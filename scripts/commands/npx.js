const fs = require("fs");
module.exports.config = {
  name: "npx",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Joy",
  description: "Responds to specific words or emojis with audio",
  commandCategory: "audio", // ✅ ক্যাটাগরি ঠিক করা হয়েছে
  usages: "bristi, 🙂, 😒",
  cooldowns: 5,
  prefix: false
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
