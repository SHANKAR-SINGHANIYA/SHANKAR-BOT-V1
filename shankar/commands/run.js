this.config = {
  name: "run",
  version: "1.0.2",
  hasPermssion: 3,
  credits: "𝐒𝐡𝐚𝐧𝐤𝐚𝐫 𝐒𝐢𝐧𝐠𝐡𝐚𝐧𝐢𝐲𝐚👑",
  description: "Shell script chalayein",
  commandCategory: "System",
  usages: "[Script]",
  cooldowns: 5,
  usePrefix: false
};

this.run = async (o) => {
  const s = async (a) => {
    if (typeof a === "object" || Array.isArray(a)) {
      if (Object.keys(a).length !== 0)
        a = JSON.stringify(a, null, 4);
      else
        a = "";
    }
    if (typeof a === "number")
      a = a.toString();
    await o.api.sendMessage(a, o.event.threadID, o.event.messageID);
  };
  const { log } = console;
  try {
    const result = await require("eval")(o.args.join(" "), { s, o, log }, true);
    await s(result);
  } catch (e) {
    const errorMessage = `[ Error ] ${e.message}\n[ Translation ] ${(await require('axios').get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=hi&dt=t&q=${encodeURIComponent(e.message)}`)).data[0][0][0]}`;
    await s(errorMessage);
  }
};
