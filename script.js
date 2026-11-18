// TAMHAS GLOBAL GROUP - Website interactions

document.addEventListener("DOMContentLoaded", function () {

  // Current year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Back to top button
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", function () {
      backToTop.classList.toggle("show", window.scrollY > 350);
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // Contact form: prepare an email
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject");
      const message = formData.get("message");

      // Add the official business email here when available.
      const businessEmail = "";

      if (!businessEmail) {
        if (formNote) {
          formNote.textContent =
            "Thank you! The form is ready, but the company's official email has not been configured yet.";
        }
        return;
      }

      const body =
        "Name: " + name +
        "\nEmail: " + email +
        "\n\nMessage:\n" + message;

      const mailto =
        "mailto:" + businessEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailto;

      if (formNote) {
        formNote.textContent = "Your email app should open with your message prepared.";
      }
    });
  }

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  // Reveal sections when scrolling
  const revealElements = document.querySelectorAll(
    ".section-heading, .info-card, .service-card, .project-card, .business-section"
  );

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealElements.forEach(function (element) {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
  }

});
