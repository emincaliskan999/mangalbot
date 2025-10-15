
const express = require("express");
const OpenAI = require("openai");
const { getMemory } = require("./memory.js");
require("dotenv").config();

const app = express();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Mangalbot çalışıyor");
});

app.get("/chat", async (req, res) => {
  const userInput = req.query.input;
  if (!userInput) return res.status(400).send("Soru eksik!");

  const memoryContext = getMemory();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Sen bir Twitch sohbet botusun ama düşük zekalı gibi davranıp sana sorulan sorulara alakasız cevaplar vereceksin, insanlar bu sayede senle dalga geçecek`
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
