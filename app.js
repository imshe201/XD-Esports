document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  const desktopLinks = document.querySelectorAll(".nav-links a");
  const mobileLinks = document.querySelectorAll(".mobile-nav a");

  /* ===== SET HOME ACTIVE BY DEFAULT ===== */
  function setDefaultActive() {
    desktopLinks.forEach(link => link.classList.remove("active"));
    mobileLinks.forEach(link => link.classList.remove("active"));

    if (desktopLinks[0]) desktopLinks[0].classList.add("active");
    if (mobileLinks[0]) mobileLinks[0].classList.add("active");
  }
  setDefaultActive();

  /* ===== HAMBURGER ===== */
  hamburger.addEventListener("click", () => {
    mobileNav.classList.toggle("show");
  });

  /* ===== ACTIVE LINK CLICK ===== */
  [...desktopLinks, ...mobileLinks].forEach(link => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");

      desktopLinks.forEach(l =>
        l.classList.toggle("active", l.getAttribute("href") === href)
      );
      mobileLinks.forEach(l =>
        l.classList.toggle("active", l.getAttribute("href") === href)
      );

      mobileNav.classList.remove("show");
    });
  });
});

/* ================= SCROLLSPY ================= */

const sections = document.querySelectorAll("section[id]");

const observerOptions = {
  root: null,
  rootMargin: "-50% 0px -50% 0px",
  threshold: 0
};

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute("id");

      document.querySelectorAll(".nav-links a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });

      document.querySelectorAll(".mobile-nav a").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* ================= MODAL ================= */

const modal = document.getElementById("tournamentModal");
const modalTitle = document.getElementById("modalTitle");
const modalDetails = document.getElementById("modalDetails");

document.querySelectorAll(".open-modal").forEach(btn => {
  btn.addEventListener("click", () => {
    modalTitle.textContent = btn.dataset.title;
    modalDetails.textContent = btn.dataset.details;
    modal.classList.add("show");
  });
});

document.querySelector(".close-modal").addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.remove("show");
});

/* ================= ACCORDION ================= */

document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const current = header.parentElement;

    document.querySelectorAll(".accordion-item.active").forEach(item => {
      if (item !== current) item.classList.remove("active");
    });

    current.classList.toggle("active");
  });
});

/* ================= REGISTER BUTTON (FINAL FIX) ================= */

document.querySelectorAll(".register-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();

    const status = btn.dataset.status;
    const tournament = btn.dataset.tournament;

    // FEATURED → OPEN REGISTRATION
    if (status === "open" && tournament === "featured") {
      window.location.href = "register.html";
      return;
    }

    // WEEKLY / MONTHLY → COMING SOON
    if (status === "coming-soon") {
      showInfoPopup(
        "⏳ Tournament dates are not finalized yet.\n\n" +
        "Entry fee & prizes are fixed.\n" +
        "You will be notified once registrations open."
      );
    }
  });
});

/* ================= INFO POPUP ================= */

function showInfoPopup(message) {
  modalTitle.textContent = "Coming Soon";
  modalDetails.textContent = message;
  modal.classList.add("show");
}
