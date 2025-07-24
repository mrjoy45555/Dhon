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
module.exports.run = async function({ api, event }) {
  try {
    const threads = await api.getThreadList(100, null, ["INBOX"]);

    if (!Array.isArray(threads)) {
      return api.sendMessage(
        "গ্রুপ লিস্ট আনতে সমস্যা হয়েছে।",
        event.threadID,
        event.messageID
      );
    }

    // Null/undefined চেকসহ গ্রুপ ফিল্টার
    const groups = threads.filter(thread => thread && thread.isGroup);

    if (groups.length === 0) {
      return api.sendMessage(
        "╭╼|━━━━━━━━━━━━━━|╾╮\n  বট কোনো গ্রুপে নেই!\n╰╼|━━━━━━━━━━━━━━|╾╯",
        event.threadID,
        event.messageID
      );
    }

    // মেসেজ তৈরির জন্য বক্স স্টাইল
    let msg = "╭╼|━━━━━━━━━━━━━━|╾╮\n";
    groups.forEach((group, index) => {
      msg += `${index + 1}. ${group.name}\n   ID: ${group.threadID}\n`;
    });
    msg += "╰╼|━━━━━━━━━━━━━━|╾╯";

    return api.sendMessage(msg, event.threadID, event.messageID);

  } catch (error) {
    console.error("getThreadList error:", error);
    return api.sendMessage(
      "গ্রুপ লিস্ট আনতে সমস্যা হয়েছে।",
      event.threadID,
      event.messageID
    );
  }
};
