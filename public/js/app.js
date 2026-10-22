// SCRAP-LINK Simplified Modern Application Logic
// Staged 3-Step Flow: (1) Photo Capture -> (2) Measure & Segregate -> (3) Match & Dispatch Recyclers

let currentStep = 1;
let captureMode = 'demo'; // 'demo' | 'webcam'
let webcamStream = null;
let currentSampleKey = 'clean';
let currentDemoAngle = 0;
let modalCallback = null;

// Demo Specimen Definitions
const demoSpecimens = {
  clean: {
    name: "Standard 250ml PET (Reference)",
    weight: 18.4,
    aiOutcome: "No visible indicator",
    usefulTitle: "18.4g High-Grade Clear PET",
    usefulDesc: "Eligible for premium bottle-to-bottle flake granulation.",
    wasteTitle: "None Detected",
    wasteDesc: "0% visible foreign contamination observed.",
    badgeClass: "bg-green-500/20 text-green-400 border border-green-500",
    badgeText: "🟢 NO VISIBLE CONTAMINATION DETECTED"
  },
  foreign: {
    name: "PET with Non-PET Metallic Foil & Ring",
    weight: 19.8,
    aiOutcome: "Visible contamination detected",
    usefulTitle: "15.2g Recoverable PET Body",
    usefulDesc: "Body plastic usable once non-PET contaminants stripped.",
    wasteTitle: "4.6g Metallic Foil & HDPE Ring",
    wasteDesc: "Must be mechanically cut or diverted from Grade A stream.",
    badgeClass: "bg-red-500/20 text-red-400 border border-red-500",
    badgeText: "🔴 VISIBLE CONTAMINATION DETECTED"
  },
  residue: {
    name: "PET with Syrup Residue & Liquid Wetness",
    weight: 23.1,
    aiOutcome: "Visible contamination detected",
    usefulTitle: "18.2g Cleanable PET Flake",
    usefulDesc: "High yield after industrial washing & drying.",
    wasteTitle: "4.9g Viscous Sugar Syrup / Liquid",
    wasteDesc: "Requires high-pressure hot water wash cycle.",
    badgeClass: "bg-red-500/20 text-red-400 border border-red-500",
    badgeText: "🔴 VISIBLE LIQUID / RESIDUE DETECTED"
  },
  glare: {
    name: "PET with Pinch Defect / Specular Glare",
    weight: 18.2,
    aiOutcome: "Uncertain — requires human review",
    usefulTitle: "18.2g Intact PET Resin",
    usefulDesc: "Physical material sound; optical distortion flagged.",
    wasteTitle: "Uncertain Crease Anomaly",
    wasteDesc: "Requires human operator sign-off to proceed.",
    badgeClass: "bg-yellow-500/20 text-yellow-400 border border-yellow-500",
    badgeText: "🟡 UNCERTAIN — OPERATOR REVIEW REQUIRED"
  }
};

// ================= DOM INITIALIZATION =================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUtmTracking();
  initScrollListeners();
  initLastUpdated();
  renderDemoGraphic(0);
});

// ================= 1. THEME TOGGLE (LIGHT / DARK) =================
function initTheme() {
  const saved = localStorage.getItem('sl_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeButtonUI(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('sl_theme', next);
  updateThemeButtonUI(next);
}

function updateThemeButtonUI(theme) {
  const icon = document.getElementById('theme-icon');
  const text = document.getElementById('theme-text');
  if (icon && text) {
    if (theme === 'dark') {
      icon.textContent = '🌙';
      text.textContent = 'Dark';
    } else {
      icon.textContent = '☀️';
      text.textContent = 'Light';
    }
  }
}

// ================= 14. UTM TRACKING =================
function initUtmTracking() {
  try {
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmCampaign = params.get('utm_campaign');
    if (utmSource || utmCampaign) {
      console.log(`[UTM Tracked] Source: ${utmSource || 'none'}, Campaign: ${utmCampaign || 'none'}`);
    }
  } catch (e) {}
}

// ================= 8 & 4. SCROLL PROGRESS & BACK TO TOP =================
function initScrollListeners() {
  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // 8. Progress Bar
    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) progressEl.style.width = scrolled + '%';

    // 4. Back to top button
    const topBtn = document.getElementById('back-to-top');
    if (topBtn) {
      topBtn.style.display = winScroll > 250 ? 'flex' : 'none';
    }
  });
}

// ================= 18. LAST UPDATED DATE =================
function initLastUpdated() {
  const dateEl = document.getElementById('last-updated-date');
  if (dateEl) {
    const d = new Date();
    dateEl.textContent = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }
}

// ================= NAVIGATION SECTION SWITCHER =================
function switchNavSection(sectionKey) {
  document.querySelectorAll('.nav-section').forEach(sec => sec.style.display = 'none');
  const target = document.getElementById(`section-${sectionKey}`);
  if (target) target.style.display = 'block';

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  // highlight matching link
  document.querySelectorAll(`.nav-link`).forEach(link => {
    if (link.textContent.toLowerCase().includes(sectionKey)) link.classList.add('active');
  });

  window.scrollTo({ top: 120, behavior: 'smooth' });
}

// ================= 5. MOBILE MENU =================
function toggleMobileMenu() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) drawer.classList.toggle('open');
}

// ================= STEPPER NAVIGATION =================
function goToStep(step) {
  currentStep = step;
  
  // Hide all step views
  document.getElementById('step-container-1').style.display = 'none';
  document.getElementById('step-container-2').style.display = 'none';
  document.getElementById('step-container-3').style.display = 'none';

  // Show active step
  document.getElementById(`step-container-${step}`).style.display = 'block';

  // Update Stepper pills
  [1, 2, 3].forEach(s => {
    const pill = document.getElementById(`step-nav-${s}`);
    if (pill) {
      pill.classList.toggle('active', s === step);
      pill.classList.toggle('completed', s < step);
    }
  });

  if (step === 2) {
    triggerStep2Scan();
  } else if (step === 3) {
    updateStep3Manifest();
  }

  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function jumpToStep(step) {
  goToStep(step);
}

// ================= STEP 1: PHOTO & DEMO SELECTION =================
function setDemoAngle(angle) {
  currentDemoAngle = angle;
  renderDemoGraphic(angle);
  document.getElementById('photo-angle-tag').textContent = `ROTATION: ${angle}° View`;
  
  // Update pills
  [0, 90, 180, 270].forEach(a => {
    const pill = document.getElementById(`angle-pill-${a}`);
    if (pill) {
      if (a === angle) {
        pill.className = 'btn btn-primary';
      } else {
        pill.className = 'btn btn-secondary';
      }
    }
  });
}

function changeDemoSample(sampleKey) {
  currentSampleKey = sampleKey;
  const spec = demoSpecimens[sampleKey];
  document.getElementById('demo-weight-input').value = spec.weight;
  renderDemoGraphic(currentDemoAngle);
}

function renderDemoGraphic(angle) {
  const container = document.getElementById('step1-photo-display');
  if (!container) return;

  if (captureMode === 'webcam') {
    return; // Webcam handled separately
  }

  // Use renderBottleSvg from sample-bottles.js if available, or build high-res SVG
  const sampleMap = {
    clean: 'sample_clean',
    foreign: 'sample_foreign',
    residue: 'sample_residue',
    glare: 'sample_uncertain'
  };
  
  const mappedId = sampleMap[currentSampleKey] || 'sample_clean';
  if (typeof renderBottleSvg === 'function') {
    container.innerHTML = renderBottleSvg(mappedId, angle, 280, 280);
  } else {
    container.innerHTML = `<div style="color:var(--text-main);">Rendering Bottle...</div>`;
  }
}

function selectCaptureMode(mode) {
  captureMode = mode;
  const btnDemo = document.getElementById('btn-use-demo');
  const btnCam = document.getElementById('btn-use-cam');
  const demoPicker = document.getElementById('demo-samples-picker');

  if (mode === 'demo') {
    btnDemo.className = 'btn btn-primary';
    btnCam.className = 'btn btn-secondary';
    demoPicker.style.display = 'block';
    stopWebcamStream();
    renderDemoGraphic(currentDemoAngle);
  } else {
    btnCam.className = 'btn btn-primary';
    btnDemo.className = 'btn btn-secondary';
    demoPicker.style.display = 'none';
    startWebcamStream();
  }
}

async function startWebcamStream() {
  const container = document.getElementById('step1-photo-display');
  container.innerHTML = `
    <video id="webcam-live-feed" autoplay playsinline muted style="width:100%; height:100%; object-fit:cover;"></video>
  `;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: "environment" }
    });
    webcamStream = stream;
    const v = document.getElementById('webcam-live-feed');
    if (v) v.srcObject = stream;
    showToast("Connected to external USB camera");
  } catch (err) {
    alert("Camera unavailable: " + err.message + ". Falling back to demo samples.");
    selectCaptureMode('demo');
  }
}

function stopWebcamStream() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(t => t.stop());
    webcamStream = null;
  }
}

// ================= STEP 2: MEASURE & SEGREGATE =================
function triggerStep2Scan() {
  const container = document.getElementById('step2-photo-display');
  const spec = demoSpecimens[currentSampleKey];

  // Render static captured image
  if (captureMode === 'demo') {
    const sampleMap = { clean: 'sample_clean', foreign: 'sample_foreign', residue: 'sample_residue', glare: 'sample_uncertain' };
    container.innerHTML = renderBottleSvg(sampleMap[currentSampleKey], currentDemoAngle, 280, 280);
  } else {
    container.innerHTML = `<div style="color:#FFF; display:flex; align-items:center; justify-content:center; height:100%;">Camera Frame Locked</div>`;
  }

  // Update Useful vs Waste text
  document.getElementById('useful-material-text').textContent = spec.usefulTitle;
  document.getElementById('useful-material-text').nextElementSibling.textContent = spec.usefulDesc;
  document.getElementById('waste-material-text').textContent = spec.wasteTitle;
  document.getElementById('waste-material-text').nextElementSibling.textContent = spec.wasteDesc;

  // Render Primary Status Card
  const verdictBox = document.getElementById('ai-verdict-box');
  if (spec.aiOutcome === 'No visible indicator') {
    verdictBox.style.background = 'rgba(34,197,94,0.12)';
    verdictBox.style.border = '1px solid #22C55E';
    verdictBox.style.color = '#4ADE80';
    verdictBox.innerHTML = `
      <div style="font-weight:800; font-size:14px;">🟢 NO VISIBLE CONTAMINATION DETECTED</div>
      <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
        *Denotes no visible indicators in camera frames. Does not certify chemical cleanliness.
      </div>
    `;
  } else if (spec.aiOutcome === 'Visible contamination detected') {
    verdictBox.style.background = 'rgba(239,68,68,0.12)';
    verdictBox.style.border = '1px solid #EF4444';
    verdictBox.style.color = '#F87171';
    verdictBox.innerHTML = `
      <div style="font-weight:800; font-size:14px;">🔴 VISIBLE CONTAMINATION DETECTED</div>
      <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
        Contaminants identified: Non-PET material or sticky fluid pool requiring diversion/wash.
      </div>
    `;
  } else {
    verdictBox.style.background = 'rgba(250,204,21,0.12)';
    verdictBox.style.border = '1px solid #FACC15';
    verdictBox.style.color = '#FDE047';
    verdictBox.innerHTML = `
      <div style="font-weight:800; font-size:14px;">🟡 UNCERTAIN — REQUIRES HUMAN REVIEW</div>
      <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
        High-contrast specular reflection on bottle crease. Awaiting operator sign-off.
      </div>
    `;
  }
}

function setOperatorDecision(decision) {
  const stamp = document.getElementById('operator-stamp-text');
  if (decision === 'CONFIRM') {
    stamp.textContent = '✓ Confirmed by OP-402';
    stamp.style.color = 'var(--green)';
    showToast("Operator confirmed AI screening outcome");
  } else if (decision === 'OVERRIDE_CONTAM') {
    stamp.textContent = 'Override: Contaminated (OP-402)';
    stamp.style.color = 'var(--red)';
    showToast("Operator override applied: Contaminated");
  } else {
    stamp.textContent = 'Override: Useful (OP-402)';
    stamp.style.color = 'var(--green)';
    showToast("Operator override applied: Useful Recyclable");
  }
}

// ================= STEP 3: MATCH WAREHOUSES & DISPATCH =================
function updateStep3Manifest() {
  const spec = demoSpecimens[currentSampleKey];
  const summary = document.getElementById('manifest-summary-text');
  if (summary) {
    summary.textContent = `1 Inspected Bottle • ${(spec.weight/1000).toFixed(3)} kg Gross Weight • ${spec.aiOutcome}`;
  }
}

function resetToFirstBottle() {
  goToStep(1);
  showToast("Ready to inspect next bottle in batch");
}

// ================= 9. COPY BUTTON =================
function copyBatchId(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(`Copied ${text} to clipboard!`);
  }).catch(() => {
    showToast(`Batch ID: ${text}`);
  });
}

// ================= 17. CONFIRMATION MODALS =================
function openDispatchModal(dealerName) {
  const modal = document.getElementById('confirmation-modal');
  document.getElementById('modal-title').textContent = `Confirm Dispatch to ${dealerName}`;
  document.getElementById('modal-desc').textContent = 
    `Offer Batch BATCH-2026-PET-084 to ${dealerName}? An automated manifest with 4-view visual evidence will be transmitted.`;
  modal.style.display = 'flex';

  modalCallback = () => {
    closeConfirmModal();
    showToast(`✓ Batch offered to ${dealerName}! Carrier dispatch scheduled.`);
  };
}

function closeConfirmModal() {
  document.getElementById('confirmation-modal').style.display = 'none';
  modalCallback = null;
}

function executeModalAction() {
  if (modalCallback) modalCallback();
}

// ================= 13. OPERATOR LOGIN & PASSWORD VISIBILITY =================
function openLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
}

function closeLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}

function togglePasswordVisibility() {
  const pwInput = document.getElementById('operator-password-input');
  if (pwInput.type === 'password') {
    pwInput.type = 'text';
  } else {
    pwInput.type = 'password';
  }
}

function handleOperatorLogin() {
  closeLoginModal();
  showToast("✓ Operator OP-402 authenticated successfully!");
}

// ================= 19. EXPANDABLE FAQ =================
function toggleFaq(element) {
  const item = element.parentElement;
  item.classList.toggle('open');
}

// ================= 20. FLOATING CONTACT DRAWER =================
function toggleContactDrawer() {
  const drawer = document.getElementById('contact-drawer');
  drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
}

function submitSupportForm() {
  toggleContactDrawer();
  showToast("✓ Support ticket logged. Scrap Link agent will contact you shortly.");
}

// ================= 2. COOKIE BANNER =================
function dismissCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.style.display = 'none';
  localStorage.setItem('sl_cookie_accepted', 'true');
}

// Check if cookie accepted
if (localStorage.getItem('sl_cookie_accepted') === 'true') {
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.style.display = 'none';
}

// ================= 3. SITE SEARCH =================
function handleSiteSearch(query) {
  const q = query.toLowerCase().trim();
  const rows = document.querySelectorAll('#full-ledger-tbody tr');
  rows.forEach(r => {
    if (r.textContent.toLowerCase().includes(q)) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

// ================= 15. TOAST NOTIFICATION =================
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3200);
}
