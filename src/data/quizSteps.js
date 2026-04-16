/**
 * 5-step operational quiz.
 *
 * Each step has a `type` that determines the renderer:
 *  - single-choice       : grid of options, pick one
 *  - dual-choice         : two single-choice questions on one screen
 *  - multi-choice        : grid of options, pick up to N (with optional "all of above")
 *  - choice-plus-slider  : single-choice driver + urgency slider
 *  - choice-described    : single-choice with description under each label
 *
 * Answers inform both context (industry, size) and archetype scoring
 * (pain points, time lost, driver) in src/data/scoring.js.
 */

export const quizSteps = [
  // ─── STEP 1: Industry ─────────────────────────────
  {
    id: 'industry',
    type: 'single-choice',
    columns: 2,
    title: 'What industry are you in?',
    subtitle: 'This helps us calculate the true cost of inefficiency for your organization.',
    options: [
      { id: 'healthcare', label: 'Healthcare', icon: '\u{1F3E5}' },
      { id: 'financial', label: 'Financial Services', icon: '\u{1F4B5}' },
      { id: 'retail', label: 'Retail / E-commerce', icon: '\u{1F6D2}' },
      { id: 'manufacturing', label: 'Manufacturing / Logistics', icon: '\u{1F3ED}' },
      { id: 'technology', label: 'Technology / SaaS', icon: '\u{1F4BB}' },
      { id: 'professional', label: 'Professional Services', icon: '\u{1F3DB}\u{FE0F}' },
      { id: 'education', label: 'Education / Nonprofit', icon: '\u{1F393}' },
      { id: 'other', label: 'Other', icon: '\u{1F527}' },
    ],
  },

  // ─── STEP 2: Company size + team size ─────────────
  {
    id: 'size',
    type: 'dual-choice',
    questions: [
      {
        id: 'companySize',
        icon: '\u{1F3E2}',
        title: 'How large is your company?',
        subtitle: 'This helps us estimate organization-wide impact.',
        layout: 'horizontal',
        options: [
          { id: '1-10', main: '1-10', sub: 'Startup' },
          { id: '11-50', main: '11-50', sub: 'Small' },
          { id: '51-200', main: '51-200', sub: 'Growing' },
          { id: '201-500', main: '201-500', sub: 'Mid-size' },
          { id: '501-1K', main: '501-1K', sub: 'Large' },
          { id: '1K-5K', main: '1K-5K', sub: 'Enterprise' },
          { id: '5K+', main: '5,000+', sub: 'Global' },
        ],
      },
      {
        id: 'teamSize',
        icon: '\u{1F465}',
        title: 'How large is your direct team?',
        subtitle: 'The people you work with day-to-day who would benefit from improvements.',
        layout: 'horizontal',
        options: [
          { id: '1-5', main: '1-5', sub: 'Tiny' },
          { id: '6-15', main: '6-15', sub: 'Small' },
          { id: '16-30', main: '16-30', sub: 'Medium' },
          { id: '31-50', main: '31-50', sub: 'Large' },
          { id: '51-100', main: '51-100', sub: 'Dept' },
          { id: '100+', main: '100+', sub: 'Division' },
        ],
        note: 'Teams your size often see the fastest ROI from workflow automation.',
      },
    ],
  },

  // ─── STEP 3: Pain points (multi-select) ───────────
  {
    id: 'painPoints',
    type: 'multi-choice',
    columns: 2,
    maxSelect: 3,
    title: 'What makes your team want to scream into a pillow?',
    subtitle: 'Pick up to 3 that resonate most.',
    options: [
      { id: 'reports', label: "Can't get reports built without manual work", icon: '\u{1F4CA}' },
      { id: 'approvals', label: 'Chasing approvals and customer follow-ups', icon: '\u{1F504}' },
      { id: 'data-hunt', label: 'Hunting for data scattered across tools', icon: '\u{2753}' },
      { id: 'breaks-at-scale', label: 'Things break when we scale or get busy', icon: '\u{1F525}' },
      { id: 'onboarding', label: 'Onboarding new people is a scramble every time', icon: '\u{1F464}' },
      { id: 'exploring', label: 'Nothing major — just exploring', icon: '\u{1F9ED}' },
    ],
    allOfAboveOption: { id: 'all-of-above', label: 'All of the above, honestly', icon: '\u{26A0}\u{FE0F}' },
  },

  // ─── STEP 4: Driver + urgency slider ──────────────
  {
    id: 'urgency',
    type: 'choice-plus-slider',
    choice: {
      id: 'driver',
      title: "What's driving this? What's happening right now?",
      subtitle: 'Pick the one that resonates most.',
      columns: 2,
      options: [
        { id: 'crisis', label: "We're in crisis mode — the pain finally tipped the scales", icon: '\u{26A0}\u{FE0F}' },
        { id: 'scaling', label: "We're scaling fast or just raised / grew", icon: '\u{1F4C8}' },
        { id: 'compliance', label: 'Compliance, audit, or regulatory pressure', icon: '\u{1F6E1}\u{FE0F}' },
        { id: 'hire', label: 'Hired (or hiring) someone to own this', icon: '\u{1F464}' },
        { id: 'launch', label: 'Launching something new that needs to work', icon: '\u{1F514}' },
        { id: 'exploring', label: "Just exploring — no urgency yet", icon: '\u{1F9ED}' },
      ],
    },
    slider: {
      id: 'timeline',
      title: 'When do you need this solved?',
      stops: [
        { id: 'asap', label: 'ASAP', emoji: '\u{1F198}', desc: 'Stop the bleeding now.' },
        { id: '30d', label: '30 days', emoji: '\u{23F3}', desc: 'Urgent — must move fast.' },
        { id: 'quarter', label: 'This quarter', emoji: '\u{1F4C5}', desc: 'On the roadmap for Q-level planning.' },
        { id: '6mo', label: '6 months', emoji: '\u{1F5D3}\u{FE0F}', desc: 'Important, but not immediate.' },
        { id: 'year', label: 'This year', emoji: '\u{1F4C6}', desc: "Planning ahead for the year's goals." },
        { id: 'eventually', label: 'Eventually', emoji: '\u{1F4AD}', desc: 'Nice to have, someday.' },
      ],
    },
  },

  // ─── STEP 5: Time lost to manual tasks ────────────
  {
    id: 'timeLost',
    type: 'choice-described',
    title: 'Roughly how much time per week does your team lose to repetitive, manual tasks?',
    subtitle: 'Think: data entry, copy-paste between systems, chasing approvals, building reports manually.',
    options: [
      { id: 'minimal', emoji: '\u{1F60C}', label: 'Minimal — a few hours at most', desc: 'Things are pretty efficient.' },
      { id: 'noticeable', emoji: '\u{1F610}', label: 'Noticeable — probably 5-15 hours', desc: 'Adds up over time.' },
      { id: 'painful', emoji: '\u{1F613}', label: 'Painful — 15-30 hours', desc: 'Significant weekly drain.' },
      { id: 'fulltime', emoji: '\u{1F635}', label: "It's basically someone's full-time job (30+)", desc: 'Major productivity loss.' },
      { id: 'unsure', emoji: '\u{1F937}', label: "No idea, but it's a lot", desc: "Haven't measured it." },
    ],
  },

  // ─── STEP 6: Scope of inefficiency ────────────────
  {
    id: 'scope',
    type: 'single-choice',
    columns: 2,
    title: 'What percentage of your organization deals with these inefficiencies?',
    subtitle: "Different from your direct team size — think organization-wide: who across the company touches manual processes, scattered data, or disconnected systems?",
    options: [
      { id: 'few', icon: '\u{1F464}', label: 'Just a few of us (less than 5%)', sub: 'Isolated to a small group' },
      { id: 'team', icon: '\u{1F465}', label: 'A team or department (5-20%)', sub: 'One area of the business' },
      { id: 'multi', icon: '\u{1F46A}', label: 'Multiple departments (20-50%)', sub: 'Cross-functional impact' },
      { id: 'most', icon: '\u{1F30D}', label: 'Most of the organization (50%+)', sub: 'Company-wide issue' },
    ],
  },

  // ─── STEP 7: Workflow health matrix ───────────────
  {
    id: 'workflowRatings',
    type: 'matrix-rating',
    title: 'How would you rate your current workflows?',
    subtitle: "Go with your gut. We'll dig deeper in the next section.",
    ratings: [
      { id: 'critical', label: 'Critical', dot: '\u{1F534}' },
      { id: 'needs-work', label: 'Needs work', dot: '\u{1F7E1}' },
      { id: 'solid', label: 'Pretty solid', dot: '\u{1F7E2}' },
      { id: 'unsure', label: 'Not Sure', dot: '\u{26AA}' },
    ],
    areas: [
      {
        id: 'people',
        icon: '\u{1F465}',
        title: 'People, Team & Communication',
        desc: 'Scheduling, task assignments, coordination, internal messaging, and keeping everyone aligned on priorities and workloads.',
      },
      {
        id: 'data',
        icon: '\u{1F5C4}\u{FE0F}',
        title: 'Data & Information Management',
        desc: 'How you store, organize, find, and maintain your critical business data across systems and teams.',
      },
      {
        id: 'process',
        icon: '\u{2699}\u{FE0F}',
        title: 'Workflow, Process & Project Management',
        desc: 'How work flows through your team start to finish — handoffs, approvals, deadlines, milestones, and progress visibility.',
      },
      {
        id: 'reporting',
        icon: '\u{1F4CA}',
        title: 'Reporting & Decision-Making',
        desc: 'Getting timely insights, dashboards, and data you need to make informed decisions without manual compilation.',
      },
      {
        id: 'integrations',
        icon: '\u{1F517}',
        title: 'System Integrations',
        desc: "How well your tools talk to each other and share data automatically, reducing manual work and errors.",
      },
      {
        id: 'cx',
        icon: '\u{1F642}',
        title: 'Customer Experience',
        desc: 'How customers interact with you — from first contact through ongoing support — and the consistency of those touchpoints.',
      },
      {
        id: 'ai',
        icon: '\u{1F916}',
        title: 'AI & Automation',
        desc: 'Using AI and automation to eliminate repetitive work, reduce errors, and scale operations without adding headcount.',
      },
      {
        id: 'security',
        icon: '\u{1F512}',
        title: 'Security & Compliance',
        desc: 'Data protection, access controls, audit trails, and meeting regulatory requirements without slowing work down.',
      },
    ],
  },

  // ─── STEP 8: Decision maker ───────────────────────
  {
    id: 'decisionMaker',
    type: 'choice-icon-list',
    title: "Who needs to say 'yes' for a project like this to move forward?",
    options: [
      { id: 'self', icon: '\u{1F64B}', label: 'Just me — I have budget authority' },
      { id: 'boss', icon: '\u{1F465}', label: 'Me + my boss / leadership team' },
      { id: 'exec', icon: '\u{1F4BC}', label: 'Our executive team / C-suite' },
      { id: 'board', icon: '\u{1F91D}', label: 'Board or investors' },
      { id: 'it', icon: '\u{1F510}', label: 'IT / Operations must approve' },
      { id: 'unclear', icon: '\u{1F937}', label: "Honestly? It's unclear who owns this here", highlight: true },
    ],
  },

  // ─── STEP 9: Lead capture form ────────────────────
  {
    id: 'contactForm',
    type: 'contact-form',
    title: 'Almost done! Where should we send your Operational Archetype Report?',
    subtitle: "We'll email you a detailed PDF with your archetype, strengths, blind spots, and a tailored action plan.",
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true, half: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Smith', required: true, half: true },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'john@company.com', required: true },
      { id: 'company', label: 'Company Name', type: 'text', placeholder: 'Acme Inc.', required: true },
      { id: 'role', label: 'Job Title', type: 'text', placeholder: 'e.g., VP Operations', required: false },
      { id: 'website', label: 'Company Website', type: 'url', placeholder: 'https://', required: false },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (555) 000-0000', required: false },
    ],
    consentCheckbox: {
      id: 'expertCall',
      label: "I'd like to discuss these findings with an AutoWorkflows expert",
      defaultChecked: true,
    },
  },
];

/**
 * Each step = 1 question screen. Matches "Question N of 9" in the reference.
 */
export function getTotalQuestionCount() {
  return quizSteps.length;
}

export function getQuestionNumberForStep(stepIndex) {
  return Math.min(stepIndex + 1, quizSteps.length);
}
