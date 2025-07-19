const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "uid",
  version: "1.2.0",
  permission: 0,
  credits: "Joy",
  prefix: true,
  description: "Get UID, Name, and Profile Picture",
  category: "user",
  cooldowns: 5
};

module.exports.run = async function({ event, api, args, Users }) {
  let uid;

  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } else if (args.join().indexOf('@') !== -1) {
    uid = Object.keys(event.mentions)[0];
  } else if (args[0]) {
    uid = args[0];
  } else {
    uid = event.senderID;
  }

  try {
    const name = await Users.getNameUser(uid);
    const imgURL = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const filePath = __dirname + `/cache/uid.jpg`;

    request(imgURL).pipe(fs.createWriteStream(filePath)).on('close', () => {
      const msg = 
`╭╼| 🎯 𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢 |╾╮
┃
┃ 👤 Name : ${name}
┃ 🆔 UID : ${uid}
┃ 📷 Pic : m.me/${uid}
┃
╰╼|━━━━━━━━━━━━━━|╾╯`;

      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    });

  } catch (error) {
    api.sendMessage("❌ ইউজারের তথ্য আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};
