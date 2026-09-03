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
  // Inputs & Body Measurements
  const bust = (parseFloat(document.getElementById('bust-circ').value) || 88) + (parseFloat(document.getElementById('bust-ease').value) || 8);
  const waist = (parseFloat(document.getElementById('waist-circ').value) || 70) + (parseFloat(document.getElementById('waist-ease').value) || 4);
  const length = parseFloat(document.getElementById('shoulder-waist').value) || 42;

  // Viewport Scale Factor (1 cm = 2.5 SVG pixels to fit on mobile screens)
  const scale = 2.5; 

  // Core Calculations
  const quarterBust = (bust / 4) * scale;
  const quarterWaist = (waist / 4) * scale;
  const totalHeight = length * scale;
  
  const neckWidth = ((bust / 16) + 1.5) * scale;
  const frontNeckDepth = ((bust / 16) + 2) * scale;
  const backNeckDepth = 2.5 * scale;
  
  const yShoulderSlope = 4 * scale;
  const armscyeDepth = ((bust / 8) + 12.5) * scale;
  const armscyeCenterY = (yShoulderSlope + armscyeDepth) / 2;
  const shoulderLength = 12.5 * scale;

  // -------------------------------------------------------------
  // 1. BACK BODICE DRAFT (Left)
  // -------------------------------------------------------------
  const bX = 20; 
  const bY = 30;  

  const bHighNeck = { x: bX + neckWidth, y: bY };
  const bLowNeck = { x: bX, y: bY + backNeckDepth };
  const bShoulderEnd = { x: bX + neckWidth + shoulderLength, y: bY + yShoulderSlope };
  const bArmpit = { x: bX + quarterBust, y: bY + armscyeDepth };
  const bWaistSide = { x: bX + quarterWaist + (2.5 * scale), y: bY + totalHeight };
  const bWaistCenter = { x: bX, y: bY + totalHeight };

  const bDartCenterX = bX + (quarterWaist * 0.45);
  const bDartTipY = bY + armscyeDepth + (3 * scale);
  const bDartWidth = 1.25 * scale;

  const backPath = `
    M ${bLowNeck.x} ${bLowNeck.y}
    Q ${bX + (neckWidth * 0.4)} ${bY + backNeckDepth}, ${bHighNeck.x} ${bHighNeck.y}
    L ${bShoulderEnd.x} ${bShoulderEnd.y}
    C ${bShoulderEnd.x + (1.5 * scale)} ${bShoulderEnd.y + (5 * scale)}, ${bArmpit.x - (1.5 * scale)} ${bY + armscyeDepth - (3 * scale)}, ${bArmpit.x} ${bArmpit.y}
    L ${bWaistSide.x} ${bWaistSide.y}
    L ${bDartCenterX + bDartWidth} ${bWaistCenter.y}
    L ${bDartCenterX} ${bDartTipY}
    L ${bDartCenterX - bDartWidth} ${bWaistCenter.y}
    L ${bWaistCenter.x} ${bWaistCenter.y}
    Z
  `;

  // -------------------------------------------------------------
  // 2. FRONT BODICE DRAFT (Center)
  // -------------------------------------------------------------
  const fX = 240; 
  const fY = 30;  

  const fHighNeck = { x: fX - neckWidth, y: fY };
  const fLowNeck = { x: fX, y: fY + frontNeckDepth };
  const fShoulderEnd = { x: fX - neckWidth - shoulderLength, y: fY + yShoulderSlope };
  const fArmpit = { x: fX - quarterBust, y: fY + armscyeDepth };
  const fWaistSide = { x: fX - quarterWaist - (3 * scale), y: fY + totalHeight };
  const fWaistCenter = { x: fX, y: fY + totalHeight };

  const fBustApexX = fX - (quarterBust * 0.48);
  const fBustApexY = fY + armscyeDepth + (2.5 * scale);
  const fDartTipY = fBustApexY + (2.5 * scale);
  const fDartWidth = 1.5 * scale;

  const frontPath = `
    M ${fLowNeck.x} ${fLowNeck.y}
    Q ${fX - neckWidth} ${fY + frontNeckDepth}, ${fHighNeck.x} ${fHighNeck.y}
    L ${fShoulderEnd.x} ${fShoulderEnd.y}
    C ${fShoulderEnd.x - (1.5 * scale)} ${fShoulderEnd.y + (4 * scale)}, ${fArmpit.x + (2 * scale)} ${fY + armscyeDepth - (3 * scale)}, ${fArmpit.x} ${fArmpit.y}
    L ${fWaistSide.x} ${fWaistSide.y}
    L ${fBustApexX - fDartWidth} ${fWaistCenter.y}
    L ${fBustApexX} ${fDartTipY}
    L ${fBustApexX + fDartWidth} ${fWaistCenter.y}
    L ${fWaistCenter.x} ${fWaistCenter.y}
    Z
  `;

  // -------------------------------------------------------------
  // 3. SLEEVE DRAFT (Right)
  // -------------------------------------------------------------
  const sX = 280;
  const sY = 30;
  
  const sleeveCapHeight = (armscyeDepth * 0.65);
  const sleeveWidth = (quarterBust * 1.5);
  const sleeveLength = 22 * scale;
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

  // SVG Render Output
  const canvas = document.getElementById('pattern-canvas');
  canvas.setAttribute('width', '100%');
  canvas.setAttribute('height', '100%');
  canvas.setAttribute('viewBox', '0 0 450 250');
  
  canvas.innerHTML = `
    <line x1="10" y1="${fY}" x2="250" y2="${fY}" stroke="#E2E8F0" stroke-dasharray="2,2" />
    <line x1="10" y1="${fY + frontNeckDepth}" x2="250" y2="${fY + frontNeckDepth}" stroke="#E2E8F0" stroke-dasharray="2,2" />
    <line x1="10" y1="${fY + armscyeDepth}" x2="250" y2="${fY + armscyeDepth}" stroke="#E2E8F0" stroke-dasharray="2,2" />
    <line x1="10" y1="${fY + totalHeight}" x2="250" y2="${fY + totalHeight}" stroke="#E2E8F0" stroke-dasharray="2,2" />

    <path d="${backPath}" fill="none" stroke="#059669" stroke-width="2" />
    <text x="${bX + 5}" y="${bY + 15}" font-size="9" font-weight="bold" fill="#059669">BACK</text>

    <path d="${frontPath}" fill="none" stroke="#2563EB" stroke-width="2" />
    <text x="${fX - 45}" y="${fY + 15}" font-size="9" font-weight="bold" fill="#2563EB">FRONT</text>
    <circle cx="${fBustApexX}" cy="${fBustApexY}" r="2" fill="#EF4444" />

    <path d="${sleevePath}" fill="none" stroke="#D97706" stroke-width="2" />
    <line x1="${sX + (sleeveWidth / 2)}" y1="${sY}" x2="${sX + (sleeveWidth / 2)}" y2="${cuffY}" stroke="#F59E0B" stroke-dasharray="2" />
    <text x="${sX + (sleeveWidth / 2) - 15}" y="${bicepY + 15}" font-size="9" font-weight="bold" fill="#D97706">SLEEVE</text>
  `;
}

// Initial Run
drawPattern();
