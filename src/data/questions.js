/**
 * Quiz Questions Data
 *
 * Each question maps to one of 4 operational dimensions:
 * 1. Execution:  Manual (M) vs Automated (A)
 * 2. Data:       Centralized (C) vs Fragmented (F)
 * 3. Connection: Siloed (S) vs Integrated (I)
 * 4. Control:    Proactive (P) vs Reactive (R)
 *
 * The 4-letter archetype code (e.g., MCSP) determines the result.
 */

export const questions = [
  // ─── DIMENSION 1: EXECUTION (Manual vs Automated) ───
  {
    id: 1,
    dimension: 'execution',
    text: 'How are most routine tasks (invoicing, reporting, onboarding) handled in your organization?',
    options: [
      { text: 'Mostly by people following documented step-by-step procedures', value: 'M', score: 0 },
      { text: 'A mix — some tasks are automated, but most still need a human touch', value: 'M', score: 1 },
      { text: 'Mostly automated with humans reviewing the output', value: 'A', score: 2 },
      { text: 'Fully automated end-to-end — systems handle the routine work', value: 'A', score: 3 },
    ],
  },
  {
    id: 2,
    dimension: 'execution',
    text: 'When a new team member joins, how do they learn your workflows?',
    options: [
      { text: 'They shadow someone and learn by doing', value: 'M', score: 0 },
      { text: 'We have documentation and SOPs they read through', value: 'M', score: 1 },
      { text: 'Onboarding checklists in project tools guide them step by step', value: 'A', score: 2 },
      { text: 'Automated onboarding workflows provision access, training, and tasks', value: 'A', score: 3 },
    ],
  },
  {
    id: 3,
    dimension: 'execution',
    text: 'How do work handoffs between teams typically happen?',
    options: [
      { text: 'Email chains, Slack messages, or verbal hand-offs', value: 'M', score: 0 },
      { text: 'Shared spreadsheets or documents that both teams update', value: 'M', score: 1 },
      { text: 'Task management tools with status updates and notifications', value: 'A', score: 2 },
      { text: 'Automated triggers — when one team completes work, the next is notified instantly', value: 'A', score: 3 },
    ],
  },

  // ─── DIMENSION 2: DATA (Centralized vs Fragmented) ───
  {
    id: 4,
    dimension: 'data',
    text: 'Where does your most critical business data live?',
    options: [
      { text: 'One main system (CRM, ERP) that everyone relies on', value: 'C', score: 3 },
      { text: 'A few key systems that sync well with each other', value: 'C', score: 2 },
      { text: 'Multiple systems with some overlap and occasional conflicts', value: 'F', score: 1 },
      { text: 'Scattered across spreadsheets, emails, drives, and various tools', value: 'F', score: 0 },
    ],
  },
  {
    id: 5,
    dimension: 'data',
    text: 'When leadership needs a key business metric, what happens?',
    options: [
      { text: "It's available in real-time on a dashboard", value: 'C', score: 3 },
      { text: 'Someone pulls it from our main system within minutes', value: 'C', score: 2 },
      { text: 'Someone spends hours compiling data from multiple sources', value: 'F', score: 1 },
      { text: "It takes days — and the numbers often don't match across reports", value: 'F', score: 0 },
    ],
  },
  {
    id: 6,
    dimension: 'data',
    text: 'How confident are you that everyone in your org is working from the same data?',
    options: [
      { text: 'Very — we have a single source of truth that everyone trusts', value: 'C', score: 3 },
      { text: 'Mostly — the important stuff is centralized and accurate', value: 'C', score: 2 },
      { text: 'Somewhat — depends on which department or system you ask', value: 'F', score: 1 },
      { text: 'Not at all — different people have different versions of the truth', value: 'F', score: 0 },
    ],
  },

  // ─── DIMENSION 3: CONNECTION (Siloed vs Integrated) ───
  {
    id: 7,
    dimension: 'connection',
    text: 'How do different departments typically work together?',
    options: [
      { text: 'They mostly operate independently with their own tools and processes', value: 'S', score: 0 },
      { text: 'Coordination happens through leadership who bridges the gaps', value: 'S', score: 1 },
      { text: 'Regular cross-functional meetings and shared project boards', value: 'I', score: 2 },
      { text: 'Seamlessly — integrated tools and workflows connect teams naturally', value: 'I', score: 3 },
    ],
  },
  {
    id: 8,
    dimension: 'connection',
    text: "When one team's decision impacts another team, how do they find out?",
    options: [
      { text: 'Usually after the fact — sometimes it causes problems', value: 'S', score: 0 },
      { text: 'Through managers who relay information up and across', value: 'S', score: 1 },
      { text: 'Through shared tools and regular cross-team check-ins', value: 'I', score: 2 },
      { text: 'Instantly — systems automatically notify affected teams', value: 'I', score: 3 },
    ],
  },
  {
    id: 9,
    dimension: 'connection',
    text: "How would you describe your organization's internal communication?",
    options: [
      { text: 'Vertical — information flows up and down the chain, rarely across', value: 'S', score: 0 },
      { text: 'Hub-and-spoke — everything routes through central leadership', value: 'S', score: 1 },
      { text: 'Matrix — both vertical and horizontal communication works well', value: 'I', score: 2 },
      { text: 'Networked — information flows freely across the entire organization', value: 'I', score: 3 },
    ],
  },

  // ─── DIMENSION 4: CONTROL (Proactive vs Reactive) ───
  {
    id: 10,
    dimension: 'control',
    text: 'How does your organization typically discover operational problems?',
    options: [
      { text: 'We spot trends early and address them before they escalate', value: 'P', score: 3 },
      { text: 'We have dashboards and alerts that flag potential issues', value: 'P', score: 2 },
      { text: 'We usually find out when a customer complains or something breaks', value: 'R', score: 1 },
      { text: "We're always firefighting — problems find us, not the other way around", value: 'R', score: 0 },
    ],
  },
  {
    id: 11,
    dimension: 'control',
    text: 'How far ahead does your organization plan its operations?',
    options: [
      { text: 'Long-term strategic roadmaps with clear milestones', value: 'P', score: 3 },
      { text: 'Quarterly goals with regular reviews and adjustments', value: 'P', score: 2 },
      { text: 'Short-term — we mostly react to whatever comes up next', value: 'R', score: 1 },
      { text: "We don't really plan — we're too busy dealing with today", value: 'R', score: 0 },
    ],
  },
  {
    id: 12,
    dimension: 'control',
    text: 'When a process breaks down, what typically happens next?',
    options: [
      { text: 'Root cause analysis, then systemic fix to prevent recurrence', value: 'P', score: 3 },
      { text: 'We fix it, document lessons learned, and update our processes', value: 'P', score: 2 },
      { text: 'We fix the immediate issue and move on to the next fire', value: 'R', score: 1 },
      { text: 'Quick patch and hope — we\'ll deal with it properly "later"', value: 'R', score: 0 },
    ],
  },
];

export const categoryLabels = {
  execution: 'Execution Style',
  data: 'Data & Systems',
  connection: 'Team Connection',
  control: 'Operational Control',
};
