this.config = {
    name: "shortcut",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "-shortcut tag ka istemal karke tag hone par jawab add kare",
    commandCategory: "Box chat",
    usages: "[all/delete/empty/tag]",
    cooldowns: 0,
    images: [],
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

let format_attachment = type => ({
    photo: 'png', video: 'mp4', audio: 'mp3', animated_image: 'gif',
})[type] || 'bin';

this.onLoad = function () {
    const { existsSync, writeFileSync, mkdirSync, readFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");
    const pathGif = resolve(__dirname, '..', 'events', "shortcut", "shortcut");
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!existsSync(path)) writeFileSync(path, JSON.stringify([]), "utf-8");
    if (!existsSync(pathGif)) mkdirSync(pathGif, { recursive: true });
    const data = JSON.parse(readFileSync(path, "utf-8"));
    for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    return;
};

this.handleEvent = async function ({ event, api, Users }) {
    const { threadID, messageID, body, senderID, mentions: Mentions = {} } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    let mentions = Object.keys(Mentions);
    const data = global.moduleData.shortcut.get(threadID);
    if (!body) return;
    if ((dataThread = mentions.length > 0 ? data.find(item => typeof item.tag_id == 'string' && mentions.includes(item.tag_id)) : false) || (dataThread = data.find(item => (item.input || '').toLowerCase() == body.toLowerCase()))) {
        const { resolve } = global.nodemodule["path"];
        const { existsSync, createReadStream } = global.nodemodule["fs-extra"];
        var object, output;
        var moment = require("moment-timezone");
        var time = moment.tz("Asia/Kolkata").format('HH:mm:ss | DD/MM/YYYY');
        var output = dataThread.output;
        if (/\{name}/g.test(output)) {
            const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
            output = output.replace(/\{name}/g, name).replace(/\{time}/g, time);
        }
        if (dataThread.uri) object = { body: output, attachment: (await require('axios').get(dataThread.uri, { responseType: 'stream' }).catch(e => ({ data: void 0 }))).data };
        else object = { body: output };
        return api.sendMessage(object, threadID, messageID);
    }
};

this.handleReply = async function ({ event = {}, api, handleReply }) {
    if (handleReply.author != event.senderID) return;
    const { readFileSync, writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const axios = require('axios');
    try {
        const { resolve } = global.nodemodule["path"];
        const { threadID, messageID, senderID, body } = event;
        const name = this.config.name;

        const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");

        switch (handleReply.type) {
            case "requireInput": {
                if (body.length == 0) return api.sendMessage("❎ Jawab khali nahi ho sakta", threadID, messageID);
                const data = global.moduleData.shortcut.get(threadID) || [];
                if (data.some(item => item.input == body)) return api.sendMessage("❎ Input pehle se maujood hai", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage("📌 Is sandesh ka jawab de aur keyword ke istemal ke liye jawab daale", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireOutput",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: body
                    });
                }, messageID);
            }
            case "requireOutput": {
                if (body.length == 0) return api.sendMessage("❎ Jawab khali nahi ho sakta", threadID, messageID);
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage("📌 Is sandesh ka jawab video/photo/mp3/gif file ke saath de ya agar zarurat nahi to 's' likhkar jawab de", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireGif",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input: handleReply.input,
                        output: body,
                        input_type: handleReply.input_type,
                        tag_id: handleReply.tag_id,
                    });
                }, messageID);
            }
            case "requireGif": {
                let id = global.utils.randomString(10);
                let uri;
                if ((event.attachments || []).length > 0) {
                    try {
                        const atm_0 = event.attachments[0];
                        id = id + '.' + format_attachment(atm_0.type);
                        const pathGif = resolve(__dirname, '..', 'events', "shortcut", "shortcut", id);
                        const res = await imgurUpload(atm_0.url);
                        uri = res.link;
                    } catch (e) {
                        console.log(e);
                        return api.sendMessage("⚠️ File upload nahi kar saka kyunki URL maujood nahi hai ya bot ko network samasya hui!", threadID, messageID);
                    }
                }
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
                var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
                const object = { id, input: handleReply.input, output: handleReply.output, uri, input_type: handleReply.input_type, tag_id: handleReply.tag_id };
                dataThread.shortcuts.push(object);
                dataGlobal.push(object);
                if (!data.some(item => item.threadID == threadID)) {
                    data.push(dataThread);
                } else {
                    const index = data.indexOf(data.find(item => item.threadID == threadID));
                    data[index] = dataThread;
                }
                global.moduleData.shortcut.set(threadID, dataGlobal);
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
                api.unsendMessage(handleReply.messageID);
                return api.sendMessage(`📝 Naya shortcut safalta se jod diya gaya, niche hai samanya jankari:\n\n- ID: ${id}\n- Input: ${handleReply.input}\n- Type: ${handleReply.input_type || 'text'}\n- Output: ${handleReply.output}`, threadID, messageID);
            }
            case "delShortcut": {
                const splitBody = event.body;
                const input = splitBody.match(/\d+/g).map(Number);
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                var dataThread = data.find(item => item.threadID == threadID);
                var inputDel = [], nums = 1, stt = 1;
                for (let num of input) {
                    const index = num - (nums++);
                    var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
                    const dataDel = dataThread.shortcuts[index];
                    inputDel.push(`${num}. ${dataDel.input || `@{${global.data.userName.get(dataDel.tag_id)}}`}`);
                    if (dataDel.id.includes('.')) {
                        /* const pathGif = resolve(__dirname, '..', 'events' ,"shortcut", "shortcut", dataDel.id);
                        unlinkSync(pathGif, (err) => {
                            if (err) throw err;
                        }); */
                    }
                    dataThread.shortcuts = dataThread.shortcuts.filter(item => item.output !== dataDel.output);
                    dataGlobal = dataGlobal.filter(item => item.output !== dataDel.output);
                    global.moduleData.shortcut.set(threadID, dataGlobal);
                }
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");
                return api.sendMessage('✅ Safalta se hata diya gaya\n\n' + inputDel.join('\n'), threadID);
            }
        }
    } catch (e) {
        console.log(e);
    }
};

this.run = function ({ event, api, args }) {
    try {
        const { readFileSync, writeFileSync, existsSync } = global.nodemodule["fs-extra"];
        const { resolve } = global.nodemodule["path"];
        const { threadID, messageID, senderID, mentions = {} } = event;
        const name = this.config.name;

        const path = resolve(__dirname, '..', 'events', "shortcut", "shortcutdata.json");

        switch (args[0]) {
            case "remove":
            case "delete":
            case "del":
            case "-d": {
                const readData = readFileSync(path, "utf-8");
                var data = JSON.parse(readData);
                const indexData = data.findIndex(item => item.threadID == threadID);
                if (indexData == -1) return api.sendMessage("❎ Is samay aapke group mein koi shortcut set nahi hai", threadID, messageID);
                var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
                var dataGlobal = global.moduleData.shortcut.get(threadID) || [];

                if (dataThread.shortcuts.length == 0) return api.sendMessage("❎ Is samay aapke group mein koi shortcut set nahi hai", threadID, messageID);

                let rm = args.slice(1).map($ => +($ - 1)).filter(isFinite);
                
                dataThread.shortcuts = dataThread.shortcuts.filter(($, i) => !rm.includes(i));
                dataGlobal = dataGlobal.filter(($, i) => !rm.includes(i));
                global.moduleData.shortcut.set(threadID, dataGlobal);
                data[indexData] = dataThread;
                writeFileSync(path, JSON.stringify(data, null, 4), "utf-8");

                return api.sendMessage("✅ Safalta se hata diya gaya\n\n", threadID, messageID);
            }

            case "list":
            case "all":
            case "-a": {
                const data = global.moduleData.shortcut.get(threadID) || [];
                var array = [];
                if (data.length == 0) return api.sendMessage("❎ Is samay aapke group mein koi shortcut set nahi hai", threadID, messageID);
                else {
                    var n = 1;
                    for (const single of data) {
                        array.push(`${n++}. ${single.uri ? "yes" : "no"} • ${single.input_type == 'tag' ? `@{${global.data.userName.get(single.tag_id)}}` : single.input} -> ${single.output}`);
                    }
                    return api.sendMessage(`📝 Niche aapke group ke saare shortcut hain:\n\n${array.join("\n")}\n\n'yes' matlab file ke saath bheja gaya\n'no' matlab file ke bina bheja gaya\n\nShortcut hatane ke liye stt ke hisaab se reply kare`, threadID, function (error, info) {
                        global.client.handleReply.push({
                            type: "delShortcut",
                            name,
                            author: senderID,
                            messageID: info.messageID
                        });
                    });
                }
            }
            case 'tag': {
                let tag_id = Object.keys(mentions)[0] || senderID;
                
                const data = global.moduleData.shortcut.get(threadID) || [];
                if (data.some(item => item.tag_id == tag_id)) return api.sendMessage("❎ Tag pehle se maujood hai", threadID, messageID);
                
                api.sendMessage("📌 Is sandesh ka jawab de aur tag hone par jawab daale", threadID, function (error, info) {
                    global.client.handleReply.push({
                        type: "requireOutput",
                        name,
                        author: senderID,
                        messageID: info.messageID,
                        input_type: 'tag',
                        tag_id,
                    });
                }, messageID);
            }
            break;
            default: {
                return api.sendMessage("📌 Is sandesh ka jawab de aur shortcut ke liye keyword daale", threadID, function (error, info) {
                    return global.client.handleReply.push({
                        type: "requireInput",
                        name,
                        author: senderID,
                        messageID: info.messageID
                    });
                }, messageID);
            }
        }
    } catch (e) {
        console.log(e);
    }
};

async function imgurUpload(l) {
    const f = require("fs"), r = require('request');
    try {
        let p, t;
        await new Promise((resolve, reject) => {
            r(l).on('response', function (response) {
                const e = response.headers['content-type'].split('/')[1];
                t = response.headers['content-type'].split('/')[0];
                p = __dirname + '/cache' + `/${Date.now()}.${e}`;
                response.pipe(f.createWriteStream(p)).on('finish', resolve).on('error', reject);
            }).on('error', reject);
        });
        const uploadResponse = await new Promise((resolve, reject) => {
            r({
                method: 'POST',
                url: 'https://api.imgur.com/3/upload',
                headers: { 'Authorization': 'Client-ID c76eb7edd1459f3' },
                formData: t === "video" ? { 'video': f.createReadStream(p) } : { 'image': f.createReadStream(p) }
            }, (e, response, b) => {
                if (e) { reject(e); return; }
                resolve(JSON.parse(b));
            });
        });
        f.unlink(p, err => { if (err) throw new Error(err); });
        return { link: uploadResponse.data.link };
    } catch (e) { throw new Error(e); }
};
