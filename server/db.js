/**
 * SQLite database layer for lead management.
 *
 * Schema: leads table with contact info, quiz answers, archetype results,
 * pipeline stage, notes, and timestamps.
 *
 * The DB file lives at ./data/leads.db (gitignored).
 */

import Database from 'better-sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DB_DIR, 'leads.db');

if (!existsSync(DB_DIR)) mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name    TEXT NOT NULL DEFAULT '',
    last_name     TEXT NOT NULL DEFAULT '',
    email         TEXT NOT NULL,
    phone         TEXT DEFAULT '',
    company       TEXT DEFAULT '',
    role          TEXT DEFAULT '',
    website       TEXT DEFAULT '',
    expert_call   INTEGER DEFAULT 0,

    -- Quiz profiling data (stored as JSON)
    industry      TEXT DEFAULT '',
    company_size  TEXT DEFAULT '',
    team_size     TEXT DEFAULT '',
    pain_points   TEXT DEFAULT '[]',
    driver        TEXT DEFAULT '',
    timeline      TEXT DEFAULT '',
    time_lost     TEXT DEFAULT '',
    scope         TEXT DEFAULT '',
    workflow_ratings TEXT DEFAULT '{}',
    decision_maker TEXT DEFAULT '',

    -- Archetype result
    archetype_code TEXT DEFAULT '',
    archetype_name TEXT DEFAULT '',
    scores        TEXT DEFAULT '{}',
    percentages   TEXT DEFAULT '{}',

    -- Pipeline
    stage         TEXT NOT NULL DEFAULT 'new',
    notes         TEXT DEFAULT '',

    -- Email delivery
    email_sent    INTEGER DEFAULT 0,

    -- Timestamps
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
  CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
  CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
`);

// Migrate old 'won' stage to 'converted'
db.prepare("UPDATE leads SET stage = 'converted' WHERE stage = 'won'").run();

// ─── LEAD STAGES ─────────────────────────────────────

export const LEAD_STAGES = [
  { id: 'new', label: 'New', color: '#3B82F6' },
  { id: 'contacted', label: 'Contacted', color: '#8B5CF6' },
  { id: 'qualified', label: 'Qualified', color: '#F59E0B' },
  { id: 'demo', label: 'Demo Scheduled', color: '#10B981' },
  { id: 'proposal', label: 'Proposal Sent', color: '#EC4899' },
  { id: 'negotiation', label: 'Negotiation', color: '#F97316' },
  { id: 'converted', label: 'Converted', color: '#059669' },
  { id: 'lost', label: 'Lost', color: '#6B7280' },
];

const VALID_STAGE_IDS = new Set(LEAD_STAGES.map((s) => s.id));

// ─── CRUD ─────────────────────────────────────────────

const insertLead = db.prepare(`
  INSERT INTO leads (
    first_name, last_name, email, phone, company, role, website, expert_call,
    industry, company_size, team_size, pain_points, driver, timeline,
    time_lost, scope, workflow_ratings, decision_maker,
    archetype_code, archetype_name, scores, percentages,
    stage, email_sent
  ) VALUES (
    @first_name, @last_name, @email, @phone, @company, @role, @website, @expert_call,
    @industry, @company_size, @team_size, @pain_points, @driver, @timeline,
    @time_lost, @scope, @workflow_ratings, @decision_maker,
    @archetype_code, @archetype_name, @scores, @percentages,
    @stage, @email_sent
  )
`);

export function createLead(data) {
  const contact = data.contactForm || {};
  const answers = data.answers || {};
  const result = data.result || {};
  const urgency = answers.urgency || {};

  const params = {
    first_name: contact.firstName || data.firstName || '',
    last_name: contact.lastName || data.lastName || '',
    email: contact.email || data.email || '',
    phone: contact.phone || data.phone || '',
    company: contact.company || data.company || '',
    role: contact.role || data.role || '',
    website: contact.website || data.website || '',
    expert_call: contact.expertCall ? 1 : 0,

    industry: answers.industry || '',
    company_size: answers.size?.companySize || '',
    team_size: answers.size?.teamSize || '',
    pain_points: JSON.stringify(answers.painPoints || []),
    driver: urgency.driver || '',
    timeline: urgency.timeline || '',
    time_lost: answers.timeLost || '',
    scope: answers.scope || '',
    workflow_ratings: JSON.stringify(answers.workflowRatings || {}),
    decision_maker: answers.decisionMaker || '',

    archetype_code: result.code || '',
    archetype_name: result.archetype?.name || '',
    scores: JSON.stringify(result.scores || {}),
    percentages: JSON.stringify(result.percentages || {}),

    stage: 'new',
    email_sent: 0,
  };

  const info = insertLead.run(params);
  return { id: info.lastInsertRowid, ...params };
}

export function getAllLeads({ stage, search, limit = 100, offset = 0 } = {}) {
  let sql = 'SELECT * FROM leads WHERE 1=1';
  const params = {};

  if (stage && stage !== 'all') {
    sql += ' AND stage = @stage';
    params.stage = stage;
  }

  if (search) {
    sql += ` AND (
      first_name LIKE @search OR last_name LIKE @search
      OR email LIKE @search OR company LIKE @search
    )`;
    params.search = `%${search}%`;
  }

  sql += ' ORDER BY created_at DESC LIMIT @limit OFFSET @offset';
  params.limit = limit;
  params.offset = offset;

  const rows = db.prepare(sql).all(params);

  // Parse JSON fields
  return rows.map(parseLeadRow);
}

export function getLeadById(id) {
  const row = db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  return row ? parseLeadRow(row) : null;
}

export function updateLead(id, updates) {
  const allowed = [
    'first_name', 'last_name', 'email', 'phone', 'company', 'role',
    'website', 'expert_call', 'stage', 'notes', 'email_sent',
    'archetype_code', 'archetype_name',
  ];

  const sets = [];
  const params = { id };

  for (const [key, val] of Object.entries(updates)) {
    if (!allowed.includes(key)) continue;
    if (key === 'stage' && !VALID_STAGE_IDS.has(val)) {
      throw new Error(`Invalid stage: "${val}". Valid: ${[...VALID_STAGE_IDS].join(', ')}`);
    }
    sets.push(`${key} = @${key}`);
    params[key] = val;
  }

  if (sets.length === 0) return getLeadById(id);

  sets.push("updated_at = datetime('now')");
  const sql = `UPDATE leads SET ${sets.join(', ')} WHERE id = @id`;
  db.prepare(sql).run(params);

  return getLeadById(id);
}

export function deleteLead(id) {
  const lead = getLeadById(id);
  if (!lead) return null;
  db.prepare('DELETE FROM leads WHERE id = ?').run(id);
  return lead;
}

export function markEmailSent(id) {
  db.prepare("UPDATE leads SET email_sent = 1, updated_at = datetime('now') WHERE id = ?").run(id);
}

export function getLeadStats() {
  const total = db.prepare('SELECT COUNT(*) as count FROM leads').get().count;
  const byStage = db.prepare('SELECT stage, COUNT(*) as count FROM leads GROUP BY stage').all();
  const recent = db.prepare("SELECT COUNT(*) as count FROM leads WHERE created_at > datetime('now', '-7 days')").get().count;
  return { total, recent, byStage };
}

function parseLeadRow(row) {
  return {
    ...row,
    expert_call: !!row.expert_call,
    email_sent: !!row.email_sent,
    pain_points: safeParse(row.pain_points, []),
    workflow_ratings: safeParse(row.workflow_ratings, {}),
    scores: safeParse(row.scores, {}),
    percentages: safeParse(row.percentages, {}),
  };
}

function safeParse(str, fallback) {
  try { return JSON.parse(str); }
  catch { return fallback; }
}

export default db;
