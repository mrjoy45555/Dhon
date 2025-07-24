const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "threads.json");

module.exports.config = {
  name: "grouplist",
  version: "2.0.0",
  Permssion: 2, // মালিক/অ্যাডমিন
  credits: "Joy",
  description: "বট যেসব গ্রুপে আছে (ট্র্যাকড) সেগুলোর নাম ও ID দেখায়",
  commandCategory: "owner",
  usages: "",
  cooldowns: 5,
  prefix: true
};

function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({}), "utf8");
}
function loadDB() {
  ensureDB();
  return JSON.parse(fs.readFileSync(FILE, "utf8"));
}
function saveDB(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2), "utf8");
}

module.exports.run = async function ({ api, event }) {
  try {
    ensureDB();
    let db = loadDB();

    // event.isGroup অনেকে দেয় না, তাই fallback
    const isGroup = event.isGroup ?? (String(event.threadID || "").length > 15);

    // বর্তমান থ্রেড ট্র্যাক করো (গ্রুপ হলে)
    if (isGroup && event.threadID && !db[event.threadID]) {
      db[event.threadID] = { name: null, lastSeen: Date.now() };
      saveDB(db);
    } else if (isGroup && event.threadID) {
      db[event.threadID].lastSeen = Date.now();
      saveDB(db);
    }

    const ids = Object.keys(db);
    if (ids.length === 0) {
      return api.sendMessage(
        "╭╼|━━━━━━━━━━━━━━|╾╮\n  কোনো গ্রুপ ট্র্যাক করা হয়নি!\n╰╼|━━━━━━━━━━━━━━|╾╯",
        event.threadID,
        event.messageID
      );
    }

    // গ্রুপের নাম রিফ্রেশ করো
    const results = [];
    for (const id of ids) {
      try {
        const info = await api.getThreadInfo(id);
        const name = info?.threadName || db[id].name || "Unknown";
        db[id].name = name;
        results.push({ id, name });
      } catch {
        results.push({ id, name: db[id].name || "Unknown" });
      }
    }
    saveDB(db);

    // আউটপুট
    let msg = "╭╼|━━━━━━━━━━━━━━|╾╮\n";
    results
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .forEach((g, i) => {
        msg += `${i + 1}. ${g.name}\n   ID: ${g.id}\n`;
      });
    msg += "╰╼|━━━━━━━━━━━━━━|╾╯";

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (e) {
    console.log("grouplist error:", e);
    return api.sendMessage("গ্রুপ লিস্ট আনতে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};
