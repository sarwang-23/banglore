import QRCode from 'qrcode';
import { 
  EMISSION_FACTORS, 
  BANGALORE_PRESETS, 
  calculateTravelEmissions, 
  calculateActivityEmissions, 
  calculateMultipleActivities,
  getAlternativeRecommendations, 
  generatePersonalizedRecommendation 
} from './emission-data.js';

// SVG Line Icons for Transport Modes
const TRANSPORT_ICONS = {
  'petrol-car': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17H3v-4l2-4h7l3 4h4v4h-2"/></svg>`,
  'diesel-car': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 17v2M18 17v2M2 12h20M6 7l2-3h8l2 3"/></svg>`,
  'electric-car': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 1h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11.1 2 11.5 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M11 7l-2 4h3l-1 4"/></svg>`,
  'two-wheeler': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="16" r="3"/><circle cx="19" cy="16" r="3"/><path d="M12 16h-3l2-5h3l3 5M15 6h2l-2 5"/></svg>`,
  'bus': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16M8 3v4M16 3v4M4 15h16M7 19v2M17 19v2"/></svg>`,
  'metro-train': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 15h.01M16 15h.01M3 21l3-3M21 21l-3-3M12 3v8"/></svg>`,
  'flight': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3.5c-.5-.5-2.5 0-4 1.5L13.5 8.5 5.3 6.7c-.8-.2-1.6.2-2 1l-.3.6c-.4.8-.2 1.8.5 2.3l6.5 4.9-3.5 3.5-2.8-.5c-.5-.1-1 .1-1.3.5l-.2.2c-.4.4-.4 1 0 1.4l2.5 2.5 2.5 2.5c.4.4 1 .4 1.4 0l.2-.2c.4-.3.6-.8.5-1.3l-.5-2.8 3.5-3.5 4.9 6.5c.5.7 1.5.9 2.3.5l.6-.3c.8-.4 1.2-1.2 1-2z"/></svg>`,
  'cycling': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-3 11.5L8.5 11H12l2.5 3 3.5-2.5M12 11l2-4.5h3"/></svg>`
};

// Activity Specifications for Multi-Activity Support
const ACTIVITY_SPECS = {
  'Air Conditioning Usage': {
    icon: '❄️',
    label: 'Air Conditioning Usage',
    subType: 'duration',
    defaultVal: 4,
    min: 1,
    max: 24,
    step: 1,
    unit: 'hrs',
    hint: 'BEE 3-Star 1.5T AC (1.2 kW) × India CEA Grid Factor (0.716 kg CO₂e/kWh)'
  },
  'Electricity Consumption': {
    icon: '⚡',
    label: 'Electricity Consumption',
    subType: 'kwh',
    defaultVal: 10,
    min: 1,
    max: 500,
    step: 5,
    unit: 'kWh',
    hint: 'India CEA CO₂ Baseline v19 · 0.716 kg CO₂e / kWh'
  },
  'Meat-Based Meal': {
    icon: '🥩',
    label: 'Meat-Based Meal',
    subType: 'meals',
    defaultVal: 1,
    min: 1,
    max: 10,
    step: 1,
    unit: 'meal(s)',
    hint: 'WRI / Poore & Nemecek Science LCA · 2.40 kg CO₂e / portion'
  },
  'Shopping / Purchase': {
    icon: '🛍️',
    label: 'Shopping / Purchase',
    subType: 'category',
    defaultVal: 'fast_fashion',
    hint: 'Lifecycle embodied procurement carbon benchmark',
    options: [
      { label: 'Apparel / Textile Goods (~8.5 kg CO₂e)', value: 'fast_fashion' },
      { label: 'Consumer Electronics & Hardware (~18.0 kg CO₂e)', value: 'electronics' },
      { label: 'Packaged Consumables & Retail (~2.5 kg CO₂e)', value: 'groceries' },
      { label: 'Leather & Luxury Goods (~32.0 kg CO₂e)', value: 'leather' }
    ]
  }
};

// Application State
const state = {
  origin: "Kempegowda Int'l Airport (BLR)",
  destination: "Bangalore Tech Summit (Palace Grounds)",
  mode: "Petrol Car",
  distance: 32,
  passengers: 1,
  activities: {}, // Multi-activity map: { [activityKey]: value }
  cachedResults: null,
  isCalculated: false
};

// DOM References
const elements = {
  // Navigation
  openMethodologyBtn: document.getElementById('open-methodology-btn'),
  quickResetHeaderBtn: document.getElementById('quick-reset-header-btn'),

  // Stage 01 Inputs
  form: document.getElementById('calculator-form'),
  originInput: document.getElementById('input-origin'),
  destinationInput: document.getElementById('input-destination'),
  modeSelect: document.getElementById('select-transport-mode'),
  modeCategoryMeta: document.getElementById('mode-category-meta'),
  transportPillGrid: document.getElementById('transport-pill-grid'),
  presetChipsContainer: document.getElementById('preset-chips-container'),

  // Distance
  distanceInput: document.getElementById('input-distance'),
  distanceSlider: document.getElementById('slider-distance'),
  distanceDisplayVal: document.getElementById('distance-display-val'),
  distMinusBtn: document.getElementById('dist-minus-btn'),
  distPlusBtn: document.getElementById('dist-plus-btn'),
  kmButtons: document.querySelectorAll('.km-btn'),

  // Passengers
  passengersInput: document.getElementById('input-passengers'),
  passengerDisplayVal: document.getElementById('passenger-display-val'),
  passMinusBtn: document.getElementById('pass-minus-btn'),
  passPlusBtn: document.getElementById('pass-plus-btn'),
  passengerHintText: document.getElementById('passenger-hint-text'),

  // Activities (Multi-Select)
  activityChipsContainer: document.getElementById('activity-chips-container'),
  followupContainer: document.getElementById('dynamic-followup-container'),

  // Calculate CTA
  calculateBtn: document.getElementById('calculate-btn'),

  // Stage 02: Carbon Reveal
  impactSection: document.getElementById('impact-section'),
  totalFootprintValue: document.getElementById('total-footprint-value'),
  emissionStatusTag: document.getElementById('emission-status-tag'),
  equivPhoneText: document.getElementById('equiv-phone-text'),
  equivTreeText: document.getElementById('equiv-tree-text'),
  splitBarJourney: document.getElementById('split-bar-journey'),
  splitBarActivity: document.getElementById('split-bar-activity'),
  splitJourneyLabel: document.getElementById('split-journey-label'),
  splitActivityLabel: document.getElementById('split-activity-label'),
  circleProgressArc: document.getElementById('circle-progress-arc'),
  circleProgressPct: document.getElementById('circle-progress-pct'),
  journeyEmissionsVal: document.getElementById('journey-emissions-val'),
  journeyDetailsText: document.getElementById('journey-details-text'),
  journeyFactorPill: document.getElementById('journey-factor-pill'),
  perPersonVal: document.getElementById('per-person-val'),
  activityEmissionsVal: document.getElementById('activity-emissions-val'),
  activityDetailsText: document.getElementById('activity-details-text'),
  activityFactorPill: document.getElementById('activity-factor-pill'),

  // Stage 03: Greener Choices
  choicesSection: document.getElementById('choices-section'),
  alternativesContainer: document.getElementById('alternatives-container'),
  alternativesCountBadge: document.getElementById('alternatives-count-badge'),
  recommendationText: document.getElementById('recommendation-text'),
  openQrModalBtn: document.getElementById('open-qr-modal-btn'),
  downloadBadgeBtn: document.getElementById('download-badge-btn'),
  resetNextVisitorBtn: document.getElementById('reset-next-visitor-btn'),

  // Modals
  methodologyModal: document.getElementById('methodology-modal'),
  closeMethodologyBtn: document.getElementById('close-methodology-btn'),
  dismissMethodologyBtn: document.getElementById('dismiss-methodology-btn'),

  qrModal: document.getElementById('qr-modal'),
  closeQrBtn: document.getElementById('close-qr-btn'),
  dismissQrBtn: document.getElementById('dismiss-qr-btn'),
  qrCanvas: document.getElementById('qr-canvas'),
  qrTotalMetric: document.getElementById('qr-total-metric'),
  qrJourneyMetric: document.getElementById('qr-journey-metric'),
  qrBestAltMetric: document.getElementById('qr-best-alt-metric'),
  shareUrlInput: document.getElementById('share-url-input'),
  copyShareUrlBtn: document.getElementById('copy-share-url-btn'),
  copyFeedbackMsg: document.getElementById('copy-feedback-msg'),

  badgeExportCanvas: document.getElementById('badge-export-canvas')
};

/**
 * Initialize application
 */
function init() {
  renderCorridorPresets();
  renderTransportCardsGrid();
  bindEvents();
  bindActivityChips();
  renderActiveFollowups();
  calculateAndRender(false);
}

/**
 * Bind multi-activity toggle chips
 */
function bindActivityChips() {
  if (!elements.activityChipsContainer) return;
  const chips = elements.activityChipsContainer.querySelectorAll('.act-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const actKey = chip.dataset.activity;
      if (state.activities[actKey] !== undefined) {
        // Toggle OFF
        delete state.activities[actKey];
        chip.classList.remove('act-chip--on');
        const stateBadge = chip.querySelector('.act-chip__state');
        if (stateBadge) stateBadge.textContent = '+';
      } else {
        // Toggle ON
        const spec = ACTIVITY_SPECS[actKey];
        state.activities[actKey] = spec ? spec.defaultVal : 1;
        chip.classList.add('act-chip--on');
        const stateBadge = chip.querySelector('.act-chip__state');
        if (stateBadge) stateBadge.textContent = '✓';
      }
      renderActiveFollowups();
      calculateAndRender(false);
    });
  });
}

/**
 * Render dynamic follow-up cards for all active activities
 */
function renderActiveFollowups() {
  if (!elements.followupContainer) return;
  const activeKeys = Object.keys(state.activities);
  
  if (activeKeys.length === 0) {
    elements.followupContainer.innerHTML = '';
    return;
  }

  elements.followupContainer.innerHTML = '';

  activeKeys.forEach(actKey => {
    const spec = ACTIVITY_SPECS[actKey];
    if (!spec) return;

    const currentVal = state.activities[actKey];
    const itemCalc = calculateActivityEmissions(actKey, currentVal);
    const card = document.createElement('div');
    card.className = 'act-card';

    let controlHtml = '';
    if (spec.subType === 'duration' || spec.subType === 'meals') {
      controlHtml = `
        <div class="param-stepper">
          <button type="button" class="stp-btn act-minus-btn" data-act="${actKey}">-${spec.step}</button>
          <input type="number" class="fi fi--center act-input-val" data-act="${actKey}" min="${spec.min}" max="${spec.max}" value="${currentVal}">
          <button type="button" class="stp-btn act-plus-btn" data-act="${actKey}">+${spec.step}</button>
        </div>
      `;
    } else if (spec.subType === 'kwh') {
      controlHtml = `
        <div class="param-stepper">
          <button type="button" class="stp-btn act-minus-btn" data-act="${actKey}">-5</button>
          <input type="number" class="fi fi--center act-input-val" data-act="${actKey}" min="${spec.min}" max="${spec.max}" value="${currentVal}">
          <button type="button" class="stp-btn act-plus-btn" data-act="${actKey}">+5</button>
        </div>
      `;
    } else if (spec.subType === 'category') {
      const opts = spec.options.map(opt => `
        <option value="${opt.value}" ${opt.value === currentVal ? 'selected' : ''}>${opt.label}</option>
      `).join('');
      controlHtml = `
        <select class="fi fi--select act-select-val" data-act="${actKey}">
          ${opts}
        </select>
      `;
    }

    card.innerHTML = `
      <div class="act-card__head">
        <div class="act-card__title">
          <span>${spec.icon}</span>
          <span>${spec.label}</span>
        </div>
        <div class="act-card__meta">
          <span class="act-card__impact">+${itemCalc.emissions.toFixed(2)} kg CO₂e</span>
          <button type="button" class="act-card__remove" data-act="${actKey}" title="Remove activity">&times;</button>
        </div>
      </div>
      <div class="act-card__body">
        ${controlHtml}
        <p class="act-card__hint">${spec.hint}</p>
      </div>
    `;

    elements.followupContainer.appendChild(card);
  });

  // Bind removal button
  elements.followupContainer.querySelectorAll('.act-card__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const actKey = btn.dataset.act;
      delete state.activities[actKey];
      if (elements.activityChipsContainer) {
        const chip = elements.activityChipsContainer.querySelector(`.act-chip[data-activity="${actKey}"]`);
        if (chip) {
          chip.classList.remove('act-chip--on');
          const stateBadge = chip.querySelector('.act-chip__state');
          if (stateBadge) stateBadge.textContent = '+';
        }
      }
      renderActiveFollowups();
      calculateAndRender(false);
    });
  });

  // Bind numeric inputs
  elements.followupContainer.querySelectorAll('.act-input-val').forEach(input => {
    input.addEventListener('input', (e) => {
      const actKey = input.dataset.act;
      const spec = ACTIVITY_SPECS[actKey];
      const val = Math.max(spec.min, Math.min(spec.max, Number(e.target.value) || spec.min));
      state.activities[actKey] = val;
      const card = input.closest('.act-card');
      if (card) {
        const itemCalc = calculateActivityEmissions(actKey, val);
        const impactElem = card.querySelector('.act-card__impact');
        if (impactElem) impactElem.textContent = `+${itemCalc.emissions.toFixed(2)} kg CO₂e`;
      }
      calculateAndRender(false);
    });
  });

  // Bind minus stepper
  elements.followupContainer.querySelectorAll('.act-minus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const actKey = btn.dataset.act;
      const spec = ACTIVITY_SPECS[actKey];
      const step = spec.step || 1;
      const current = Number(state.activities[actKey]) || spec.defaultVal;
      const nextVal = Math.max(spec.min, current - step);
      state.activities[actKey] = nextVal;
      renderActiveFollowups();
      calculateAndRender(false);
    });
  });

  // Bind plus stepper
  elements.followupContainer.querySelectorAll('.act-plus-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const actKey = btn.dataset.act;
      const spec = ACTIVITY_SPECS[actKey];
      const step = spec.step || 1;
      const current = Number(state.activities[actKey]) || spec.defaultVal;
      const nextVal = Math.min(spec.max, current + step);
      state.activities[actKey] = nextVal;
      renderActiveFollowups();
      calculateAndRender(false);
    });
  });

  // Bind select
  elements.followupContainer.querySelectorAll('.act-select-val').forEach(select => {
    select.addEventListener('change', (e) => {
      const actKey = select.dataset.act;
      state.activities[actKey] = e.target.value;
      renderActiveFollowups();
      calculateAndRender(false);
    });
  });
}

/**
 * Event Bindings
 */
function bindEvents() {
  elements.originInput.addEventListener('input', (e) => {
    state.origin = e.target.value || "Point of Origin";
  });
  elements.destinationInput.addEventListener('input', (e) => {
    state.destination = e.target.value || "Destination";
  });

  // Mode Dropdown binding
  if (elements.modeSelect) {
    elements.modeSelect.addEventListener('change', (e) => {
      state.mode = e.target.value;
      syncTransportCards();
      if (state.isCalculated) calculateAndRender(true);
    });
  }

  // Distance bindings
  elements.distanceInput.addEventListener('input', (e) => {
    const val = Math.max(1, Number(e.target.value) || 1);
    state.distance = val;
    elements.distanceSlider.value = Math.min(val, 100);
    updateKmButtonsActive(val);
    updateDistanceDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  elements.distanceSlider.addEventListener('input', (e) => {
    const val = Number(e.target.value);
    state.distance = val;
    elements.distanceInput.value = val;
    updateKmButtonsActive(val);
    updateDistanceDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  elements.distMinusBtn.addEventListener('click', () => {
    const nextVal = Math.max(1, state.distance - 5);
    state.distance = nextVal;
    elements.distanceInput.value = nextVal;
    elements.distanceSlider.value = Math.min(nextVal, 100);
    updateKmButtonsActive(nextVal);
    updateDistanceDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  elements.distPlusBtn.addEventListener('click', () => {
    const nextVal = state.distance + 5;
    state.distance = nextVal;
    elements.distanceInput.value = nextVal;
    elements.distanceSlider.value = Math.min(nextVal, 100);
    updateKmButtonsActive(nextVal);
    updateDistanceDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  // Preset km chips
  elements.kmButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const km = Number(btn.dataset.km);
      state.distance = km;
      elements.distanceInput.value = km;
      elements.distanceSlider.value = Math.min(km, 100);
      updateKmButtonsActive(km);
      updateDistanceDisplays();
      if (state.isCalculated) calculateAndRender(true);
    });
  });

  // Passengers
  elements.passengersInput.addEventListener('input', (e) => {
    const val = Math.max(1, Math.min(50, Number(e.target.value) || 1));
    state.passengers = val;
    updatePassengerDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  elements.passMinusBtn.addEventListener('click', () => {
    const nextVal = Math.max(1, state.passengers - 1);
    state.passengers = nextVal;
    elements.passengersInput.value = nextVal;
    updatePassengerDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  elements.passPlusBtn.addEventListener('click', () => {
    const nextVal = Math.min(50, state.passengers + 1);
    state.passengers = nextVal;
    elements.passengersInput.value = nextVal;
    updatePassengerDisplays();
    if (state.isCalculated) calculateAndRender(false);
  });

  // Activity Select
  elements.activitySelect.addEventListener('change', () => {
    state.activityValue = null;
    updateFollowupInput();
  });

  // Form Submit / Calculate CTA
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    revealAndScrollToImpact();
  });

  // Modals
  elements.openMethodologyBtn.addEventListener('click', () => {
    elements.methodologyModal.classList.remove('hidden');
  });
  elements.closeMethodologyBtn.addEventListener('click', () => {
    elements.methodologyModal.classList.add('hidden');
  });
  elements.dismissMethodologyBtn.addEventListener('click', () => {
    elements.methodologyModal.classList.add('hidden');
  });

  elements.openQrModalBtn.addEventListener('click', openQrModal);
  elements.closeQrBtn.addEventListener('click', () => elements.qrModal.classList.add('hidden'));
  elements.dismissQrBtn.addEventListener('click', () => elements.qrModal.classList.add('hidden'));

  // Copy share URL
  elements.copyShareUrlBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(elements.shareUrlInput.value).then(() => {
      elements.copyFeedbackMsg.classList.add('visible');
      setTimeout(() => elements.copyFeedbackMsg.classList.remove('visible'), 2500);
    });
  });

  // Badge download
  elements.downloadBadgeBtn.addEventListener('click', generateAndDownloadBadge);

  // Reset actions
  elements.resetNextVisitorBtn.addEventListener('click', resetCalculator);
  elements.quickResetHeaderBtn.addEventListener('click', resetCalculator);
}

function updateKmButtonsActive(km) {
  elements.kmButtons.forEach(btn => {
    if (Number(btn.dataset.km) === km) {
      btn.classList.add('km-btn--on');
    } else {
      btn.classList.remove('km-btn--on');
    }
  });
}

function updateDistanceDisplays() {
  elements.distanceDisplayVal.textContent = `${state.distance} km`;
}

function updatePassengerDisplays() {
  elements.passengerDisplayVal.textContent = `${state.passengers} ${state.passengers === 1 ? 'passenger' : 'passengers'}`;
  syncTransportCards();
}

/**
 * Signature Reveal Transition
 */
function revealAndScrollToImpact() {
  state.isCalculated = true;
  if (elements.impactSection) elements.impactSection.classList.remove('hidden');
  if (elements.choicesSection) elements.choicesSection.classList.remove('hidden');

  calculateAndRender(true);

  // Smooth cinematic scroll into Stage 02
  elements.impactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Main Calculation Engine & UI Updates
 */
function calculateAndRender(shouldAnimate = false) {
  const travel = calculateTravelEmissions(state.mode, state.distance, state.passengers);
  const activity = calculateMultipleActivities(state.activities);
  
  const totalFootprint = Number((travel.perPersonEmissions + activity.emissions).toFixed(2));
  const altAnalysis = getAlternativeRecommendations(state.mode, state.distance, state.passengers);
  const primaryActivity = Object.keys(state.activities)[0] || 'None';
  const recMessage = generatePersonalizedRecommendation(
    state.mode, 
    state.distance, 
    state.passengers, 
    primaryActivity, 
    totalFootprint
  );

  state.cachedResults = {
    travel,
    activity,
    totalFootprint,
    altAnalysis,
    recMessage
  };

  // Render numerical typography
  if (shouldAnimate) {
    animateValue(elements.totalFootprintValue, parseFloat(elements.totalFootprintValue.textContent) || 0, totalFootprint, 500);
  } else {
    elements.totalFootprintValue.textContent = totalFootprint.toFixed(2);
  }

  // Update Status Tag
  elements.emissionStatusTag.className = 'impact-status';
  if (totalFootprint <= 1.5) {
    elements.emissionStatusTag.classList.add('impact-status--eco');
    elements.emissionStatusTag.textContent = 'Low Carbon Intensity · < 1.5 kg CO₂e';
  } else if (totalFootprint <= 8.0) {
    elements.emissionStatusTag.classList.add('impact-status--moderate');
    elements.emissionStatusTag.textContent = 'Standard Urban Profile · Moderate Impact';
  } else {
    elements.emissionStatusTag.classList.add('impact-status--high');
    elements.emissionStatusTag.textContent = 'Elevated Carbon Intensity · High Opportunity';
  }

  // Circular Gauge (r=82, circumference = 2 * PI * 82 ≈ 515.22)
  const scorePercent = Math.min(100, Math.max(5, Math.round((2.5 / Math.max(totalFootprint, 0.5)) * 100)));
  const circumference = 515.22;
  const offset = circumference - (Math.min(scorePercent, 100) / 100) * circumference;

  if (elements.circleProgressArc) {
    elements.circleProgressArc.style.strokeDasharray = `${circumference}`;
    elements.circleProgressArc.style.strokeDashoffset = `${offset}`;
    elements.circleProgressArc.style.stroke =
      totalFootprint <= 1.5 ? '#72E5A8' :
      totalFootprint <= 8.0 ? '#36815F' : '#B79A68';
  }
  if (elements.circleProgressPct) {
    elements.circleProgressPct.textContent = `${scorePercent}%`;
  }

  // Proportional Split Bar
  const totalSum = (travel.perPersonEmissions + activity.emissions) || 1;
  const journeyPct = Math.round((travel.perPersonEmissions / totalSum) * 100);
  const activityPct = 100 - journeyPct;

  elements.splitBarJourney.style.width = `${journeyPct}%`;
  elements.splitBarActivity.style.width = `${activityPct}%`;
  elements.splitJourneyLabel.textContent = `Transport: ${journeyPct}% (${travel.perPersonEmissions.toFixed(2)} kg)`;
  elements.splitActivityLabel.textContent = `Operations: ${activityPct}% (${activity.emissions.toFixed(2)} kg)`;

  // Contextual Equivalence Telemetry
  const treeMonths = (totalFootprint / 1.8).toFixed(1);
  const phoneCharges = Math.round(totalFootprint / 0.008);
  elements.equivPhoneText.textContent = totalFootprint > 0 
    ? `~${phoneCharges.toLocaleString()} Smartphone charges`
    : `0 Smartphone cycles`;
  elements.equivTreeText.textContent = totalFootprint > 0 
    ? `~${treeMonths} Tree-months carbon capture`
    : `Zero tailpipe footprint`;

  // Journey breakdown
  elements.journeyEmissionsVal.textContent = travel.perPersonEmissions.toFixed(2);
  elements.perPersonVal.textContent = `${travel.perPersonEmissions.toFixed(2)} kg`;
  
  if (travel.type === 'per_vehicle_km') {
    elements.journeyDetailsText.innerHTML = `Vehicle total: <strong>${travel.totalEmissions.toFixed(2)} kg</strong> (${state.passengers} pax)`;
  } else if (travel.type === 'per_passenger_km') {
    elements.journeyDetailsText.innerHTML = `Mass transit: <strong>${travel.perPersonEmissions.toFixed(2)} kg</strong> per passenger`;
  } else {
    elements.journeyDetailsText.innerHTML = `Zero direct emissions (Scope 1/3)`;
  }
  elements.journeyFactorPill.textContent = `${travel.factor} ${travel.unit}`;

  // Activity breakdown (Multi-Activity Support)
  elements.activityEmissionsVal.textContent = activity.emissions.toFixed(2);
  const activeCount = Object.keys(state.activities).length;
  elements.activityDetailsText.textContent = activeCount === 0 ? 'None selected' : activity.description;
  elements.activityFactorPill.textContent = activeCount === 0 
    ? 'Baseline: 0.00 kg' 
    : `${activeCount} activity (${activity.emissions.toFixed(2)} kg CO₂e)`;

  // Render Alternatives
  renderAlternatives(altAnalysis.recommendations, travel.perPersonEmissions);

  // Render Advisory
  elements.recommendationText.textContent = recMessage;
}

/**
 * Render Greener Alternatives Cards
 */
function renderAlternatives(alternatives, originalPerPerson) {
  if (!elements.alternativesContainer) return;
  elements.alternativesContainer.innerHTML = '';
  
  if (!alternatives || alternatives.length === 0) {
    if (elements.alternativesCountBadge) elements.alternativesCountBadge.textContent = 'Benchmark Mode';
    elements.alternativesContainer.innerHTML = `
      <div style="padding:24px; background:#FFFFFF; border:1px solid #E1E8E1; border-radius:14px; color:#66736C;">
        ${state.mode} already represents the lowest carbon pathway on this corridor. No further reduction mode available.
      </div>
    `;
    return;
  }

  if (elements.alternativesCountBadge) {
    elements.alternativesCountBadge.textContent = `${alternatives.length} Pathways`;
  }

  alternatives.forEach(alt => {
    const iconSvg = TRANSPORT_ICONS[alt.iconKey] || '';
    const card = document.createElement('div');
    card.className = 'alt-card';
    card.innerHTML = `
      <div class="alt-icon-box">${iconSvg}</div>
      <div class="alt-info">
        <div class="alt-title-row">
          <span class="alt-mode-name">${alt.mode}</span>
          ${alt.isGreener ? '<span class="alt-greener-tag">Greener Alternative</span>' : ''}
        </div>
        <div class="alt-note" title="${alt.notes}">${alt.notes}</div>
        <div class="alt-comparison-row">
          <span class="alt-emiss-badge">Alternative: <strong>${alt.altPerPerson.toFixed(2)} kg CO₂e</strong></span>
          <span class="alt-orig-badge">Original: ${originalPerPerson.toFixed(2)} kg CO₂e</span>
        </div>
      </div>
      <div class="alt-metrics">
        <div class="alt-pct">-${alt.pctReduction}%</div>
        <div class="alt-saved">Saves <strong>${alt.savedPerPerson.toFixed(2)} kg CO₂e</strong></div>
      </div>
    `;
    elements.alternativesContainer.appendChild(card);
  });
}

/**
 * Animated number count-up
 */
function animateValue(elem, start, end, duration) {
  if (!elem) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const current = (progress * (end - start)) + start;
    elem.textContent = current.toFixed(2);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      elem.textContent = end.toFixed(2);
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * QR Pass Generator Modal
 */
function openQrModal() {
  if (!state.cachedResults) return;

  const res = state.cachedResults;
  const bestAlt = res.altAnalysis.recommendations[0];
  const bestAltStr = bestAlt 
    ? `${bestAlt.mode} (-${bestAlt.pctReduction}%)` 
    : 'Already benchmark mode';

  elements.qrTotalMetric.textContent = `${res.totalFootprint.toFixed(2)} kg CO₂e`;
  elements.qrJourneyMetric.textContent = `${state.origin} → BTS (${state.distance} km, ${state.mode})`;
  elements.qrBestAltMetric.textContent = bestAltStr;

  const queryParams = new URLSearchParams({
    summit: 'Bangalore_Tech_Summit_2026',
    platform: 'CarbonSynq',
    footprint: `${res.totalFootprint.toFixed(2)}kg_CO2e`,
    origin: state.origin,
    mode: state.mode,
    distance: `${state.distance}km`,
    standard: 'CEA_v19_DEFRA_2024'
  });

  const fullShareUrl = `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`;
  elements.shareUrlInput.value = fullShareUrl;

  QRCode.toCanvas(elements.qrCanvas, fullShareUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#245B45',
      light: '#FFFFFF'
    }
  }, (error) => {
    if (error) console.error('QR Code error:', error);
  });

  elements.qrModal.classList.remove('hidden');
}

/**
 * Executive Institutional Certificate Generator
 */
function generateAndDownloadBadge() {
  const canvas = elements.badgeExportCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const res = state.cachedResults;
  if (!res) return;

  const width = canvas.width;
  const height = canvas.height;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.5, '#F5F7F3');
  bgGrad.addColorStop(1, '#E8F0E9');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Border
  ctx.strokeStyle = '#245B45';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  // Inner Border
  ctx.strokeStyle = '#B79A68';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(52, 52, width - 104, height - 104);

  // Brand Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#245B45';
  ctx.font = '800 32px "Manrope", sans-serif';
  ctx.fillText('CARBONSYNQ INTELLIGENCE', width / 2, 130);

  ctx.fillStyle = '#66736C';
  ctx.font = '600 18px "Inter", sans-serif';
  ctx.fillText('BANGALORE TECH SUMMIT 2026 • OFFICIAL SUSTAINABILITY PASS', width / 2, 168);

  ctx.fillStyle = '#245B45';
  ctx.font = '700 24px "Manrope", sans-serif';
  ctx.fillText('CERTIFIED SCOPE 3 CARBON IMPACT AUDIT', width / 2, 215);

  // Line Divider
  ctx.strokeStyle = '#E1E8E1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(140, 245);
  ctx.lineTo(width - 140, 245);
  ctx.stroke();

  // Central Authoritative KPI
  ctx.fillStyle = '#66736C';
  ctx.font = '700 18px "Inter", sans-serif';
  ctx.fillText('ESTIMATED CARBON FOOTPRINT', width / 2, 315);

  ctx.fillStyle = '#202B27';
  ctx.font = '800 96px "Manrope", sans-serif';
  ctx.fillText(`${res.totalFootprint.toFixed(2)}`, width / 2, 420);

  ctx.fillStyle = '#245B45';
  ctx.font = '700 30px "JetBrains Mono", monospace';
  ctx.fillText('kg CO₂e', width / 2, 470);

  // Corridor Specifications Box
  const boxX = 120;
  const boxY = 530;
  const boxW = width - 240;
  const boxH = 260;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(boxX, boxY, boxW, boxH);
  ctx.strokeStyle = '#E1E8E1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#245B45';
  ctx.font = '700 20px "Manrope", sans-serif';
  ctx.fillText('SUMMIT MOBILITY AUDIT TELEMETRY', boxX + 30, boxY + 45);

  ctx.fillStyle = '#66736C';
  ctx.font = '500 17px "Inter", sans-serif';
  ctx.fillText(`Origin: ${state.origin}`, boxX + 30, boxY + 90);
  ctx.fillText(`Destination: ${state.destination}`, boxX + 30, boxY + 125);
  ctx.fillText(`Transport Mode: ${state.mode}`, boxX + 30, boxY + 160);
  ctx.fillText(`Corridor Distance: ${state.distance} km  •  Occupancy: ${state.passengers} passenger(s)`, boxX + 30, boxY + 195);
  ctx.fillText(`Supplementary Activity: ${state.activity}`, boxX + 30, boxY + 230);

  // Greener Alternative Box
  const altBoxY = 820;
  const altBoxH = 200;
  ctx.fillStyle = '#E8F0E9';
  ctx.fillRect(boxX, altBoxY, boxW, altBoxH);
  ctx.strokeStyle = '#245B45';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(boxX, altBoxY, boxW, altBoxH);

  ctx.fillStyle = '#245B45';
  ctx.font = '700 20px "Manrope", sans-serif';
  ctx.fillText('OPTIMAL DECARBONIZATION PATHWAY', boxX + 30, altBoxY + 45);

  const bestAlt = res.altAnalysis.recommendations[0];
  if (bestAlt) {
    ctx.fillStyle = '#245B45';
    ctx.font = '800 24px "Manrope", sans-serif';
    ctx.fillText(`${bestAlt.mode}  •  Net Abatement: -${bestAlt.pctReduction}% CO₂e`, boxX + 30, altBoxY + 90);

    ctx.fillStyle = '#202B27';
    ctx.font = '600 17px "Inter", sans-serif';
    ctx.fillText(`Potential Scope 3 reduction: ${bestAlt.savedPerPerson.toFixed(2)} kg CO₂e avoided.`, boxX + 30, altBoxY + 130);
    ctx.fillStyle = '#66736C';
    ctx.font = '500 15px "Inter", sans-serif';
    ctx.fillText(bestAlt.notes, boxX + 30, altBoxY + 165);
  } else {
    ctx.fillStyle = '#245B45';
    ctx.font = '800 22px "Manrope", sans-serif';
    ctx.fillText('Current corridor represents the benchmark lowest-emission mode.', boxX + 30, altBoxY + 95);
  }

  // Verification Seal & Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = '#8E9B94';
  ctx.font = '600 14px "JetBrains Mono", monospace';
  const issueDate = new Date().toISOString().split('T')[0];
  ctx.fillText(`AUDIT REFERENCE: CSQ-BTS26-${Date.now().toString(36).toUpperCase()}  •  ISSUED: ${issueDate}`, width / 2, 1260);
  ctx.fillText('STANDARDS: GHG PROTOCOL SCOPE 3 (CAT 6 & 7)  •  INDIA CEA DATABASE v19', width / 2, 1295);

  ctx.fillStyle = '#245B45';
  ctx.font = '700 16px "Manrope", sans-serif';
  ctx.fillText('Verified at CarbonSynq Flagship Experience  •  Bangalore Tech Summit 2026', width / 2, 1340);

  // Trigger download
  const link = document.createElement('a');
  link.download = `CarbonSynq-BTS2026-Pass-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Reset calculator for next summit delegate
 */
function resetCalculator() {
  state.origin = "Kempegowda Int'l Airport (BLR)";
  state.destination = "Bangalore Tech Summit (Palace Grounds)";
  state.mode = "Petrol Car";
  state.distance = 32;
  state.passengers = 1;
  state.activities = {};
  state.isCalculated = false;

  elements.originInput.value = state.origin;
  elements.destinationInput.value = state.destination;
  elements.modeSelect.value = state.mode;
  elements.distanceInput.value = state.distance;
  elements.distanceSlider.value = state.distance;
  elements.passengersInput.value = state.passengers;

  if (elements.activityChipsContainer) {
    elements.activityChipsContainer.querySelectorAll('.act-chip').forEach(c => {
      c.classList.remove('act-chip--on');
      const b = c.querySelector('.act-chip__state');
      if (b) b.textContent = '+';
    });
  }
  renderActiveFollowups();

  updateKmButtonsActive(32);
  syncTransportCards();
  updateDistanceDisplays();
  updatePassengerDisplays();

  if (elements.impactSection) elements.impactSection.classList.add('hidden');
  if (elements.choicesSection) elements.choicesSection.classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Start app
document.addEventListener('DOMContentLoaded', init);
