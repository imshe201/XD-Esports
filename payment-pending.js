/* ================= FIREBASE ================= */
import { db } from "./firebase.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= REGISTRATION ID ================= */
const registrationId = localStorage.getItem("registrationId");

if (!registrationId) {
  alert("Session expired. Please register again.");
  window.location.href = "register.html";
}

/* ================= FETCH REGISTRATION ================= */
async function loadPendingData() {
  try {
    const regRef = doc(db, "registrations", registrationId);
    const snap = await getDoc(regRef);

    if (!snap.exists()) {
      throw new Error("Registration not found");
    }

    const registrationData = snap.data();

    /* ================= WHATSAPP MESSAGE (USER → ADMIN) ================= */

    // 🔴 REPLACE with your admin WhatsApp number (with country code, no +)
    const adminPhone = "916200179248";

    const message = `
Hello XD ESPORTS Team 👋

I have completed my payment.

📌 Tournament: ${registrationData.tournament}
👤 Team Leader: ${registrationData.leaderName}
💰 Amount Paid: ₹${registrationData.entryFee}
🧾 Transaction ID: ${registrationData.transactionId || "Submitted via website"}
📱 WhatsApp: ${registrationData.whatsapp}

Please verify my payment.

Thank you 🙏
`;

    const whatsappLink =
      "https://wa.me/" +
      adminPhone +
      "?text=" +
      encodeURIComponent(message);

    const btn = document.getElementById("whatsappPending");
    btn.href = whatsappLink;
    btn.style.pointerEvents = "auto";
    btn.style.opacity = "1";

  } catch (err) {
    console.error(err);
    alert("Unable to load verification details.");
  }
}

loadPendingData();
