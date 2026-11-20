// TAMHAS GLOBAL GROUP - Website interactions

document.addEventListener("DOMContentLoaded", function () {

  // EmailJS Configuration
  const EMAILJS_PUBLIC_KEY = "4l8JZR0nckc8DrU0s";
  const EMAILJS_SERVICE_ID = "service_nxfdbf4";
  const EMAILJS_TEMPLATE_ID = "template_8ketbrm";

  // Current year
  const year = document.getElementById("year");
  if (year) {
    year.textContent = new Date().getFullYear();
// TAMHAS GLOBAL GROUP - Website interactions

document.addEventListener("DOMContentLoaded", function () {

  // EmailJS Configuration
  const EMAILJS_PUBLIC_KEY = "4l8JZR0nckc8DrU0s";
  const EMAILJS_SERVICE_ID = "service_nxfdbf4";

  // Contact Us Template
  const EMAILJS_CONTACT_TEMPLATE = "template_8ketbrm";

  // Automatic Reply Template
  const EMAILJS_AUTOREPLY_TEMPLATE = "template_4ieothw";


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


  // Contact form with Automatic Reply
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const submitButton = contactForm.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (formNote) {
        formNote.textContent = "Sending your message...";
      }

      if (submitButton) {
        submitButton.disabled = true;
      }

      try {

        if (!window.emailjs) {
          throw new Error("EmailJS SDK is not loaded.");
        }

        // Step 1: Send message to TAMHAS Support Gmail
        await window.emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_CONTACT_TEMPLATE,
          contactForm,
          EMAILJS_PUBLIC_KEY
        );

        // Step 2: Send automatic reply to the customer
        try {

          await window.emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            EMAILJS_AUTOREPLY_TEMPLATE,
            contactForm,
            EMAILJS_PUBLIC_KEY
          );

          if (formNote) {
            formNote.textContent =
              "Thank you! Your message has been received. A confirmation email has been sent to you.";
          }

        } catch (replyError) {

          console.error("Automatic reply error:", replyError);

          if (formNote) {
            formNote.textContent =
              "Your message was received successfully, but the confirmation email could not be sent.";
          }

        }

        contactForm.reset();

      } catch (error) {

        console.error("EmailJS error:", error);

        if (formNote) {
          formNote.textContent =
            "Sorry, your message could not be sent. Please try again later.";
        }

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
        }

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
