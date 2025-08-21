// js/anthropometrics.js
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------
     Theme Toggle
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
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ------------------------------
     Form + Calculations
  ------------------------------- */
  const form = document.getElementById('anthro-form');
  const bmiResult = document.getElementById('bmi-result');
  const bsaResult = document.getElementById('bsa-result');
  const whrResult = document.getElementById('whr-result');

  const CORE_KEY = 'biomath-core-data';

  // Prefill weight & height from core storage
  const coreData = JSON.parse(localStorage.getItem(CORE_KEY) || 'null');
  if (coreData) {
    if (coreData.weight) form.weight.value = coreData.weight;
    if (coreData.height) form.height.value = coreData.height;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const weight = parseFloat(form.weight.value);
    const height = parseFloat(form.height.value);
    const waist = parseFloat(form.waist.value);
    const hip = parseFloat(form.hip.value);

    if (!(weight && height && waist && hip)) {
      alert('Please enter all required values.');
      return;
    }

    // BMI = weight / height²
    const bmi = weight / (height * height);

    // BSA (Mosteller formula) = sqrt((height(cm) * weight) / 3600)
    const heightCm = height * 100;
    const bsa = Math.sqrt((heightCm * weight) / 3600);

    // Waist-Hip Ratio = waist / hip
    const whr = waist / hip;

    // Update results
    bmiResult.textContent = bmi.toFixed(2);
    bsaResult.textContent = bsa.toFixed(2) + ' m²';
    whrResult.textContent = whr.toFixed(2);
  });

  // Clear results on reset
  form.addEventListener('reset', () => {
    setTimeout(() => {
      bmiResult.textContent = '--';
      bsaResult.textContent = '--';
      whrResult.textContent = '--';
    }, 0);
  });
});
