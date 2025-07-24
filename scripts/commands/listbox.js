const fs = require("fs");

module.exports.config = {
  name: "listbox",
  version: "1.0.1",
  Permssion: 2,
  credits: "Joy",
  description: "স্টাইলিশ বক্সে লিস্ট দেখায়",
  Category: "general",   // <-- খালি নয়, সঠিক স্ট্রিং
  usages: "[approve|...]",
  cooldowns: 3,
  prefix: true
};

module.exports.run = async function({ api, event, args }) {
  // ডেমো ডাটা (তুমি চাইলে ফাইল/ডিবি থেকে নিতে পারো)
  const data = ["আইটেম ১", "আইটেম ২", "আইটেম ৩"];

  if (!Array.isArray(data) || data.length === 0) {
    return api.sendMessage(
      "╭╼|━━━━━━━━━━━━━━|╾╮\n  কোনো ডেটা নেই!\n╰╼|━━━━━━━━━━━━━━|╾╯",
      event.threadID,
      event.messageID
    );
  }

  let msg = "╭╼|━━━━━━━━━━━━━━|╾╮\n";
  data.forEach((item, i) => (msg += `${i + 1}. ${item}\n`));
  msg += "╰╼|━━━━━━━━━━━━━━|╾╯";

  return api.sendMessage(msg, event.threadID, event.messageID);
};
