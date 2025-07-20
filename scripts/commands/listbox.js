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

module.exports.handleReply = async function({ api, event, Threads, handleReply }) {
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

  const arg = event.body.split(" ");
  const index = parseInt(arg[1]) - 1;

  if (index < 0 || index >= handleReply.groupid.length) {
    return api.sendMessage("❌ Invalid number!", event.threadID, event.messageID);
  }

  const idgr = handleReply.groupid[index];

  switch (handleReply.type) {
    case "reply":
      if (arg[0].toLowerCase() === "ban") {
        const data = (await Threads.getData(idgr)).data || {};
        data.banned = 1;
        await Threads.setData(idgr, { data });
        global.data.threadBanned.set(parseInt(idgr), 1);
        return api.sendMessage(`[${idgr}] Successfully banned!`, event.threadID, event.messageID);
      }

      if (arg[0].toLowerCase() === "out") {
        try {
          await api.removeUserFromGroup(api.getCurrentUserID(), idgr);
          const threadInfo = await Threads.getData(idgr);
          return api.sendMessage(`Left thread:\n${idgr}\n${threadInfo.name || "Unknown"}`, event.threadID, event.messageID);
        } catch (e) {
          return api.sendMessage(`❌ Failed to leave thread: ${e.message}`, event.threadID, event.messageID);
        }
      }
      break;
  }
};

module.exports.run = async function({ api, event, Threads }) {
  try {
    const inbox = await api.getThreadList(100, null, ["INBOX"]);
    const list = inbox.filter(group => group.isSubscribed && group.isGroup);

    let listthread = [];
    for (const groupInfo of list) {
      const data = await api.getThreadInfo(groupInfo.threadID);
      listthread.push({
        id: groupInfo.threadID,
        name: groupInfo.name,
        sotv: data.userInfo.length,
      });
    }

    listthread.sort((a, b) => b.sotv - a.sotv);

    // স্টাইলিশ ফন্ট ফাংশন (simple uppercase + spacing)
    function fancyFont(text) {
      return text
        .split("")
        .map(char => {
          const letters = {
            A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗", I: "𝓘",
            J: "𝓙", K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟", Q: "𝓠", R: "𝓡",
            S: "𝓢", T: "𝓣", U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧", Y: "𝓨", Z: "𝓩",
            a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱", i: "𝓲",
            j: "𝓳", k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻",
            s: "𝓼", t: "𝓽", u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃"
          };
          return letters[char] || char;
        })
        .join("");
    }

    let msg = "╭╼|━━━━━━━━━━━━━━|╾╮\n\n";  // স্টাইল্ড বক্স শুরু
    let groupid = [];
    let i = 1;
    for (const group of listthread) {
      msg += `${i++}. ${fancyFont(group.name)}\n 𝕋𝕀𝔻: ${group.id}\n𝕄𝕖𝕞𝕓𝕖𝕣𝕤: ${group.sotv}\n\n`;
      groupid.push(group.id);
    }
    msg += "╰╼|━━━━━━━━━━━━━━|╾╯\n";  // স্টাইল্ড বক্স শেষ

    api.sendMessage(
      msg + '𝕽𝖊𝖕𝖑𝖞 𝖜𝖎𝖙𝖍 "ban [number]" 𝖔𝖗 "out [number]" 𝖙𝖔 𝖇𝖆𝖓 𝖔𝖗 𝖑𝖊𝖆𝖛𝖊 𝖙𝖍𝖆𝖙 𝖙𝖍𝖗𝖊𝖆𝖉!',
      event.threadID,
      (error, data) => {
        global.client.handleReply.push({
          name: this.config.name,
          author: event.senderID,
          messageID: data.messageID,
          groupid,
          type: "reply",
        });
      }
    );
  } catch (e) {
    console.error(e);
    return api.sendMessage("❌ 𝕰𝖗𝖗𝖔𝖗 𝖔𝖈𝖈𝖚𝖗𝖗𝖊𝖉 𝖜𝖍𝖎𝖑𝖊 𝖋𝖊𝖙𝖈𝖍𝖎𝖓𝖌 𝖌𝖗𝖔𝖚𝖕𝖘.", event.threadID);
  }
};
