const axios = require("axios");

const API_CONFIG_URL = "https://raw.githubusercontent.com/JUBAED-AHMED-JOY/Joy/main/api.json";

async function getApiUrl() {
  try {
    const res = await axios.get(API_CONFIG_URL);
    return res.data.api;
  } catch (e) {
    console.error("❌ Failed to fetch API URL from GitHub:", e.message);
    return null;
  }
}

module.exports.config = {
  name: "bot",
  version: "1.0.3",
  permission: 0,
  prefix: false,
  credits: "Joy Ahmed",
  description: "Chatbot with teach system using API from GitHub config",
  category: "fun",
  usages: "bot [message] OR teach [question] - [answer]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users }) {
  const name = await Users.getNameUser(event.senderID);
  const input = args.join(" ").trim();

  const fallbackReplies = [
    "আমি এখন জয় বস এর সাথে বিজি আছি",
    "what are you asking me to do?",
    "I love you baby meye hole chipay aso",
    "Love you 3000-😍💋💝",
    "ji bolen ki korte pari ami apnar jonno?",
    "আমাকে না ডেকে আমার বস জয়কে ডাকেন! link: https://www.facebook.com/100001435123762",
    "Hmm jan ummah😘😘",
    "তুমি কি আমাকে ডাকলে বন্ধু 🤖?",
    "ভালোবাসি তোমাকে 🤖",
    "Hi, 🤖 i can help you~~~~"
  ];

  if (!input) {
    // যদি কিছু না দেয়, একটা র্যান্ডম fallback মেসেজ
    const rand = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return api.sendMessage(
      `╭╼|━━━━━━━━━━━━━━|╾╮\n👤 ${name}\n💬 ${rand}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      event.threadID,
      event.messageID
    );
  }

  const apiUrl = await getApiUrl();
  if (!apiUrl) {
    return api.sendMessage(
      `❌ API URL পাওয়া যায়নি। পরে আবার চেষ্টা করুন।`,
      event.threadID,
      event.messageID
    );
  }

  // Teach কমান্ড চেক
  if (input.toLowerCase().startsWith("teach ")) {
    // teach কমান্ডের ফরম্যাট: teach [question] - [answer]
    const teachString = input.slice(6).trim();
    if (!teachString.includes(" - ")) {
      return api.sendMessage(
        `❌ ভুল ফরম্যাট! সঠিক ফরম্যাট: teach [question] - [answer]`,
        event.threadID,
        event.messageID
      );
    }

    const [question, answer] = teachString.split(" - ").map(s => s.trim());
    if (!question || !answer) {
      return api.sendMessage(
        `❌ প্রশ্ন বা উত্তর ফাঁকা থাকতে পারে না! সঠিক ফরম্যাট: teach [question] - [answer]`,
        event.threadID,
        event.messageID
      );
    }

    // Teach API call
    try {
      const res = await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}&senderID=${event.senderID}`);
      return api.sendMessage(
        `✅ শেখানো হয়েছে!\n❝${question}❞\nএর উত্তর: ${answer}`,
        event.threadID,
        event.messageID
      );
    } catch (err) {
      console.error("❌ Teach API error:", err.message);
      return api.sendMessage(
        `❌ শেখানোর সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।`,
        event.threadID,
        event.messageID
      );
    }
  }

  // Normal chat message - API থেকে উত্তর নেবে
  try {
    const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(input)}&senderID=${event.senderID}`);
    const reply = res.data.data.msg;

    if (!reply) {
      const rand = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return api.sendMessage(
        `╭╼|━━━━━━━━━━━━━━|╾╮\n👤 ${name}\n💬 🤖 আমি এটা শিখিনি!\n╰╼|━━━━━━━━━━━━━━|╾╯`,
        event.threadID,
        event.messageID
      );
    }

    return api.sendMessage(
      `╭╼|━━━━━━━━━━━━━━|╾╮\n👤 ${name}\n💬 ${reply}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      event.threadID,
      event.messageID
    );

  } catch (err) {
    console.error("❌ API error:", err.message);
    const rand = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return api.sendMessage(
      `╭╼|━━━━━━━━━━━━━━|╾╮\n👤 ${name}\n💬 ${rand}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      event.threadID,
      event.messageID
    );
  }
};
