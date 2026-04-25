const topbar = document.querySelector(".topbar");
const navToggle = document.querySelector(".nav-toggle");
const reservationButtons = document.querySelectorAll("[data-reservation]");
const contactForm = document.querySelector("[data-contact-form]");

if (navToggle && topbar) {
  navToggle.addEventListener("click", () => {
    topbar.classList.toggle("nav-open");
  });
}

reservationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert("Rezervace prohlídky bude brzy dostupná online. Zavolejte prosím na +420 777 872 385.");
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Děkuji za zprávu. Ozvu se vám do 24 hodin.");
    contactForm.reset();
  });
}

const syncTopContactVisibility = () => {
  if (window.scrollY > 0) {
    document.body.classList.add("scrolled");
  } else {
    document.body.classList.remove("scrolled");
  }
};

syncTopContactVisibility();
window.addEventListener("scroll", syncTopContactVisibility, { passive: true });
