/**
 * Generates a professional PDF report for the Operational Archetype quiz.
 * jsPDF is loaded dynamically to avoid bloating the initial bundle.
 *
 * @param {Object} params
 * @param {string}  params.code         - 4-letter archetype code
 * @param {Object}  params.percentages  - { execution, data, connection, control }
 * @param {Object}  params.archetype    - { name, emoji, animal, animalEmoji, tagline }
 * @param {Object}  params.details      - Claude-generated report details
 * @param {Object}  params.user         - { name, email, phone, company, role, teamSize }
 */
// jsPDF's standard Helvetica font is encoded in WinAnsi (cp1252).
// Anything outside that range — emoji, CJK, most arrows/symbols — silently
// renders as blank boxes. Sanitize all dynamic text before drawing.
const CP1252_EXTRAS = new Set([
  0x20AC, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 0x02C6,
  0x2030, 0x0160, 0x2039, 0x0152, 0x017D, 0x2018, 0x2019, 0x201C,
  0x201D, 0x2022, 0x2013, 0x2014, 0x02DC, 0x2122, 0x0161, 0x203A,
  0x0153, 0x017E, 0x0178,
]);

const ASCII_FALLBACK = {
  '‘': "'", '’': "'", '‚': ',', '‛': "'",
  '“': '"', '”': '"', '„': '"', '‟': '"',
  '–': '-', '—': '-', '−': '-', '­': '',
  '…': '...', ' ': ' ', '​': '', '‌': '', '‍': '',
  '﻿': '', '→': '->', '←': '<-', '↔': '<->',
  '✓': 'v', '✔': 'v', '✗': 'x', '✘': 'x',
  '★': '*', '☆': '*', '⚠': '!', '️': '',
};

function pdfSafe(text) {
  if (text == null) return '';
  const s = String(text);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const code = s.charCodeAt(i);
    // Surrogate pair = emoji from astral plane (e.g. 🦉, 📊). Drop both halves.
    if (code >= 0xD800 && code <= 0xDBFF) { i++; continue; }
    if (code <= 0xFF) { out += s[i]; continue; }
    if (CP1252_EXTRAS.has(code)) { out += s[i]; continue; }
    const fallback = ASCII_FALLBACK[s[i]];
    if (fallback != null) { out += fallback; continue; }
    // Drop anything else (misc symbols, dingbats, CJK, etc.).
  }
  return out.replace(/[ \t]+/g, ' ').replace(/\s+\n/g, '\n').trim();
}

export async function generatePdf({ code, percentages, archetype: arch, details: d, user }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const MARGIN = 20;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  // ── Colors (cream / navy palette to match the web UI) ──
  const PRIMARY = [30, 42, 58];        // #1E2A3A navy
  const PRIMARY_LIGHT = [232, 223, 201]; // #E8DFC9 warm beige
  const GREEN = [5, 122, 85];          // #057A55 deeper green for cream bg
  const GREEN_BG = [232, 240, 226];    // #E8F0E2 muted sage
  const RED = [180, 35, 24];           // #B42318
  const RED_BG = [250, 232, 228];      // #FAE8E4
  const AMBER_BG = [245, 239, 228];    // #F5EFE4 warm cream
  const TEXT = [30, 42, 58];           // #1E2A3A
  const TEXT_SEC = [91, 106, 128];     // #5B6A80
  const TEXT_MUTED = [122, 134, 154];  // #7A869A
  const BORDER = [236, 228, 211];      // #ECE4D3
  const WHITE = [255, 255, 255];

  // ── Helpers ──────────────────────────────────────
  function setColor(rgb) {
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  }
  function setFill(rgb) {
    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  }
  function setDraw(rgb) {
    doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  }

  // All text drawing routes through these so emojis / smart quotes never reach jsPDF.
  function drawText(text, x, drawY, opts) {
    doc.text(pdfSafe(text), x, drawY, opts);
  }

  function addWrappedText(text, x, startY, maxWidth, lineHeight) {
    const lines = doc.splitTextToSize(pdfSafe(text), maxWidth);
    lines.forEach((line, i) => {
      doc.text(line, x, startY + i * lineHeight);
    });
    return startY + lines.length * lineHeight;
  }

  function checkPageBreak(needed) {
    if (y + needed > 280) {
      doc.addPage();
      y = 20;
    }
  }

  function drawHorizontalBar(x, barY, width, pct, height) {
    // Track background
    setFill(BORDER);
    doc.roundedRect(x, barY, width, height, height / 2, height / 2, 'F');
    // Fill
    if (pct > 0) {
      setFill(PRIMARY);
      const fillW = Math.max(height, (pct / 100) * width);
      doc.roundedRect(x, barY, fillW, height, height / 2, height / 2, 'F');
    }
    // Marker circle
    const markerX = x + (pct / 100) * width;
    setFill(WHITE);
    setDraw(PRIMARY);
    doc.setLineWidth(0.8);
    doc.circle(markerX, barY + height / 2, 3, 'FD');
  }

  // ═══════════════════════════════════════════════════
  // PAGE 1: COVER / HERO
  // ═══════════════════════════════════════════════════

  // Top accent bar
  setFill(PRIMARY);
  doc.rect(0, 0, W, 6, 'F');

  y = 30;

  // Brand
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(PRIMARY);
  drawText('AutoWorkflows.ai', W / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(8);
  setColor(TEXT_MUTED);
  doc.setFont('helvetica', 'normal');
  drawText('OPERATIONAL ARCHETYPE REPORT', W / 2, y, { align: 'center' });
  y += 20;

  // Archetype name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  setColor(TEXT);
  drawText(arch.name.toUpperCase(), W / 2, y, { align: 'center' });
  y += 10;

  // Code badge
  setFill(PRIMARY_LIGHT);
  const codeW = 30;
  doc.roundedRect(W / 2 - codeW / 2, y - 4, codeW, 10, 3, 3, 'F');
  doc.setFontSize(11);
  setColor(PRIMARY);
  doc.setFont('helvetica', 'bold');
  drawText(code, W / 2, y + 3, { align: 'center' });
  y += 16;

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  setColor(TEXT_SEC);
  const taglineLines = doc.splitTextToSize(pdfSafe(`"${arch.tagline}"`), CONTENT_W - 20);
  taglineLines.forEach((line) => {
    doc.text(line, W / 2, y, { align: 'center' });
    y += 6;
  });
  y += 8;

  // Prepared for
  if (user.name) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(TEXT_MUTED);
    drawText('PREPARED FOR', W / 2, y, { align: 'center' });
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    setColor(TEXT);
    drawText(user.name, W / 2, y, { align: 'center' });
    y += 5;
    if (user.company) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      setColor(TEXT_SEC);
      const roleLine = [user.role, user.company].filter(Boolean).join(' at ');
      drawText(roleLine, W / 2, y, { align: 'center' });
      y += 5;
    }
    if (user.teamSize) {
      doc.setFontSize(9);
      drawText(`Team size: ${user.teamSize}`, W / 2, y, { align: 'center' });
      y += 5;
    }
  }
  y += 10;

  // ── Dimension Scores ──
  const dimSectionY = y;
  setFill(AMBER_BG);
  doc.roundedRect(MARGIN, dimSectionY, CONTENT_W, 72, 4, 4, 'F');
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, dimSectionY, CONTENT_W, 72, 4, 4, 'S');

  y = dimSectionY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(TEXT);
  drawText('Your Operational DNA', W / 2, y, { align: 'center' });
  y += 10;

  const dims = [
    { label: 'Execution', low: 'Manual', high: 'Automated', pct: percentages.execution },
    { label: 'Data', low: 'Fragmented', high: 'Centralized', pct: percentages.data },
    { label: 'Connection', low: 'Siloed', high: 'Integrated', pct: percentages.connection },
    { label: 'Control', low: 'Reactive', high: 'Proactive', pct: percentages.control },
  ];

  dims.forEach((dim) => {
    const barX = MARGIN + 30;
    const barW = CONTENT_W - 70;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    setColor(TEXT_MUTED);
    drawText(dim.low, barX - 2, y - 1, { align: 'right' });
    drawText(dim.high, barX + barW + 2, y - 1);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    setColor(TEXT);
    drawText(dim.label.toUpperCase(), W / 2, y - 1, { align: 'center' });

    drawHorizontalBar(barX, y + 1, barW, dim.pct, 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(PRIMARY);
    drawText(`${dim.pct}%`, barX + barW + 14, y + 4, { align: 'right' });

    y += 13;
  });

  y = dimSectionY + 72 + 12;

  // ═══════════════════════════════════════════════════
  // CHARACTERISTICS
  // ═══════════════════════════════════════════════════
  checkPageBreak(60);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setColor(TEXT);
  drawText('Characteristics', MARGIN, y);
  y += 8;

  const characteristics = [
    { label: 'EXECUTION STYLE', text: d.execution_style },
    { label: 'DATA APPROACH', text: d.data_approach },
    { label: 'CONNECTION PATTERN', text: d.connection_pattern },
    { label: 'CONTROL POSTURE', text: d.control_posture },
    { label: 'CULTURAL DNA', text: d.cultural_dna },
  ];

  characteristics.forEach((c) => {
    checkPageBreak(25);

    // Left border accent
    setFill(PRIMARY);
    doc.rect(MARGIN, y - 3, 1.2, 14, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    setColor(TEXT_SEC);
    drawText(c.label, MARGIN + 4, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setColor(TEXT);
    y = addWrappedText(c.text, MARGIN + 4, y, CONTENT_W - 8, 4.2);
    y += 5;
  });

  // ═══════════════════════════════════════════════════
  // PAGE 2: SUPERPOWERS + KRYPTONITE
  // ═══════════════════════════════════════════════════
  doc.addPage();
  y = 20;

  // Top accent bar
  setFill(PRIMARY);
  doc.rect(0, 0, W, 3, 'F');

  // ── Superpowers ──
  // Box height has to flex with the number of items so longer responses don't clip.
  const spLineH = 7.5;
  const spBoxH = Math.max(52, 18 + d.superpowers.length * spLineH);
  setFill(GREEN_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, spBoxH, 4, 4, 'F');
  setDraw([197, 215, 188]);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, spBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(GREEN);
  drawText('Superpowers', MARGIN + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT);
  d.superpowers.forEach((s, i) => {
    drawText(`\u2022  ${s}`, MARGIN + 10, y + 20 + i * spLineH);
  });

  y += spBoxH + 10;

  // ── Kryptonite ──
  const kLineH = 7.5;
  const kBoxH = Math.max(52, 18 + d.kryptonite.length * kLineH);
  setFill(RED_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, kBoxH, 4, 4, 'F');
  setDraw([225, 180, 170]);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, kBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(RED);
  drawText('Kryptonite', MARGIN + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT);
  d.kryptonite.forEach((k, i) => {
    drawText(`\u2022  ${k}`, MARGIN + 10, y + 20 + i * kLineH);
  });

  y += kBoxH + 14;

  // ── Ideal Starting Points ──
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(TEXT);
  drawText('Ideal Starting Point', MARGIN, y);
  y += 10;

  d.ideal_starting_points.forEach((step, i) => {
    checkPageBreak(12);
    // Number circle
    setFill(PRIMARY);
    doc.circle(MARGIN + 5, y - 1, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(WHITE);
    drawText(String(i + 1), MARGIN + 5, y + 0.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setColor(TEXT);
    y = addWrappedText(step, MARGIN + 14, y, CONTENT_W - 18, 5);
    y += 5;
  });

  y += 8;

  // ── Famous Last Words ──
  checkPageBreak(30);
  setFill(AMBER_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 4, 4, 'F');
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(TEXT_SEC);
  drawText('FAMOUS LAST WORDS', MARGIN + 8, y + 8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  setColor(TEXT);
  const flwLines = doc.splitTextToSize(pdfSafe(d.famous_last_words), CONTENT_W - 16);
  flwLines.forEach((line, i) => {
    doc.text(line, MARGIN + 8, y + 16 + i * 5);
  });

  y += 34;

  // ── Real World Example ──
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(TEXT);
  drawText('Real World Example', MARGIN, y);
  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT_SEC);
  y = addWrappedText(d.real_world_example, MARGIN, y, CONTENT_W, 4.5);
  y += 12;

  // ── Why This Spirit Animal ──
  checkPageBreak(45);
  setFill(AMBER_BG);
  const animalBoxStart = y;
  const animalLines = doc.splitTextToSize(pdfSafe(d.why_animal), CONTENT_W - 16);
  const animalBoxH = 18 + animalLines.length * 4.5;
  doc.roundedRect(MARGIN, y, CONTENT_W, animalBoxH, 4, 4, 'F');
  setDraw(BORDER);
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, animalBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setColor(TEXT);
  // Spirit-animal emoji intentionally dropped: jsPDF Helvetica can't render astral chars.
  drawText(`Why ${arch.animal}?`, MARGIN + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT);
  animalLines.forEach((line, i) => {
    doc.text(line, MARGIN + 8, y + 18 + i * 4.5);
  });
  y = animalBoxStart + animalBoxH + 15;

  // ── CTA Footer ──
  checkPageBreak(35);
  setFill(PRIMARY);
  doc.roundedRect(MARGIN, y, CONTENT_W, 30, 4, 4, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  setColor(WHITE);
  drawText('Ready to Transform Your Operations?', W / 2, y + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  drawText('Book a free strategy call at autoworkflows.ai', W / 2, y + 22, { align: 'center' });

  // ── Footer on every page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    drawText(`AutoWorkflows.ai  |  Operational Archetype Report  |  Page ${p} of ${totalPages}`, W / 2, 290, { align: 'center' });
  }

  return doc;
}

/**
 * Generate and trigger download of the PDF
 */
export async function downloadPdf(results) {
  const doc = await generatePdf(results);
  const name = results.user?.name
    ? results.user.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    : 'report';
  doc.save(`operational-archetype-${name}.pdf`);
}

/**
 * Generate PDF and return as base64 string (for email attachments)
 */
export async function generatePdfBase64(results) {
  const doc = await generatePdf(results);
  // jsPDF datauristring format: "data:application/pdf;filename=...;base64,XXXXX"
  const dataUri = doc.output('datauristring');
  const commaIdx = dataUri.indexOf(',');
  return commaIdx > -1 ? dataUri.slice(commaIdx + 1) : dataUri;
}
