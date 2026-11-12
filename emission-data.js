/**
 * CarbonSynq – Enterprise Carbon Accounting & Emission Standards
 * Bangalore Tech Summit 2026 Executive Edition
 * 
 * Emission Factors & Protocols:
 * - Central Electricity Authority (CEA), Govt. of India: CO2 Baseline Database for the Indian Power Sector v19 (0.716 kg CO2e/kWh)
 * - UK DEFRA / DESNZ 2024 Greenhouse Gas Conversion Factors for Corporate Reporting
 * - Bureau of Energy Efficiency (BEE), Ministry of Power & ARAI vehicle fuel efficiency benchmarks
 * - ICAO Carbon Emissions Calculator (Aviation Radiative Forcing Standard)
 * - WRI / GHG Protocol Scope 3 Category 6 (Business Travel) & Category 7 (Employee Commuting)
 */

export const EMISSION_FACTORS = {
  transport: {
    'Petrol Car': {
      factor: 0.170, // kg CO2e per vehicle-km
      type: 'per_vehicle_km',
      unit: 'kg CO₂e / vehicle-km',
      source: 'ARAI / BEE & UK DEFRA 2024 (Average Petrol ICE, 14 km/L, 2.31 kg CO₂/L)',
      iconKey: 'petrol-car',
      description: 'Internal Combustion Engine (1.2L–1.5L Petrol)',
      category: 'private'
    },
    'Diesel Car': {
      factor: 0.175, // kg CO2e per vehicle-km
      type: 'per_vehicle_km',
      unit: 'kg CO₂e / vehicle-km',
      source: 'ARAI / BEE & UK DEFRA 2024 (Average Diesel SUV/Sedan, 15 km/L, 2.68 kg CO₂/L)',
      iconKey: 'diesel-car',
      description: 'Compression-Ignition Diesel Passenger Vehicle',
      category: 'private'
    },
    'Electric Car': {
      factor: 0.086, // kg CO2e per vehicle-km
      type: 'per_vehicle_km',
      unit: 'kg CO₂e / vehicle-km',
      source: 'India CEA Baseline v19 (0.716 kg CO₂e/kWh) × 0.12 kWh/km EV Consumption',
      iconKey: 'electric-car',
      description: 'Battery Electric Vehicle (Charged on Southern Regional Grid)',
      category: 'private'
    },
    'Two-Wheeler': {
      factor: 0.045, // kg CO2e per vehicle-km
      type: 'per_vehicle_km',
      unit: 'kg CO₂e / vehicle-km',
      source: 'ARAI Fuel Economy Benchmarks & DEFRA 2024 (110–150cc Commuter Bike)',
      iconKey: 'two-wheeler',
      description: 'Single-track 4-stroke commuter motorcycle or scooter (~45 km/L)',
      category: 'private'
    },
    'Bus': {
      factor: 0.038, // kg CO2e per passenger-km
      type: 'per_passenger_km',
      unit: 'kg CO₂e / passenger-km',
      source: 'BMTC / TERI Urban Transit Fleet Telemetry & UK DEFRA 2024',
      iconKey: 'bus',
      description: 'Municipal Public Transit (BMTC / Volvo Diesel Fleet, 50% Avg Load)',
      category: 'public'
    },
    'Metro / Train': {
      factor: 0.022, // kg CO2e per passenger-km
      type: 'per_passenger_km',
      unit: 'kg CO₂e / passenger-km',
      source: 'BMRCL Namma Metro Sustainability Disclosure & Indian Railways Traction Factor',
      iconKey: 'metro-train',
      description: 'Electric Mass Rapid Transit (Namma Metro Grid-Tied Traction)',
      category: 'public'
    },
    'Flight': {
      factor: 0.210, // kg CO2e per passenger-km
      type: 'per_passenger_km',
      unit: 'kg CO₂e / passenger-km',
      source: 'ICAO Carbon Calculator & DEFRA 2024 (Domestic Aviation with Radiative Forcing)',
      iconKey: 'flight',
      description: 'Domestic Commercial Aviation (Short-Haul Turbofan with RF Uplift)',
      category: 'flight'
    },
    'Walking / Cycling': {
      factor: 0.000,
      type: 'zero',
      unit: 'kg CO₂e / km',
      source: 'IPCC Direct Emissions Scope 1 Zero-Tailpipe Accounting Framework',
      iconKey: 'cycling',
      description: 'Active Non-Motorized Mobility (Zero Operational GHG Emissions)',
      category: 'active'
    }
  },

  activities: {
    'Air Conditioning Usage': {
      subType: 'duration',
      label: 'Operational AC Runtime (Hours)',
      unitName: 'hours',
      defaultVal: 4,
      min: 1,
      max: 24,
      factor: 0.860, // kg CO2e per hour
      unit: 'kg CO₂e / hour',
      source: 'BEE Star Rating Standard (1.5-Ton 3-Star Inverter AC, 1.2 kW Load) × CEA Grid Factor',
      description: '1.5-ton split HVAC system operational cooling cycle'
    },
    'Electricity Consumption': {
      subType: 'kwh',
      label: 'Direct Electricity Consumption (kWh)',
      unitName: 'kWh',
      defaultVal: 10,
      min: 1,
      max: 500,
      factor: 0.716, // kg CO2e per kWh
      unit: 'kg CO₂e / kWh',
      source: 'India Central Electricity Authority (CEA) CO2 Baseline Database v19 (2024)',
      description: 'Metered grid power consumption from the southern Indian regional interconnect'
    },
    'Meat-Based Meal': {
      subType: 'meals',
      label: 'Meat-Based Protein Meals',
      unitName: 'meals',
      defaultVal: 1,
      min: 1,
      max: 10,
      factor: 2.400, // kg CO2e per meal
      unit: 'kg CO₂e / meal',
      source: 'Poore & Nemecek (Science 2018) / World Resources Institute (WRI) Agri-LCA',
      description: 'Composite poultry or red meat meal life cycle footprint'
    },
    'Shopping / Purchase': {
      subType: 'category',
      label: 'Procurement / Retail Category',
      unitName: 'item',
      options: [
        { label: 'Apparel / Textile Goods (1 piece)', value: 'fast_fashion', factor: 8.500, desc: 'Average synthetic or cotton garment life cycle footprint' },
        { label: 'Consumer Electronics & Peripherals', value: 'electronics', factor: 18.000, desc: 'Hardware accessory / peripheral life-cycle manufacturing impact' },
        { label: 'Packaged Consumables / Daily Retail', value: 'groceries', factor: 2.500, desc: 'Weekly packaged consumer goods retail allocation' },
        { label: 'Leather & High-Embodied Luxury Goods', value: 'leather', factor: 32.000, desc: 'Specialty leather goods or high-intensity manufactured footwear' }
      ],
      defaultVal: 'fast_fashion',
      source: 'Carbon Trust, Ellen MacArthur Foundation & ADEME Corporate Procurement LCAs'
    }
  }
};

/**
 * Bangalore Tech Summit 2026 Strategic Route Corridors
 */
export const BANGALORE_PRESETS = [
  { name: "BLR Kempegowda Int'l Airport", distance: 32, mode: 'Diesel Car' },
  { name: 'Whitefield Tech Corridor', distance: 22, mode: 'Metro / Train' },
  { name: 'Koramangala Commercial Hub', distance: 14, mode: 'Petrol Car' },
  { name: 'Electronic City Phase 1', distance: 26, mode: 'Bus' },
  { name: 'Indiranagar 100ft Corridor', distance: 9, mode: 'Electric Car' },
  { name: 'Bengaluru Central Rail Terminal', distance: 5, mode: 'Metro / Train' }
];

/**
 * Calculates travel emissions
 * @param {string} mode 
 * @param {number} distanceKm 
 * @param {number} passengers 
 */
export function calculateTravelEmissions(mode, distanceKm, passengers) {
  const spec = EMISSION_FACTORS.transport[mode];
  if (!spec) {
    return { totalEmissions: 0, perPersonEmissions: 0, factor: 0, unit: '', source: 'Provisional' };
  }

  const dist = Math.max(0, Number(distanceKm) || 0);
  const pass = Math.max(1, Number(passengers) || 1);

  let totalEmissions = 0;
  let perPersonEmissions = 0;

  if (spec.type === 'per_vehicle_km') {
    totalEmissions = spec.factor * dist;
    perPersonEmissions = totalEmissions / pass;
  } else if (spec.type === 'per_passenger_km') {
    perPersonEmissions = spec.factor * dist;
    totalEmissions = perPersonEmissions * pass;
  } else {
    totalEmissions = 0;
    perPersonEmissions = 0;
  }

  return {
    totalEmissions: Number(totalEmissions.toFixed(2)),
    perPersonEmissions: Number(perPersonEmissions.toFixed(2)),
    factor: spec.factor,
    unit: spec.unit,
    source: spec.source,
    type: spec.type,
    iconKey: spec.iconKey,
    description: spec.description
  };
}

/**
 * Calculates additional activity emissions
 * @param {string} activityKey 
 * @param {any} inputVal 
 */
export function calculateActivityEmissions(activityKey, inputVal) {
  if (!activityKey || activityKey === 'None') {
    return { emissions: 0, description: 'No supplementary activity selected', source: 'N/A', factor: 0, unit: '' };
  }

  const spec = EMISSION_FACTORS.activities[activityKey];
  if (!spec) {
    return { emissions: 0, description: 'Unrecognized operational activity', source: 'Provisional', factor: 0, unit: '' };
  }

  let emissions = 0;
  let desc = spec.description || '';

  if (spec.subType === 'category') {
    const opt = spec.options.find(o => o.value === inputVal) || spec.options[0];
    emissions = opt.factor;
    desc = opt.desc;
    return {
      emissions: Number(emissions.toFixed(2)),
      description: desc,
      source: spec.source,
      factor: opt.factor,
      unit: 'kg CO₂e / item'
    };
  }

  const numVal = Math.max(0, Number(inputVal) || 0);
  emissions = spec.factor * numVal;

  return {
    emissions: Number(emissions.toFixed(2)),
    description: `${numVal} ${spec.unitName} • ${desc}`,
    source: spec.source,
    factor: spec.factor,
    unit: spec.unit
  };
}

/**
 * Calculates emissions for multiple concurrent supplementary activities
 * @param {Object} activitiesMap - Map of activityKey -> inputVal
 */
export function calculateMultipleActivities(activitiesMap = {}) {
  const keys = Object.keys(activitiesMap).filter(k => k && k !== 'None');
  if (keys.length === 0) {
    return {
      emissions: 0,
      description: 'None selected',
      items: [],
      factor: 0,
      unit: 'kg CO₂e'
    };
  }

  let totalEmissions = 0;
  const items = [];

  for (const key of keys) {
    const val = activitiesMap[key];
    const itemCalc = calculateActivityEmissions(key, val);
    if (itemCalc.emissions > 0) {
      totalEmissions += itemCalc.emissions;
      items.push({
        key,
        emissions: itemCalc.emissions,
        description: itemCalc.description,
        factor: itemCalc.factor,
        unit: itemCalc.unit
      });
    }
  }

  const desc = items.length === 1 
    ? items[0].description 
    : `${items.length} activities: ` + items.map(i => `${i.key.replace(' Usage', '').replace(' Consumption', '')} (${i.emissions.toFixed(2)} kg)`).join(' · ');

  return {
    emissions: Number(totalEmissions.toFixed(2)),
    description: desc,
    items,
    factor: totalEmissions,
    unit: 'kg CO₂e'
  };
}

/**
 * Alternative recommendation engine
 * Evaluates transport alternatives for the same distance and passenger count.
 * Returns up to 3 lower-emission alternatives with strictly calculated savings.
 */
export function getAlternativeRecommendations(originalMode, distanceKm, passengers) {
  const origCalc = calculateTravelEmissions(originalMode, distanceKm, passengers);
  const origPerPerson = origCalc.perPersonEmissions;
  const dist = Number(distanceKm) || 0;
  const pass = Math.max(1, Number(passengers) || 1);

  const allModes = Object.keys(EMISSION_FACTORS.transport);
  const candidates = [];

  for (const mode of allModes) {
    if (mode === originalMode) continue;

    // Filter out impractical modes for distances:
    if (dist > 12 && mode === 'Walking / Cycling') continue;
    if (dist < 150 && mode === 'Flight') continue;

    const altCalc = calculateTravelEmissions(mode, dist, pass);
    const altPerPerson = altCalc.perPersonEmissions;
    const savedPerPerson = origPerPerson - altPerPerson;

    // Strict validation: ONLY qualify if calculation supports a lower footprint
    if (savedPerPerson > 0.005) {
      const pctReduction = origPerPerson > 0 
        ? Math.round((savedPerPerson / origPerPerson) * 100)
        : 0;

      const totalJourneySaved = origCalc.totalEmissions - altCalc.totalEmissions;

      candidates.push({
        mode,
        iconKey: altCalc.iconKey,
        altPerPerson: altPerPerson,
        altTotal: altCalc.totalEmissions,
        savedPerPerson: Number(savedPerPerson.toFixed(2)),
        totalSaved: Number(totalJourneySaved.toFixed(2)),
        pctReduction: Math.min(100, Math.max(1, pctReduction)),
        isGreener: true,
        source: altCalc.source,
        notes: getModeFeasibilityNote(mode, dist)
      });
    }
  }

  candidates.sort((a, b) => b.savedPerPerson - a.savedPerPerson);

  return {
    originalMode,
    originalPerPerson: origPerPerson,
    originalTotal: origCalc.totalEmissions,
    recommendations: candidates.slice(0, 3)
  };
}

function getModeFeasibilityNote(mode, dist) {
  switch (mode) {
    case 'Metro / Train':
      return 'BMRCL Namma Metro Green & Purple lines provide direct zero-congestion electrified transit to central Bengaluru.';
    case 'Electric Car':
      return 'Eliminates Scope 1 tailpipe emissions with a 50%+ reduction in lifecycle well-to-wheel greenhouse gas intensity.';
    case 'Bus':
      return 'BMTC Vayu Vajra & electric transit routes deliver high passenger-km carbon efficiency for summit corridors.';
    case 'Two-Wheeler':
      return 'Optimized lightweight powertrain offering reduced per-trip fuel burn for single-passenger urban travel.';
    case 'Walking / Cycling':
      return 'Zero-tailpipe non-motorized transport. Ideal for micro-mobility between summit venue zones.';
    default:
      return 'Demonstrated reduction in net Scope 3 greenhouse gas intensity compared to baseline.';
  }
}

/**
 * Generates authoritative executive sustainability recommendations
 */
export function generatePersonalizedRecommendation(originalMode, distanceKm, passengers, activityKey, totalFootprint) {
  const recommendations = [];

  if (originalMode === 'Petrol Car' || originalMode === 'Diesel Car') {
    if (passengers === 1) {
      recommendations.push("Single-occupant fossil fuel transit represents the highest Scope 3 intensity on this corridor. Transitioning to corporate carpooling (3+ occupants) or Namma Metro electric rapid transit would reduce travel carbon by up to 85% while bypassing metropolitan traffic congestion.");
    } else {
      recommendations.push("Multi-passenger vehicle allocation has successfully attenuated your per-capita carbon load. For further institutional decarbonization, transitioning corporate fleets to dedicated EV shuttles delivers an additional 50% lifecycle abatement.");
    }
  } else if (originalMode === 'Flight') {
    recommendations.push("Short-haul regional aviation contributes disproportionately to enterprise Scope 3 emissions due to high cruise-altitude radiative forcing. For corridors under 450 km, Vande Bharat electrified rail delivers an immediate 90% emissions reduction with comparable gate-to-gate productivity.");
  } else if (originalMode === 'Electric Car') {
    recommendations.push("EV transit demonstrates forward-thinking corporate mobility. As Karnataka's grid continues to integrate utility-scale solar and wind (currently >35% renewable penetration), your net well-to-wheel footprint will automatically decline annually.");
  } else if (originalMode === 'Metro / Train' || originalMode === 'Bus') {
    recommendations.push("Utilizing electrified mass transit exemplifies corporate leadership in urban mobility. Electrified rail infrastructure represents the gold standard for high-density, low-carbon conference attendance.");
  } else if (originalMode === 'Walking / Cycling') {
    recommendations.push("Active zero-emission mobility sets the definitive sustainability benchmark for summit delegates, generating 0.00 kg CO₂e in operational Scope 1 and Scope 3 transport emissions.");
  }

  if (activityKey === 'Air Conditioning Usage') {
    recommendations.push("Optimizing climate control setpoints to 24°C rather than 18°C lowers compressor duty cycles by approximately 6% per degree, avoiding ~0.4 kg CO₂e per standard 8-hour workday on regional grid power.");
  } else if (activityKey === 'Meat-Based Meal') {
    recommendations.push("Integrating plant-forward dining into institutional conference catering reduces agricultural supply-chain emissions by 60–70% relative to conventional meat-heavy menus.");
  } else if (activityKey === 'Electricity Consumption') {
    recommendations.push("Deploying energy management systems and procuring certified green power tariffs or I-RECs mitigates indirect Scope 2 electricity exposure across corporate facilities.");
  }

  return recommendations.join(' ');
}
