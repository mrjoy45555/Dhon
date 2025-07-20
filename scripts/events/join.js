const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");

module.exports.config = {
  name: "join",
  eventType: ["log:subscribe"],
  version: "1.0.7",
  credits: "Joy Ahmed",
  description: "Bot join message with FB link, address & stylish fonts",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "axios": ""
  }
};

module.exports.onLoad = function () {
  const joinGifPath = path.join(__dirname, "cache", "joinGif", "randomgif");
  if (!fs.existsSync(joinGifPath)) {
    fs.mkdirSync(joinGifPath, { recursive: true });
  }
};

async function downloadImage(url, filepath) {
  const writer = fs.createWriteStream(filepath);
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream"
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

async function getUserName(api, userID) {
  try {
    const info = await api.getUserInfo(userID);
    return info[userID].name || "Unknown";
  } catch {
    return "Unknown";
  }
}

module.exports.run = async function({ api, event }) {
  const { threadID } = event;
  const botID = api.getCurrentUserID();

  if (event.logMessageData.addedParticipants.some(user => user.userFbId === botID)) {
    await api.changeNickname(`[ ${global.config.PREFIX} ] • ${global.config.BOTNAME || "𝐁𝐎𝐓"}`, threadID, botID);

    const fbProfilePicUrl = "https://graph.facebook.com/100001435123762/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    const picPath = path.join(__dirname, "cache", "joinGif", "bot_join.jpg");

    if (!fs.existsSync(picPath)) {
      try {
        await downloadImage(fbProfilePicUrl, picPath);
      } catch (e) {
        console.error("Error downloading bot profile pic:", e);
      }
    }

    const fbLink = "https://www.facebook.com/profile.php?id=100001435123762";
    const address = "Dhaka, Bangladesh";

    const msg = {
      body: `
╭╼|━━━━━━━━━━━━━━━━━━━━|╾╮
│
│      🤖 𝓑𝓸𝓽 𝓙𝓸𝓲𝓷𝓮𝓭 🤖
│
│  𝕋𝕙𝕖 𝕓𝕠𝕥 𝕙𝕒𝕤 𝕤𝕦𝕔𝕔𝕖𝕤𝕤𝕗𝕦𝕝𝕝𝕪 𝕛𝕠𝕚𝕟𝕖𝕕 𝕥𝕙𝕖 𝕘𝕣𝕠𝕦𝕡.
│
│  📍 𝔸𝕕𝕕𝕣𝕖𝕤𝕤: ${address}
│
│  🌐 𝔽𝕒𝕔𝕖𝔹𝕠𝕠𝕜: ${fbLink}
│
│  𝕋𝕪𝕡𝕖 '${global.config.PREFIX || "!"}𝕙𝕖𝕝𝕡' 𝕥𝕠 𝕤𝕖𝕖 𝕔𝕠𝕞𝕞𝕒𝕟𝕕𝕤.
│
│  𝔹𝕠𝕥 𝔸𝕕𝕞𝕚𝕟: 𝕁𝕠𝕪 𝔸𝕙𝕞𝕖𝕕
│
╰╼|━━━━━━━━━━━━━━━━━━━━|╾╯
      `,
      attachment: fs.createReadStream(picPath)
    };

    return api.sendMessage(msg, threadID);
  }

  try {
    const adderID = event.logMessageData.actorFbId;
    const adderName = await getUserName(api, adderID);

    const addedUsers = event.logMessageData.addedParticipants;
    const addedNames = addedUsers.map(u => u.fullName).join(", ");

    const prefix = global.config.PREFIX || "!";

    const welcomeMsg = `
╭╼|━━━━━━━━━━━━━━|╾╮
│
│        🌸 𝓦𝓮𝓵𝓬𝓸𝓶𝓮 🌸
│
│  𝔄𝕤𝕤𝕒𝕝𝕒𝕞𝕦’𝕒𝕝𝕒𝕚𝕜𝕦𝕞 𝕨𝕒 ℝ𝕒𝕙𝕞𝕒𝕥𝕦𝕝𝕝𝕒𝕙𝕚 𝕨𝕒 𝔹𝕒𝕣𝕒𝕜𝕒𝕥𝕦𝕙 🤲
│
│  𝖂𝖊𝗅𝗅𝖈𝗈𝗆𝖾 (${addedNames}) 𝖙𝗈 𝗈𝗎𝗋 𝗀𝗋𝗈𝗎𝗉!
│
│  𝓐𝓭𝓭𝓮𝓭 𝓫𝔂: ${adderName}
│
│  𝗧𝘆𝗉𝗲 '${prefix}𝘩𝗲𝗹𝗽' 𝘁𝗈 𝘀𝗲𝗲 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀.
│
│  𝔹𝕠𝕥 𝔸𝕕𝕞𝕚𝕟: 𝕁𝕠𝕪 𝔸𝕙𝕞𝕖𝕕
│
╰╼|━━━━━━━━━━━━━━|╾╯
    `;

    return api.sendMessage(welcomeMsg, threadID);
  } catch (error) {
    console.error("Join command error:", error);
  }
};
