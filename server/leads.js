/**
 * Express router for lead CRUD operations.
 *
 * GET    /api/leads              - List leads (query: ?stage=new&search=foo&limit=50&offset=0)
 * GET    /api/leads/stats        - Pipeline stats (totals per stage)
 * GET    /api/leads/stages       - Available stage definitions
 * GET    /api/leads/:id          - Get one lead
 * POST   /api/leads              - Create a lead manually
 * PUT    /api/leads/:id          - Update a lead (stage, notes, contact fields)
 * DELETE /api/leads/:id          - Delete a lead
 */

import { Router } from 'express';
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getLeadStats,
  LEAD_STAGES,
} from './db.js';

const router = Router();

// List leads with optional filtering
router.get('/leads', (req, res) => {
  const { stage, search, limit, offset } = req.query;
  const leads = getAllLeads({
    stage,
    search,
    limit: limit ? parseInt(limit) : 100,
    offset: offset ? parseInt(offset) : 0,
  });
  res.json({ leads, count: leads.length });
});

// Pipeline stats
router.get('/leads/stats', (req, res) => {
  res.json(getLeadStats());
});

// Stage definitions
router.get('/leads/stages', (req, res) => {
  res.json({ stages: LEAD_STAGES });
});

// Get one lead
router.get('/leads/:id', (req, res) => {
  const lead = getLeadById(parseInt(req.params.id));
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  res.json(lead);
});

// Create a lead manually (the quiz auto-creates via /api/generate-results too)
router.post('/leads', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const lead = createLead({
    contactForm: req.body,
    answers: req.body.answers || {},
    result: req.body.result || {},
  });
  res.status(201).json(lead);
});

// Update a lead
router.put('/leads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const existing = getLeadById(id);
  if (!existing) return res.status(404).json({ error: 'Lead not found' });

  const updated = updateLead(id, req.body);
  res.json(updated);
});

// Delete a lead
router.delete('/leads/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const deleted = deleteLead(id);
  if (!deleted) return res.status(404).json({ error: 'Lead not found' });
  res.json({ deleted: true, lead: deleted });
});

export default router;
