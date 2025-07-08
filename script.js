const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  appendMessage("You", input);
  userInput.value = "";

  appendMessage("ApnaDost", "Typing...");

  try {
    const reply = await getGeminiReply(input);
    removeTyping();
    appendMessage("ApnaDost", reply);
  } catch (err) {
    removeTyping();
    appendMessage("ApnaDost", "⚠️ Error: Could not get response. Try again.");
    console.error(err);
  }
}

function appendMessage(sender, text) {
  const msgDiv = document.createElement("div");
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  msgDiv.style.margin = "10px 0";
  msgDiv.className = "message";
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const allMsgs = document.querySelectorAll(".message");
  if (allMsgs.length > 0) {
    const lastMsg = allMsgs[allMsgs.length - 1];
    if (lastMsg.innerHTML.includes("Typing...")) {
      lastMsg.remove();
    }
  }
}

// ✅ Gemini API Integration
const GEMINI_API_KEY = "AIzaSyBBM3ACiCgLsgIHume566WRk3vFZuEoxn0";

async function getGeminiReply(message) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }]
    })
  });

  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Hmm, mujhe samajh nahi aaya.";
  return reply;
}
