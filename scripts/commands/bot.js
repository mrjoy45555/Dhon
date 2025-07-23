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
  version: "1.0.7",
  permission: 0,
  prefix: false,
  credits: "Joy Ahmed",
  description: "Chatbot with teach system using API from GitHub config",
  category: "fun",
  usages: "bot [message] OR teach [question] - [answer]",
  cooldowns: 5,
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
    try {
    const apiUrl = await getApiUrl();
      const response = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(event.body)}`);
      console.log(response.data);
      const result = response.data.data.msg;


      api.sendMessage(result, event.threadID, (error, info) => {
        if (error) {
          console.error('Error replying to user:', error);
          return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }
        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          head: event.body
        });
      }, event.messageID);

    } catch (error) {
      console.error('Error in handleReply:', error);
      api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
    }
}

module.exports.run = async function ({ api, event, args, Users }) {
  const senderName = await Users.getNameUser(event.senderID);
  let input = args.join(" ").trim();
  let replyPrefix = `👤 ${senderName}\n`;
  let mentions = [{
    tag: senderName,
    id: event.senderID
  }];

  // 🧠 Detect reply message
  if (!input && event.type === "message_reply" && event.messageReply?.body) {
    input = event.messageReply.body;

    const replyUID = event.messageReply.senderID;
    const replyName = await Users.getNameUser(replyUID);

    mentions = [{
      tag: replyName,
      id: replyUID
    }];
    replyPrefix += `↪️ রিপ্লাই দিয়েছেন: ${replyName}\n`;
  }

  // 🧠 If mentioned someone but no input
  if (!input && event.mentions && Object.keys(event.mentions).length > 0) {
    input = "hi";
  }

  // 🧠 If said 'bot', treat as call
  if (!input && args.join(" ").toLowerCase().includes("bot")) {
    input = "hi";
    mentions = [{
      tag: senderName,
      id: event.senderID
    }];
  }

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
    const rand = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return api.sendMessage({
      body: `╭╼|━━━━━━━━━━━━━━|╾╮\n${replyPrefix}💬 ${rand}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      mentions
    }, event.threadID, event.messageID);
  }

  const apiUrl = await getApiUrl();
  if (!apiUrl) {
    return api.sendMessage(`❌ API URL পাওয়া যায়নি। পরে আবার চেষ্টা করুন।`, event.threadID, event.messageID);
  }

  // 🧠 Teach system
  if (input.toLowerCase().startsWith("teach ")) {
    const teachString = input.slice(6).trim();
    if (!teachString.includes(" - ")) {
      return api.sendMessage(`❌ ভুল ফরম্যাট! teach [question] - [answer]`, event.threadID, event.messageID);
    }

    const [question, answer] = teachString.split(" - ").map(s => s.trim());
    if (!question || !answer) {
      return api.sendMessage(`❌ প্রশ্ন বা উত্তর ফাঁকা থাকতে পারে না!`, event.threadID, event.messageID);
    }

    try {
      await axios.get(`${apiUrl}/sim?type=teach&ask=${encodeURIComponent(question)}&ans=${encodeURIComponent(answer)}&senderID=${event.senderID}`);
      return api.sendMessage(`✅ শেখানো হয়েছে!\n❝${question}❞\nউত্তর: ${answer}`, event.threadID, event.messageID);
    } catch (err) {
      console.error("❌ Teach API error:", err.message);
      return api.sendMessage(`❌ শেখানোর সময় সমস্যা হয়েছে।`, event.threadID, event.messageID);
    }
  }

  // 💬 Ask system
  try {
    const res = await axios.get(`${apiUrl}/sim?type=ask&ask=${encodeURIComponent(input)}&senderID=${event.senderID}`);
    const reply = res.data.data.msg;

    if (!reply) {
      return api.sendMessage({
        body: `╭╼|━━━━━━━━━━━━━━|╾╮\n${replyPrefix}💬 🤖 আমি এটা শিখিনি!\n╰╼|━━━━━━━━━━━━━━|╾╯`,
        mentions
      }, event.threadID, event.messageID);
    }

    return api.sendMessage({ body: reply }, event.threadID, (error, info) => {
          if (error) {
            return api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
          }

          global.client.handleReply.push({
            type: 'reply',
            name: this.config.name,
            messageID: info.messageID,
            author: event.senderID,
            head: input,
          });
        }, event.messageID);

  } catch (err) {
    console.error("❌ API error:", err.message);
    const rand = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return api.sendMessage({
      body: `╭╼|━━━━━━━━━━━━━━|╾╮\n${replyPrefix}💬 ${rand}\n╰╼|━━━━━━━━━━━━━━|╾╯`,
      mentions
    }, event.threadID, event.messageID);
  }
};
