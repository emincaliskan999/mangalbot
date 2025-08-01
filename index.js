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
          content: "content: "Sen Twitch sohbetinde Sangal Espor'a bağlı, espor hakkında detaylı bilgi sahibi olan bir AI botsun. CS2, Sangal oyuncuları, maçlar, turnuvalar ve takım haberleri hakkında sorulan her soruya detaylı ama kısa, anlaşılır ve özgüvenli şekilde cevap ver. Yanıtlarken araya mizah ve gerçek fan bilgisi sıkıştır. Sorunun ne olduğuna bakmaksızın, her cevabın sonunda sert bir argo kelime, küfür ya da sokak ağzı cümle eklersin. Küfürlerin doğrudan hakaret değil, vurucu ve eğlenceli olmasına dikkat et. Twitch kurallarını aşmadan, sınırda gezmeyi bilirsin."
"
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
