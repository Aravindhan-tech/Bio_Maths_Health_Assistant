// js/labs.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("labs-form");

  const egfrResult = document.getElementById("egfr-result");
  const osmResult = document.getElementById("osm-result");
  const tcHdlResult = document.getElementById("tc-hdl-result");
  const ldlHdlResult = document.getElementById("ldl-hdl-result");

  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
      document.body.classList.toggle("theme-light");

      // Update icon
      themeToggle.textContent = document.body.classList.contains("theme-dark")
        ? "☀️"
        : "🌙";
    });
  }

  // Helper: reset results
  const resetResults = () => {
    [egfrResult, osmResult, tcHdlResult, ldlHdlResult].forEach(el => {
      el.textContent = "--";
      el.classList.remove("highlight"); // remove animation class
    });
  };

  // Animate new result
  const showResult = (element, value) => {
    element.textContent = value;
    element.classList.add("highlight"); // CSS animation
    setTimeout(() => element.classList.remove("highlight"), 800);
  };

  // Calculate results
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const creatinine = parseFloat(document.getElementById("creatinine").value) || 0;
    const glucose = parseFloat(document.getElementById("glucose").value) || 0;
    const sodium = parseFloat(document.getElementById("sodium").value) || 0;
    const ldl = parseFloat(document.getElementById("ldl").value) || 0;
    const hdl = parseFloat(document.getElementById("hdl").value) || 1; // avoid /0
    const tc = parseFloat(document.getElementById("tc").value) || 0;

    // eGFR (simplified MDRD, assume age=40, male)
    if (creatinine > 0) {
      const egfr = 175 * Math.pow(creatinine, -1.154) * Math.pow(40, -0.203);
      showResult(egfrResult, egfr.toFixed(1));
    } else {
      showResult(egfrResult, "--");
    }

    // Osmolality (approx: 2Na + glucose/18)
    if (sodium > 0) {
      const osm = 2 * sodium + glucose / 18;
      showResult(osmResult, osm.toFixed(1));
    } else {
      showResult(osmResult, "--");
    }

    // TC/HDL ratio
    showResult(tcHdlResult, tc && hdl ? (tc / hdl).toFixed(2) : "--");

    // LDL/HDL ratio
    showResult(ldlHdlResult, ldl && hdl ? (ldl / hdl).toFixed(2) : "--");
  });

  // Clear results on reset
  form.addEventListener("reset", resetResults);
});
