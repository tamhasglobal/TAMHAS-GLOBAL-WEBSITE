
/* =========================================
   TAMHAS GLOBAL GROUP
   Website JavaScript + EmailJS + Supabase
========================================= */

document.addEventListener("DOMContentLoaded", function () {

  // =====================================
  // CONFIGURATION
  // =====================================

  const EMAILJS_PUBLIC_KEY = "4l8JZR0nckc8DrU0s";
  const EMAILJS_SERVICE_ID = "service_nxfdbf4";
  const CONTACT_TEMPLATE_ID = "template_8ketbrm";
  const AUTOREPLY_TEMPLATE_ID = "template_4ieothw";

  const SUPABASE_URL = "https://wthpnjaejgxvxdwwasru.supabase.co";
  const SUPABASE_KEY = "sb_publishable_Hu3Z832uD274dCVfQaIV5Q_c7bHcWzv";

  // =====================================
  // CURRENT YEAR
  // =====================================

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // =====================================
  // MOBILE NAVIGATION
  // =====================================

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

  // =====================================
  // BACK TO TOP
  // =====================================

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

  // =====================================
  // SUPABASE CONFIGURATION
  // =====================================

  const publishedContent = document.getElementById("publishedContent");

  let supabaseClient = null;

  if (window.supabase) {

    supabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

  }

  // =====================================
  // LOAD PUBLISHED WEBSITE CONTENT
  // =====================================

  async function loadPublishedContent() {

    if (!publishedContent) return;

    publishedContent.textContent = "Loading content...";

    try {

      if (!supabaseClient) {
        throw new Error("Supabase library is not available.");
      }

      const { data, error } = await supabaseClient
        .from("site_content")
        .select("id, slug, title, content, updated_at")
        .eq("is_published", true)
        .order("updated_at", { ascending: false });

      if (error) {
        throw error;
      }

      publishedContent.replaceChildren();

      if (!data || data.length === 0) {
        return;
      }

      data.forEach(function (item) {

        const article = document.createElement("article");
        article.className = "published-content-card";

        const heading = document.createElement("h3");
        heading.textContent = item.title || "Untitled";

        const paragraph = document.createElement("p");
        paragraph.textContent = item.content || "";

        article.appendChild(heading);
        article.appendChild(paragraph);

        publishedContent.appendChild(article);

      });

    } catch (error) {

      console.error("Published Content Error:", error);

      publishedContent.textContent =
        "Published content is temporarily unavailable.";

    }

  }

  loadPublishedContent();

  // =====================================
  // EMAILJS INITIALIZATION
  // =====================================

  let emailJSInitialized = false;

  function initializeEmailJS() {

    if (!window.emailjs) {
      throw new Error("EmailJS SDK is not loaded.");
    }

    if (!emailJSInitialized) {

      window.emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY
      });

      emailJSInitialized = true;

    }

  }

  // =====================================
  // CONTACT FORM + SUPABASE + EMAILJS
  // =====================================

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
        formNote.textContent = "Saving your message...";
      }

      // GET FORM VALUES

      const formData = new FormData(contactForm);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();

      try {

        // CHECK SUPABASE

        if (!supabaseClient) {
          throw new Error("Supabase is not available.");
        }

        // SAVE MESSAGE TO SUPABASE

        const { error: databaseError } = await supabaseClient
          .from("messages")
          .insert({
            name: name,
            email: email,
            subject: subject,
            message: message
          });

        if (databaseError) {
          throw databaseError;
        }

        // MESSAGE IS NOW SAVED IN DATABASE

        if (formNote) {
          formNote.textContent =
            "Your message has been saved. Sending notification email...";
        }

        // RESET FORM AFTER DATABASE SAVE
        // This prevents accidental duplicate submissions
        contactForm.reset();

        // SEND EMAIL TO SUPPORT

        try {

          initializeEmailJS();

          await window.emailjs.sendForm(
            EMAILJS_SERVICE_ID,
            CONTACT_TEMPLATE_ID,
            contactForm
          );

        } catch (supportEmailError) {

          console.error(
            "Support Email Error:",
            supportEmailError
          );

          if (formNote) {
            formNote.textContent =
              "Your message was saved successfully in our system, but the support notification email could not be sent.";
          }

          return;

        }

        // SEND AUTOMATIC CUSTOMER REPLY

        try {

          await window.emailjs.send(
            EMAILJS_SERVICE_ID,
            AUTOREPLY_TEMPLATE_ID,
            {
              name: name,
              email: email,
              subject: subject,
              message: message
            }
          );

          if (formNote) {
            formNote.textContent =
              "Thank you! Your message has been received and saved successfully. A confirmation email has been sent to your email address.";
          }

        } catch (replyError) {

          console.error(
            "Automatic Reply Error:",
            replyError
          );

          if (formNote) {
            formNote.textContent =
              "Your message was saved and sent to our support team, but the confirmation email could not be sent.";
          }

        }

      } catch (error) {

        console.error("Contact Form Error:", error);

        if (formNote) {
          formNote.textContent =
            "Sorry! Your message could not be saved. Please try again later.";
        }

      } finally {

        if (submitButton) {
          submitButton.disabled = false;
        }

      }

    });

  }

  // =====================================
  // SMOOTH ANCHOR NAVIGATION
  // =====================================

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

      const targetId = link.getAttribute("href");

      let target = null;

      try {
        target = document.querySelector(targetId);
      } catch (error) {
        console.warn("Invalid navigation target:", targetId);
      }

      if (target) {

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    });

  });

  // =====================================
  // REVEAL ANIMATION
  // =====================================

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
