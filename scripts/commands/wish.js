module.exports = {
  config: {
    name: "wish",
    version: "3.0.0",
    credit: "Joy Ahmed",
    permission: 2,
    shortDescription: "জন্মদিনের শুভেচ্ছা",
    longDescription: "মেনশন করা ইউজারকে একাধিক স্টাইলিশ জন্মদিনের শুভেচ্ছা বার্তা পাঠায়।",
    prefix: true,
    category: "fun",
    guide: {
      en: "{p}birthday @mention"
    }
  },

  onStart: async function ({ api, event }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention)
      return api.sendMessage("❌ যাকে শুভেচ্ছা দিতে চাও তাকে mention করো!", event.threadID, event.messageID);

    const name = event.mentions[mention];
    const tag = [{ id: mention, tag: name }];

    // স্টাইলিশ বক্স টেমপ্লেট
    const box = (text) =>
`╭╼|━━━━━━━━━━━━━━|╾╮
${text}
╰╼|━━━━━━━━━━━━━━|╾╯`;

    const send = (body) => api.sendMessage({ body, mentions: tag }, event.threadID);

    // জন্মদিনের শুভেচ্ছা মেসেজ লিস্ট
    const messages = [
      `🌸 ${name}, জন্মদিনের শুভেচ্ছা!\nতোমার জীবন হোক রঙিন আর সুখে ভরা।`,
      `✨ ${name}, হাসি মুখে কাটুক প্রতিটি মুহূর্ত!\n𝐇𝐀𝐏𝐏𝐘 𝐁𝐈𝐑𝐓𝐇𝐃𝐀𝐘 🎉`,
      `💖 ${name}, তুমি প্রতিদিন নতুন স্বপ্ন দেখো,\nশুভ জন্মদিনে রইলো অফুরন্ত ভালোবাসা!`,
      `🎂 ${name}, জীবন হোক মিষ্টি কেকের মতো মিষ্টি।\nঅনেক অনেক শুভেচ্ছা!`,
      `🌟 ${name}, তোমার প্রতিটি দিন আলোয় ভরে উঠুক,\nপ্রিয়জনদের সাথে কাটুক সুন্দর সময়।`,
      `🎉 ${name}, আজ তোমার দিন, মজা করো জমিয়ে!\nহ্যাপি বার্থডে 🥳`,
      `💐 ${name}, আজ তোমার জন্য রইলো দোয়া ও শুভেচ্ছা,\nতুমি থাকো সুস্থ আর খুশি!`,
      `💝 ${name}, এই হাসিটা যেন কখনো না মুছে যায়,\nশুভ জন্মদিন!`,
      `🎊 ${name}, তোমার জীবনের প্রতিটি বছর হোক সেরা,\nশুভ জন্মদিনের শুভেচ্ছা!`,
      `🎀 ${name}, তোমার জীবনে আসুক সুখ, শান্তি আর ভালোবাসা।`
    ];

    // শুরুতে একটি স্পেশাল শুভেচ্ছা
    send(box(`JOY AHMED b0sS পক্ষ থেকে ${name}-কে জন্মদিনের শুভেচ্ছা!\n🎉 HAPPY BIRTHDAY 🎉`));

    // একে একে মেসেজ পাঠানো
    messages.forEach((msg, index) => {
      setTimeout(() => send(box(msg)), 3000 * (index + 1));
    });
  }
};
