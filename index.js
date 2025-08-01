const express = require("express");
const app = express();
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("Mangalbot 🔥 Aktif!");
});

app.get("/chat", async (req, res) => {
  const userInput = req.query.input;
  if (!userInput) return res.status(400).send("Soru eksik!");

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Sen Twitch yayıncısı için eğlenceli, komik, kısa cevaplar veren bir AI botsun."
        },
        {
          role: "user",
          content: userInput
        }
      ]
    });

    res.send(response.data.choices[0].message.content);
  } catch (err) {
    console.error(err);
    res.status(500).send("Bot çöktü 😵‍💫");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});