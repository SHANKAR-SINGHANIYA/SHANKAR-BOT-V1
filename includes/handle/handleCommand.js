module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity'),
    escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    logger = require("../../utils/log.js");
  const axios = require('axios');
  const request = require('request');
  const fs = require('fs');
  const path = require('path');
  const moment = require("moment-timezone");
  
  return async function ({ event }) {
    const dateNow = Date.now()
    const time = moment.tz("Asia/Kolkata").format("HH:MM:ss DD/MM/YYYY");
    const { allowInbox, PREFIX, ADMINBOT, NDH, DeveloperMode, adminOnly, keyAdminOnly, ndhOnly, adminPaseOnly } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    
    function byte2mb(bytes) {
      const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      let l = 0, n = parseInt(bytes, 10) || 0;
      while (n >= 1024 && ++l) n = n / 1024;
      return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)} ${units[l]}`;
    }
    
    let threadSettingBox = global.data.threadData.get(threadID) || {};
    let prefixbox = threadSettingBox.PREFIX || PREFIX;
    const tm = process.uptime(),
      Tm = (require('moment-timezone')).tz('Asia/Kolkata').format('HH:mm:ss || DD/MM/YYYY')
    h = Math.floor(tm / (60 * 60)), H = h < 10 ? '0' + h : h,
      m = Math.floor((tm % (60 * 60)) / 60), M = m < 10 ? '0' + m : m,
      s = Math.floor(tm % 60), S = s < 10 ? '0' + s : s, $ = ':'
      
    var senderID = String(senderID),
      threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {}
    const prefixRegex = new RegExp(`^(<@!?${senderID}>|${escapeRegex((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)})\\s*`);
    
    const adminbot = require('./../../config.json');

    if (typeof body === 'string' && body.startsWith(prefixbox) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.adminOnly == true) {
      return api.sendMessage(`⚠️ Only bot admins can use this bot!`, threadID, messageID);
    }
    if (typeof body === 'string' && body.startsWith(prefixbox) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.adminPaseOnly == true) {
      return api.sendMessage(`⚠️ Only bot admins can use this bot in private messages!`, threadID, messageID);
    }
    if (typeof body === 'string' && body.startsWith(prefixbox) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID) && adminbot.ndhOnly == true) {
      return api.sendMessage(`⚠️ Only bot support team can use this bot!`, threadID, messageID);
    }

    const dataAdbox = require('./../../shankar/commands/data/dataAdbox.json');
    var threadInf = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const findd = threadInf.adminIDs.find(el => el.id == senderID);
    if (typeof body === 'string' && body.startsWith(prefixbox) && dataAdbox.adminbox.hasOwnProperty(threadID) && dataAdbox.adminbox[threadID] == true && !NDH.includes(senderID) && !ADMINBOT.includes(senderID) && !findd && event.isGroup == true) return api.sendMessage(`⚠️ Only group admins can use this bot!`, event.threadID, event.messageID);

    if (userBanned.has(senderID) || threadBanned.has(threadID) || allowInbox == ![] && senderID == threadID) {
      if (!body.startsWith(PREFIX)) return
      if (!NDH.includes(senderID.toString()) && !ADMINBOT.includes(senderID.toString())) {
        if (userBanned.has(senderID)) {
          const { reason, dateAdded } = userBanned.get(senderID) || {};
          return api.sendMessage(global.getText("handleCommand", "userBanned", reason, dateAdded), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
        } else {
          if (threadBanned.has(threadID)) {
            const { reason, dateAdded } = threadBanned.get(threadID) || {};
            return api.sendMessage(global.getText("handleCommand", "threadBanned", reason, dateAdded), threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 15 * 1000));
              return api.unsendMessage(info.messageID);
            }, messageID);
          }
        }
      }
    }
    
    body = body !== undefined ? body : 'x'
    const [matchedPrefix] = body.match(prefixRegex) || ['']
    var args = body.slice(matchedPrefix.length).trim().split(/ +/);
    var commandName = args.shift().toLowerCase();
    var command = commands.get(commandName);
    
    //------------ usePrefix -------->
    if (!prefixRegex.test(body)) {
      args = (body || '').trim().split(/ +/);
      commandName = args.shift()?.toLowerCase();
      command = commands.get(commandName);
      if (command && command.config) {
        if (command.config.usePrefix === false && commandName.toLowerCase() !== command.config.name.toLowerCase()) {
          api.sendMessage(global.getText("handleCommand", "notMatched", command.config.name), event.threadID, event.messageID);
          return;
        }
        if (command.config.usePrefix === true && !body.startsWith(PREFIX)) {
          return;
        }
      }
      if (command && command.config) {
        if (typeof command.config.usePrefix === 'undefined') {
          return;
        }
      }
    }
    //---------------END --------------<

    if (!command) {
      if (!body.startsWith((threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX)) return;

      var allCommandName = [];
      const commandValues = commands['keys']();

      for (const cmd of commandValues) allCommandName.push(cmd);
      var gio = moment.tz("Asia/Kolkata").format("HH:mm:ss | DD/MM/YYYY");
      const name = await Users.getNameUser(event.senderID);
      let uid = event.senderID;
      const folderPath = './shankar/commands';
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
        const allFiles = files
          .filter(file => fs.statSync(path.join(folderPath, file)).isFile())
          .map(file => ({
            name: file,
            time: fs.statSync(path.join(folderPath, file)).mtime.getTime(),
          }));
        const latestFile = allFiles.sort((a, b) => b.time - a.time)[0];
        if (latestFile) {
          const newFile = latestFile.name;
          const checker = stringSimilarity.findBestMatch(commandName, allCommandName);
          if (checker.bestMatch.rating >= 0.5) {
            command = client.commands.get(checker.bestMatch.target);
          } else {
            api.sendMessage({
              body: `-⪼ Command does not exist\n-⪼ ${threadSetting.PREFIX || PREFIX}menu to see all commands\n-⪼ Similar command: ${checker.bestMatch.target}\n-⪼ Uptime: ${H + $ + M + $ + S} `,
              attachment: global.ytb_rst.splice(0, 1)
            }, event.threadID, async (err, info) => {
              await new Promise(resolve => setTimeout(resolve, 60 * 1000));
              return api.unsendMessage(info.messageID);
            }, event.messageID);
          }
        }
      });
    }
    
    if (command) {
      let fs = require('fs');
      let path = __dirname + '/../../shankar/commands/data/commands-banned.json';
      let data = {};
      let send = msg => api.sendMessage(msg, threadID, messageID);
      let is_qtv_box = id => threadInfo.get(threadID).adminIDs.some($ => $.id == id);
      let name = id => global.data.userName.get(id);
      let cmd = command.config.name;

      if (fs.existsSync(path)) data = JSON.parse(fs.readFileSync(path));
      if (data[threadID]) {
        if (ban = data[threadID].cmds.find($ => $.cmd == cmd)) {
          if (ADMINBOT.includes(ban.author) && !NDH.includes(senderID) && ban.author != senderID) return send(`[ BANNED COMMAND ]\n────────────────────\n🕑 Time: ${ban.time}\n👤 Bot admin: ${name(ban.author)}\n⛔ This group is banned from using ${cmd} command\n✏️ Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          if (is_qtv_box(ban.author) && !NDH.includes(senderID) && ban.author != senderID) return send(`[ BANNED COMMAND ]\n────────────────────\n🕑 Time: ${ban.time}\n👤 Group admin: ${name(ban.author)}\n⛔ Members are banned from using ${cmd} command\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
        };
        if (all = (data[threadID].users[senderID] || {}).all) {
          if (all.status == true && ADMINBOT.includes(all.author) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID)) return send(`[ BANNED USER ]\n────────────────────\n🕑 Time: ${all.time}\n⚠️ You have been banned by bot admin: ${name(all.author)}\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          if (all.status == true && is_qtv_box(all.author) && !NDH.includes(senderID) && !ADMINBOT.includes(sid) && !is_qtv_box(senderID)) return send(`[ BANNED USER ]\n────────────────────\n🕑 Time ${all.time}\n⛔ You have been banned by group admin: ${name(all.author)}\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
        };
        if (user_ban = (data[threadID].users[senderID] || {
          cmds: []
        }).cmds.find($ => $.cmd == cmd)) {
          if (ADMINBOT.includes(user_ban.author) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID)) return send(`[ USER BANNED COMMAND ]\n────────────────────\n🕑 Time: ${user_ban.time}\n👤 Bot admin: ${name(user_ban.author)}\n⛔ You are banned from using ${cmd} command\n✏️ Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
          if (is_qtv_box(user_ban.author) && !is_qtv_box(senderID) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID)) return send(`[ USER BANNED COMMAND ]\n────────────────────\n🕑 Time: ${user_ban.time}\n👤 Group admin: ${name(user_ban.author)}\n⛔ You are banned from using ${cmd} command\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`);
        }
      }
    };
    
    if ((_kJe82Q = process.cwd() + '/shankar/commands/data/disable-command.json', fs.existsSync(_kJe82Q))) if (!ADMINBOT.includes(senderID) && !NDH.includes(senderID) && JSON.parse(fs.readFileSync(_kJe82Q))[threadID]?.[command.config.commandCategory] == true) return api.sendMessage(`[ DISABLED COMMAND GROUP ]\n────────────────────\n⚠️ This group is not allowed to use commands in "${command.config.commandCategory}" category\n👤 Contact admin for support\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, threadID);

    if (commandBanned.get(threadID) || commandBanned.get(senderID)) {
      if (!NDH.includes(senderID) && !ADMINBOT.includes(senderID)) {
        const banThreads = commandBanned.get(threadID) || [],
          banUsers = commandBanned.get(senderID) || [];
        if (banThreads.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandThreadBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000))
            return api.unsendMessage(info.messageID);
          }, messageID);
        if (banUsers.includes(command.config.name))
          return api.sendMessage(global.getText("handleCommand", "commandUserBanned", command.config.name), threadID, async (err, info) => {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
            return api.unsendMessage(info.messageID);
          }, messageID);
      }
    }
    
    if (command.config.commandCategory.toLowerCase() == 'nsfw' && !global.data.threadAllowNSFW.includes(threadID) && !NDH.includes(senderID) && !ADMINBOT.includes(senderID))
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000))
        return api.unsendMessage(info.messageID);
      }, messageID);
      
    var threadInfo2;
    if (event.isGroup == !![])
      try {
        threadInfo2 = (threadInfo.get(threadID) || await Threads.getInfo(threadID))
        if (Object.keys(threadInfo2).length == 0) throw new Error();
      } catch (err) {
        logger(global.getText("handleCommand", "cantGetInfoThread", "error"));
      }
      
    const ten = await Users.getNameUser(event.senderID)
    let uid1 = event.senderID;
    var permssion = 0;
    var threadInfoo = (threadInfo.get(threadID) || await Threads.getInfo(threadID));
    const find = threadInfoo.adminIDs.find(el => el.id == senderID);
    if (NDH.includes(senderID.toString())) permssion = 3;
    else if (ADMINBOT.includes(senderID.toString())) permssion = 2;
    else if (!ADMINBOT.includes(senderID) && find) permssion = 1;
    
    var permissionName = ""
    if (command.config.hasPermssion == 1) {
      permissionName = "Group Admin"
    } else if (command.config.hasPermssion == 2) {
      permissionName = "BOT_ADMIN"
    } else if (command.config.hasPermssion == 3) {
      permissionName = "BOT_SUPPORT"
    }
    
    if (command.config.hasPermssion > permssion) return api.sendMessage(`👤 User: ${ten}\n📝 Command: ${command.config.name} requires ${permissionName} permission\n⚠️ You don't have permission to use this command\n────────────────────\n⏰ Time: ${Tm}`, event.threadID, async (err, info) => {
      await new Promise(resolve => setTimeout(resolve, 15 * 1000));
      return api.unsendMessage(info.messageID);
    }, event.messageID);
    
    if (!client.cooldowns.has(command.config.name)) client.cooldowns.set(command.config.name, new Map());
    const timestamps = client.cooldowns.get(command.config.name);
    const expirationTime = (command.config.cooldowns || 1) * 1000;
    if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime)
      return api.sendMessage(`[ COMMAND COOLDOWN ]\n────────────────────\n✏️ Command "${command.config.name}" has cooldown: ${command.config.cooldowns} seconds\n⚠️ To prevent spam, please wait ${((timestamps.get(senderID) + expirationTime - dateNow) / 1000).toString().slice(0, 5)} seconds\n────────────────────\n⏳ Uptime: ${H + $ + M + $ + S}\n⏰ Time: ${Tm}`, threadID, async (err, info) => {
        await new Promise(resolve => setTimeout(resolve, 15 * 1000));
        return api.unsendMessage(info.messageID);
      }, messageID);
      
    var getText2;
    if (command.languages && typeof command.languages == 'object' && command.languages.hasOwnProperty(global.config.language))
      getText2 = (...values) => {
        var lang = command.languages[global.config.language][values[0]] || '';
        for (var i = values.length; i > 0x2533 + 0x1105 + -0x3638; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    else getText2 = () => {};
    
    try {
      const Obj = {};
      Obj.api = api
      Obj.event = event
      Obj.args = args
      Obj.models = models
      Obj.Users = Users
      Obj.Threads = Threads
      Obj.Currencies = Currencies
      Obj.permssion = permssion
      Obj.getText = getText2
      command.run(Obj)
      timestamps.set(senderID, dateNow);
      if (DeveloperMode == !![])
        logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow), "[ DEV MODE ]");
      return;
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};
