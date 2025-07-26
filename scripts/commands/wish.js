module.exports = {
  config: {
    name: "wish",
    version: "3.0.1",
    credit: "Joy Ahmed",
    permission: 2, // 0 = everyone, 1 = group admin, 2 = bot admin
    shortDescription: "জন্মদিনের শুভেচ্ছা",
    longDescription: "মেনশন/রিপ্লাই করা ইউজারকে একাধিক স্টাইলিশ জন্মদিনের শুভেচ্ছা বার্তা পাঠায়।",
    Prefix: true,
    category: "fun",
    guide: {
      en: "{p}wish @mention\n{p}wish me (নিজেকে শুভেচ্ছা দিতে)\nকিংবা কারো মেসেজে রিপ্লাই দিয়ে {p}wish"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      let targetID, targetName;

      // 1) @mention থাকলে
      const mention = Object.keys(event.mentions || {})[0];
      if (mention) {
        targetID = mention;
        targetName = event.mentions[mention];
      }

      // 2) ".wish me" হলে নিজের আইডি
      else if (args && args[0] && args[0].toLowerCase() === "me") {
        targetID = event.senderID;
        targetName = "তুমি";
      }

      // 3) কারো মেসেজে রিপ্লাই দিয়ে কমান্ড দিলে
      else if (event.messageReply && event.messageReply.senderID) {
        targetID = event.messageReply.senderID;
        targetName = "আপনি";
      }

      // না হলে error
      if (!targetID) {
        return api.sendMessage("❌ যাকে শুভেচ্ছা দিতে চাও তাকে mention করো / `.wish me` লেখো / কারো মেসেজে রিপ্লাই দিয়ে `.wish` দাও!", event.threadID, event.messageID);
      }

      const tag = [{ id: targetID, tag: targetName }];

      // স্টাইলিশ বক্স টেমপ্লেট
      const box = (text) =>
`╭╼|━━━━━━━━━━━━━━|╾╮
${text}
╰╼|━━━━━━━━━━━━━━|╾╯`;

      const send = (body, delay = 0) =>
        setTimeout(() => {
          api.sendMessage({ body, mentions: tag }, event.threadID);
        }, delay);

      // মেসেজ লিস্ট
      const messages = [
        `🌸 ${targetName}, জন্মদিনের শুভেচ্ছা!\nতোমার জীবন হোক রঙিন আর সুখে ভরা।`,
        `✨ ${targetName}, হাসি মুখে কাটুক প্রতিটি মুহূর্ত!\n𝐇𝐀𝐏𝐏𝐘 𝐁𝐈𝐑𝐓𝐇𝐃𝐀𝐘 🎉`,
        `💖 ${targetName}, তুমি প্রতিদিন নতুন স্বপ্ন দেখো,\nশুভ জন্মদিনে রইলো অফুরন্ত ভালোবাসা!`,
        `🎂 ${targetName}, জীবন হোক কেকের মতো মিষ্টি।\nঅনেক অনেক শুভেচ্ছা!`,
        `🌟 ${targetName}, তোমার প্রতিটি দিন আলোয় ভরে উঠুক,\nপ্রিয়জনদের সাথে কাটুক সুন্দর সময়।`,
        `🎉 ${targetName}, আজ তোমার দিন, মজা করো জমিয়ে!\nহ্যাপি বার্থডে 🥳`,
        `💐 ${targetName}, আজ তোমার জন্য রইলো দোয়া ও শুভেচ্ছা,\nতুমি থাকো সুস্থ আর খুশি!`,
        `💝 ${targetName}, এই হাসিটা যেন কখনো না মুছে যায়,\nশুভ জন্মদিন!`,
        `🎊 ${targetName}, তোমার জীবনের প্রতিটি বছর হোক সেরা,\nশুভ জন্মদিনের শুভেচ্ছা!`,
        `🎀 ${targetName}, তোমার জীবনে আসুক সুখ, শান্তি আর ভালোবাসা।`
      ];

      // প্রথম স্পেশাল শুভেচ্ছা
      send(box(`JOY AHMED b0sS পক্ষ থেকে ${targetName}-কে জন্মদিনের শুভেচ্ছা!\n🎉 HAPPY BIRTHDAY 🎉`), 0);

      // বাকিগুলো ৩ সেকেন্ড অন্তর পাঠাবে
      messages.forEach((msg, i) => send(box(msg), 3000 * (i + 1)));

    } catch (e) {
      api.sendMessage("❌ কিছু একটা ভুল হয়েছে, কনসোলে error দেখো।", event.threadID, event.messageID);
      console.error(e);
    }
  }
};
