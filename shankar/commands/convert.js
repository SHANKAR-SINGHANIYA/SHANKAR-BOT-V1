module.exports.config = {
    name: "convert",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Aapke video ka jawab dein jisko aap video se MP3 mein badalna chahte hain",
    commandCategory: "Upyogita",
    usages: "reply",
    cooldowns: 5,
    usePrefix: false
};

module.exports.run = async function ({ api, args, event, Currencies, Users }) {
    try {
        const axios = require("axios");
        const fs = require("fs-extra");
        const request = require("request");
        var audioss = [];
        var audio = args.join(" ") || event.messageReply.attachments[0].url;
        var { data } = await axios.get(audio, { method: 'GET', responseType: 'arraybuffer' });
        fs.writeFileSync(__dirname + "/cache/vdtoau.m4a", Buffer.from(data, 'utf-8'));
        audioss.push(fs.createReadStream(__dirname + "/cache/vdtoau.m4a"));
        var msg = { body: "MP3 mein convert safalata se kiya gaya 🎶", attachment: audioss };
        api.sendMessage(msg, event.threadID, event.messageID);
    } catch (e) {
        console.log(e);
    }
}
