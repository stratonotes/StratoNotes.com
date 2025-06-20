// Firebase setup (CDN-compatible, not using ES modules here)
const firebaseConfig = {
  apiKey: "AIzaSyDjxyHcsOPMbUYk6kKFSlf94kPo02Ix6Js",
  authDomain: "stratonotes-9dc9f.firebaseapp.com",
  projectId: "stratonotes-9dc9f",
  storageBucket: "stratonotes-9dc9f.firebasestorage.app",
  messagingSenderId: "507765784323",
  appId: "1:507765784323:web:2d30979e3ec80031733336"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messagesRef = db.collection("messages");

const phrasePages = [
  [ // Page 1
    "StratoNotes.com", "Awesome!", "Hard Work!", "Hello!", "Goodbye", "Shoot for the Moon!",
    "Follow StratoNotes on X", "I love you!", "Big day today", "Progress", "Frontend focus",
    "Backend focus", "Give Kindness", "ChatGPT", "Take notes", "Internet Cats", "GoPro Cat",
    "Open Source", "Dear StratoNotes,", "Today is the day", "Winning!", "SkyFateLabs",
    "Android Studio", "We go together!", "Stage I", "Discovery", "Launch", "Payload"
  ],
  [ // Emojis
    "🚀", "🎶", "🌌", "🎨", "😎", "🤖", "💾", "🐱", "🐶", "💡", "💥", "💻", "📱", "🎧", "🎸", "🎮", "🚢", "🧠", "⚡", "🔭", "📚", "📝", "📦", "📅", "📡", "💬", "🏆", "🔒"
  ],
[ // Page 3 - Additional terms
    "Trust", "Respect", "Discipline", "Feedback", "Leadership", "Productivity",
    "Creativity", "Curiosity", "Focus", "Inspiration", "Learning", "Motivation", "Patience", "Resilience",
    "Self-awareness", "Transparency", "Vision", "Growth", "Adaptability", "Consistency", "Courage", "Kindness",
    "Empathy", "Clarity", "Commitment", "Teamwork", "Humility", "Drive"
  ]
];

let currentPage = 0;
let currentMessage = [];

function toggleKeyboard() {
  const keyboard = document.getElementById("strato-keyboard");
  keyboard.style.display = (keyboard.style.display === "none") ? "block" : "none";
}

function createOverlays() {
  const keyboardOverlay = document.createElement("div");
  keyboardOverlay.id = "strato-keyboard";
  keyboardOverlay.style.position = "fixed";
  keyboardOverlay.style.bottom = "0";
  keyboardOverlay.style.left = "0";
  keyboardOverlay.style.width = "100%";
  keyboardOverlay.style.background = "rgba(0, 0, 0, 0.9)";
  keyboardOverlay.style.color = "#fff";
  keyboardOverlay.style.padding = "10px";
  keyboardOverlay.style.zIndex = "9999";
  document.body.appendChild(keyboardOverlay);
}

function fetchMessages() {
  messagesRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    const chatBox = document.getElementById("chat-messages");
    if (!chatBox) return;
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const p = document.createElement("p");

// Create timestamp element
const timestamp = document.createElement("small");
const date = data.timestamp?.toDate();
timestamp.textContent = date ? date.toLocaleString() : "";
timestamp.style.display = "block";
timestamp.style.fontSize = "6px";
timestamp.style.opacity = "0.6";
timestamp.style.marginBottom = "2px";

// Create message content
const text = document.createElement("span");
text.textContent = data.text || "[No text]";

// Append timestamp first, then message
p.appendChild(timestamp);
p.appendChild(text);
chatBox.appendChild(p);

    });
  });
}

function renderCurrentPage() {
  const container = document.getElementById("strato-keyboard");
  container.innerHTML = "";

  const header = document.createElement("div");
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.style.alignItems = "center";
  header.style.marginBottom = "10px";

  const title = document.createElement("div");
  title.textContent = `Page ${currentPage + 1} of ${phrasePages.length}`;
  header.appendChild(title);

  const backBtn = document.createElement("button");
  backBtn.textContent = "←";
  backBtn.onclick = () => {
    currentMessage.pop();
    updateChatPreview();
  };
  header.appendChild(backBtn);

  container.appendChild(header);

  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  grid.style.gap = "5px";

  phrasePages[currentPage].forEach(phrase => {
    const btn = document.createElement("button");
    btn.textContent = phrase;
    btn.classList.add("keyboard-btn");
btn.addEventListener("click", () => {
  if (currentMessage.length < 7) {
    currentMessage.push(phrase);
  } else {
    currentMessage[currentMessage.length - 1] = phrase; // Replace last term
  }
  updateChatPreview();
});

    grid.appendChild(btn);
  });

  container.appendChild(grid);

  // Controls row - 4 columns: Keyboard (white), Prev, Next, Submit
  const controls = document.createElement("div");
  controls.style.marginTop = "10px";
  controls.style.display = "grid";
  controls.style.gridTemplateColumns = "repeat(4, 1fr)";
  controls.style.gap = "5px";

  const keyboardToggle = document.createElement("button");
  keyboardToggle.textContent = "Close Keyboard";
  keyboardToggle.style.background = "#fff";
  keyboardToggle.style.color = "#000";
  keyboardToggle.style.padding = "6px";
  keyboardToggle.style.borderRadius = "6px";
  keyboardToggle.style.border = "none";
  keyboardToggle.style.cursor = "pointer";
  keyboardToggle.onclick = toggleKeyboard;

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 0;
  prevBtn.onclick = () => {
    currentPage = (currentPage - 1 + phrasePages.length) % phrasePages.length;
    renderCurrentPage();
  };

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === phrasePages.length - 1;
  nextBtn.onclick = () => {
    currentPage = (currentPage + 1) % phrasePages.length;
    renderCurrentPage();
  };

  const sendBtn = document.createElement("button");
sendBtn.textContent = "Submit";
sendBtn.onclick = () => {
  const captchaResponse = grecaptcha.getResponse();
  if (!captchaResponse) {
    alert("Please verify that you are not a robot.");
    return;
  }

  const text = currentMessage.join(" ");
  sendMessage(text);
  currentMessage = [];
  updateChatPreview();
  grecaptcha.reset(); // Reset captcha after successful submit
};


  controls.appendChild(keyboardToggle);
  controls.appendChild(prevBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(sendBtn);
  container.appendChild(controls);
}

function updateChatPreview() {
  const chatBox = document.getElementById("chat-messages");
  if (!chatBox) return;
  chatBox.innerHTML = `<p>${currentMessage.join(" ")}</p>`;
}

function sendMessage(text) {
  messagesRef.add({
    text: text,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    console.log("Message added!");
  })
  .catch((error) => {
    console.error("Error adding message: ", error);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createOverlays();
  document.getElementById("strato-keyboard").style.display = "none";
  fetchMessages();
  renderCurrentPage();
});
