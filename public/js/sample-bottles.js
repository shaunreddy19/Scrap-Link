// SCRAP-LINK Sample Bottles Generator
// Creates realistic SVG/Canvas multi-angle captures (0°, 90°, 180°, 270°) for 4 inspection scenarios:
// 1. Clean Reference PET 250ml
// 2. PET with Foreign Non-PET Material (foil seal, label fragment, neck ring)
// 3. PET with Visible Food/Syrup Residue & Wetness
// 4. Deformed / Glare Bottle (Uncertain)

const SAMPLE_BOTTLES = {
  sample_clean: {
    id: "sample_clean",
    name: "Sample 01: Standard 250ml PET (Reference)",
    description: "Nominal 143mm H × Ø52mm PET bottle. Clean walls, no visible foreign matter.",
    expectedAiOutcome: "No visible indicator",
    expectedIndicators: {
      foodResidue: false,
      foreignMaterial: false,
      visibleWetness: false
    },
    weightGrams: 18.4,
    notes: "Reference specimen. Remember: 'No visible indicator' does not certify chemical cleanliness.",
    angles: {
      0: { label: "0° (Front View)", details: "Transparent PET cylinder, neck threads clean, minimal diffuse reflections." },
      90: { label: "90° (Right Side View)", details: "Uniform side profile, wall thickness 0.3mm visible, base petaloid intact." },
      180: { label: "180° (Rear View)", details: "Rear seam visible, clean optical transmission, no visible particles." },
      270: { label: "270° (Left Side View)", details: "Side profile, no foreign adhesion, consistent lighting reflection." }
    }
  },
  sample_foreign: {
    id: "sample_foreign",
    name: "Sample 02: Foreign Non-PET Adhesion",
    description: "250ml PET bottle with metallic seal foil patch at shoulder and non-PET plastic neck band.",
    expectedAiOutcome: "Visible contamination detected",
    expectedIndicators: {
      foodResidue: false,
      foreignMaterial: true,
      visibleWetness: false
    },
    weightGrams: 19.8,
    notes: "Contaminant detected: Non-PET metallic foil adhesive and blue HDPE ring. Must be diverted.",
    angles: {
      0: { label: "0° (Front View)", details: "Silver foil residue (14x8mm) visible on upper shoulder." },
      90: { label: "90° (Right Side View)", details: "Foil edge profile evident; blue HDPE tamper-evident ring stuck under thread." },
      180: { label: "180° (Rear View)", details: "Back reflection shows shadow of opaque foil contaminant." },
      270: { label: "270° (Left Side View)", details: "HDPE ring clip visible on neck flange." }
    }
  },
  sample_residue: {
    id: "sample_residue",
    name: "Sample 03: Visible Liquid & Sticky Syrup Residue",
    description: "250ml PET bottle with visible dark liquid droplet pool at base and sticky dried syrup streaks.",
    expectedAiOutcome: "Visible contamination detected",
    expectedIndicators: {
      foodResidue: true,
      foreignMaterial: false,
      visibleWetness: true
    },
    weightGrams: 23.1,
    notes: "Contaminant detected: Viscous sugar syrup droplet pool in bottom petaloid recess (approx 3.5ml).",
    angles: {
      0: { label: "0° (Front View)", details: "Amber liquid pool (approx 4mm depth) visible resting in bottom curve." },
      90: { label: "90° (Right Side View)", details: "Liquid meniscus visible at 15° angle; syrup drip trail on interior wall." },
      180: { label: "180° (Rear View)", details: "Brown sugar crystal residue film coating rear lower interior." },
      270: { label: "270° (Left Side View)", details: "Surface droplet refraction under white LED illumination." }
    }
  },
  sample_uncertain: {
    id: "sample_uncertain",
    name: "Sample 04: Partial Pinch Defect / Specular Glare",
    description: "250ml PET bottle with crumpled side crease causing severe specular reflection and optical distortion.",
    expectedAiOutcome: "Uncertain — requires human review",
    expectedIndicators: {
      foodResidue: false,
      foreignMaterial: false,
      visibleWetness: false
    },
    weightGrams: 18.2,
    notes: "AI confidence low due to sharp specular LED ring reflections on warped crease. Requires operator human review.",
    angles: {
      0: { label: "0° (Front View)", details: "Fold crease across midriff; LED ring reflects high-contrast bright hotspot." },
      90: { label: "90° (Right Side View)", details: "Crease shadow mimics dark particulate, triggering edge anomaly." },
      180: { label: "180° (Rear View)", details: "Rear distortion from opposite fold; internal clarity obscured." },
      270: { label: "270° (Left Side View)", details: "Severe lens flare / refraction anomaly on crease line." }
    }
  }
};

// SVG Renderer for high-precision bottle diagrams
function renderBottleSvg(sampleId, angle, width = 360, height = 360) {
  const sample = SAMPLE_BOTTLES[sampleId] || SAMPLE_BOTTLES.sample_clean;
  
  // Base bottle dimensions inside CAD 300x450 scaled box
  // Reference bottle: 143mm H x 52mm Dia
  let bottleColor = "rgba(230, 245, 255, 0.45)";
  let strokeColor = "#38BDF8";
  let capColor = "#0284C7";
  
  let foreignOverlay = "";
  let residueOverlay = "";
  let glareOverlay = "";
  let angleIndicator = `<text x="20" y="30" fill="#FACC15" font-family="monospace" font-weight="bold" font-size="14">ROTATION: ${angle}°</text>`;

  // Scenario specific SVG features based on angle
  if (sampleId === 'sample_foreign') {
    if (angle === 0 || angle === 90) {
      const foilX = angle === 0 ? 165 : 190;
      foreignOverlay = `
        <!-- Non-PET Foil Contaminant -->
        <rect x="${foilX}" y="145" width="28" height="18" rx="2" fill="#94A3B8" stroke="#E2E8F0" stroke-width="1.5" />
        <line x1="${foilX+2}" y1="150" x2="${foilX+26}" y2="158" stroke="#475569" stroke-width="1" />
        <circle cx="${foilX+14}" cy="154" r="3" fill="#CBD5E1" />
        <rect x="156" y="98" width="48" height="6" fill="#2563EB" stroke="#1D4ED8" />
        <text x="${foilX - 25}" y="140" fill="#EF4444" font-family="monospace" font-size="10" font-weight="bold">[FOREIGN FOIL]</text>
      `;
    } else {
      foreignOverlay = `
        <!-- HDPE Tamper ring rear shadow -->
        <rect x="156" y="98" width="48" height="6" fill="#2563EB" stroke="#1D4ED8" opacity="0.85" />
        <ellipse cx="180" cy="155" rx="10" ry="6" fill="#64748B" opacity="0.3" />
        <text x="130" y="140" fill="#EF4444" font-family="monospace" font-size="10">[REAR FOIL SHADOW]</text>
      `;
    }
  }

  if (sampleId === 'sample_residue') {
    let poolHeight = angle === 90 ? 28 : 22;
    residueOverlay = `
      <!-- Amber syrup pool at bottom & interior streak -->
      <path d="M 148 290 Q 180 ${305 + (angle === 90 ? 5 : 0)} 212 290 L 210 305 Q 180 312 150 305 Z" fill="#B45309" opacity="0.85" stroke="#78350F" />
      <path d="M ${170 + (angle/10)} 180 Q ${175 + (angle/15)} 240 ${172 + (angle/20)} 288" stroke="#D97706" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.75" />
      <circle cx="${165 + (angle/12)}" cy="220" r="3.5" fill="#B45309" opacity="0.8" />
      <circle cx="${185 - (angle/15)}" cy="255" r="2.5" fill="#B45309" opacity="0.8" />
      <text x="120" y="332" fill="#F59E0B" font-family="monospace" font-size="10" font-weight="bold">[VISCOUS LIQUID POOL]</text>
    `;
  }

  if (sampleId === 'sample_uncertain') {
    glareOverlay = `
      <!-- Severe specular reflection & crimp crease -->
      <path d="M 148 180 L 195 205 L 152 230" fill="none" stroke="#E2E8F0" stroke-width="3.5" stroke-dasharray="2,2" />
      <ellipse cx="185" cy="195" rx="24" ry="14" fill="#FFFFFF" opacity="0.85" />
      <ellipse cx="185" cy="195" rx="36" ry="22" fill="#FEF08A" opacity="0.3" />
      <line x1="160" y1="180" x2="210" y2="210" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" />
      <text x="110" y="175" fill="#FACC15" font-family="monospace" font-size="10" font-weight="bold">[SPECULAR GLARE CREASE]</text>
    `;
  }

  return `
    <svg viewBox="0 0 360 360" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:#090D14; border-radius:4px;">
      <defs>
        <!-- Chamber lighting gradient (simulating ring light at Z=355mm) -->
        <radialGradient id="ringLight" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.18" />
          <stop offset="60%" stop-color="#0284C7" stop-opacity="0.06" />
          <stop offset="100%" stop-color="#090D14" stop-opacity="0" />
        </radialGradient>
        
        <!-- Plastic PET gradient -->
        <linearGradient id="petGloss" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.4)" />
          <stop offset="25%" stop-color="rgba(200,230,255,0.1)" />
          <stop offset="70%" stop-color="rgba(200,230,255,0.15)" />
          <stop offset="95%" stop-color="rgba(255,255,255,0.5)" />
        </linearGradient>

        <!-- Turntable platform gradient -->
        <linearGradient id="turntableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#334155" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>

      <!-- Chamber Background Grid -->
      <rect width="360" height="360" fill="#090D14" />
      <rect width="360" height="360" fill="url(#ringLight)" />
      
      <!-- Calibration grid lines (representing 10mm increments) -->
      <g stroke="#1E293B" stroke-width="0.5" stroke-dasharray="2,4">
        <line x1="30" y1="0" x2="30" y2="360" />
        <line x1="180" y1="0" x2="180" y2="360" stroke="#334155" stroke-width="1" />
        <line x1="330" y1="0" x2="330" y2="360" />
        <line x1="0" y1="90" x2="360" y2="90" />
        <line x1="0" y1="180" x2="360" y2="180" stroke="#334155" stroke-width="1" />
        <line x1="0" y1="270" x2="360" y2="270" />
      </g>

      <!-- Turntable Ø78mm Base Platform in CAD Chamber -->
      <g id="turntable-platform">
        <ellipse cx="180" cy="318" rx="85" ry="18" fill="url(#turntableGrad)" stroke="#475569" stroke-width="1.5" />
        <ellipse cx="180" cy="315" rx="80" ry="15" fill="#1E293B" stroke="#FACC15" stroke-width="0.8" stroke-dasharray="4,4" />
        <!-- Detent Index Markers at 0, 90, 180, 270 -->
        <circle cx="180" cy="330" r="3" fill="${angle === 0 ? '#FACC15' : '#64748B'}" />
        <circle cx="255" cy="315" r="3" fill="${angle === 90 ? '#FACC15' : '#64748B'}" />
        <circle cx="180" cy="300" r="3" fill="${angle === 180 ? '#FACC15' : '#64748B'}" />
        <circle cx="105" cy="315" r="3" fill="${angle === 270 ? '#FACC15' : '#64748B'}" />
        <text x="180" y="348" fill="#94A3B8" font-family="monospace" font-size="9" text-anchor="middle">MANUAL TURNTABLE Ø78mm (INDEX: ${angle}°)</text>
      </g>

      <!-- Reference 250ml PET Bottle Outline (143mm H x Ø52mm) -->
      <g id="pet-bottle" transform="rotate(${(angle % 4) * 0.5}, 180, 200)">
        <!-- Bottle Neck & Thread -->
        <rect x="166" y="78" width="28" height="20" fill="url(#petGloss)" stroke="${strokeColor}" stroke-width="1" />
        <line x1="164" y1="84" x2="196" y2="84" stroke="#94A3B8" stroke-width="1.5" />
        <line x1="164" y1="90" x2="196" y2="90" stroke="#94A3B8" stroke-width="1.5" />

        <!-- Shoulder Curve -->
        <path d="M 166 98 C 160 115, 146 130, 146 150 L 146 285 C 146 300, 155 310, 180 310 C 205 310, 214 300, 214 285 L 214 150 C 214 130, 200 115, 194 98 Z" 
              fill="${bottleColor}" stroke="${strokeColor}" stroke-width="1.8" />
        
        <!-- Gloss Highlights -->
        <path d="M 152 145 L 152 280" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round" />
        <path d="M 157 150 L 157 275" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
        
        <!-- Petaloid Base Indentations -->
        <path d="M 156 295 Q 180 290 204 295" stroke="#0284C7" stroke-width="1" fill="none" opacity="0.6" />
        <path d="M 162 302 Q 180 296 198 302" stroke="#0284C7" stroke-width="1" fill="none" opacity="0.4" />

        <!-- Specific Overlays -->
        ${foreignOverlay}
        ${residueOverlay}
        ${glareOverlay}
      </g>

      <!-- Optical Aiming Reticle (Aim point approx X=172, Y=65, Z=158) -->
      <g stroke="#FACC15" stroke-width="0.8" opacity="0.7">
        <circle cx="180" cy="190" r="14" fill="none" stroke-dasharray="3,3" />
        <line x1="180" y1="170" x2="180" y2="210" />
        <line x1="160" y1="190" x2="200" y2="190" />
      </g>

      <!-- Telemetry Annotations on Screen -->
      ${angleIndicator}
      <text x="20" y="48" fill="#94A3B8" font-family="monospace" font-size="10">FOV: Logitech C270 (Placeholder)</text>
      <text x="20" y="64" fill="#94A3B8" font-family="monospace" font-size="10">WORKING DIST: 210mm (Assumed)</text>
      <text x="340" y="30" fill="#38BDF8" font-family="monospace" font-size="11" text-anchor="end">${sample.name.split(':')[0]}</text>
      <text x="340" y="48" fill="#64748B" font-family="monospace" font-size="10" text-anchor="end">${sample.angles[angle].label}</text>
    </svg>
  `;
}
