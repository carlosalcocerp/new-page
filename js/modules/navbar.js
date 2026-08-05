/**
 * navbar.js — Control del navbar: scroll effect + menú mobile
 */
export function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('mobile-menu');

  // Efecto al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Toggle menú mobile
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('active');
      toggle.textContent = isOpen ? '✕' : '☰';
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('active');
        toggle.textContent = '☰';
      });
    });
  }
}
