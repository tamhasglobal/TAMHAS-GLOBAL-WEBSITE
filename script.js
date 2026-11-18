

// TAMHAS GLOBAL GROUP Website

// Update copyright year automatically
const footer = document.querySelector("footer");

if (footer) {
  const copyright = footer.querySelector("p:last-child");

  if (copyright) {
    copyright.textContent =
      `© ${new Date().getFullYear()} TAMHAS GLOBAL GROUP`;
  }
}

// Create Back to Top button
const topButton = document.createElement("button");

topButton.textContent = "↑";
topButton.setAttribute("aria-label", "Back to top");

topButton.style.cssText = `
  position: fixed;
  bottom: 22px;
  right: 20px;
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 50%;
  background: #078de0;
  color: white;
  font-size: 25px;
  cursor: pointer;
  display: none;
  z-index: 1000;
`;

document.body.appendChild(topButton);

// Show button when scrolling
window.addEventListener("scroll", () => {
  topButton.style.display =
    window.scrollY > 300 ? "block" : "none";
});

// Scroll to top
topButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

console.log("TAMHAS GLOBAL GROUP website loaded!");
