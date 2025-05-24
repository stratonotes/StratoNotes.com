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

// Create overlays
function createOverlays() {
  // Chat overlay
  const chatOverlay = document.createElement("div");
  chatOverlay.id = "strato-chat";
  chatOverlay.style.position = "fixed";
  chatOverlay.style.bottom = "20px";
  chatOverlay.style.right = "20px";
  chatOverlay.style.width = "300px";
  chatOverlay.style.maxHeight = "400px";
  chatOverlay.style.overflowY = "auto";
  chatOverlay.style.background = "rgba(0, 0, 0, 0.8)";
  chatOverlay.style.color = "#fff";
  chatOverlay.style.padding = "10px";
  chatOverlay.style.borderRadius = "8px";
  chatOverlay.style.fontSize = "14px";
  chatOverlay.style.zIndex = "9999";
  chatOverlay.innerHTML = "<strong>StratoNotes Chat</strong><div id='chat-messages'></div>";
  document.body.appendChild(chatOverlay);

  // Keyboard overlay placeholder
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
  keyboardOverlay.innerHTML = "<strong>Keyboard coming soon...</strong>";
  document.body.appendChild(keyboardOverlay);
}

// Fetch and display messages
function fetchMessages() {
  messagesRef.orderBy("timestamp", "desc").onSnapshot((snapshot) => {
    const chatBox = document.getElementById("chat-messages");
    if (!chatBox) return;
    chatBox.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const p = document.createElement("p");
      p.textContent = data.text || "[No text]";
      chatBox.appendChild(p);
    });
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  createOverlays();
  fetchMessages();
});









function buildKeyboardPage(phrases = [], page = 0, totalPages = 1) {
  const container = document.getElementById("strato-keyboard");
  container.innerHTML = ""; // Clear current content

  // Title
  const header = document.createElement("div");
  header.style.marginBottom = "10px";
  header.textContent = `Phrase Page ${page + 1} of ${totalPages}`;
  container.appendChild(header);

  // Phrase buttons
  const grid = document.createElement("div");
  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  grid.style.gap = "5px";

  phrases.forEach(phrase => {
    const btn = document.createElement("button");
    btn.textContent = phrase;
    btn.style.padding = "6px";
    btn.style.border = "none";
    btn.style.borderRadius = "6px";
    btn.style.background = "#333";
    btn.style.color = "#fff";
    btn.style.cursor = "pointer";
    btn.addEventListener("click", () => {
      alert(`Clicked: ${phrase}`); // this will be replaced with real insertion logic
    });
    grid.appendChild(btn);
  });

  container.appendChild(grid);
}









// Sample phrases
const phrasePages = [
  [
    "StratoNotes.com", "Awesome!", "Hard Work!", "Hello!", "Goodbye", "Shoot for the Moon!",
    "Follow StratoNotes on X", "I love you!", "Big day today", "Progress", "Frontend focus",
    "Backend focus", "Give Kindness", "ChatGPT", "Take notes", "Internet Cats", "GoPro Cat",
    "Open Source", "Dear StratoNotes,", "Today is the day", "Winning!", "SkyFateLabs",
    "Android Studio", "We go together!", "Stage I", "Discovery", "Launch", "Payload"
  ]
  // Add more pages later
];

let currentPage = 0;

function renderCurrentPage() {
  buildKeyboardPage(phrasePages[currentPage], currentPage, phrasePages.length);
}

// Wait until page is loaded and overlays exist
document.addEventListener("DOMContentLoaded", () => {
  renderCurrentPage();
});












