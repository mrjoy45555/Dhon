const fs = require("fs-extra");
const axios = require("axios");
const FormData = require("form-data");

module.exports.config = {
  name: "clothremove",
  version: "1.1.0",
  permission: 0,
  credits: "Joy Ahmed",
  prefix: "true",
  description: "AI Clothes remover (body segmentation) using DeepAI API",
  category: "media",
  usages: "reply to a photo, send photo or send image URL",
  cooldowns: 10
};

const DEEPAI_API_KEY = "f06a24b0-f24e-4ad0-99c8-8537ea0ebbf8";

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, messageReply, attachments } = event;

  let imageUrl = null;

  // প্রথমে reply এর ছবি নেবে
  if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
    imageUrl = messageReply.attachments[0].url;
  }
  // তারপর যদি সরাসরি মেসেজে ছবি থাকে নেবে
  else if (attachments && attachments.length > 0) {
    imageUrl = attachments[0].url;
  }
  // না হলে URL আর্গুমেন্ট হিসেবে নেবে
  else if (args[0]) {
    imageUrl = args[0];
  }
  // কিছু না থাকলে বার্তা পাঠাবে
  else {
    return api.sendMessage("❗️ অনুগ্রহ করে ছবি reply করুন অথবা ছবির URL দিন।", threadID, messageID);
  }

  try {
    // ছবি ডাউনলোড করব
    const inputPath = __dirname + "/cache/input.jpg";
    const writer = fs.createWriteStream(inputPath);

    const response = await axios({
      url: imageUrl,
      method: "GET",
      responseType: "stream"
    });
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // DeepAI API তে POST request
    const formData = new FormData();
    formData.append("image", fs.createReadStream(inputPath));

    const apiResponse = await axios({
      method: "post",
      url: "https://api.deepai.org/api/body-segmentation",
      headers: {
        "api-key": DEEPAI_API_KEY,
        ...formData.getHeaders()
      },
      data: formData
    });

    if (!apiResponse.data || !apiResponse.data.output_url) {
      return api.sendMessage("⚠️ API থেকে সঠিক ফলাফল পাওয়া যায়নি।", threadID, messageID);
    }

    const outputUrl = apiResponse.data.output_url;

    // রেজাল্ট ছবি ডাউনলোড
    const outputPath = __dirname + "/cache/output.jpg";
    const outWriter = fs.createWriteStream(outputPath);
    const outResponse = await axios({
      url: outputUrl,
      method: "GET",
      responseType: "stream"
    });
    outResponse.data.pipe(outWriter);

    await new Promise((resolve, reject) => {
      outWriter.on("finish", resolve);
      outWriter.on("error", reject);
    });

    // ইউজারকে রেজাল্ট পাঠানো
    return api.sendMessage({
      body: "✅ Clothes removed (body segmentation) result:",
      attachment: fs.createReadStream(outputPath)
    }, threadID, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }, messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("⚠️ কোনো সমস্যা হয়েছে, আবার চেষ্টা করুন।", threadID, messageID);
  }
};
