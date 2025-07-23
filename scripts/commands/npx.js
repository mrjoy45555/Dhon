const fs = require("fs");
module.exports.config = {
  name: "npx",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Joy",
  description: "Responds to certain emojis with message and audio",
  prefix: false,
  commandCategory: "no prefix",
  usages: "🤡",
  cooldowns: 5,
};

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const triggers = ["bristi", "bristi", "🙂", "😒"];
  if (triggers.some(trigger => body.startsWith(trigger))) {
    const msg = {
      body: "╭╼|━━━━━━━━━━━━━━|╾╮\n" +
            "╰╼|━━━━━━━━━━━━━━|╾╯",
      attachment: fs.createReadStream(__dirname + `/Joy/JOY12.mp3`)
    };
    api.sendMessage(msg, threadID, () => {
      api.setMessageReaction("🤡", event.messageID, () => {}, true);
    });
  }
};

module.exports.run = function () {};
