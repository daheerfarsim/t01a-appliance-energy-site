const powerMap = {
  tv_led: 80,
  tv_oled: 140,
  fan: 60,
  ac_small: 750,
  fridge: 180,
};

const el = (id) => document.getElementById(id);
const applianceSel = el('appliance');
const powerInput = el('power');
const hoursInput = el('hours');
const daysInput = el('days');
const tariffInput = el('tariff');
const currencySel = el('currency');
const results = el('results');
const calcBtn = el('calcBtn');

function kwhPerDay(watts, hours) {
  return (watts / 1000) * hours;
}
function fmtMoney(currency, value) {
  return `${currency} ${value.toFixed(2)}`;
}
function renderResults() {
  const W = Number(powerInput.value || 0);
  const H = Number(hoursInput.value || 0);
  const D = Number(daysInput.value || 30);
  const T = Number(tariffInput.value || 0);
  const C = currencySel.value;

  const perDay = kwhPerDay(W, H);
  const perMonth = perDay * D;
  const costMonth = perMonth * T;

  results.innerHTML = `
    <div class="result-box"><span>kWh/day</span><strong>${perDay.toFixed(3)}</strong></div>
    <div class="result-box"><span>kWh/month</span><strong>${perMonth.toFixed(2)}</strong></div>
    <div class="result-box"><span>Monthly cost</span><strong>${fmtMoney(C, costMonth)}</strong></div>
  `;
}
function syncPreset() {
  const key = applianceSel.value;
  if (key in powerMap) powerInput.value = powerMap[key];
}
function renderCompare() {
  const tbody = document.querySelector('#compareTable tbody');
  const H = Number(hoursInput.value || 0);
  const D = Number(daysInput.value || 30);
  const T = Number(tariffInput.value || 0);
  const C = currencySel.value;

  const rows = Object.entries(powerMap).map(([key, W]) => {
    const day = kwhPerDay(W, H);
    const month = day * D;
    const cost = month * T;
    const name = {
      tv_led: 'TV — LED',
      tv_oled: 'TV — OLED',
      fan: 'Fan',
      ac_small: 'Air Conditioner — 1HP',
      fridge: 'Fridge — Medium',
    }[key];
    return `<tr><td>${name}</td><td>${W}</td><td>${day.toFixed(3)}</td><td>${fmtMoney(C, cost)}</td></tr>`;
  }).join('');
  tbody.innerHTML = rows;
}
applianceSel.addEventListener('change', () => { syncPreset(); });
[powerInput, hoursInput, daysInput, tariffInput, currencySel]
  .forEach(inp => inp.addEventListener('input', () => { renderResults(); renderCompare(); }));
calcBtn.addEventListener('click', () => { renderResults(); renderCompare(); });
syncPreset(); renderResults(); renderCompare();
