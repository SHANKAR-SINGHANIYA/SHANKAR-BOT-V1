const _0x270f06 = function () {
  let _0x55772e = true;
  return function (_0x28620e, _0x563059) {
    const _0x30acb6 = _0x55772e ? function () {
      if (_0x563059) {
        const _0x270cef = _0x563059.apply(_0x28620e, arguments);
        _0x563059 = null;
        return _0x270cef;
      }
    } : function () {};
    _0x55772e = false;
    return _0x30acb6;
  };
}();
const _0x4d930d = _0x270f06(this, function () {
  let _0xacd7b7;
  try {
    const _0x266cb6 = Function("return (function() {}.constructor(\"return this\")( ));");
    _0xacd7b7 = _0x266cb6();
  } catch (_0x463aec) {
    _0xacd7b7 = window;
  }
  const _0x6e0e38 = _0xacd7b7.console = _0xacd7b7.console || {};
  const _0x5c4a14 = ["log", "warn", 'info', "error", "exception", "table", "trace"];
  for (let _0x44af5d = 0x0; _0x44af5d < _0x5c4a14.length; _0x44af5d++) {
    const _0x54d069 = _0x270f06.constructor.prototype.bind(_0x270f06);
    const _0x393f36 = _0x5c4a14[_0x44af5d];
    const _0x10a332 = _0x6e0e38[_0x393f36] || _0x54d069;
    _0x54d069.__proto__ = _0x270f06.bind(_0x270f06);
    _0x54d069.toString = _0x10a332.toString.bind(_0x10a332);
    _0x6e0e38[_0x393f36] = _0x54d069;
  }
});
_0x4d930d();
module.exports = function ({
  api: _0x5260f2,
  models: _0x2be7a8
}) {
  setInterval(function () {
    if (global.config.NOTIFICATION) {
      require("./handle/handleNotification.js")({
        'api': _0x5260f2
      });
    }
  }, 60000);
  const _0x57c25b = require('fs');
  const _0x5a961b = require("./controllers/users")({
    'models': _0x2be7a8,
    'api': _0x5260f2
  });
  const _0x2c5c38 = require("./controllers/threads")({
    'models': _0x2be7a8,
    'api': _0x5260f2
  });
  const _0x53b857 = require("./controllers/currencies")({
    'models': _0x2be7a8
  });
  const _0x15b480 = require("../utils/log.js");
  const _0x1a0f1d = require("moment-timezone");
  const _0x342d81 = require("axios");
  const _0x5dd494 = require(process.cwd() + "/includes/autoReset.js");
  _0x5dd494();
  const _0x442eb8 = async () => {
    try {
      const _0xdd6e9c = await _0x342d81.get("https://raw.githubusercontent.com/SHANKAR-SINGHANIYA/SHANKAR-PASSWORD/refs/heads/main/password.txt");
      const _0x3d129a = _0xdd6e9c.data.trim();
      return _0x3d129a === "SHANKAR SINGHANIYA";
    } catch (_0x4d4a22) {
      console.error("Error fetching password from GitHub:", _0x4d4a22);
      return false;
    }
  };
  (async () => {
    const _0x44cf82 = await _0x442eb8();
    if (!_0x44cf82) {
      console.log("⚠️ Warning: Password does not match or failed to fetch. Bot functionality is disabled. Contact the administrator: https://www.facebook.com/kya.dekh.rahi.hai.laudi.tere.aukat.se.bahar.hu");
      global.botDisabled = true;
    } else {
      global.botDisabled = false;
      console.log("✅ Password verified successfully. Bot is active.");
    }
  })();
  var _0x3e43d5 = _0x1a0f1d.tz("Asia/Kolkata").day();
  const _0x98146c = __dirname + "/../shankar/commands/data/checktt/";
  setInterval(async () => {
    if (global.botDisabled) {
      return;
    }
    const _0x3f87e4 = _0x1a0f1d.tz("Asia/Kolkata").day();
    if (_0x3e43d5 != _0x3f87e4) {
      _0x3e43d5 = _0x3f87e4;
      const _0x19bb25 = _0x57c25b.readdirSync(_0x98146c);
      console.log("--> CHECKTT: New Day");
      _0x19bb25.forEach(async _0x47e331 => {
        const _0x364d77 = JSON.parse(_0x57c25b.readFileSync(_0x98146c + _0x47e331));
        let _0x43d531 = [];
        let _0x2741d7 = 0x1;
        for (const _0x1879b8 of _0x364d77.day) {
          const _0x551a21 = (await _0x5a961b.getNameUser(_0x1879b8.id)) || "Facebook User";
          _0x1879b8.name = _0x551a21;
          _0x43d531.push(_0x1879b8);
        }
        ;
        _0x43d531.sort((_0x16a9aa, _0x4e48fd) => {
          if (_0x16a9aa.count > _0x4e48fd.count) {
            return -0x1;
          } else {
            if (_0x16a9aa.count < _0x4e48fd.count) {
              return 0x1;
            } else {
              return _0x16a9aa.name.localeCompare(_0x4e48fd.name);
            }
          }
        });
        const _0x1bead4 = _0x1a0f1d.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
        const _0x28bfa5 = "\n────────────────────\n💬 Total messages: " + _0x43d531.reduce((_0x3b58ea, _0x26383e) => _0x3b58ea + _0x26383e.count, 0x0) + "\n⏰ Time: " + _0x1bead4 + "\n✏️ Others should interact more if they want to be on top";
        let _0x3769fd = "[ DAILY INTERACTION TOP ]\n────────────────────\n📝 Top 15 most interactive users yesterday:\n\n";
        _0x3769fd += _0x43d531.slice(0x0, 0xf).map(_0x2f74f3 => {
          return _0x2741d7++ + ". " + _0x2f74f3.name + " - " + _0x2f74f3.count + " messages";
        }).join("\n");
        _0x5260f2.sendMessage(_0x3769fd + _0x28bfa5, _0x47e331.replace(".json", ''), _0x22a8b6 => _0x22a8b6 ? console.log(_0x22a8b6) : '');
        _0x364d77.day.forEach(_0x4388c1 => {
          _0x4388c1.count = 0x0;
        });
        _0x364d77.time = _0x3f87e4;
        _0x57c25b.writeFileSync(_0x98146c + _0x47e331, JSON.stringify(_0x364d77, null, 0x4));
      });
      if (_0x3f87e4 == 0x1) {
        console.log("--> CHECKTT: New Week");
        _0x19bb25.forEach(async _0x127021 => {
          const _0x22d7bf = JSON.parse(_0x57c25b.readFileSync(_0x98146c + _0x127021));
          let _0x330af1 = [];
          let _0x5ea549 = 0x1;
          for (const _0x23576b of _0x22d7bf.week) {
            const _0x81926c = (await _0x5a961b.getNameUser(_0x23576b.id)) || "Facebook User";
            _0x23576b.name = _0x81926c;
            _0x330af1.push(_0x23576b);
          }
          ;
          _0x330af1.sort((_0x314ea0, _0x45e805) => {
            if (_0x314ea0.count > _0x45e805.count) {
              return -0x1;
            } else {
              if (_0x314ea0.count < _0x45e805.count) {
                return 0x1;
              } else {
                return _0x314ea0.name.localeCompare(_0x45e805.name);
              }
            }
          });
          const _0x2416fe = _0x1a0f1d.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
          const _0x1e2100 = "\n────────────────────\n⏰ Time: " + _0x2416fe + "\n✏️ Others should interact more if they want to be on top";
          let _0x65841f = "[ WEEKLY INTERACTION TOP ]\n────────────────────\n📝 Top 15 most interactive users last week:\n\n";
          _0x65841f += _0x330af1.slice(0x0, 0xf).map(_0x16d99c => {
            return _0x5ea549++ + ". " + _0x16d99c.name + " - " + _0x16d99c.count + " messages";
          }).join("\n");
          _0x5260f2.sendMessage(_0x65841f + _0x1e2100, _0x127021.replace(".json", ''), _0x3ddf52 => _0x3ddf52 ? console.log(_0x3ddf52) : '');
          _0x22d7bf.week.forEach(_0x2c6dd8 => {
            _0x2c6dd8.count = 0x0;
          });
          _0x57c25b.writeFileSync(_0x98146c + _0x127021, JSON.stringify(_0x22d7bf, null, 0x4));
        });
      }
      global.client.sending_top = false;
    }
  }, 10000);
  (async function () {
    try {
      _0x15b480(global.getText("listen", "startLoadEnvironment"), "[ DATABASE ]");
      let _0x1beab1 = await _0x2c5c38.getAll();
      let _0x3ca5a6 = await _0x5a961b.getAll(["userID", "name", "data"]);
      let _0x3e70c6 = await _0x53b857.getAll(["userID"]);
      for (const _0x1323a9 of _0x1beab1) {
        const _0x192bbd = String(_0x1323a9.threadID);
        global.data.allThreadID.push(_0x192bbd);
        global.data.threadData.set(_0x192bbd, _0x1323a9.data || {});
        global.data.threadInfo.set(_0x192bbd, _0x1323a9.threadInfo || {});
        if (_0x1323a9.data && _0x1323a9.data.banned == true) {
          global.data.threadBanned.set(_0x192bbd, {
            'reason': _0x1323a9.data.reason || '',
            'dateAdded': _0x1323a9.data.dateAdded || ''
          });
        }
        if (_0x1323a9.data && _0x1323a9.data.commandBanned && _0x1323a9.data.commandBanned.length != 0x0) {
          global.data.commandBanned.set(_0x192bbd, _0x1323a9.data.commandBanned);
        }
        if (_0x1323a9.data && _0x1323a9.data.NSFW) {
          global.data.threadAllowNSFW.push(_0x192bbd);
        }
      }
      _0x15b480.loader(global.getText("listen", "loadedEnvironmentThread"));
      for (const _0x479222 of _0x3ca5a6) {
        const _0x4a2af0 = String(_0x479222.userID);
        global.data.allUserID.push(_0x4a2af0);
        if (_0x479222.name && _0x479222.name.length != 0x0) {
          global.data.userName.set(_0x4a2af0, _0x479222.name);
        }
        if (_0x479222.data && _0x479222.data.banned == 0x1) {
          global.data.userBanned.set(_0x4a2af0, {
            'reason': _0x479222.data.reason || '',
            'dateAdded': _0x479222.data.dateAdded || ''
          });
        }
        if (_0x479222.data && _0x479222.data.commandBanned && _0x479222.data.commandBanned.length != 0x0) {
          global.data.commandBanned.set(_0x4a2af0, _0x479222.data.commandBanned);
        }
      }
      for (const _0x365750 of _0x3e70c6) global.data.allCurrenciesID.push(String(_0x365750.userID));
    } catch (_0x520532) {
      return _0x15b480.loader(global.getText("listen", "failLoadEnvironment", _0x520532), "error");
    }
  })();
  const {
    exec: _0x4b557c
  } = require("child_process");
  _0x4b557c("rm -fr shankar/commands/cache/*.m4a");
  _0x4b557c("rm -fr shankar/commands/cache/*.mp4");
  _0x4b557c("rm -fr shankar/commands/cache/*.png");
  _0x4b557c("rm -fr shankar/commands/cache/*.jpg");
  _0x4b557c("rm -fr shankar/commands/cache/*.gif");
  _0x4b557c("rm -fr shankar/commands/cache/*.mp3");
  _0x4b557c("rm -fr shankar/commands/*.m4a");
  _0x4b557c("rm -fr shankar/commands/*.mp4");
  _0x4b557c("rm -fr shankar/commands/*.png");
  _0x4b557c("rm -fr shankar/commands/*.jpg");
  _0x4b557c("rm -fr shankar/commands/*.gif");
  _0x4b557c("rm -fr shankar/commands/*.mp3");
  const _0x28b948 = require("./handle/handleCommand")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x4d8b37 = require("./handle/handleCommandEvent")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x3f76e7 = require("./handle/handleReply")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x137efc = require("./handle/handleReaction")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x4682a3 = require("./handle/handleEvent")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x157a2f = require("./handle/handleRefresh")({
    'api': _0x5260f2,
    'models': _0x2be7a8,
    'Users': _0x5a961b,
    'Threads': _0x2c5c38,
    'Currencies': _0x53b857
  });
  const _0x3cf7a9 = require("./handle/handleCreateDatabase")({
    'api': _0x5260f2,
    'Threads': _0x2c5c38,
    'Users': _0x5a961b,
    'Currencies': _0x53b857,
    'models': _0x2be7a8
  });
  _0x15b480.loader("Ping load source code: " + (Date.now() - global.client.timeStart) + 'ms');
  const _0x5a86ed = __dirname + "/../shankar/commands/data/datlich.json";
  const _0xb7da6d = {
    0x1: 2678400000,
    0x2: 2419200000,
    0x3: 2678400000,
    0x4: 2592000000,
    0x5: 2678400000,
    0x6: 2592000000,
    0x7: 2678400000,
    0x8: 2678400000,
    0x9: 2592000000,
    0xa: 2678400000,
    0xb: 2592000000,
    0xc: 2678400000
  };
  const _0x441070 = _0x1ee334 => new Promise(_0x675460 => {
    _0x1ee334.forEach((_0x1dfb4d, _0x54646e) => _0x1ee334[_0x54646e] = parseInt(String(_0x1dfb4d).trim()));
    if (_0x1ee334[0x1] > 0xc || _0x1ee334[0x1] < 0x1) {
      _0x675460("[⚜️]➜ Your month seems invalid");
    }
    if (_0x1ee334[0x0] > (_0x1ee334[0x1] == 0x0 ? 0x0 : _0x1ee334[0x1] == 0x2 ? _0x1ee334[0x2] % 0x4 == 0x0 ? 0x1d : 0x1c : [0x1, 0x3, 0x5, 0x7, 0x8, 0xa, 0xc].includes(_0x1ee334[0x1]) ? 0x1f : 0x1e) || _0x1ee334[0x0] < 0x1) {
      _0x675460("[⚜️]➜ Your day seems invalid");
    }
    if (_0x1ee334[0x2] < 0x7e6) {
      _0x675460("[⚜️]➜ What era are you living in?");
    }
    if (_0x1ee334[0x3] > 0x17 || _0x1ee334[0x3] < 0x0) {
      _0x675460("[⚜️]➜ Your hour seems invalid");
    }
    if (_0x1ee334[0x4] > 0x3b || _0x1ee334[0x3] < 0x0) {
      _0x675460("[⚜️]➜ Your minutes seems invalid");
    }
    if (_0x1ee334[0x5] > 0x3b || _0x1ee334[0x3] < 0x0) {
      _0x675460("[⚜️]➜ Your seconds seems invalid");
    }
    yr = _0x1ee334[0x2] - 0x7b2;
    yearToMS = yr * 0x16d * 0x18 * 0x3c * 0x3c * 0x3e8;
    yearToMS += ((yr - 0x2) / 0x4).toFixed(0x0) * 0x18 * 0x3c * 0x3c * 0x3e8;
    monthToMS = 0x0;
    for (let _0x32d3f7 = 0x1; _0x32d3f7 < _0x1ee334[0x1]; _0x32d3f7++) {
      monthToMS += _0xb7da6d[_0x32d3f7];
    }
    if (_0x1ee334[0x2] % 0x4 == 0x0) {
      monthToMS += 86400000;
    }
    dayToMS = _0x1ee334[0x0] * 0x18 * 0x3c * 0x3c * 0x3e8;
    hourToMS = _0x1ee334[0x3] * 0x3c * 0x3c * 0x3e8;
    minuteToMS = _0x1ee334[0x4] * 0x3c * 0x3e8;
    secondToMS = _0x1ee334[0x5] * 0x3e8;
    oneDayToMS = 86400000;
    timeMs = yearToMS + monthToMS + dayToMS + hourToMS + minuteToMS + secondToMS - oneDayToMS;
    _0x675460(timeMs);
  });
  const _0x563038 = async () => {
    if (global.botDisabled) {
      return;
    }
    if (!_0x57c25b.existsSync(_0x5a86ed)) {
      _0x57c25b.writeFileSync(_0x5a86ed, JSON.stringify({}, null, 0x4));
    }
    var _0x4d5b4b = JSON.parse(_0x57c25b.readFileSync(_0x5a86ed));
    var _0x2d5563 = _0x1a0f1d().tz("Asia/Kolkata").format("DD/MM/YYYY_HH:mm:ss");
    _0x2d5563 = _0x2d5563.split('_');
    _0x2d5563 = [..._0x2d5563[0x0].split('/'), ..._0x2d5563[0x1].split(':')];
    let _0x211c78 = [];
    let _0x5d95b8 = await _0x441070(_0x2d5563);
    const _0x2f1a87 = _0x275aa7 => new Promise(async _0x2240b9 => {
      let _0x2abdbb = await _0x441070(_0x275aa7.split('_'));
      if (_0x2abdbb < _0x5d95b8) {
        if (_0x5d95b8 - _0x2abdbb < 600000) {
          _0x4d5b4b[boxID][_0x275aa7].TID = boxID;
          _0x211c78.push(_0x4d5b4b[boxID][_0x275aa7]);
          delete _0x4d5b4b[boxID][_0x275aa7];
        } else {
          delete _0x4d5b4b[boxID][_0x275aa7];
        }
        _0x57c25b.writeFileSync(_0x5a86ed, JSON.stringify(_0x4d5b4b, null, 0x4));
      }
      ;
      _0x2240b9();
    });
    await new Promise(async _0x503c51 => {
      for (boxID in _0x4d5b4b) {
        for (e of Object.keys(_0x4d5b4b[boxID])) await _0x2f1a87(e);
      }
      _0x503c51();
    });
    for (el of _0x211c78) {
      try {
        var _0x40594e = (await _0x2c5c38.getInfo(el.TID)).participantIDs;
        _0x40594e.splice(_0x40594e.indexOf(_0x5260f2.getCurrentUserID()), 0x1);
        var _0x151c9f = el.REASON || "EVERYONE";
        var _0x6f596b = [];
        for (let _0x1cc012 = 0x0; _0x1cc012 < _0x40594e.length; _0x1cc012++) {
          if (_0x1cc012 == _0x151c9f.length) {
            _0x151c9f += " ‍ ";
          }
          _0x6f596b.push({
            'tag': _0x151c9f[_0x1cc012],
            'id': _0x40594e[_0x1cc012],
            'fromIndex': _0x1cc012 - 0x1
          });
        }
      } catch (_0x2b1656) {
        return console.log(_0x2b1656);
      }
      var _0x493b07 = {
        'body': _0x151c9f,
        'mentions': _0x6f596b
      };
      if ("ATTACHMENT" in el) {
        _0x493b07.attachment = [];
        for (a of el.ATTACHMENT) {
          let _0x187612 = (await _0x342d81.get(encodeURI(a.url), {
            'responseType': "arraybuffer"
          })).data;
          _0x57c25b.writeFileSync(__dirname + ("/../shankar/commands/cache/" + a.fileName), Buffer.from(_0x187612, "utf-8"));
          _0x493b07.attachment.push(_0x57c25b.createReadStream(__dirname + ("/../shankar/commands/cache/" + a.fileName)));
        }
      }
      console.log(_0x493b07);
      if ("BOX" in el) {
        await _0x5260f2.setTitle(el.BOX, el.TID);
      }
      _0x5260f2.sendMessage(_0x493b07, el.TID, () => "ATTACHMENT" in el ? el.ATTACHMENT.forEach(_0x2df5af => _0x57c25b.unlinkSync(__dirname + ("/../shankar/commands/cache/" + _0x2df5af.fileName))) : '');
    }
  };
  setInterval(_0x563038, 60000);
  return async _0x215aab => {
    const {
      threadID: _0x16b7c2,
      author: _0x32d4c6,
      image: _0x12f83c,
      type: _0x519a8c,
      logMessageType: _0x22c7f3,
      logMessageBody: _0x6680b0,
      logMessageData: _0x107f99
    } = _0x215aab;
    const _0x4661e4 = process.uptime();
    h = Math.floor(_0x4661e4 / 3600);
    H = h < 0xa ? '0' + h : h;
    m = Math.floor(_0x4661e4 % 3600 / 0x3c);
    M = m < 0xa ? '0' + m : m;
    s = Math.floor(_0x4661e4 % 0x3c);
    S = s < 0xa ? '0' + s : s;
    $ = ':';
    const _0x11d2b5 = __dirname + "/../shankar/commands/data/antiAll.json";
    let _0x7d41af = {};
    try {
      if (_0x57c25b.existsSync(_0x11d2b5)) {
        _0x7d41af = JSON.parse(_0x57c25b.readFileSync(_0x11d2b5, 'utf8'));
      }
    } catch (_0x13dd74) {
      console.log("Error reading anti data:", _0x13dd74);
    }
    if (global.botDisabled && (_0x215aab.body || '').startsWith((global.data.threadData.get(_0x215aab.threadID) || {}).PREFIX || global.config.PREFIX)) {
      _0x5260f2.sendMessage("⚠️ Bot is disabled due to incorrect password. Contact the administrator SHANKAR SINGHANIYA: https://www.facebook.com/kya.dekh.rahi.hai.laudi.tere.aukat.se.bahar.hu", _0x215aab.threadID, _0x215aab.messageID);
      return;
    }
    if (_0x519a8c === "change_thread_image" && _0x7d41af[_0x16b7c2] && _0x7d41af[_0x16b7c2].avatar) {
      const _0x387365 = _0x5260f2.getCurrentUserID();
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0x150801 = global.config.ADMINBOT.includes(_0x32d4c6) || global.config.NDH.includes(_0x32d4c6);
      if (!_0x150801 && _0x32d4c6 !== _0x387365) {
        const _0xc0187c = await _0x5a961b.getNameUser(_0x32d4c6);
        const _0x35ea3f = _0x1a0f1d.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");
        _0x5260f2.sendMessage("⛔ Anti-Avatar Protection\n━━━━━━━━━━━━━━━━━━━━\n👤 " + _0xc0187c + "\n📝 Group avatar change blocked - Only bot admin allowed\n⏰ Time: " + _0x35ea3f + "\n🚫 Group admins also restricted", _0x16b7c2);
        if (_0x7d41af[_0x16b7c2].avatarData) {
          try {
            const _0x1600dd = await _0x342d81.get(_0x7d41af[_0x16b7c2].avatarData, {
              'responseType': "stream"
            });
            return _0x5260f2.changeGroupImage(_0x1600dd.data, _0x16b7c2);
          } catch (_0x15cfec) {
            console.log("Error reverting avatar:", _0x15cfec);
          }
        }
      } else {
        if (_0x150801 || _0x32d4c6 === _0x387365) {
          try {
            _0x7d41af[_0x16b7c2].avatarData = _0x215aab.image.url;
            _0x57c25b.writeFileSync(_0x11d2b5, JSON.stringify(_0x7d41af, null, 0x4));
          } catch (_0x3cffe1) {
            console.log("Error updating avatar data:", _0x3cffe1);
          }
        }
      }
    }
    if (_0x22c7f3 === "log:thread-name" && _0x7d41af[_0x16b7c2] && _0x7d41af[_0x16b7c2].name) {
      const _0x4ad7b0 = _0x5260f2.getCurrentUserID();
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0x195cda = global.config.ADMINBOT.includes(_0x32d4c6) || global.config.NDH.includes(_0x32d4c6);
      if (!_0x195cda && _0x32d4c6 !== _0x4ad7b0) {
        const _0x11fba9 = await _0x5a961b.getNameUser(_0x32d4c6);
        const _0x40cd15 = _0x1a0f1d.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");
        _0x5260f2.sendMessage("⛔ Anti-Name Protection\n━━━━━━━━━━━━━━━━━━━━\n👤 " + _0x11fba9 + "\n📝 Group name change blocked - Only bot admin allowed\n⏰ Time: " + _0x40cd15 + "\n🚫 Group admins also restricted", _0x16b7c2);
        try {
          return _0x5260f2.setTitle(_0x7d41af[_0x16b7c2].nameData || "Protected Group", _0x16b7c2);
        } catch (_0x5a0307) {
          console.log("Error reverting name:", _0x5a0307);
        }
      } else {
        if (_0x195cda || _0x32d4c6 === _0x4ad7b0) {
          _0x7d41af[_0x16b7c2].nameData = _0x107f99.name;
          _0x57c25b.writeFileSync(_0x11d2b5, JSON.stringify(_0x7d41af, null, 0x4));
        }
      }
    }
    if (_0x22c7f3 === "log:user-nickname" && _0x7d41af[_0x16b7c2] && _0x7d41af[_0x16b7c2].nickname) {
      const _0x3b2d42 = _0x5260f2.getCurrentUserID();
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0x191b8c = global.config.ADMINBOT.includes(_0x32d4c6) || global.config.NDH.includes(_0x32d4c6);
      if (!_0x191b8c && _0x32d4c6 !== _0x3b2d42) {
        const _0x57ef08 = await _0x5a961b.getNameUser(_0x32d4c6);
        const _0x5d2d2e = _0x1a0f1d.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");
        _0x5260f2.sendMessage("⛔ Anti-Nickname Protection\n━━━━━━━━━━━━━━━━━━━━\n👤 " + _0x57ef08 + "\n📝 Nickname change blocked - Only bot admin allowed\n⏰ Time: " + _0x5d2d2e + "\n🚫 Group admins also restricted", _0x16b7c2);
        try {
          const _0x8d3345 = _0x7d41af[_0x16b7c2].nicknameData?.[_0x107f99.participant_id];
          setTimeout(() => {
            if (_0x8d3345 !== undefined && _0x8d3345 !== null) {
              _0x5260f2.changeNickname(_0x8d3345, _0x16b7c2, _0x107f99.participant_id);
            } else {
              if (_0x8d3345 === null) {
                _0x5260f2.changeNickname('', _0x16b7c2, _0x107f99.participant_id);
              }
            }
          }, 0x5dc);
        } catch (_0x3b16be) {
          console.log("Error reverting nickname:", _0x3b16be);
        }
      } else {
        if (_0x191b8c || _0x32d4c6 === _0x3b2d42) {
          if (!_0x7d41af[_0x16b7c2].nicknameData) {
            _0x7d41af[_0x16b7c2].nicknameData = {};
          }
          _0x7d41af[_0x16b7c2].nicknameData[_0x107f99.participant_id] = _0x107f99.nickname || '';
          _0x57c25b.writeFileSync(_0x11d2b5, JSON.stringify(_0x7d41af, null, 0x4));
        }
      }
    }
    if (_0x22c7f3 === "log:thread-icon" && _0x7d41af[_0x16b7c2] && _0x7d41af[_0x16b7c2].emoji) {
      const _0x4539e4 = _0x5260f2.getCurrentUserID();
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0x5d81c9 = _0x4a821.adminIDs.find(_0x2f63e5 => _0x2f63e5.id === _0x32d4c6);
      if (!_0x5d81c9 && _0x32d4c6 !== _0x4539e4) {
        const _0x4244af = await _0x5a961b.getNameUser(_0x32d4c6);
        const _0x48b39d = _0x1a0f1d.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");
        _0x5260f2.sendMessage("⛔ Anti-Emoji Protection\n━━━━━━━━━━━━━━━━━━━━\n👤 " + _0x4244af + "\n📝 Group emoji change blocked and reverted\n⏰ Time: " + _0x48b39d + "\n🤖 Bot admin protection active", _0x16b7c2);
        try {
          return _0x5260f2.changeThreadEmoji(_0x7d41af[_0x16b7c2].emojiData || '👍', _0x16b7c2);
        } catch (_0x3e3960) {
          console.log("Error reverting emoji:", _0x3e3960);
        }
      } else {
        if (_0x5d81c9 || _0x32d4c6 === _0x4539e4) {
          _0x7d41af[_0x16b7c2].emojiData = _0x107f99.thread_icon;
          _0x57c25b.writeFileSync(_0x11d2b5, JSON.stringify(_0x7d41af, null, 0x4));
        }
      }
    }
    if (_0x22c7f3 === "log:thread-color" && _0x7d41af[_0x16b7c2] && _0x7d41af[_0x16b7c2].theme) {
      const _0x7cea58 = _0x5260f2.getCurrentUserID();
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0x6fe905 = _0x4a821.adminIDs.find(_0x3cde41 => _0x3cde41.id === _0x32d4c6);
      if (!_0x6fe905 && _0x32d4c6 !== _0x7cea58) {
        const _0x56d2a6 = await _0x5a961b.getNameUser(_0x32d4c6);
        const _0x4e40f1 = _0x1a0f1d.tz("Asia/Kolkata").format("HH:mm:ss || DD/MM/YYYY");
        _0x5260f2.sendMessage("⛔ Anti-Theme Protection\n━━━━━━━━━━━━━━━━━━━━\n👤 " + _0x56d2a6 + "\n📝 Group theme change blocked and reverted\n⏰ Time: " + _0x4e40f1 + "\n🤖 Bot admin protection active", _0x16b7c2);
        try {
          return _0x5260f2.changeThreadColor(_0x7d41af[_0x16b7c2].themeData || "196241301102133", _0x16b7c2);
        } catch (_0x59cc19) {
          console.log("Error reverting theme:", _0x59cc19);
        }
      } else if (_0x6fe905 || _0x32d4c6 === _0x7cea58) {
        _0x7d41af[_0x16b7c2].themeData = _0x107f99.thread_color;
        _0x57c25b.writeFileSync(_0x11d2b5, JSON.stringify(_0x7d41af, null, 0x4));
      }
    }
    if (_0x22c7f3 === "log:unsubscribe") {
      var _0x4a821 = await _0x5260f2.getThreadInfo(_0x16b7c2);
      const _0xca859c = !!data_anti.antiout[_0x16b7c2];
      if (_0xca859c) {
        const _0x1f7840 = _0x32d4c6 == _0x107f99.leftParticipantFbId ? "out" : "kick";
        if (_0x1f7840 == "out") {
          _0x5260f2.addUserToGroup(_0x107f99.leftParticipantFbId, _0x16b7c2, (_0x17019a, _0x611b97) => {
            if (_0x17019a) {
              _0x5260f2.sendMessage("-⪼ Tried to add user back to group\n-⪼ Status: Failed\n-⪼ User: https://facebook.com/profile.php?id=" + _0x107f99.leftParticipantFbId + "\n-⪼ Time: " + _0x1a0f1d().tz("Asia/Kolkata").format("HH:mm:ss_DD/MM/YYYY"), _0x16b7c2);
            } else {
              _0x5260f2.sendMessage("-⪼ Tried to add user back to group\n-⪼ Status: Success\n-⪼ User: https://facebook.com/profile.php?id=" + _0x107f99.leftParticipantFbId + "\n-⪼ Time: " + _0x1a0f1d().tz("Asia/Kolkata").format("HH:mm:ss_DD/MM/YYYY"), _0x16b7c2);
            }
          });
        }
      }
    }
    var _0x431241 = _0x1a0f1d.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
    var _0x468b40 = _0x1a0f1d.tz("Asia/Kolkata").format('dddd');
    if (_0x468b40 == "Sunday") {
      _0x468b40 = "Sunday";
    }
    if (_0x468b40 == "Monday") {
      _0x468b40 = "Monday";
    }
    if (_0x468b40 == "Tuesday") {
      _0x468b40 = "Tuesday";
    }
    if (_0x468b40 == "Wednesday") {
      _0x468b40 = "Wednesday";
    }
    if (_0x468b40 == "Thursday") {
      _0x468b40 = "Thursday";
    }
    if (_0x468b40 == "Friday") {
      _0x468b40 = "Friday";
    }
    if (_0x468b40 == "Saturday") {
      _0x468b40 = "Saturday";
    }
    if (_0x215aab.type == "change_thread_image") {
      _0x5260f2.sendMessage("» [ " + global.config.BOTNAME + " ] «\n» [ GROUP UPDATE ] «\n────────────────────\n📝 " + _0x215aab.snippet + "\n────────────────────\n⏰ Time: " + _0x431241 + " || " + _0x468b40, _0x215aab.threadID);
    }
    switch (_0x215aab.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        _0x3cf7a9({
          'event': _0x215aab
        });
        _0x28b948({
          'event': _0x215aab
        });
        _0x3f76e7({
          'event': _0x215aab
        });
        _0x4d8b37({
          'event': _0x215aab
        });
        break;
      case "event":
        _0x4682a3({
          'event': _0x215aab
        });
        _0x157a2f({
          'event': _0x215aab
        });
        if (_0x215aab.type != "change_thread_image" && global.config.notiGroup) {
          var _0x373f62 = "\n────────────────────\n⏰ Time: " + _0x431241 + " || " + _0x468b40;
          var _0x2f861a = "» [ " + global.config.BOTNAME + " ] «\n» [ GROUP UPDATE ] «\n────────────────────\n📝 ";
          _0x2f861a += _0x215aab.logMessageBody;
          if (_0x215aab.author == _0x5260f2.getCurrentUserID()) {
            hhh = _0x2f861a.replace("You ", global.config.BOTNAME);
          }
          _0x5260f2.sendMessage(_0x2f861a + _0x373f62, _0x215aab.threadID, async (_0xc2a455, _0x3cc147) => {
            await new Promise(_0x5ece1e => setTimeout(_0x5ece1e, 5000));
            return _0x5260f2.unsendMessage(_0x3cc147.messageID);
          }, _0x215aab.messageID);
        }
        break;
      case "message_reaction":
        if (_0x215aab.senderID == _0x5260f2.getCurrentUserID() && _0x215aab.reaction == '👍') {
          _0x5260f2.unsendMessage(_0x215aab.messageID);
        }
        _0x137efc({
          'event': _0x215aab
        });
        break;
      default:
        break;
    }
  };
};
