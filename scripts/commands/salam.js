const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "salam",
  version: "1.0.0",
  permission: 0,
  credits: "JOY",
  description: "Auto reply Salam & give Salam on hi/hello with Islamic picture",
  prefix: true,
  category: "events",
  cooldowns: 0,
  hasPermission: 0
};

const IMAGE_DIR = path.join(__dirname, "cache");
const SALAM_IMG = path.join(IMAGE_DIR, "salam.jpg");
const WA_IMG = path.join(IMAGE_DIR, "wa.jpg");

const imageUrls = {
  salam: "https://drive.google.com/uc?id=1HuRT_EHPCc0F5RnUwl2n53WW2TfbY6hR",
  wa: "https://drive.google.com/uc?id=1Hv92IqK-9AYhWs-P8N4vz5DmMz0Ko7iK"
};

module.exports.onLoad = async () => {
  try {
    await fs.ensureDir(IMAGE_DIR);

    const download = async (url, dest) => {
      if (fs.existsSync(dest)) return;
      const res = await axios.get(url, { responseType: "arraybuffer" });
      await fs.writeFile(dest, res.data);
    };

    await download(imageUrls.salam, SALAM_IMG);
    await download(imageUrls.wa, WA_IMG);
    console.log("[auto-salam] ✅ Image cache ready");
  } catch (e) {
    console.error("[auto-salam] ❌ onLoad error:", e);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, body } = event;
    if (!body || typeof body !== "string") return;

    const msg = body.toLowerCase().trim();
    const hiRegex = /\b(hi|hello|hey|yo|hii+)\b/i;
    const salamRegex = /(ass?alam[uo] ?(alaikum)?|আসসালামু আলাইকুম|সালাম|salam(ualaikum)?)/i;

    // Hi/Hello
    if (hiRegex.test(msg)) {
      const text =
`╭╼|━━━━━━━━━━━━━━|╾╮
আসসালামু আলাইকুম ✨
╰╼|━━━━━━━━━━━━━━|╾╯`;
      return api.sendMessage(
        { body: text, attachment: fs.createReadStream(SALAM_IMG) },
        threadID,
        messageID
      );
    }

    // Salam Response
    if (salamRegex.test(msg)) {
      const text =
`╭╼|━━━━━━━━━━━━━━|╾╮
🤲 ওয়া আলাইকুমুস সালাম 🤍
╰╼|━━━━━━━━━━━━━━|╾╯`;
      return api.sendMessage(
        { body: text, attachment: fs.createReadStream(WA_IMG) },
        threadID,
        messageID
      );
    }

  } catch (e) {
    console.error("[auto-salam] ❌ handleEvent error:", e);
  }
};

module.exports.run = () => {};
