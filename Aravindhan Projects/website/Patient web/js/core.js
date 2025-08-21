// js/core.js
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
     Core Form Handling
  ------------------------------- */
  const form = document.getElementById('core-form');
  const previewList = document.getElementById('preview-list');
  const STORAGE_KEY = 'biomath-core-data';

  // Prefill form if data exists
  const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  if (storedData) {
    Object.entries(storedData).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
    renderPreview(storedData);
  }

  // Save data on submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      weight: form.weight.value.trim(),
      height: form.height.value.trim(),
      age: form.age.value.trim(),
      sex: form.sex.value
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    renderPreview(data);
  });

  // Clear storage on reset
  form.addEventListener('reset', () => {
    localStorage.removeItem(STORAGE_KEY);
    setTimeout(() => {
      renderEmpty();
    }, 0); // ensure after fields clear
  });

  /* ------------------------------
     Helpers: Preview Rendering
  ------------------------------- */
  function renderPreview(data) {
    previewList.innerHTML = '';
    Object.entries(data).forEach(([key, value]) => {
      const li = document.createElement('li');
      li.textContent = `${capitalize(key)}: ${value}`;
      previewList.appendChild(li);
    });
  }

  function renderEmpty() {
    previewList.innerHTML = '<li>No data saved yet.</li>';
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
});
