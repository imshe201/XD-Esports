/* ================= FIREBASE ================= */
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= LIVE SLOT COUNT (FIRESTORE ONLY) ================= */

const slotText = document.getElementById("slotsLeft");
const slotMessage = document.getElementById("slotMessage");
const slotBox = document.getElementById("slotBox");

const tournamentRef = doc(db, "tournaments", "featured");

async function loadSlots() {
  try {
    const snap = await getDoc(tournamentRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const slotsLeft = data.maxSlots - data.filledSlots;

    slotText.textContent = slotsLeft;

    if (slotsLeft <= 10) {
      slotMessage.textContent = "🔥 Almost Full!";
      slotMessage.style.color = "#ef4444";
      slotBox.style.animation = "shake 0.3s infinite";
    } else if (slotsLeft <= 30) {
      slotMessage.textContent = "⚠️ Filling Fast";
      slotMessage.style.color = "#fbbf24";
      slotBox.style.animation = "";
    } else {
      slotMessage.textContent = "Slots available";
      slotMessage.style.color = "";
      slotBox.style.animation = "";
    }
  } catch (err) {
    console.error("Slot load failed:", err);
  }
}

loadSlots();

/* ================= COUNTDOWN TIMER ================= */

const targetDate = new Date("February 10, 2026 23:59:59").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = targetDate - now;

  if (diff <= 0) {
    document.querySelector(".countdown").innerHTML =
      "<strong>⛔ Registrations Closed</strong>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("d").textContent = days;
  document.getElementById("h").textContent = hours;
  document.getElementById("m").textContent = minutes;
  document.getElementById("s").textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

/* ================= FORM SUBMIT ================= */

document
  .getElementById("registrationForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.textContent = "Processing...";

    try {
      /* 🔐 FINAL SLOT CHECK FROM FIRESTORE */
      const snap = await getDoc(tournamentRef);
      const data = snap.data();

      if (data.filledSlots >= data.maxSlots) {
        alert("Registrations Closed");
        submitBtn.disabled = false;
        submitBtn.textContent = "PAY ₹50 & CONFIRM SLOT";
        return;
      }

      /* 📝 SAVE REGISTRATION */
      const docRef = await addDoc(collection(db, "registrations"), {
        leaderName: form.leaderName.value,
        whatsapp: form.whatsapp.value,
        leaderIGN: form.leaderIGN.value,
        leaderUID: form.leaderUID.value,

        player2IGN: form.player2IGN.value,
        player2UID: form.player2UID.value,
        player3IGN: form.player3IGN.value,
        player3UID: form.player3UID.value,

        optionalIGN: form.optionalIGN.value || null,
        optionalUID: form.optionalUID.value || null,

        tournament: "Battle for Survival – Season 1",
        entryFee: 50,
        status: "pending_payment",
        createdAt: serverTimestamp()
      });

      /* 🔑 STORE REGISTRATION ID FOR PAYMENT PAGE */
      localStorage.setItem("registrationId", docRef.id);

      /* ➡️ REDIRECT TO PAYMENT */
      window.location.href = "payment.html";

    } catch (err) {
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.textContent = "PAY ₹50 & CONFIRM SLOT";
      alert("❌ Registration failed. Try again.");
    }
  });
