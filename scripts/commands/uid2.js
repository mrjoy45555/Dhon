module.exports.config = {
  name: "uid2",
  version: "1.0.0",
  permission: 0,
  credits: "Joy Ahmed",
  description: "UID দেখায় (mention বা reply দিলে তারটা)",
  prefix: true,
  category: "info",
  usages: "uid2 [mention or reply]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  let targetID;

  // যদি reply করা হয়
  if (event.type === "message_reply") {
    targetID = event.messageReply.senderID;
  }
  // যদি mention থাকে
  else if (Object.keys(event.mentions).length > 0) {
    targetID = Object.keys(event.mentions)[0];
  }
  // না হলে নিজের ID
  else {
    targetID = event.senderID;
  }

  return api.sendMessage(`🔎 UID: ${targetID}`, event.threadID, event.messageID);
};
