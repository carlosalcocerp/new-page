/**
 * app.js — Punto de entrada principal
 * Importa e inicializa todos los módulos de la landing page.
 */
import { initNavbar } from './modules/navbar.js';
import { initRevealAnimations, initCounterAnimation } from './modules/animations.js';
import { initFAQ } from './modules/faq.js';
import { initCalculator } from './modules/calculator.js';
import { initSmoothScroll } from './modules/smooth-scroll.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initRevealAnimations();
  initCounterAnimation();
  initFAQ();
  initCalculator();
  initSmoothScroll();
});
