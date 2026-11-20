/* =========================================
   TAMHAS GLOBAL GROUP
   Website JavaScript + EmailJS
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // EMAILJS CONFIGURATION
  const EMAILJS_PUBLIC_KEY = "4l8JZR0nckc8DrU0s";
  const EMAILJS_SERVICE_ID = "service_nxfdbf4";

  // Two EmailJS Template IDs
  const CONTACT_TEMPLATE_ID = "template_8ketbrm";
  const AUTOREPLY_TEMPLATE_ID = "template_4ieothw";


  // CURRENT YEAR
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // MOBILE NAVIGATION
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


  // BACK TO TOP
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


  // CONTACT FORM + AUTOMATIC REPLY
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

      event.preventDefault();

      if (!contactForm.reportValidity()) {
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (submitButton) {
        submitButton.disabled = true;
      }

      if (formNote) {
        formNote.textContent = "Sending your message...";
      }

      try {

        // CHECK EMAILJS
        if (!window.emailjs) {
          throw new Error("EmailJS SDK is not loaded.");
        }

        // INITIALIZE EMAILJS
        window.emailjs.init({
          publicKey: EMAILJS_PUBLIC_KEY
        });

        // STEP 1: SEND MESSAGE TO SUPPORT GMAIL
        await window.emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          CONTACT_TEMPLATE_ID,
          contactForm
        );

        // STEP 2: SEND AUTOMATIC REPLY TO CUSTOMER
        try {

          await window.emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            AUTOREPLY_TEMPLATE_ID,
            contactForm
          );

          if (formNote) {
            formNote.textContent =
              "Thank you! Your message has been received. A confirmation email has been sent to your email address.";
          }

        } catch (replyError) {

          console.error("Automatic Reply Error:", replyError);

          if (formNote) {
            formNote.textContent =
              "Your message was received successfully, but the confirmation email could not be sent.";
          }

        }

        contactForm.reset();

      } catch (error) {

        console.error("Contact Form Error:", error);

        if (formNote) {
          formNote.textContent =
            "Sorry! Your message could not be sent. Please try again later.";
        }

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
        }

      }

    });

  }


  // SMOOTH ANCHOR NAVIGATION
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


  // REVEAL ANIMATION
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
