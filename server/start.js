/**
 * POST /api/start  — handles the /start intake form submission.
 * Saves to DB (via leads table) and syncs to Twenty CRM.
 */

import { Router } from 'express';
import { syncLeadToCRM } from './crm.js';

const router = Router();

router.post('/start', async (req, res) => {
  const {
    situation,   // step 1: role/situation choice
    aiJourney,   // step 2: AI journey stage
    problem,     // step 3: problem description (free text)
    timeline,    // step 4: timeline choice
    name,        // step 5
    email,       // step 5
    company,     // step 5
    phone,       // step 5 (optional)
  } = req.body;

  if (!email || !name) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Build a readable note body from all steps
  const noteBody = [
    `**Situation / Role:** ${situation || '—'}`,
    `**AI Journey Stage:** ${aiJourney || '—'}`,
    `**Problem / Goal:** ${problem || '—'}`,
    `**Timeline:** ${timeline || '—'}`,
    `**Name:** ${name}`,
    `**Email:** ${email}`,
    `**Company:** ${company || '—'}`,
    `**Phone:** ${phone || '—'}`,
  ].join('\n\n');

  const lead = {
    first_name: (name || '').split(' ')[0],
    last_name:  (name || '').split(' ').slice(1).join(' '),
    email,
    company:    company || '',
    phone:      phone   || '',
    role:       situation || '',
    opportunity_name: 'Start Form Lead',
    note_title: 'Start Form Submission',
    note_body:  noteBody,
  };

  try {
    const crm = await syncLeadToCRM(lead);
    console.log(`[START] Lead synced — person=${crm.crm_person_id} company=${crm.crm_company_id} opp=${crm.crm_opportunity_id}`);
    return res.json({ ok: true, ...crm });
  } catch (err) {
    console.error('[START] CRM sync error:', err.message);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
