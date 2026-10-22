# Scrap Link

> A hardware-assisted recycling inspection and traceability platform that screens recyclables for visible contamination and connects local collection points with scrap dealers to support better-informed material handovers.

---

## Overview

**Scrap Link** addresses contamination in recyclable materials by providing a physical-to-digital bridge between residential waste collection and industrial recycling plants.

Instead of replacing existing local collectors, Scrap Link strengthens their work:
1. **Inspection Chamber (CAD v2.4)**: Screens individual 250ml PET bottles across 4 manual turntable viewing angles (0°, 90°, 180°, 270°).
2. **Local AI Screening**: Detects visible food residue, foreign non-PET material (foil, labels, caps), and residual liquids/wetness without cloud dependencies.
3. **Operator Verification**: Allows human operators to confirm or override screening results while immutably preserving the original AI prediction for auditability.
4. **Warehouse Matching & Handover**: Connects verified batches with recycling dealers based on quality tolerance, purchase rate, and logistical parameters.

---

## Aesthetic & Palette

The user interface uses a high-contrast industrial theme:
- **Safety Yellow**: `#FACC15` / `#EAB308`
- **Jet Black**: `#080C14` / `#0F1626`
- **Crisp White**: `#FFFFFF` / `#F8FAFC`
- **Full Dark & Light Mode** with smooth transition and saved preference.

---

## 3-Step Guided Workflow

1. **Capture or Select Object**: Capture using external USB camera or select from reference test specimens (*Clean PET*, *Non-PET Foil & Neck Ring*, *Syrup Residue & Wetness*, *Glare Crease*).
2. **Measure & Segregate**: Clear plain-English separation of **Useful Recyclable Material** vs **Waste / Contaminants** with automated tare weight calculation.
3. **Dispatch to Warehouses**: Automatically match batches with verified recycling warehouses (*Apex Polymers*, *EcoFlake Hub*, *Metro Plastics*) with commercial Accept/Reject workflows and separate physical vehicle handover logging.

---

## CAD v2.4 Reference Parameters

- **Chamber Dimensions**: 300 mm (W) × 200 mm (D) × 450 mm (H)
- **Manual Turntable**: Ø78 × 4 mm platform with detent index markers
- **Camera Mount**: Logitech C270 CAD placeholder at Z = 355 mm (lens-to-target ~210 mm)
- **Front Window**: 100 W × 185 H × 3 mm clear acrylic panel
- **Side Tray Opening**: Y = 22–178 mm, Z = 28–322 mm (sliding travel: -195 mm)

---

## Getting Started

### Prerequisites
- Node.js (v18+)

### Installation & Run
```bash
# Clone the repository
git clone https://github.com/<your-username>/scrap-link.git
cd scrap-link

# Start the local server
node server.js
```

Open your browser and navigate to:
**http://localhost:3000**

---

## Non-Negotiable Accuracy Compliance

- **No hidden contamination detection**: Scrap Link screens only for *visible surface indicators*.
- **Approved Taxonomy**: Outcomes are strictly `"Visible contamination detected"`, `"No visible indicator"`, and `"Uncertain — requires human review"`.
- *"No visible indicator"* does not certify chemical cleanliness or food-grade recyclability.
- Turntable rotation is strictly manual (0°, 90°, 180°, 270°). No motorized rotation or automated sorting gate is claimed in the initial prototype.
- Blockchain is evaluated as a future feasibility study only and is explicitly excluded from the local prototype.
