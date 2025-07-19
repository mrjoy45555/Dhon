const moment = require("moment-timezone");
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "Admin",
  version: "1.0.0",
  permission: 0,
  credits: "Joy",
  description: "Shows admin's personal information",
  prefix: true,
  category: "info",
  usages: "",
  cooldowns: 5,
  dependencies: {
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async function ({ api, event }) {
  const currentTime = moment.tz("Asia/Dhaka").format("DD MMM YYYY, hh:mm:ss A");
  const imageUrl = "https://graph.facebook.com/100001435123762/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
  const imgPath = __dirname + "/cache/admin_avatar.png";

  const infoText = `
╔══════════════════════════════════════╗
║         👑 Admin Information Panel           ║
╠══════════════════════════════════════╣
║ 🧑‍💼 Name       : MD Jubaed Ahmed Joy       ║
║ 🌐 Facebook   : Joy Ahmed                     ║
║ 🕋 Religion    : Islam                                ║
║ 🏠 From        : Jamalpur, Dhaka               ║
║ 📍 Current     : Tarakandi, Jamalpur          ║
║ 🚹 Gender     : Male                                 ║
║ 🎂 Age         : 16+                                  ║
║ 💘 Status     : Single                                ║
║ 🎓 Work       : Student                               ║
║ 📧 Email      : mdjubaedahmed124@gmail.com  ║
║ 📞 WhatsApp   : +8801709045888              ║
║ ✈️ Telegram   : t.me/JOY_AHMED_88           ║
║ 🔗 FB Link    : https://www.facebook.com/100001435123762║
╠══════════════════════════════════════╣
║ ⏰ Time        : ${currentTime}             ║
╚══════════════════════════════════════╝`;

  const callback = () => {
    api.sendMessage({
      body: infoText,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath));
  };

  request(encodeURI(imageUrl))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", callback);
};
