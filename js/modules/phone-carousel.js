/**
 * phone-carousel.js — Carrusel rotativo de pantallas del teléfono
 * Auto-rota entre las 4 pantallas de la app con transiciones suaves.
 */

export function initPhoneCarousel() {
  const slides = document.querySelectorAll('.phone-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  
  if (slides.length === 0) return;

  let currentIndex = 0;
  let intervalId = null;
  const INTERVAL = 4000; // 4 segundos entre slides

  function goToSlide(index) {
    // Desactivar slide actual
    slides[currentIndex].classList.remove('active');
    dots[currentIndex]?.classList.remove('active');

    // Activar nuevo slide
    currentIndex = index;
    slides[currentIndex].classList.add('active');
    dots[currentIndex]?.classList.add('active');
  }

  function nextSlide() {
    const next = (currentIndex + 1) % slides.length;
    goToSlide(next);
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(nextSlide, INTERVAL);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Click en dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      // Resetear autoplay al interactuar
      startAutoplay();
    });
  });

  // Pausar al hacer hover en el teléfono
  const phoneFrame = document.querySelector('.phone-frame');
  if (phoneFrame) {
    phoneFrame.addEventListener('mouseenter', stopAutoplay);
    phoneFrame.addEventListener('mouseleave', startAutoplay);
  }

  // Iniciar
  goToSlide(0);
  startAutoplay();
}
