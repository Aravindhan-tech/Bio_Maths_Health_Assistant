// js/vitals.js
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------
     Theme Toggle (Dark/Light Mode)
  ------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.className = savedTheme;
    updateThemeButton(savedTheme);
  }

  themeToggleBtn?.addEventListener('click', () => {
    const newTheme = body.classList.contains('theme-light')
      ? 'theme-dark'
      : 'theme-light';
    body.className = newTheme;
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
  });

  function updateThemeButton(theme) {
    if (theme === 'theme-dark') {
      themeToggleBtn.textContent = '☀️';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
    } else {
      themeToggleBtn.textContent = '🌙';
      themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
    }
  }

  /* ------------------------------
     Footer Year
  ------------------------------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* ------------------------------
     Vitals Form Calculations
  ------------------------------- */
  const form = document.getElementById('vitals-form');
  const mapResult = document.getElementById('map-result');
  const ppResult = document.getElementById('pp-result');
  const rppResult = document.getElementById('rpp-result');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const sbp = parseFloat(document.getElementById('sbp').value);
    const dbp = parseFloat(document.getElementById('dbp').value);
    const hr = parseFloat(document.getElementById('hr').value);

    if (isNaN(sbp) || isNaN(dbp) || isNaN(hr)) {
      alert('Please enter valid numbers for all inputs.');
      return;
    }

    // Calculations
    const map = dbp + (sbp - dbp) / 3;
    const pp = sbp - dbp;
    const rpp = sbp * hr;

    // Update Results
    mapResult.textContent = map.toFixed(2) + ' mmHg';
    ppResult.textContent = pp.toFixed(2) + ' mmHg';
    rppResult.textContent = rpp.toLocaleString() + ' mmHg·bpm';
  });

  form?.addEventListener('reset', () => {
    mapResult.textContent = '--';
    ppResult.textContent = '--';
    rppResult.textContent = '--';
  });
});
