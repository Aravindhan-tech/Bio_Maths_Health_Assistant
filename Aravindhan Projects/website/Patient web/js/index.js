// js/index.js
'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------
     Theme Toggle (Dark/Light Mode)
  ------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Load stored theme if exists
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
     Keyboard Accessibility for Cards
  ------------------------------- */
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('a');
        if (link) link.click();
      }
    });
  });
});
