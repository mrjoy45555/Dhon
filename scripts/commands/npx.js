const fs = require("fs");
module.exports.config = {
  name: "npx",
  version: "2.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "send audio video",
  prefix: false,
  category: "npx",
  usages: "🙂",
  cooldowns: 5
};

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const triggers = ["bristi", "🙂", "😒"];
  const loweredBody = body.toLowerCase();

  if (triggers.some(trigger => loweredBody.startsWith(trigger))) {
    const msg = {
      body: "╭╼|━━━━━━━━━━━━━━|╾╮\n" +
            "╰╼|━━━━━━━━━━━━━━|╾╯",
      attachment: fs.createReadStream(__dirname + `/Joy/JOY12.mp3`)
    };
    api.sendMessage(msg, threadID, () => {
      api.setMessageReaction("🤡", messageID, () => {}, true);
    });
  }
};

module.exports.run = function () {};
