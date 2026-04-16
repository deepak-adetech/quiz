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
export async function generatePdf({ code, percentages, archetype: arch, details: d, user }) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const MARGIN = 20;
  const CONTENT_W = W - MARGIN * 2;
  let y = 0;

  // ── Colors ───────────────────────────────────────
  const PRIMARY = [37, 99, 235];       // #2563EB
  const PRIMARY_LIGHT = [219, 234, 254]; // #DBEAFE
  const GREEN = [16, 185, 129];        // #10B981
  const GREEN_BG = [240, 253, 244];    // #F0FDF4
  const RED = [239, 68, 68];           // #EF4444
  const RED_BG = [254, 242, 242];      // #FEF2F2
  const AMBER_BG = [255, 247, 237];    // #FFF7ED
  const TEXT = [30, 41, 59];           // #1E293B
  const TEXT_SEC = [100, 116, 139];    // #64748B
  const TEXT_MUTED = [148, 163, 184];  // #94A3B8
  const BORDER = [226, 232, 240];      // #E2E8F0
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

  function addWrappedText(text, x, startY, maxWidth, lineHeight) {
    const lines = doc.splitTextToSize(text, maxWidth);
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
  doc.text('AutoWorkflows.ai', W / 2, y, { align: 'center' });
  y += 5;
  doc.setFontSize(8);
  setColor(TEXT_MUTED);
  doc.setFont('helvetica', 'normal');
  doc.text('OPERATIONAL ARCHETYPE REPORT', W / 2, y, { align: 'center' });
  y += 20;

  // Archetype name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  setColor(TEXT);
  doc.text(arch.name.toUpperCase(), W / 2, y, { align: 'center' });
  y += 10;

  // Code badge
  setFill(PRIMARY_LIGHT);
  const codeW = 30;
  doc.roundedRect(W / 2 - codeW / 2, y - 4, codeW, 10, 3, 3, 'F');
  doc.setFontSize(11);
  setColor(PRIMARY);
  doc.setFont('helvetica', 'bold');
  doc.text(code, W / 2, y + 3, { align: 'center' });
  y += 16;

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(12);
  setColor(TEXT_SEC);
  const taglineLines = doc.splitTextToSize(`"${arch.tagline}"`, CONTENT_W - 20);
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
    doc.text('PREPARED FOR', W / 2, y, { align: 'center' });
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    setColor(TEXT);
    doc.text(user.name, W / 2, y, { align: 'center' });
    y += 5;
    if (user.company) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      setColor(TEXT_SEC);
      const roleLine = [user.role, user.company].filter(Boolean).join(' at ');
      doc.text(roleLine, W / 2, y, { align: 'center' });
      y += 5;
    }
    if (user.teamSize) {
      doc.setFontSize(9);
      doc.text(`Team size: ${user.teamSize}`, W / 2, y, { align: 'center' });
      y += 5;
    }
  }
  y += 10;

  // ── Dimension Scores ──
  const dimSectionY = y;
  setFill([248, 250, 252]); // bg
  doc.roundedRect(MARGIN, dimSectionY, CONTENT_W, 72, 4, 4, 'F');
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, dimSectionY, CONTENT_W, 72, 4, 4, 'S');

  y = dimSectionY + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(TEXT);
  doc.text('Your Operational DNA', W / 2, y, { align: 'center' });
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
    doc.text(dim.low, barX - 2, y - 1, { align: 'right' });
    doc.text(dim.high, barX + barW + 2, y - 1);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    setColor(TEXT);
    doc.text(dim.label.toUpperCase(), W / 2, y - 1, { align: 'center' });

    drawHorizontalBar(barX, y + 1, barW, dim.pct, 3.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(PRIMARY);
    doc.text(`${dim.pct}%`, barX + barW + 14, y + 4, { align: 'right' });

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
  doc.text('Characteristics', MARGIN, y);
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
    setFill(BORDER);
    doc.rect(MARGIN, y - 3, 1.2, 14, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    setColor(TEXT_SEC);
    doc.text(c.label, MARGIN + 4, y);
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
  const spBoxH = 52;
  setFill(GREEN_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, spBoxH, 4, 4, 'F');
  setDraw([187, 247, 208]); // green border
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, spBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(GREEN);
  doc.text('Superpowers', MARGIN + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT);
  d.superpowers.forEach((s, i) => {
    const emoji = d.superpower_emojis?.[i] || '\u2714';
    doc.text(`${emoji}  ${s}`, MARGIN + 10, y + 20 + i * 7.5);
  });

  y += spBoxH + 10;

  // ── Kryptonite ──
  const kBoxH = 52;
  setFill(RED_BG);
  doc.roundedRect(MARGIN, y, CONTENT_W, kBoxH, 4, 4, 'F');
  setDraw([254, 202, 202]); // red border
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, kBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(RED);
  doc.text('Kryptonite', MARGIN + 8, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  setColor(TEXT);
  d.kryptonite.forEach((k, i) => {
    const emoji = d.kryptonite_emojis?.[i] || '\u274C';
    doc.text(`${emoji}  ${k}`, MARGIN + 10, y + 20 + i * 7.5);
  });

  y += kBoxH + 14;

  // ── Ideal Starting Points ──
  checkPageBreak(50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  setColor(TEXT);
  doc.text('Ideal Starting Point', MARGIN, y);
  y += 10;

  d.ideal_starting_points.forEach((step, i) => {
    checkPageBreak(12);
    // Number circle
    setFill(GREEN);
    doc.circle(MARGIN + 5, y - 1, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setColor(WHITE);
    doc.text(String(i + 1), MARGIN + 5, y + 0.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    setColor(TEXT);
    y = addWrappedText(step, MARGIN + 14, y, CONTENT_W - 18, 5);
    y += 5;
  });

  y += 8;

  // ── Famous Last Words ──
  checkPageBreak(30);
  setFill([248, 250, 252]);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 4, 4, 'F');
  setDraw(BORDER);
  doc.setLineWidth(0.3);
  doc.roundedRect(MARGIN, y, CONTENT_W, 24, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setColor(TEXT_SEC);
  doc.text('FAMOUS LAST WORDS', MARGIN + 8, y + 8);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  setColor(TEXT);
  const flwLines = doc.splitTextToSize(d.famous_last_words, CONTENT_W - 16);
  flwLines.forEach((line, i) => {
    doc.text(line, MARGIN + 8, y + 16 + i * 5);
  });

  y += 34;

  // ── Real World Example ──
  checkPageBreak(35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setColor(TEXT);
  doc.text('Real World Example', MARGIN, y);
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
  const animalText = d.why_animal;
  const animalLines = doc.splitTextToSize(animalText, CONTENT_W - 16);
  const animalBoxH = 18 + animalLines.length * 4.5;
  doc.roundedRect(MARGIN, y, CONTENT_W, animalBoxH, 4, 4, 'F');
  setDraw([253, 230, 138]); // amber border
  doc.setLineWidth(0.4);
  doc.roundedRect(MARGIN, y, CONTENT_W, animalBoxH, 4, 4, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  setColor(TEXT);
  doc.text(`${arch.animalEmoji}  Why ${arch.animal}?`, MARGIN + 8, y + 10);

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
  doc.text('Ready to Transform Your Operations?', W / 2, y + 12, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Book a free strategy call at autoworkflows.ai', W / 2, y + 22, { align: 'center' });

  // ── Footer on every page ──
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(TEXT_MUTED[0], TEXT_MUTED[1], TEXT_MUTED[2]);
    doc.text(`AutoWorkflows.ai  |  Operational Archetype Report  |  Page ${p} of ${totalPages}`, W / 2, 290, { align: 'center' });
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
