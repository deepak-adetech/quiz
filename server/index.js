/**
 * Express backend server:
 *  - POST /api/generate-results  →  calls Claude API for archetype report
 *  - POST /api/send-email         →  sends report as PDF via Zepto Mail
 *
 * Run (with .env loaded):  node --env-file=.env server/index.js
 * Or simply:               node server/index.js   (dotenv loads .env automatically)
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import leadsRouter from './leads.js';
import { createLead, markEmailSent } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ── Claude API ──────────────────────────────────────
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// ── Zepto Mail ──────────────────────────────────────
const ZEPTO_API_KEY = process.env.ZEPTO_API_KEY || '';
const ZEPTO_API_URL = process.env.ZEPTO_API_URL || 'https://api.zeptomail.in/v1.1/email';
const ZEPTO_FROM_EMAIL = process.env.ZEPTO_FROM_EMAIL || 'noreply@targetedge.in';
const ZEPTO_FROM_NAME = process.env.ZEPTO_FROM_NAME || 'CometLab';

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// ── Lead management CRUD routes ──
app.use('/api', leadsRouter);

// ═══════════════════════════════════════════════════
// POST /api/generate-results
// ═══════════════════════════════════════════════════
app.post('/api/generate-results', async (req, res) => {
  const { result, name, answers } = req.body;

  if (!result || !result.code) {
    return res.status(400).json({ error: 'Missing result data' });
  }

  // ── Persist lead in DB ──
  let leadId = null;
  try {
    const lead = createLead({
      contactForm: answers?.contactForm || {},
      answers: answers || {},
      result,
    });
    leadId = lead.id;
    console.log(`[LEAD CREATED] id=${leadId} email=${lead.email} archetype=${result.code}`);
  } catch (err) {
    console.error('Failed to save lead:', err.message);
  }

  const { code, scores, percentages, archetype } = result;

  if (!CLAUDE_API_KEY) {
    console.warn('CLAUDE_API_KEY not set - using client-side fallback');
    return res.json({ details: null, leadId });
  }

  const prompt = buildClaudePrompt(code, scores, percentages, archetype, name || '');

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Claude API error (${response.status}):`, errText);
      return res.json({ details: null, leadId });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json({ details: parsed, leadId });
    }

    console.error('Failed to parse Claude response as JSON');
    return res.json({ details: null, leadId });
  } catch (err) {
    console.error('Claude API request failed:', err.message);
    return res.json({ details: null, leadId });
  }
});

// ═══════════════════════════════════════════════════
// POST /api/send-email
// Body: { email, name, pdfBase64, archetypeName, archetypeCode, tagline, userInfo }
// ═══════════════════════════════════════════════════
app.post('/api/send-email', async (req, res) => {
  const {
    email,
    name,
    pdfBase64,
    archetypeName,
    archetypeCode,
    tagline,
    userInfo,
    leadId,
  } = req.body;

  if (!email || !pdfBase64) {
    return res.status(400).json({ error: 'Missing email or PDF content' });
  }

  if (!ZEPTO_API_KEY) {
    console.warn('ZEPTO_API_KEY not set - skipping email');
    return res.json({ sent: false, reason: 'email_not_configured' });
  }

  const htmlBody = buildEmailHtml({ name, archetypeName, archetypeCode, tagline });
  const safeName = (name || 'report').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();

  try {
    const response = await fetch(ZEPTO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Zoho-enczapikey ${ZEPTO_API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        from: { address: ZEPTO_FROM_EMAIL, name: ZEPTO_FROM_NAME },
        to: [{ email_address: { address: email, name: name || '' } }],
        subject: `Your Operational Archetype: ${archetypeName} (${archetypeCode})`,
        htmlbody: htmlBody,
        attachments: [
          {
            name: `operational-archetype-${safeName}.pdf`,
            content: pdfBase64,
            mime_type: 'application/pdf',
          },
        ],
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Zepto error:', response.status, responseText);
      return res.status(500).json({
        sent: false,
        error: 'Email provider error',
        status: response.status,
      });
    }

    // Mark lead as emailed in DB
    if (leadId) {
      try { markEmailSent(leadId); } catch (e) { console.error('markEmailSent failed:', e.message); }
    }
    console.log(`[EMAIL SENT] to=${email} archetype=${archetypeName} (${archetypeCode}) leadId=${leadId || 'n/a'}`);

    return res.json({ sent: true });
  } catch (err) {
    console.error('Email send failed:', err.message);
    return res.status(500).json({ sent: false, error: err.message });
  }
});

// ── Health check ────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    claude: !!CLAUDE_API_KEY,
    zepto: !!ZEPTO_API_KEY,
  });
});

// ═══════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════

function buildClaudePrompt(code, scores, percentages, archetype, userName) {
  const greeting = userName ? `for ${userName}'s organization` : 'for this organization';

  return `You are an expert business operations consultant analyzing an organization's Operational Archetype quiz results. Generate a comprehensive, personalized archetype report ${greeting}.

## Quiz Results
- **Archetype Code:** ${code}
- **Archetype Name:** ${archetype.name}
- **Spirit Animal:** ${archetype.animal}
- **Tagline:** "${archetype.tagline}"

## Dimension Scores (0-9 scale, higher = more mature)
- **Execution** (Manual 0 <-> 9 Automated): ${scores.execution}/9 (${percentages.execution}%)
- **Data** (Fragmented 0 <-> 9 Centralized): ${scores.data}/9 (${percentages.data}%)
- **Connection** (Siloed 0 <-> 9 Integrated): ${scores.connection}/9 (${percentages.connection}%)
- **Control** (Reactive 0 <-> 9 Proactive): ${scores.control}/9 (${percentages.control}%)

## Code Meaning
- 1st letter: M = Manual execution, A = Automated execution
- 2nd letter: C = Centralized data, F = Fragmented data
- 3rd letter: S = Siloed teams, I = Integrated teams
- 4th letter: P = Proactive control, R = Reactive control

## Your Task
Generate a detailed archetype report as a JSON object. Be specific, insightful, and actionable. Write as if speaking directly to the business leader. Use concrete examples relevant to their archetype.

Return ONLY a valid JSON object with this exact structure:
{
    "execution_style": "2-3 sentence description of how this organization executes work based on their M/A score",
    "data_approach": "2-3 sentence description of their data management based on C/F score",
    "connection_pattern": "2-3 sentence description of how teams connect based on S/I score",
    "control_posture": "2-3 sentence description of their control approach based on P/R score",
    "cultural_dna": "2-3 sentence description synthesizing all dimensions into a cultural portrait",
    "superpowers": ["strength 1", "strength 2", "strength 3", "strength 4"],
    "superpower_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "kryptonite": ["weakness 1", "weakness 2", "weakness 3", "weakness 4"],
    "kryptonite_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "ideal_starting_points": ["first step", "second step", "third step"],
    "famous_last_words": "A funny, relatable one-liner this archetype would say (in quotes)",
    "real_world_example": "A 2-3 sentence realistic example of a company with this archetype - include industry, size, and core operational challenge",
    "why_animal": "2-3 sentence explanation of why ${archetype.animal} perfectly represents this archetype - use the animal's real traits as metaphors"
}

Be specific, direct, and genuinely honest. Superpowers should feel genuinely positive and specific to this archetype. Kryptonite must be candid and real — name the actual pain points without softening them, as honest feedback is more useful than vague positivity. Starting points should be immediately actionable. Famous last words should make someone laugh because it's so true.`;
}

function buildEmailHtml({ name, archetypeName, archetypeCode, tagline }) {
  const firstName = (name || '').split(' ')[0] || 'there';
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Your Operational Archetype Report</title>
</head>
<body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#1e293b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#7c3aed 100%);padding:32px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.02em;">CometLab</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Operational Archetype Report</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 32px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#475569;">Thanks for taking the Operational Archetype quiz! Your personalized report is ready. Here's your result:</p>

              <div style="background:#f1f5f9;border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
                <div style="font-size:12px;color:#64748b;letter-spacing:0.08em;text-transform:uppercase;font-weight:600;margin-bottom:8px;">Your Archetype</div>
                <div style="font-size:28px;font-weight:800;color:#1e293b;margin-bottom:4px;">${escapeHtml(archetypeName)}</div>
                <div style="display:inline-block;background:#dbeafe;color:#2563eb;padding:4px 12px;border-radius:6px;font-family:'SF Mono',monospace;font-size:12px;font-weight:700;letter-spacing:0.12em;margin-bottom:12px;">${escapeHtml(archetypeCode)}</div>
                <p style="margin:8px 0 0;font-style:italic;color:#64748b;font-size:14px;line-height:1.5;">"${escapeHtml(tagline || '')}"</p>
              </div>

              <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#475569;">
                Your full report is attached as a PDF. It includes:
              </p>
              <ul style="margin:0 0 24px;padding-left:20px;color:#475569;font-size:15px;line-height:1.8;">
                <li>Your complete operational DNA breakdown</li>
                <li>Your 4 biggest <strong>superpowers</strong></li>
                <li>Your 4 blind spots (<strong>kryptonite</strong>)</li>
                <li>A tailored <strong>3-step action plan</strong></li>
                <li>Real-world examples and your spirit animal</li>
              </ul>

              <div style="text-align:center;margin:32px 0;">
                <a href="https://autoworkflows.ai" style="display:inline-block;background:#2563eb;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">Book a Strategy Call &rarr;</a>
              </div>

              <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#475569;">Questions? Just hit reply — we read every response.</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">— The AutoWorkflows.ai Team</p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:24px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;">
              &copy; ${new Date().getFullYear()} CometLab. All rights reserved.<br>
              You received this because you took our Operational Archetype quiz.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Serve React frontend from dist/ ─────────────────
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// SPA fallback — all non-API routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`  Claude API: ${CLAUDE_API_KEY ? 'configured' : 'NOT SET'}`);
  console.log(`  Zepto Mail: ${ZEPTO_API_KEY ? 'configured' : 'NOT SET'}`);
});
