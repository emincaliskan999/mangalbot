
import fs from "fs";

let chatLog = [];

try {
  const raw = fs.readFileSync("./chat_logs.json", "utf8");
  chatLog = JSON.parse(raw);
} catch (e) {
  console.error("Chat log yüklenemedi:", e);
}

export function getMemory() {
  const lastMessages = chatLog.slice(-50); // Son 50 mesajı alıyoruz
  return lastMessages.map((msg) => `Twitch chatten biri: ${msg}`).join("\n");
}
