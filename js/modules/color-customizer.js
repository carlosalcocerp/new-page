/**
 * color-customizer.js — Módulo de personalización del color primario
 * Permite cambiar el color rojo principal (#FC3441) a cualquier color elegido.
 * El color se guarda en localStorage para persistir entre sesiones.
 */

const DEFAULT_PRIMARY = '#FC3441';
const STORAGE_KEY = 'viago-custom-primary-color';

// Colores preset sugeridos
const PRESET_COLORS = [
  '#FC3441', // Rojo original
  '#FF6B35', // Naranja
  '#F7B731', // Amarillo
  '#20BF6B', // Verde
  '#0FB9B1', // Teal
  '#3867D6', // Azul
  '#8854D0', // Púrpura
  '#EB3B5A', // Rosa
  '#2D98DA', // Celeste
  '#FA8231', // Durazno
  '#26DE81', // Lima
  '#4B7BEC', // Índigo
  '#A55EEA', // Violeta
  '#FC5C65', // Coral
];

/**
 * Convierte un color hex a HSL y genera variantes automáticas
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Genera todas las variantes de color primario a partir de un hex
 */
function generateColorVariants(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  return {
    primary: hex,
    hover: `hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.max(l - 8, 10)}%)`,
    dark: `hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 18, 5)}%)`,
    light: `hsl(${h}, ${Math.min(s, 100)}%, 93%)`,
    glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`,
    borderActive: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`,
    gradientPrimary: `linear-gradient(135deg, ${hex} 0%, hsl(${h}, ${Math.min(s + 5, 100)}%, ${Math.max(l - 8, 10)}%) 100%)`,
    gradientDark: `linear-gradient(135deg, hsl(${h}, ${Math.min(s + 10, 100)}%, ${Math.max(l - 18, 5)}%) 0%, ${hex} 100%)`,
  };
}

/**
 * Aplica las variantes de color como CSS custom properties en :root
 */
function applyColorToRoot(hex) {
  const variants = generateColorVariants(hex);
  if (!variants) return;

  const root = document.documentElement;
  root.style.setProperty('--color-primary', variants.primary);
  root.style.setProperty('--color-primary-hover', variants.hover);
  root.style.setProperty('--color-primary-700', variants.dark);
  root.style.setProperty('--color-primary-light', variants.light);
  root.style.setProperty('--color-primary-glow', variants.glow);
  root.style.setProperty('--border-active', variants.borderActive);
  root.style.setProperty('--gradient-primary', variants.gradientPrimary);
  root.style.setProperty('--gradient-dark', variants.gradientDark);
  root.style.setProperty('--shadow-glow', `0 4px 28px ${variants.glow}`);
}

/**
 * Guarda el color en localStorage
 */
function saveColor(hex) {
  try {
    localStorage.setItem(STORAGE_KEY, hex);
  } catch (e) {
    // localStorage no disponible
  }
}

/**
 * Carga el color guardado de localStorage
 */
function loadSavedColor() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

/**
 * Valida un string hex
 */
function isValidHex(hex) {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

/**
 * Inicializa el sistema de personalización de color
 */
export function initColorCustomizer() {
  // Aplicar color guardado al cargar (si existe)
  const savedColor = loadSavedColor();
  if (savedColor && isValidHex(savedColor)) {
    applyColorToRoot(savedColor);
  }

  // Buscar elementos del DOM
  const toggle = document.getElementById('color-customizer-toggle');
  const panel = document.getElementById('color-customizer-panel');
  const colorInput = document.getElementById('color-input-native');
  const hexInput = document.getElementById('color-hex-input');
  const swatchPreview = document.getElementById('color-swatch-preview');
  const hexDisplay = document.getElementById('color-hex-display');
  const resetBtn = document.getElementById('btn-reset-color');
  const presetGrid = document.getElementById('preset-grid');

  if (!toggle || !panel) return;

  // Estado actual
  let currentColor = savedColor || DEFAULT_PRIMARY;

  // Actualizar la UI con el color actual
  function updateUI(hex) {
    if (!isValidHex(hex)) return;
    
    currentColor = hex;
    
    // Actualizar preview swatch
    if (swatchPreview) swatchPreview.style.backgroundColor = hex;
    
    // Actualizar input nativo
    if (colorInput) colorInput.value = hex;
    
    // Actualizar input hex
    if (hexInput) hexInput.value = hex;
    
    // Actualizar display hex
    if (hexDisplay) hexDisplay.textContent = hex;

    // Actualizar preset activo
    if (presetGrid) {
      presetGrid.querySelectorAll('.preset-swatch').forEach(swatch => {
        swatch.classList.toggle('active', swatch.dataset.color.toUpperCase() === hex.toUpperCase());
      });
    }
  }

  // Inicializar UI
  updateUI(currentColor);

  // --- Toggle panel ---
  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    toggle.textContent = isOpen ? '✕' : '🎨';
  });

  // Cerrar al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !toggle.contains(e.target) && panel.classList.contains('open')) {
      panel.classList.remove('open');
      toggle.classList.remove('active');
      toggle.textContent = '🎨';
    }
  });

  // --- Color input nativo (color picker del navegador) ---
  if (colorInput) {
    colorInput.addEventListener('input', (e) => {
      const hex = e.target.value.toUpperCase();
      applyColorToRoot(hex);
      saveColor(hex);
      updateUI(hex);
    });
  }

  // --- Hex input manual ---
  if (hexInput) {
    hexInput.addEventListener('input', (e) => {
      let val = e.target.value.trim();
      
      // Agregar # si no lo tiene
      if (val && !val.startsWith('#')) {
        val = '#' + val;
      }
      
      if (isValidHex(val)) {
        const hex = val.toUpperCase();
        applyColorToRoot(hex);
        saveColor(hex);
        updateUI(hex);
      }
    });

    hexInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        hexInput.blur();
      }
    });
  }

  // --- Presets de color ---
  if (presetGrid) {
    PRESET_COLORS.forEach(color => {
      const swatch = document.createElement('button');
      swatch.className = 'preset-swatch';
      swatch.dataset.color = color;
      swatch.style.backgroundColor = color;
      swatch.setAttribute('aria-label', `Color ${color}`);
      swatch.title = color;

      if (color.toUpperCase() === currentColor.toUpperCase()) {
        swatch.classList.add('active');
      }

      swatch.addEventListener('click', () => {
        applyColorToRoot(color);
        saveColor(color);
        updateUI(color);
      });

      presetGrid.appendChild(swatch);
    });
  }

  // --- Botón reset ---
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      applyColorToRoot(DEFAULT_PRIMARY);
      saveColor(DEFAULT_PRIMARY);
      updateUI(DEFAULT_PRIMARY);
    });
  }
}
