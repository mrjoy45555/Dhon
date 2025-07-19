const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "help",
  version: "2.1.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "সব কমান্ড এবং বট তথ্য দেখায়",
  prefix: true,
  category: "system",
  usages: "[command name]",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const commandList = global.client.commands;
  const prefix = global.config.PREFIX || ".";
  let msg = "";

  if (args[0]) {
    const name = args[0].toLowerCase();
    const command = commandList.get(name);
    if (!command)
      return api.sendMessage(`❌ '${name}' নামে কোনো কমান্ড খুঁজে পাওয়া যায়নি।`, event.threadID, event.messageID);

    msg += `╭╼|━━━━━━━━━━━━━━|╾╮\n`;
    msg += `🔎 ${name} কমান্ড তথ্য\n`;
    msg += `╰╼|━━━━━━━━━━━━━━|╾╯\n\n`;
    msg += `📄 বিবরণ: ${command.config.description || "নেই"}\n`;
    msg += `📂 ক্যাটাগরি: ${command.config.category || "Unknown"}\n`;
    msg += `📌 ব্যবহার: ${prefix}${command.config.name} ${command.config.usages || ""}\n`;
    msg += `⏱️ Cooldown: ${command.config.cooldowns || 3} সেকেন্ড\n`;
    msg += `👤 Permission: ${command.config.permission}\n`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  }

  // সব ক্যাটাগরি অনুযায়ী কমান্ড লিস্ট
  const categories = {};
  commandList.forEach((command) => {
    const cat = command.config.category || "Unknown";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(command.config.name);
  });

  // হেল্প হেডার
  msg += `╭╼|━━━━━━━━━━━━━━|╾╮\n`;
  msg += `🤖 ${global.config.BOTNAME || "Merai Bot"} Help Menu\n`;
  msg += `╰╼|━━━━━━━━━━━━━━|╾╯\n\n`;

  for (const cat in categories) {
    msg += `📁 ${cat.toUpperCase()}:\n`;
    msg += `➤ ${categories[cat].sort().join(", ")}\n\n`;
  }

  // এডমিন ইনফো সেকশন
  msg += `╭╼|━━━━━━━━━━━━━━|╾╮\n`;
  msg += `🧑‍💼 Bot Admin Info\n`;
  msg += `╰╼|━━━━━━━━━━━━━━|╾╯\n\n`;
  msg += `👑 Owner: Joy Ahmed\n`;
  msg += `📞 Contact: wa.me/8801709045888\n`;
  msg += `🌐 Facebook: https://facebook.com/100001435123762\n`;
  msg += `⚙️ Prefix: ${prefix}\n`;
  msg += `📦 Version: 2.1.0\n`;
  msg += `📊 Total Commands: ${commandList.size}\n`;

  // প্রোফাইল পিকচার ডাউনলোড ও সেন্ড
  const ownerUID = "100001435123762";
  const avatarURL = `https://graph.facebook.com/${ownerUID}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const path = __dirname + `/cache/help_owner.jpg`;

  try {
    const res = await axios.get(avatarURL, { responseType: "arraybuffer" });
    fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));

    return api.sendMessage({
      body: msg,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);

  } catch (e) {
    console.error(e);
    return api.sendMessage(msg + `\n⚠️ Admin picture লোড হয়নি।`, event.threadID, event.messageID);
  }
};
