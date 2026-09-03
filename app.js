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
  const bust = (parseFloat(document.getElementById('bust-circ').value) || 0) + (parseFloat(document.getElementById('bust-ease').value) || 0);
  const waist = (parseFloat(document.getElementById('waist-circ').value) || 0) + (parseFloat(document.getElementById('waist-ease').value) || 0);
  const length = parseFloat(document.getElementById('shoulder-waist').value) || 0;

  // Pattern coordinate calculations (Front Quarter Block)
  const scale = 5; // Scale factor for canvas view
  const startX = 50;
  const startY = 50;

  const bustWidth = (bust / 4) * scale;
  const waistWidth = (waist / 4) * scale;
  const blockLength = length * scale;
  const neckWidth = 6.5 * scale;
  const shoulderDrop = 4 * scale;

  // Points mapping
  const pCenterTop = `${startX},${startY}`;
  const pNeck = `${startX + neckWidth},${startY}`;
  const pShoulder = `${startX + neckWidth + 8 * scale},${startY + shoulderDrop}`;
  const pArmpit = `${startX + bustWidth},${startY + (blockLength * 0.45)}`;
  const pWaistCorner = `${startX + waistWidth},${startY + blockLength}`;
  const pCenterBottom = `${startX},${startY + blockLength}`;

  // SVG Path Construction
  const pathD = `
    M ${pCenterTop}
    L ${pNeck}
    L ${pShoulder}
    Q ${startX + bustWidth - 10} ${startY + (blockLength * 0.35)}, ${pArmpit}
    L ${pWaistCorner}
    L ${pCenterBottom}
    Z
  `;

  const canvas = document.getElementById('pattern-canvas');
  canvas.innerHTML = `
    <path d="${pathD}" fill="none" stroke="#2563EB" stroke-width="2" />
    <text x="${startX + 10}" y="${startY + 20}" font-size="12" fill="#6B7280">Center Front</text>
    <circle cx="${startX}" cy="${startY}" r="4" fill="#EF4444" />
  `;
}

function downloadSVG() {
  const svgData = document.getElementById('pattern-canvas').outerHTML;
  const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "bodice-pattern-block.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Initial draw
drawPattern();
