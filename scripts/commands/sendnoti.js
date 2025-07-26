const axios = require("axios");

module.exports.config = {
  name: "sendnoti",
  version: "2.0.1",
  permission: 2,
  credits: "Joy",
  description: "Send a message/photo/video/sticker/file to all groups & allow two-way reply bridge.",
  prefix: true,
  category: "message",
  usages: "[text] or reply to a message | optional: --limit <n>",
  cooldowns: 5
};

const BOX_TOP = "╭╼|━━━━━━━━━━━━━━|╾╮";
const BOX_BOT = "╰╼|━━━━━━━━━━━━━━|╾╯";
const box = (t) => `${BOX_TOP}\n${t}\n${BOX_BOT}`;

// A tiny helper to push handleReply safely
function pushHandleReply(obj) {
  if (!global.client) global.client = {};
  if (!global.client.handleReply) global.client.handleReply = [];
  global.client.handleReply.push(obj);
}

async function getStream(url) {
  const res = await axios.get(url, { responseType: "stream" });
  return res.data;
}

// Convert reply attachments -> streams
async function buildAttachmentStreams(attachments = []) {
  const out = [];
  for (const att of attachments) {
    try {
      out.push(await getStream(att.url));
    } catch (e) {
      console.log("Attachment stream error:", e.message);
    }
  }
  return out;
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply } = event;

  const botID = await api.getCurrentUserID();
  const adminList = global.config?.ADMINBOT || [botID];
  if (!adminList.includes(senderID.toString())) {
    return api.sendMessage(box("❌ এই কমান্ডটি শুধুমাত্র বট অ্যাডমিনদের জন্য!"), threadID, messageID);
  }

  // limit
  let limit = 20;
  const limitIndex = args.indexOf("--limit");
  if (limitIndex !== -1 && args[limitIndex + 1]) {
    const p = parseInt(args[limitIndex + 1], 10);
    if (!isNaN(p) && p > 0) limit = p;
    args.splice(limitIndex, 2);
  }

  // prepare message + attachments
  let notifMessage = "";
  let attachmentStreams = [];

  if (messageReply) {
    notifMessage = messageReply.body || "";
    if (messageReply.attachments?.length) {
      attachmentStreams = await buildAttachmentStreams(messageReply.attachments);
    }
  } else {
    notifMessage = args.join(" ");
    if (!notifMessage) {
      return api.sendMessage(box("📌 বিজ্ঞপ্তি পাঠানোর জন্য কোনো মেসেজ দিন বা রিপ্লাই করুন।"), threadID, messageID);
    }
  }

  // fetch groups
  let threadList = [];
  try {
    threadList = await api.getThreadList(1000, null, ["INBOX"]);
  } catch (e) {
    return api.sendMessage(box("❌ থ্রেড লিস্ট আনতে সমস্যা হয়েছে!"), threadID, messageID);
  }

  const groups = threadList.filter(t => t.isGroup);
  let sent = 0, failed = 0;

  const startMsg = await api.sendMessage(box("⏳ বিজ্ঞপ্তি পাঠানো শুরু হয়েছে..."), threadID);

  // Send & register bridge
  for (const t of groups) {
    if (sent >= limit) break;
    if (t.threadID === threadID) continue;

    try {
      let firstMsgID = null;
      const bodyText = box(`📢 বিজ্ঞপ্তি\n${notifMessage}`);

      if (attachmentStreams.length === 0) {
        const info = await api.sendMessage(bodyText, t.threadID);
        firstMsgID = info.messageID;
      } else {
        // send first with caption
        const info = await api.sendMessage(
          {
            body: bodyText,
            attachment: attachmentStreams[0]
          },
          t.threadID
        );
        firstMsgID = info.messageID;

        // remaining
        for (let i = 1; i < attachmentStreams.length; i++) {
          await api.sendMessage({ attachment: attachmentStreams[i] }, t.threadID);
        }
      }

      // register handleReply bridge (group -> origin)
      pushHandleReply({
        name: this.config.name,
        type: "groupToOrigin",
        originThread: threadID,
        groupThread: t.threadID,
        anchorMsgID: firstMsgID,
        adminID: senderID
      });

      sent++;
    } catch (e) {
      console.error(`Send error to ${t.threadID}:`, e);
      failed++;
    }
  }

  const summary =
    box(
      `✅ সফলভাবে পাঠানো হয়েছে ${sent} গ্রুপে.` +
      (failed ? `\n❌ ${failed} গ্রুপে পাঠানো যায়নি।` : "") +
      `\n🛠️ রিপ্লাই করলে দুই দিকেই যাবে।`
    );

  try {
    if (api.editMessage) {
      await api.editMessage(summary, startMsg.messageID, threadID);
    } else {
      await api.sendMessage(summary, threadID);
    }
  } catch {
    await api.sendMessage(summary, threadID);
  }
};

// ------------- Two-way bridge -------------
module.exports.handleReply = async function ({ api, event, handleReply }) {
  const { threadID, senderID, body } = event;

  async function packOutgoingAttachments(srcEvent) {
    if (!srcEvent.attachments || srcEvent.attachments.length === 0) return [];
    const arr = [];
    for (const a of srcEvent.attachments) {
      try {
        arr.push(await getStream(a.url));
      } catch (e) {
        console.log("packOutgoingAttachments error:", e.message);
      }
    }
    return arr;
  }

  // group -> origin
  if (handleReply.type === "groupToOrigin") {
    if (threadID !== handleReply.groupThread) return;

    const streams = await packOutgoingAttachments(event);
    const msg = {
      body: box(`💬 [Reply from Group ${handleReply.groupThread}]\n${body || ""}`),
      attachment: streams.length ? streams : undefined
    };

    const sent = await api.sendMessage(msg, handleReply.originThread);

    pushHandleReply({
      name: module.exports.config.name,
      type: "originToGroup",
      originThread: handleReply.originThread,
      groupThread: handleReply.groupThread,
      anchorMsgID: sent.messageID,
      adminID: handleReply.adminID
    });

    return;
  }

  // origin -> group
  if (handleReply.type === "originToGroup") {
    if (threadID !== handleReply.originThread) return;
    if (senderID !== handleReply.adminID) return;

    const streams = await packOutgoingAttachments(event);
    const msg = {
      body: box(`📨 [Reply from Admin]\n${body || ""}`),
      attachment: streams.length ? streams : undefined
    };

    const sent = await api.sendMessage(msg, handleReply.groupThread);

    pushHandleReply({
      name: module.exports.config.name,
      type: "groupToOrigin",
      originThread: handleReply.originThread,
      groupThread: handleReply.groupThread,
      anchorMsgID: sent.messageID,
      adminID: handleReply.adminID
    });

    return;
  }
};
