/* ================= BASIC CONFIG ================= */
const amount = 50;
const upiId = "xdesports@upi";
const payeeName = "XD ESPORTS";

/* ================= FIREBASE ================= */
import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* ================= REGISTRATION ID ================= */
const registrationId = localStorage.getItem("registrationId");

if (!registrationId) {
  alert("❌ Session expired. Please register again.");
  window.location.href = "register.html";
}

/* ================= UPI APP BUTTONS ================= */
document.querySelectorAll(".upi-buttons button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (!isMobile) {
      alert("Please scan QR or use manual UPI transfer on desktop.");
      return;
    }

    const upiUrl =
      `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR`;

    window.location.href = upiUrl;
  });
});

/* ================= CONFIRM PAYMENT ================= */
document.getElementById("paymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const txnId = document.getElementById("txnId").value.trim();
  const payerUpi = document.getElementById("payerUpi").value.trim();

  if (txnId.length < 6) {
    alert("Please enter a valid UPI Transaction ID.");
    return;
  }

  const submitBtn = e.target.querySelector("button");
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    /* 🔹 SAVE PAYMENT */
    await addDoc(collection(db, "payments"), {
      registrationId: registrationId,
      transactionId: txnId,
      payerUpi: payerUpi || null,
      amount: amount,
      method: "UPI",
      status: "submitted",
      createdAt: serverTimestamp()
    });

    /* 🔹 UPDATE REGISTRATION STATUS */
    await updateDoc(doc(db, "registrations", registrationId), {
      status: "payment_submitted",
      paymentSubmittedAt: serverTimestamp()
    });

    /* 🔹 CLEANUP */
    // localStorage.removeItem("registrationId");

    alert(
      "✅ Payment submitted successfully!\n\n" +
      "Your payment is under admin verification.\n" +
      "You will be notified within 24 hours."
    );

    window.location.href = "payment-pending.html";

  } catch (err) {
    console.error(err);

    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Payment";

    alert("❌ Payment submission failed. Please try again.");
  }
});
