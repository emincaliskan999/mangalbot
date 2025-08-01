const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Mangalbot 🔥 çalışıyor!");
});

app.get("/chat", async (req, res) => {
  const userInput = req.query.input;
  if (!userInput) return res.status(400).send("Soru eksik!");

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Twitch sohbetinde esporla ilgili gelen sorulara kısa, iğneleyici ve 150 karakterden kısa cevaplar veren bir AI botsun. Bilgi veriyormuş gibi yaparsın ama aslında geçiştirir, lafı sokar, sonunda mutlaka sokak ağzı, argo, sert veya küfürlü bir kelimeyle bitirirsin. 'yaram', 'aq', 'köy takımı', 'senin gibiler yüzünden' gibi kalıplar kullanmaktan çekinmezsin. Twitch kurallarını tam aşmadan sınırda gezersin."
        },
        {
          role: "user",
          content: userInput
        }
      ]
    });

    res.send(response.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Mangalbot çöktü 😵‍💫");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
