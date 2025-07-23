const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "npx2",
  version: "2.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "audio",
  prefix: false,
  category: "npx",
  usages: "🤡",
  cooldowns: 5
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const triggers = ["😁", "😆", "🤣"];
  const loweredBody = body.toLowerCase();

  if (triggers.some(trigger => loweredBody.startsWith(trigger))) {
    const url = "https://drive.google.com/uc?export=download&id=1EaIxj2fuYSrR0QVvE9zw8kjG1OOZTW8R"; // ⬅️ লিংক এখানে দাও
    const filePath = path.join(__dirname, "temp_voice.mp3");

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, Buffer.from(response.data, "utf-8"));

      const msg = {
        body: "╭╼|━━━━━━━━━━━━━━|╾╮\n╰╼|━━━━━━━━━━━━━━|╾╯",
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(msg, threadID, () => {
        api.setMessageReaction("🤡", messageID, () => {}, true);
        fs.unlinkSync(filePath); // ✅ ডাউনলোড করা ফাইল মুছে ফেলা
      });
    } catch (err) {
      api.sendMessage("⛔ ফাইল আনতে সমস্যা হয়েছে। লিংক ঠিক আছে তো?", threadID, messageID);
    }
  }
};

module.exports.run = function () {};
