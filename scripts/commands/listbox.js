const fs = require("fs");

module.exports.config = {
  name: "listbox",
  version: "0.0.2",
  permission: 2,
  prefix: true,
  credits: "Joy",
  description: "Send list of groups and allow ban/out",
  category: "admin",
  usages: "",
  cooldowns: 5,
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
