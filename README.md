# CarbonSynq Intelligence – Enterprise Climate Platform
### Bangalore Tech Summit 2026 • Official Sustainability Engine

A world-class, Swiss Minimalist enterprise carbon footprint calculator and decarbonization analytics platform built for Bangalore Tech Summit 2026 delegates, technology founders, CEOs, sustainability executives, and institutional investors.

---

## 🎨 Swiss Minimalist Color System

| Token | Exact Hex | Role & Application |
| :--- | :--- | :--- |
| **Main Background** | `#F6F7F3` | Warm off-white canvas |
| **Header Background** | `#FFFFFF` | Sticky navigation bar surface with subtle border |
| **Primary Cards** | `#FFFFFF` | Major dashboard panels with soft elevation |
| **Secondary Surfaces** | `#EAF0E9` | Soft sage-green surfaces for secondary sections & advisory |
| **Input Background** | `#F7F9F6` | Form controls and unselected segmented cards |
| **Primary Green** | `#245B45` | Swiss forest emerald for key CTAs, active cards & metrics |
| **Secondary Green** | `#3D8061` | Secondary indicators and active gauge arcs |
| **Muted Teal** | `#739B91` | Operational activity split indicators & scope tags |
| **Soft Green** | `#E1EEE5` | Badges, preset chips & active state card highlights |
| **Primary Text** | `#202B27` | Deep pine charcoal for high-contrast headers and body |
| **Secondary Text** | `#66736C` | Refined sage slate for captions and metadata |
| **Muted Text** | `#929B95` | Micro-citations, footnotes & icons |
| **Borders** | `#E2E8E2` | Subtle 1px borders across panels, inputs & tables |
| **Gold Accent** | `#B79A68` | Swiss champagne gold for BTS Climate Badge & certificate seal |

---

## 🏛️ Platform Architecture & Features

1. **Header & Brand Identity:**
   - CarbonSynq geometric leaf-shield logo mark in `#245B45`.
   - Bangalore Tech Summit 2026 identification tag.
   - Methodology & Sources modal action.
   - 1-click Reset session action.

2. **Compact Editorial Hero Section:**
   - **Headline:** *"Understand Your Impact. Move Towards Net Zero."*
   - **Subtitle:** *"Measure carbon emissions, compare smarter mobility choices and make sustainable decisions."*
   - Bengaluru Smart Mobility Grid visual widget displaying live CEA baseline intensity (`0.716 kg CO₂e/kWh`) and Namma Metro traction status.

3. **Journey Calculator (Left Column):**
   - Quick City Presets (`Kempegowda Airport`, `Whitefield Corridor`, `Koramangala Hub`, `Electronic City`, `Indiranagar`, `City Railway Stn`).
   - Starting Location & Destination inputs with route glyphs.
   - 8-grid Transport Selection Cards with Lucide line icons, subtle hover states, and clear selected borders (`#245B45`).
   - Travel distance numeric input with `-5km` / `+5km` steppers, precision track slider, and quick selection chips (`5 km`, `15 km`, `32 km`, `50 km`, `350 km`).
   - Passenger allocation stepper with mathematical occupancy note (`Gross Trip ÷ Occupants`).
   - Secondary Sage Panel for Additional Activity with **strictly one** dynamic follow-up input.
   - Primary Forest Green calculation button (`#245B45` hover `#1B4534`).

4. **Carbon Impact Analytics (Right Column):**
   - **Circular Progress Meter:** High-precision SVG circular arc visualizing efficiency index against the BTS 2.5 kg target.
   - **Numerical Typography:** Authoritative gross footprint hero metric (`X.XX kg CO₂e`) in Manrope/Inter tabular numbers.
   - **Proportional Emissions Split Bar:** Real-time visual comparison between transport % and operational activity %.
   - **Environmental Impact Comparisons:** Smartphone recharge cycles and mature tree carbon sequestration months.
   - **Breakdown Cards:** Detailed Scope 3 Cat 6 travel vs. Scope 2/3 operations with recognized conversion factors.

5. **Practical Greener Alternatives:**
   - Recommends verified lower-emission transport modes (Namma Metro, Bus, Two-Wheeler, Walking/Cycling).
   - Displays transport icon, mode name, `Greener Alternative` badge, operational context, emissions saved, and percentage reduction badge (`-87% CO₂e`).

6. **Personalized Recommendation & Digital Pass:**
   - Sage-green advisory panel with gold BTS 2026 Climate Badge (`#B79A68`).
   - Strategic, authoritative guidance tailored to the user's travel and activity profile.
   - **Digital Pass (QR):** High-contrast on-screen QR code and copyable audit link.
   - **Export Summit Badge:** Generates a crisp institutional certificate (`PNG`) via HTML5 Canvas.
   - **Next Visitor Reset:** Prepares the kiosk for the next attendee in 1 click.

---

## 📊 Scientific Emission Standards & Factors

| Transport Mode / Activity | Factor | Basis | Standard Source Citation |
| :--- | :--- | :--- | :--- |
| **Petrol Car** | `0.170` | kg CO₂e / veh-km | ARAI / BEE & UK DEFRA 2024 (Average Petrol ICE, 14 km/L, 2.31 kg CO₂/L) |
| **Diesel Car** | `0.175` | kg CO₂e / veh-km | ARAI / BEE & UK DEFRA 2024 (Average Diesel SUV/Sedan, 15 km/L, 2.68 kg CO₂/L) |
| **Electric Car** | `0.086` | kg CO₂e / veh-km | India CEA Baseline Database v19 (0.716 kg/kWh) × 0.12 kWh/km EV consumption |
| **Two-Wheeler** | `0.045` | kg CO₂e / veh-km | ARAI fuel economy benchmarks & DEFRA 2024 (110–150cc commuter bike) |
| **Bus (Public Transit)** | `0.038` | kg CO₂e / pass-km | BMTC / TERI Urban Transit Studies & UK DEFRA 2024 (50% fleet load factor) |
| **Metro / Train (Electric)** | `0.022` | kg CO₂e / pass-km | BMRCL Namma Metro Sustainability Report & Indian Railways Traction Factor |
| **Flight (Domestic Short-Haul)** | `0.210` | kg CO₂e / pass-km | ICAO Carbon Calculator & DEFRA 2024 (With radiative forcing uplift) |
| **Walking / Cycling** | `0.000` | kg CO₂e / km | IPCC Scope 1 & 3 Zero Direct Tailpipe Emissions Framework |
| **Air Conditioning** | `0.860` | kg CO₂e / hr | BEE 3-Star 1.5T AC (1.2 kW continuous load) × CEA Grid Factor (0.716 kg/kWh) |
| **Electricity Consumption** | `0.716` | kg CO₂e / kWh | India Central Electricity Authority (CEA) CO₂ Baseline Database v19 (2024) |
| **Meat-Based Meal** | `2.400` | kg CO₂e / meal | Poore & Nemecek (*Science* 2018) / World Resources Institute (WRI) Agri-LCA |
| **Shopping (Apparel)** | `8.500` | kg CO₂e / item | Carbon Trust & Ellen MacArthur Foundation Apparel LCA Benchmarks |
| **Shopping (Electronics)** | `18.000` | kg CO₂e / item | ADEME & Apple Life Cycle Environmental Telemetry Reports |

---

## 🚀 Running Locally

```powershell
cd C:\Users\Sarwang\.gemini\antigravity-ide\scratch\carbonsynq-bts2026
npm run dev
# Server running at http://localhost:3030
```
