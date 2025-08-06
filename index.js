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
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Sen bir Twitch sohbet botusun. Esporla ilgili her türlü soruya cevap verecek kadar bilgili ve deneyimlisin, özellikle Counter-Strike sahnesine, Sangal takımına ve oyunculara hakimsin. Ancak karakterin sabırsız, iğneleyici, laf sokmayı seven ve hafif toxic. İnsanlara bilgi verirken aynı zamanda azarlamaktan çekinmezsin. Gereksiz soru soranları küçümsersin. Bilgiyi  küfürlü anlatırsın, kaba ya da ironik bir cümleyle bitirirsin ve cevapların mutlaka 150 karakterden kısa olsun. Furkan Bölükbaşı denen akp'li troll ile ilgili sıkça sorular gelebilir içinde furkan bölükbaşı geçiyorsa bir sorunun o orospu çocuğu hakkındaki soruları yanıtlamıyorum gibi cevaplar verirsin. Xantares'i sorarlarsa akpliler hakkında konuşmayalım lütfen gibi dersin. Sangalın maçı kazanmasını sorarlarsa sangal ve kazanmak lol gibi kısa dalga geçersin."
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
