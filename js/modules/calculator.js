/**
 * calculator.js — Calculadora de retorno de inversión (ROI)
 */
const MONTHLY_RENT = 299; // Tarifa mensual de alquiler en soles

export function initCalculator() {
  const inputs = document.querySelectorAll('.calc-group input');
  inputs.forEach(input => input.addEventListener('input', calculate));
  calculate(); // Cálculo inicial
}

function calculate() {
  const drivers    = parseInt(document.getElementById('calc-drivers')?.value) || 0;
  const ridesPerDay = parseInt(document.getElementById('calc-rides')?.value) || 0;
  const avgFare    = parseFloat(document.getElementById('calc-fare')?.value) || 0;
  const commission = parseFloat(document.getElementById('calc-commission')?.value) || 25;

  const dailyRevenue = drivers * ridesPerDay * avgFare;
  const monthlyRevenue = dailyRevenue * 30;
  const lostToApps = monthlyRevenue * (commission / 100);
  const saved = Math.max(0, lostToApps - MONTHLY_RENT);

  const fmt = (n) => 'S/ ' + n.toLocaleString('es-PE', { maximumFractionDigits: 0 });

  setText('result-lost', fmt(lostToApps));
  setText('result-rent', fmt(MONTHLY_RENT));
  setText('result-saved', fmt(saved));
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
