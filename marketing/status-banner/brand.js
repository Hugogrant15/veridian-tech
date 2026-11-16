// Shared by every banner and poster in this folder.
// Set WEBSITE once the domain is live (e.g. "www.example.com"), then re-render.
// While it is empty, every website line is removed, so no placeholder text is ever shown.
window.VERIDIAN_WEBSITE = "veridiantechinnovationsltd.com";

window.addEventListener("DOMContentLoaded", () => {
  const site = window.VERIDIAN_WEBSITE;
  document.querySelectorAll("[data-website]").forEach((el) => {
    if (site) el.textContent = site;
    else el.remove();
  });
  document.querySelectorAll("[data-website-sep]").forEach((el) => {
    if (!site) el.remove();
  });
});
