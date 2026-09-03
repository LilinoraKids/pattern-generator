let currentUnit = 'cm';

function setUnit(unit) {
  if (currentUnit === unit) return;
  currentUnit = unit;
  
  document.getElementById('btn-cm').className = unit === 'cm' 
    ? "px-4 py-1.5 text-sm font-semibold rounded bg-black text-white" 
    : "px-4 py-1.5 text-sm font-semibold rounded bg-gray-100 text-gray-700";
    
  document.getElementById('btn-inch').className = unit === 'inch' 
    ? "px-4 py-1.5 text-sm font-semibold rounded bg-black text-white" 
    : "px-4 py-1.5 text-sm font-semibold rounded bg-gray-100 text-gray-700";

  document.querySelectorAll('.unit-label').forEach(el => el.textContent = unit);
  drawPattern();
}

function drawPattern() {
  // Inputs & Measurements
  const bust = (parseFloat(document.getElementById('bust-circ').value) || 88) + (parseFloat(document.getElementById('bust-ease').value) || 8);
  const waist = (parseFloat(document.getElementById('waist-circ').value) || 70) + (parseFloat(document.getElementById('waist-ease').value) || 4);
  const length = parseFloat(document.getElementById('shoulder-waist').value) || 42;

  // Standard Scale for Viewport (1 cm = 3.2 SVG pixels)
  const scale = 3.2; 
  
  // Calculated Core Dimensions
  const quarterBust = (bust / 4) * scale;
  const quarterWaist = (waist / 4) * scale;
  const totalHeight = length * scale;
  
  const neckWidth = ((bust / 16) + 1.5) * scale;
  const frontNeckDepth = ((bust / 16) + 2) * scale;
  const backNeckDepth = 2.5 * scale;
  const armscyeDepth = ((bust / 8) + 12) * scale;
  const shoulderDrop = 4 * scale;
  const shoulderLength = 12.5 * scale;

  // -------------------------------------------------------------
  // 1. BACK BODICE DRAFT (Left)
  // -------------------------------------------------------------
  const bX = 30;
  const bY = 40;

  const bHighNeck = { x: bX + neckWidth, y: bY };
  const bLowNeck = { x: bX, y: bY + backNeckDepth };
  const bShoulder = { x: bX + neckWidth + shoulderLength, y: bY + shoulderDrop };
  const bArmpit = { x: bX + quarterBust, y: bY + armscyeDepth };
  const bWaistSide = { x: bX + quarterWaist + (2.5 * scale), y: bY + totalHeight }; // Includes waist dart allowance
  const bWaistCenter = { x: bX, y: bY + totalHeight };

  // Back Waist Dart
  const bDartCenter = bX + (quarterWaist * 0.45);
  const bDartWidth = 2 * scale;
  const bDartHeight = (armscyeDepth - 3 * scale);

  const backPath = `
    M ${bLowNeck.x} ${bLowNeck.y}
    Q ${bX + (neckWidth * 0.4)} ${bY + backNeckDepth}, ${bHighNeck.x} ${bHighNeck.y}
    L ${bShoulder.x} ${bShoulder.y}
    C ${bShoulder.x + (1.5 * scale)} ${bShoulder.y + (7 * scale)}, ${bX + quarterBust - (1 * scale)} ${bY + armscyeDepth - (4 * scale)}, ${bArmpit.x} ${bArmpit.y}
    L ${bWaistSide.x} ${bWaistSide.y}
    L ${bDartCenter + bDartWidth} ${bWaistCenter.y}
    L ${bDartCenter} ${bY + armscyeDepth + bDartHeight}
    L ${bDartCenter - bDartWidth} ${bWaistCenter.y}
    L ${bWaistCenter.x} ${bWaistCenter.y}
    Z
  `;

  // -------------------------------------------------------------
  // 2. FRONT BODICE DRAFT (Center)
  // -------------------------------------------------------------
  const fX = 310;
  const fY = 40;

  const fHighNeck = { x: fX - neckWidth, y: fY };
  const fLowNeck = { x: fX, y: fY + frontNeckDepth };
  const fShoulder = { x: fX - neckWidth - shoulderLength, y: fY + shoulderDrop };
  const fArmpit = { x: fX - quarterBust, y: fX - quarterBust, y: fY + armscyeDepth };
  const fWaistSide = { x: fX - quarterWaist - (3 * scale), y: fY + totalHeight };
  const fWaistCenter = { x: fX, y: fY + totalHeight };

  // Front Waist Dart
  const fDartCenter = fX - (quarterWaist * 0.45);
  const fDartWidth = 2.5 * scale;
  const fDartHeight = (armscyeDepth - 2 * scale);

  const frontPath = `
    M ${fLowNeck.x} ${fLowNeck.y}
    Q ${fX - neckWidth} ${fY + frontNeckDepth}, ${fHighNeck.x} ${fHighNeck.y}
    L ${fShoulder.x} ${fShoulder.y}
    C ${fShoulder.x - (2 * scale)} ${fShoulder.y + (6 * scale)}, ${fX - quarterBust + (2.5 * scale)} ${fY + armscyeDepth - (5 * scale)}, ${fArmpit.x} ${fY + armscyeDepth}
    L ${fWaistSide.x} ${fWaistSide.y}
    L ${fDartCenter - fDartWidth} ${fWaistCenter.y}
    L ${fDartCenter} ${fY + armscyeDepth + fDartHeight}
    L ${fDartCenter + fDartWidth} ${fWaistCenter.y}
    L ${fWaistCenter.x} ${fWaistCenter.y}
    Z
  `;

  // -------------------------------------------------------------
  // 3. SLEEVE DRAFT (Right)
  // -------------------------------------------------------------
  const sX = 420;
  const sY = 40;
  
  const sleeveCapHeight = (armscyeDepth * 0.65);
  const sleeveWidth = (quarterBust * 1.5);
  const sleeveLength = 22 * scale; // Standard short sleeve length
  const bicepY = sY + sleeveCapHeight;
  const cuffY = sY + sleeveLength;

  const sleevePath = `
    M ${sX + (sleeveWidth / 2)} ${sY}
    C ${sX + (sleeveWidth * 0.8)} ${sY}, ${sX + sleeveWidth} ${bicepY - (3 * scale)}, ${sX + sleeveWidth} ${bicepY}
    L ${sX + sleeveWidth - (2 * scale)} ${cuffY}
    L ${sX + (2 * scale)} ${cuffY}
    L ${sX} ${bicepY}
    C ${sX} ${bicepY - (3 * scale)}, ${sX + (sleeveWidth * 0.2)} ${sY}, ${sX + (sleeveWidth / 2)} ${sY}
    Z
  `;

  // Render SVG Elements
  const canvas = document.getElementById('pattern-canvas');
  canvas.setAttribute('viewBox', '0 0 600 500');
  canvas.innerHTML = `
    <!-- BACK BODICE -->
    <path d="${backPath}" fill="none" stroke="#059669" stroke-width="2" />
    <text x="${bX + 10}" y="${bY + (totalHeight / 2)}" font-size="10" fill="#059669" writing-mode="tb">Center Back</text>
    <text x="${bX + 15}" y="${bY + 18}" font-size="11" font-weight="bold" fill="#059669">BACK</text>

    <!-- FRONT BODICE -->
    <path d="${frontPath}" fill="none" stroke="#2563EB" stroke-width="2" />
    <text x="${fX - 20}" y="${fY + (totalHeight / 2)}" font-size="10" fill="#2563EB" writing-mode="tb">Center Front</text>
    <text x="${fX - 55}" y="${fY + 18}" font-size="11" font-weight="bold" fill="#2563EB">FRONT</text>

    <!-- SLEEVE -->
    <path d="${sleevePath}" fill="none" stroke="#D97706" stroke-width="2" />
    <line x1="${sX + (sleeveWidth / 2)}" y1="${sY}" x2="${sX + (sleeveWidth / 2)}" y2="${cuffY}" stroke="#F59E0B" stroke-dasharray="3" />
    <text x="${sX + (sleeveWidth / 2) - 20}" y="${bicepY + 20}" font-size="11" font-weight="bold" fill="#D97706">SLEEVE</text>
  `;
}

// Initial Call
drawPattern();
