import archetypes from './archetypes';

/**
 * Derives the 4-letter archetype code from the step-based quiz answers.
 *
 * Each dimension is scored 0..10 (0 = immature, 10 = mature).
 * Threshold at 5 decides the letter.
 *
 * Signals used:
 *   execution  (M/A)   — time lost to manual tasks, pain points (reports/approvals)
 *   data       (F/C)   — pain points (data-hunt, reports), workflow rating of Data & Reporting
 *   connection (S/I)   — scope (org-wide implies more silos if it's a problem), workflow rating of People/System Integrations
 *   control    (R/P)   — driver (crisis = reactive, launching = proactive), timeline urgency, workflow rating of Process/Project Mgmt
 */
export function calculateArchetype(answers) {
  const scores = {
    execution: 5,   // default neutral
    data: 5,
    connection: 5,
    control: 5,
  };

  // ── Step 3: Pain points (multi-select) ──
  const pain = Array.isArray(answers.painPoints) ? answers.painPoints : [];
  if (pain.includes('reports')) { scores.execution -= 1; scores.data -= 1; }
  if (pain.includes('approvals')) { scores.execution -= 1; }
  if (pain.includes('data-hunt')) { scores.data -= 2; }
  if (pain.includes('breaks-at-scale')) { scores.control -= 1; }
  if (pain.includes('onboarding')) { scores.connection -= 1; scores.execution -= 1; }
  if (pain.includes('exploring')) { /* neutral */ }

  // ── Step 4: Driver + Timeline ──
  const driver = answers.urgency?.driver;
  const timeline = answers.urgency?.timeline;
  if (driver === 'crisis') scores.control -= 2;
  if (driver === 'scaling') scores.control += 1;
  if (driver === 'compliance') scores.control -= 1;
  if (driver === 'launch') scores.control += 1;
  if (driver === 'exploring') scores.control += 1;
  if (timeline === 'asap' || timeline === '30d') scores.control -= 1;
  if (timeline === 'year' || timeline === 'eventually') scores.control += 1;

  // ── Step 5: Time lost to manual work ──
  const timeLost = answers.timeLost;
  if (timeLost === 'minimal') scores.execution += 3;
  if (timeLost === 'noticeable') scores.execution += 1;
  if (timeLost === 'painful') scores.execution -= 2;
  if (timeLost === 'fulltime') scores.execution -= 4;
  if (timeLost === 'unsure') scores.data -= 1;

  // ── Step 6: Scope (how many touch the inefficiency) ──
  const scope = answers.scope;
  if (scope === 'few') { /* small problem, slightly positive */ scores.connection += 1; }
  if (scope === 'team') scores.connection += 0;
  if (scope === 'multi') scores.connection -= 2;
  if (scope === 'most') scores.connection -= 3;

  // ── Step 7: Workflow health ratings ──
  const wf = answers.workflowRatings || {};
  const ratingScore = (r) => (r === 'solid' ? 2 : r === 'needs-work' ? -1 : r === 'critical' ? -3 : 0);

  if (wf.people !== undefined) scores.connection += ratingScore(wf.people);
  if (wf.data !== undefined) scores.data += ratingScore(wf.data);
  if (wf.process !== undefined) scores.control += ratingScore(wf.process);
  if (wf.reporting !== undefined) scores.data += ratingScore(wf.reporting);
  if (wf.integrations !== undefined) scores.connection += ratingScore(wf.integrations);
  if (wf.cx !== undefined) scores.control += ratingScore(wf.cx);
  if (wf.ai !== undefined) scores.execution += ratingScore(wf.ai);
  if (wf.security !== undefined) scores.control += ratingScore(wf.security);

  // ── Step 8: Decision maker (contextual, slight signal) ──
  const decision = answers.decisionMaker;
  if (decision === 'unclear') scores.connection -= 1;
  if (decision === 'self') scores.control += 1;

  // Clamp to 0..10
  for (const k of Object.keys(scores)) {
    scores[k] = Math.max(0, Math.min(10, scores[k]));
  }

  // ── Derive 4-letter code ──
  const code =
    (scores.execution >= 5 ? 'A' : 'M') +
    (scores.data >= 5 ? 'C' : 'F') +
    (scores.connection >= 5 ? 'I' : 'S') +
    (scores.control >= 5 ? 'P' : 'R');

  // Normalize to 0..9 scale for display (matches existing result page)
  const percentages = {
    execution: Math.round((scores.execution / 10) * 100),
    data: Math.round((scores.data / 10) * 100),
    connection: Math.round((scores.connection / 10) * 100),
    control: Math.round((scores.control / 10) * 100),
  };

  // Re-scale scores to 0..9 so the result page bars still work
  const scoresOutOfNine = {
    execution: Math.round((scores.execution / 10) * 9),
    data: Math.round((scores.data / 10) * 9),
    connection: Math.round((scores.connection / 10) * 9),
    control: Math.round((scores.control / 10) * 9),
  };

  const archetype = archetypes[code] || archetypes['MCSP'];

  return { code, scores: scoresOutOfNine, percentages, archetype };
}
