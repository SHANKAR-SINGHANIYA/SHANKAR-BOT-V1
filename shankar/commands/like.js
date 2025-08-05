const axios = require("axios");

module.exports.config = {
  name: "like",
  version: "1.0.3",
  hasPermission: 0,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Facebook par like badhayein tezi se",
  commandCategory: "Upyogita",
  cooldowns: 5,
  images: [],
};

module.exports.run = async ({ event, api }) => {
  const tokens = [
    "EAAAAUaZA8jlABO6u6eqIcGaFiAWbteV24XGzPyg8ZAiYC4aL5x5tkV1UnZAVwqQlgH7P5JadwavZC5uiM8rZAHc7KD7ONshqWq5B5BXIEbRGlqwYGOnG1oRZAfOT3CBJbFLF7xPqXK9HrRmZCvmfagDgYk4ROUdMkQ8MJVcrs7qOuBVFDQKZBDwZCeV4NPzcPW0MrZBSqa0xQtiQZDZD",
    "EAAAAUaZA8jlABOygm4d1raBNNLl7W6Vo88XlxEbNMsjxP3QEQ4UzBK41h9ZBryIrIuo8VEAZA7UR2zRct1tSNxqKINgb9X9EgowDgvWeYPwaZAuvRI71MloylZCzQ0JpakAfZBO8w589JVWZCHKZCptQL8ByHEOwpxCw6ZC4m8f9NWWBo4V8TmglC4aa3uzZALl0ktOW5X47pwqQZDZD"
  ];

  api.sendMessage(
    `[ FACEBOOK LIKE FOLLOW ]\n────────────────────\n\n1. Tool shuru karein - jis ID par buff karna hai uska jawab dein\n2. Tool band karein\n────────────────────\n🔐 Kul token: ${tokens.length}\n📌 Mode chunne ke liye STT ka jawab dein`,
    event.threadID,
    (error, info) => {
      global.client.handleReply.push({
        type: "choose",
        name: module.exports.config.name,
        author: event.senderID,
        messageID: info.messageID,
        tokens,
      });
    }
  );
};

module.exports.handleReply = async function ({
  args,
  event,
  Users,
  api,
  handleReply,
  Currencies,
  __GLOBAL,
}) {
  const tokens = handleReply.tokens || [];

  switch (handleReply.type) {
    case "choose": {
      const choose = parseInt(event.body);

      if (isNaN(choose) || choose < 1 || choose > 2) {
        return api.sendMessage(
          "⚠️ Kripaya ek valid sankhya daalein (1 ya 2)",
          event.threadID
        );
      }

      switch (choose) {
        case 1: {
          const id = '444250201188189';
          api.sendMessage(
            `🔄 Like buff karne ki prakriya shuru ho rahi hai!`,
            event.threadID,
            async (err, info) => {
              if (err) {
                console.error("Sandesh bhejne mein error:", err);
                return;
              }

              setTimeout(async () => {
                await api.unsendMessage(info.messageID);
              }, 100000);

              api.unsendMessage(handleReply.messageID);

              let successCount = 0;
              let errorCount = 0;
              let currentIndex = 0;

              const makeRequest = async () => {
                if (currentIndex < tokens.length) {
                  const accessToken = tokens[currentIndex];

                  if (!accessToken) {
                    api.sendMessage("Amanya access token", event.threadID);
                    currentIndex++;
                    makeRequest();
                    return;
                  }

                  const headers = {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36",
                    "Accept-Language": "hi-IN, en-US;q=0.9",
                  };

                  try {
                    const response = await axios.post(`https://graph.facebook.com/${id}/likes`,
                      null,
                      {
                        params: {
                          access_token: accessToken,
                        },
                        headers,
                      });
                    if (response.data.error) {
                      errorCount++;
                    } else {
                      successCount++;
                    }
                  } catch (error) {
                    errorCount++;
                  }
                  tokens.splice(currentIndex, 1);

                  currentIndex++;
                  setTimeout(makeRequest, 30000);
                } else {
                  const resultMessage = `🎉 Facebook like buff ka parinaam:\n👍 Safalta: ${successCount} like\n🚫 Asafalta: ${errorCount} like`;
                  api.sendMessage(resultMessage, event.threadID);
                }
              };

              makeRequest();
            }
          );
          break;
        }
        case 2: {
          api.unsendMessage(handleReply.messageID);
          break;
        }
      }
      break;
    }
  }
};
