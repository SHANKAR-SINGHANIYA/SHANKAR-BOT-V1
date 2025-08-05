const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "api",
    version: "1.2.9",
    hasPermission: 3,
    credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
    description: "Link ko src api mein upload karein",
    commandCategory: "Admin",
    usages: "[]",
    cooldowns: 5,
    images: [],
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const projectHome = path.resolve('./');
        const srcapi = path.join(projectHome, 'includes/datajson');

        switch (args[0]) {
            case 'add': {
                if (args.length === 1) {
                    api.sendMessage("⚠️ Kripya file ka naam daalein", event.threadID, event.messageID);
                    return;
                }

                const tip = args[1];
                const dataPath = path.join(srcapi, `${tip}.json`);
                if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, '[]', 'utf-8');
                const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

                for (const i of event.messageReply.attachments) {
                    const response = await axios.get(`https://catbox-mnib.onrender.com/upload?url=${encodeURIComponent(i.url)}`);
                    if (Array.isArray(response.data)) {
                        data.push(...response.data.map(linkObj => linkObj.url));
                    } else {
                        data.push(response.data.url);
                    }
                }

                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
                api.sendMessage(`☑️ Link api par safalta se upload kiya gaya`, event.threadID, event.messageID);
                break;
            }

            case 'check': {
                const files = fs.readdirSync(srcapi);
                const results = [];

                for (const file of files) {
                    const filePath = path.join(srcapi, file);
                    const fileContent = fs.readFileSync(filePath, 'utf8');
                    const linksArray = JSON.parse(fileContent);

                    let totalLinks = linksArray.length;
                    let liveCount = 0;
                    let deadCount = 0;

                    const checkLinkPromises = linksArray.map(link => {
                        return axios.head(link)
                            .then(response => {
                                if (response.status === 200) {
                                    liveCount++;
                                } else {
                                    deadCount++;
                                }
                            })
                            .catch(() => {
                                deadCount++;
                            });
                    });

                    await Promise.all(checkLinkPromises);

                    results.push(`File: ${file}\n📝 Kul: ${totalLinks}\n✅ Chalu: ${liveCount}\n❎ Band: ${deadCount}`);
                }

                api.sendMessage(`${results.join('\n\n')}\n\n📌 Band links ko filter karne ke liye emoji thok dein`, event.threadID);
                break;
            }
            default:
                api.sendMessage("📝 Add ya check ka istemal karein", event.threadID, event.messageID);
        }
    } catch (error) {
        console.log(error);
        api.sendMessage(`❎ Command chalane ke dauraan error aaya: ${error}`, event.threadID, event.messageID);
    }
};
