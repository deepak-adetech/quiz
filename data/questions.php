<?php
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

$questions = [
    // ─── DIMENSION 1: EXECUTION (Manual vs Automated) ───
    [
        'id' => 1,
        'dimension' => 'execution',
        'text' => 'How are most routine tasks (invoicing, reporting, onboarding) handled in your organization?',
        'options' => [
            ['text' => 'Mostly by people following documented step-by-step procedures', 'value' => 'M', 'score' => 0],
            ['text' => 'A mix — some tasks are automated, but most still need a human touch', 'value' => 'M', 'score' => 1],
            ['text' => 'Mostly automated with humans reviewing the output', 'value' => 'A', 'score' => 2],
            ['text' => 'Fully automated end-to-end — systems handle the routine work', 'value' => 'A', 'score' => 3],
        ],
    ],
    [
        'id' => 2,
        'dimension' => 'execution',
        'text' => 'When a new team member joins, how do they learn your workflows?',
        'options' => [
            ['text' => 'They shadow someone and learn by doing', 'value' => 'M', 'score' => 0],
            ['text' => 'We have documentation and SOPs they read through', 'value' => 'M', 'score' => 1],
            ['text' => 'Onboarding checklists in project tools guide them step by step', 'value' => 'A', 'score' => 2],
            ['text' => 'Automated onboarding workflows provision access, training, and tasks', 'value' => 'A', 'score' => 3],
        ],
    ],
    [
        'id' => 3,
        'dimension' => 'execution',
        'text' => 'How do work handoffs between teams typically happen?',
        'options' => [
            ['text' => 'Email chains, Slack messages, or verbal hand-offs', 'value' => 'M', 'score' => 0],
            ['text' => 'Shared spreadsheets or documents that both teams update', 'value' => 'M', 'score' => 1],
            ['text' => 'Task management tools with status updates and notifications', 'value' => 'A', 'score' => 2],
            ['text' => 'Automated triggers — when one team completes work, the next is notified instantly', 'value' => 'A', 'score' => 3],
        ],
    ],

    // ─── DIMENSION 2: DATA (Centralized vs Fragmented) ───
    [
        'id' => 4,
        'dimension' => 'data',
        'text' => 'Where does your most critical business data live?',
        'options' => [
            ['text' => 'One main system (CRM, ERP) that everyone relies on', 'value' => 'C', 'score' => 3],
            ['text' => 'A few key systems that sync well with each other', 'value' => 'C', 'score' => 2],
            ['text' => 'Multiple systems with some overlap and occasional conflicts', 'value' => 'F', 'score' => 1],
            ['text' => 'Scattered across spreadsheets, emails, drives, and various tools', 'value' => 'F', 'score' => 0],
        ],
    ],
    [
        'id' => 5,
        'dimension' => 'data',
        'text' => 'When leadership needs a key business metric, what happens?',
        'options' => [
            ['text' => 'It\'s available in real-time on a dashboard', 'value' => 'C', 'score' => 3],
            ['text' => 'Someone pulls it from our main system within minutes', 'value' => 'C', 'score' => 2],
            ['text' => 'Someone spends hours compiling data from multiple sources', 'value' => 'F', 'score' => 1],
            ['text' => 'It takes days — and the numbers often don\'t match across reports', 'value' => 'F', 'score' => 0],
        ],
    ],
    [
        'id' => 6,
        'dimension' => 'data',
        'text' => 'How confident are you that everyone in your org is working from the same data?',
        'options' => [
            ['text' => 'Very — we have a single source of truth that everyone trusts', 'value' => 'C', 'score' => 3],
            ['text' => 'Mostly — the important stuff is centralized and accurate', 'value' => 'C', 'score' => 2],
            ['text' => 'Somewhat — depends on which department or system you ask', 'value' => 'F', 'score' => 1],
            ['text' => 'Not at all — different people have different versions of the truth', 'value' => 'F', 'score' => 0],
        ],
    ],

    // ─── DIMENSION 3: CONNECTION (Siloed vs Integrated) ───
    [
        'id' => 7,
        'dimension' => 'connection',
        'text' => 'How do different departments typically work together?',
        'options' => [
            ['text' => 'They mostly operate independently with their own tools and processes', 'value' => 'S', 'score' => 0],
            ['text' => 'Coordination happens through leadership who bridges the gaps', 'value' => 'S', 'score' => 1],
            ['text' => 'Regular cross-functional meetings and shared project boards', 'value' => 'I', 'score' => 2],
            ['text' => 'Seamlessly — integrated tools and workflows connect teams naturally', 'value' => 'I', 'score' => 3],
        ],
    ],
    [
        'id' => 8,
        'dimension' => 'connection',
        'text' => 'When one team\'s decision impacts another team, how do they find out?',
        'options' => [
            ['text' => 'Usually after the fact — sometimes it causes problems', 'value' => 'S', 'score' => 0],
            ['text' => 'Through managers who relay information up and across', 'value' => 'S', 'score' => 1],
            ['text' => 'Through shared tools and regular cross-team check-ins', 'value' => 'I', 'score' => 2],
            ['text' => 'Instantly — systems automatically notify affected teams', 'value' => 'I', 'score' => 3],
        ],
    ],
    [
        'id' => 9,
        'dimension' => 'connection',
        'text' => 'How would you describe your organization\'s internal communication?',
        'options' => [
            ['text' => 'Vertical — information flows up and down the chain, rarely across', 'value' => 'S', 'score' => 0],
            ['text' => 'Hub-and-spoke — everything routes through central leadership', 'value' => 'S', 'score' => 1],
            ['text' => 'Matrix — both vertical and horizontal communication works well', 'value' => 'I', 'score' => 2],
            ['text' => 'Networked — information flows freely across the entire organization', 'value' => 'I', 'score' => 3],
        ],
    ],

    // ─── DIMENSION 4: CONTROL (Proactive vs Reactive) ───
    [
        'id' => 10,
        'dimension' => 'control',
        'text' => 'How does your organization typically discover operational problems?',
        'options' => [
            ['text' => 'We spot trends early and address them before they escalate', 'value' => 'P', 'score' => 3],
            ['text' => 'We have dashboards and alerts that flag potential issues', 'value' => 'P', 'score' => 2],
            ['text' => 'We usually find out when a customer complains or something breaks', 'value' => 'R', 'score' => 1],
            ['text' => 'We\'re always firefighting — problems find us, not the other way around', 'value' => 'R', 'score' => 0],
        ],
    ],
    [
        'id' => 11,
        'dimension' => 'control',
        'text' => 'How far ahead does your organization plan its operations?',
        'options' => [
            ['text' => 'Long-term strategic roadmaps with clear milestones', 'value' => 'P', 'score' => 3],
            ['text' => 'Quarterly goals with regular reviews and adjustments', 'value' => 'P', 'score' => 2],
            ['text' => 'Short-term — we mostly react to whatever comes up next', 'value' => 'R', 'score' => 1],
            ['text' => 'We don\'t really plan — we\'re too busy dealing with today', 'value' => 'R', 'score' => 0],
        ],
    ],
    [
        'id' => 12,
        'dimension' => 'control',
        'text' => 'When a process breaks down, what typically happens next?',
        'options' => [
            ['text' => 'Root cause analysis, then systemic fix to prevent recurrence', 'value' => 'P', 'score' => 3],
            ['text' => 'We fix it, document lessons learned, and update our processes', 'value' => 'P', 'score' => 2],
            ['text' => 'We fix the immediate issue and move on to the next fire', 'value' => 'R', 'score' => 1],
            ['text' => 'Quick patch and hope — we\'ll deal with it properly "later"', 'value' => 'R', 'score' => 0],
        ],
    ],
];

/**
 * Archetype definitions — 16 possible combinations
 */
$archetypes = [
    'MCSP' => [
        'name' => 'The Foundation',
        'emoji' => "\xF0\x9F\x8F\x9B",  // 🏛
        'animal' => 'Owl',
        'animal_emoji' => "\xF0\x9F\xA6\x89",
        'tagline' => 'We know exactly what\'s broken. We just haven\'t fixed it yet.',
    ],
    'MCSR' => [
        'name' => 'The Watchtower',
        'emoji' => "\xF0\x9F\x94\xAD",
        'animal' => 'Hawk',
        'animal_emoji' => "\xF0\x9F\xA6\x85",
        'tagline' => 'We have the data, but fires keep pulling us off course.',
    ],
    'MCIP' => [
        'name' => 'The Conductor',
        'emoji' => "\xF0\x9F\x8E\xBC",
        'animal' => 'Elephant',
        'animal_emoji' => "\xF0\x9F\x90\x98",
        'tagline' => 'Everyone knows the plan. Now we just need to stop doing it all by hand.',
    ],
    'MCIR' => [
        'name' => 'The Juggler',
        'emoji' => "\xF0\x9F\xA4\xB9",
        'animal' => 'Octopus',
        'animal_emoji' => "\xF0\x9F\x90\x99",
        'tagline' => 'Great teamwork, good data — but everything still feels like a scramble.',
    ],
    'MFSP' => [
        'name' => 'The Island Chain',
        'emoji' => "\xF0\x9F\x8F\x9D",
        'animal' => 'Turtle',
        'animal_emoji' => "\xF0\x9F\x90\xA2",
        'tagline' => 'Smart teams working hard in isolation with their own versions of the truth.',
    ],
    'MFSR' => [
        'name' => 'The Survivor',
        'emoji' => "\xF0\x9F\x8C\x8A",
        'animal' => 'Chameleon',
        'animal_emoji' => "\xF0\x9F\xA6\x8E",
        'tagline' => 'Every day is an adventure — and not in a good way.',
    ],
    'MFIP' => [
        'name' => 'The Village',
        'emoji' => "\xF0\x9F\x8F\x98",
        'animal' => 'Bee',
        'animal_emoji' => "\xF0\x9F\x90\x9D",
        'tagline' => 'People talk and plan well, but the tools and data can\'t keep up.',
    ],
    'MFIR' => [
        'name' => 'The Campfire',
        'emoji' => "\xF0\x9F\x94\xA5",
        'animal' => 'Ant',
        'animal_emoji' => "\xF0\x9F\x90\x9C",
        'tagline' => 'Strong culture, great people — held together by grit, not systems.',
    ],
    'ACSP' => [
        'name' => 'The Engine',
        'emoji' => "\xE2\x9A\x99\xEF\xB8\x8F",
        'animal' => 'Lion',
        'animal_emoji' => "\xF0\x9F\xA6\x81",
        'tagline' => 'A powerful machine — but the departments run on parallel tracks.',
    ],
    'ACSR' => [
        'name' => 'The Treadmill',
        'emoji' => "\xF0\x9F\x8F\x83",
        'animal' => 'Cheetah',
        'animal_emoji' => "\xF0\x9F\x90\x86",
        'tagline' => 'Fast, automated, and organized — but always chasing the next crisis.',
    ],
    'ACIP' => [
        'name' => 'The Orchestrator',
        'emoji' => "\xF0\x9F\x8E\xAF",
        'animal' => 'Dolphin',
        'animal_emoji' => "\xF0\x9F\x90\xAC",
        'tagline' => 'The gold standard. Connected, automated, and always one step ahead.',
    ],
    'ACIR' => [
        'name' => 'The Responder',
        'emoji' => "\xF0\x9F\x9A\x80",
        'animal' => 'Wolf',
        'animal_emoji' => "\xF0\x9F\x90\xBA",
        'tagline' => 'Connected and capable — but still stuck in reaction mode.',
    ],
    'AFSP' => [
        'name' => 'The Archipelago',
        'emoji' => "\xF0\x9F\x97\xBA",
        'animal' => 'Eagle',
        'animal_emoji' => "\xF0\x9F\xA6\x85",
        'tagline' => 'Pockets of automation excellence, but nothing talks to anything else.',
    ],
    'AFSR' => [
        'name' => 'The Pinball Machine',
        'emoji' => "\xF0\x9F\x8E\xB0",
        'animal' => 'Fox',
        'animal_emoji' => "\xF0\x9F\xA6\x8A",
        'tagline' => 'Things happen fast, but nobody\'s quite sure where the ball is going.',
    ],
    'AFIP' => [
        'name' => 'The Network',
        'emoji' => "\xF0\x9F\x95\xB8",
        'animal' => 'Spider',
        'animal_emoji' => "\xF0\x9F\x95\xB7",
        'tagline' => 'Well-connected and forward-thinking — just needs one source of truth.',
    ],
    'AFIR' => [
        'name' => 'The Improviser',
        'emoji' => "\xF0\x9F\x8E\xAD",
        'animal' => 'Monkey',
        'animal_emoji' => "\xF0\x9F\x90\x92",
        'tagline' => 'Innovative and agile, but chaos is always one bad day away.',
    ],
];

/**
 * Calculate archetype code from quiz answers
 */
function calculateArchetype(array $answers): array {
    $dimensions = [
        'execution'  => 0,
        'data'       => 0,
        'connection' => 0,
        'control'    => 0,
    ];

    global $questions;

    foreach ($answers as $questionId => $selectedIndex) {
        $question = $questions[$questionId] ?? null;
        if (!$question) continue;
        $option = $question['options'][$selectedIndex] ?? null;
        if (!$option) continue;
        $dimensions[$question['dimension']] += $option['score'];
    }

    // Each dimension has 3 questions, max score 9 per dimension
    // Threshold at 4.5 (midpoint)
    $code = '';
    $code .= ($dimensions['execution'] >= 5)  ? 'A' : 'M';
    $code .= ($dimensions['data'] >= 5)        ? 'C' : 'F';
    $code .= ($dimensions['connection'] >= 5)  ? 'I' : 'S';
    $code .= ($dimensions['control'] >= 5)     ? 'P' : 'R';

    return [
        'code' => $code,
        'scores' => $dimensions,
        'percentages' => [
            'execution'  => round(($dimensions['execution'] / 9) * 100),
            'data'       => round(($dimensions['data'] / 9) * 100),
            'connection' => round(($dimensions['connection'] / 9) * 100),
            'control'    => round(($dimensions['control'] / 9) * 100),
        ],
    ];
}
