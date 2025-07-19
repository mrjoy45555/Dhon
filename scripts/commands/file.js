const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "file",
  version: "2.0.0",
  permission: 2,
  credits: "Joy Ahmed",
  description: "কোনো কমান্ড ফাইলের কোড Hastebin লিংকে দেয়",
  prefix: true,
  category: "system",
  usages: "[filename]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID } = event;

  if (!args[0]) {
    return api.sendMessage("❌ কোনো ফাইলের নাম দেওয়া হয়নি!\n\n📝 উদাহরণ: .file help.js", threadID, messageID);
  }

  const filename = args[0].endsWith(".js") ? args[0] : `${args[0]}.js`;
  const filepath = path.join(__dirname, filename);

  if (!fs.existsSync(filepath)) {
    return api.sendMessage(`❌ '${filename}' নামের কোনো ফাইল পাওয়া যায়নি।`, threadID, messageID);
  }

  try {
    const content = fs.readFileSync(filepath, "utf8");

    const res = await axios.post("https://hst.sh/documents", content, {
      headers: { "Content-Type": "text/plain" }
    });

    const key = res.data.key;
    const url = `https://hst.sh/${key}`;

    return api.sendMessage(`📄 ${filename} ফাইল আপলোড সফল ✅\n🔗 ${url}`, threadID, messageID);

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ ফাইল আপলোডে সমস্যা হয়েছে!", threadID, messageID);
  }
};
