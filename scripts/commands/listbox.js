module.exports.config = {
  name: "listbox",
  version: "1.0.0",
  Permssion: 2, // অ্যাডমিন বা বট মালিক ব্যবহার করতে পারবে
  credits: "Joy",
  description: "বট কোন কোন গ্রুপে আছে তা দেখাবে (নাম ও ID সহ)",
  commandCategory: "owner",
  usages: "",
  cooldowns: 5,
  prefix: true,

};

module.exports.run = async function({ api, event }) {
  try {
    // গ্রুপ লিস্ট নিয়ে আসা
    const threads = await api.getThreadList(100, null, ["INBOX"]);
    const groups = threads.filter(thread => thread.isGroup);

    if (groups.length === 0) {
      return api.sendMessage(
        "╭╼|━━━━━━━━━━━━━━|╾╮\n  বট কোনো গ্রুপে নেই!\n╰╼|━━━━━━━━━━━━━━|╾╯",
        event.threadID,
        event.messageID
      );
    }

    // বক্স স্টাইলে গ্রুপের নাম ও আইডি দেখাবে
    let msg = "╭╼|━━━━━━━━━━━━━━|╾╮\n";
    groups.forEach((group, index) => {
      msg += `${index + 1}. ${group.name}\n   ID: ${group.threadID}\n`;
    });
    msg += "╰╼|━━━━━━━━━━━━━━|╾╯";

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage("গ্রুপ লিস্ট আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};
