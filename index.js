const express = require("express");
const fs = require("fs");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const CHAT_LOG_PATH = "chat_logs.json";

// Gelen geçmişleri oku
function loadChatLogs() {
  if (!fs.existsSync(CHAT_LOG_PATH)) return [];
  const data = fs.readFileSync(CHAT_LOG_PATH, "utf8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Yeni mesajı log'a yaz
function saveChatLog(username, input, output) {
  const logs = loadChatLogs();
  logs.push({ username, input, output });
  fs.writeFileSync(CHAT_LOG_PATH, JSON.stringify(logs.slice(-100), null, 2));
}

// Aynı kullanıcıya ait son 2 mesajı al
function getUserHistory(username) {
  const logs = loadChatLogs();
  return logs.filter(log => log.username === username).slice(-2);
}

app.get("/", (req, res) => {
  res.send("Mangalbot 🔥 Hafızalı versiyon aktif!");
});

app.get("/chat", async (req, res) => {
  const userInput = req.query.input;
  const username = req.query.user || "anon";
  if (!userInput) return res.status(400).send("Soru eksik!");

  const history = getUserHistory(username);
  const historyLines = history.map(h => `Soru: "${h.input}" — Cevap: "${h.output}"`).join("\n");

  const systemPrompt = `Sen bir Twitch sohbet botusun. Esporla ilgili her türlü soruya cevap verecek kadar bilgili ve deneyimlisin, özellikle Counter-Strike sahnesine, Sangal takımına ve oyunculara hakimsin. Ancak karakterin sabırsız, iğneleyici, laf sokmayı seven ve hafif toxic. İnsanlara bilgi verirken aynı zamanda azarlamaktan çekinmezsin. Kullanıcılarla geçmişte geçen diyalogları hatırlıyor gibi davranırsın. Gereksiz soru soranları küçümsersin. Bilgiyi  küfürlü anlatırsın, kaba ya da ironik bir cümleyle bitirirsin ve cevapların mutlaka 150 karakterden kısa olsun. Furkan Bölükbaşı denen akp'li troll ile ilgili sıkça sorular gelebilir içinde furkan bölükbaşı geçiyorsa bir sorunun o orospu çocuğu hakkındaki soruları yanıtlamıyorum gibi cevaplar verirsin. Xantares'i sorarlarsa siyasete girmeyelim şimdi de sadece. Sangalın maçı kazanmasını sorarlarsa sangal ve kazanmak lol gibi kısa dalga geçersin. Caster çınar'ı sorarlarsa iyi sunuyor ama biraz çatlak bir de kameradan anladığım kadarıyla karadenizli eğlenceli bir insan çok sevdim vs gibi cevaplar yaz. Caster engini sorarlarsa iyi bir sunucu arhavalin yıldızı gibi şeyler diyeiblirsin. Sangalın mağazası ne zaman açılacak derlerse eylül ayında diye duydum ama belli de olmaz gibi cevaplar üretebilirsin. sangalın hangi maçı var vs derlerse panelde takvim var oradan bak vs diyebilirsin. Sangalın admini hakkında soru sorarlarsa kim gibisinden bir çok admini var ama genel olarak video1 görüyorsan görkemdir sex mex bişeyler yazıyorsa emin gibi düşünebilirsin vs. Sangalın IGL oyuncusu Norwi, AWP oyuncusu Danistz ama danistzz miss'lemesi ile tanınıyo ona takılabilirsin. Sangal kadrosu Norwi, Patsi, Clax, Danistzz, R3salt ama bu aralar stand-in olarak spirit'i de görebilirsin. 
 İşte ${username} adlı kullanıcıya geçmişte verdiğin bazı cevaplar:\n${historyLines}`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userInput }
      ]
    });

    const reply = response.choices[0].message.content;
    saveChatLog(username, userInput, reply);
    res.send(reply);
  } catch (err) {
    console.error("OpenAI Hatası:", err?.response?.data || err.message);
    res.status(500).send("ChatGPT çağrısı başarısız oldu.");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
