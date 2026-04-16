<?php
/**
 * Claude API Integration for generating archetype results
 */

require_once __DIR__ . '/../config.php';

function callClaudeAPI(string $archetypeCode, array $scores, array $percentages, array $archetype, string $userName = ''): ?array {
    $prompt = buildPrompt($archetypeCode, $scores, $percentages, $archetype, $userName);

    $payload = [
        'model' => CLAUDE_MODEL,
        'max_tokens' => 4096,
        'messages' => [
            [
                'role' => 'user',
                'content' => $prompt,
            ],
        ],
    ];

    $ch = curl_init(CLAUDE_API_URL);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . CLAUDE_API_KEY,
            'anthropic-version: 2023-06-01',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_TIMEOUT        => 60,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        error_log("Claude API error (HTTP $httpCode): $response");
        return null;
    }

    $data = json_decode($response, true);
    $text = $data['content'][0]['text'] ?? '';

    // Extract JSON from the response
    $jsonMatch = [];
    if (preg_match('/\{[\s\S]*\}/', $text, $jsonMatch)) {
        $result = json_decode($jsonMatch[0], true);
        if (json_last_error() === JSON_ERROR_NONE) {
            return $result;
        }
    }

    error_log("Failed to parse Claude API response as JSON");
    return null;
}

function buildPrompt(string $code, array $scores, array $percentages, array $archetype, string $userName): string {
    $name = $archetype['name'];
    $animal = $archetype['animal'];
    $tagline = $archetype['tagline'];

    $greeting = $userName ? "for $userName's organization" : "for this organization";

    return <<<PROMPT
You are an expert business operations consultant analyzing an organization's Operational Archetype quiz results. Generate a comprehensive, personalized archetype report $greeting.

## Quiz Results
- **Archetype Code:** $code
- **Archetype Name:** $name
- **Spirit Animal:** $animal
- **Tagline:** "$tagline"

## Dimension Scores (0-9 scale, higher = more mature)
- **Execution** (Manual 0 ←→ 9 Automated): {$scores['execution']}/9 ({$percentages['execution']}%)
- **Data** (Fragmented 0 ←→ 9 Centralized): {$scores['data']}/9 ({$percentages['data']}%)
- **Connection** (Siloed 0 ←→ 9 Integrated): {$scores['connection']}/9 ({$percentages['connection']}%)
- **Control** (Reactive 0 ←→ 9 Proactive): {$scores['control']}/9 ({$percentages['control']}%)

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
    "superpowers": [
        "Specific operational strength 1",
        "Specific operational strength 2",
        "Specific operational strength 3",
        "Specific operational strength 4"
    ],
    "superpower_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "kryptonite": [
        "Specific operational weakness 1",
        "Specific operational weakness 2",
        "Specific operational weakness 3",
        "Specific operational weakness 4"
    ],
    "kryptonite_emojis": ["emoji1", "emoji2", "emoji3", "emoji4"],
    "ideal_starting_points": [
        "Specific actionable first step",
        "Specific actionable second step",
        "Specific actionable third step"
    ],
    "famous_last_words": "A funny, relatable one-liner this archetype would say (in quotes)",
    "real_world_example": "A 2-3 sentence fictional but realistic example of a company with this archetype — include industry, size, and the core operational challenge they face",
    "why_animal": "2-3 sentence explanation of why this spirit animal ({$animal}) perfectly represents this archetype — use the animal's real traits as metaphors for the operational style"
}

Be creative, specific, and insightful. The superpowers should feel genuinely positive. The kryptonite should feel honest but not harsh. The starting points should be immediately actionable. The famous last words should make someone laugh because it's so true.
PROMPT;
}

/**
 * Generate fallback results when API is unavailable
 */
function generateFallbackResults(string $code, array $archetype): array {
    $results = [
        'MCSP' => [
            'execution_style' => 'Manual workflows dominate, but execution is methodical. Processes are well-documented and followed consistently. Humans drive everything, but they follow clear procedures.',
            'data_approach' => 'Centralized data with excellent quality. Single source of truth exists for critical information. Data is clean, organized, and accessible to leadership. Reporting and dashboards are accurate.',
            'connection_pattern' => 'Teams work in departmental bubbles despite shared data. Each department has its own processes and tools. Data flows to leadership, but teams don\'t collaborate across boundaries.',
            'control_posture' => 'Proactive planning at the strategic level. Leadership has excellent visibility into what\'s happening. You can see problems clearly and plan solutions, but execution lags behind strategy.',
            'cultural_dna' => 'Strategic vision without tactical execution. You know exactly what needs to be done, but translating that vision into coordinated action across departments is the challenge. Data gives you clarity, but teams don\'t work together.',
            'superpowers' => ['Accurate reporting and dashboards', 'Clear priorities based on real data', 'Strong leadership and planning', 'Data quality is excellent'],
            'superpower_emojis' => ["\xF0\x9F\x93\x8A", "\xF0\x9F\x8E\xAF", "\xF0\x9F\x93\x8B", "\xF0\x9F\x92\x8E"],
            'kryptonite' => ['Teams don\'t collaborate across departments', 'Manual handoffs cause delays', 'Execution doesn\'t match strategy', 'Can see the problems but can\'t fix them fast enough'],
            'kryptonite_emojis' => ["\xF0\x9F\x91\xA5", "\xF0\x9F\x94\x84", "\xF0\x9F\x98\x93", "\xF0\x9F\x93\x89"],
            'ideal_starting_points' => ['Automate cross-functional workflows', 'Break down departmental silos', 'Integrate communication channels'],
            'famous_last_words' => '"We have the data, we just need someone to execute."',
            'real_world_example' => 'Professional services firm, 75 people, beautiful CRM and dashboards, but project delivery still a mess because teams don\'t talk.',
            'why_animal' => 'Like an owl, you see everything clearly from above — you have excellent vision and can spot problems from a distance. You\'re wise and strategic, but you watch rather than act. Your data gives you perfect clarity, but you\'re still figuring out how to translate that vision into coordinated action across your organization.',
        ],
    ];

    // Return specific fallback if available, otherwise generate generic one
    if (isset($results[$code])) {
        return $results[$code];
    }

    // Generic fallback based on code letters
    $isManual = $code[0] === 'M';
    $isCentralized = $code[1] === 'C';
    $isSiloed = $code[2] === 'S';
    $isProactive = $code[3] === 'P';

    return [
        'execution_style' => $isManual
            ? 'Your organization relies heavily on human-driven processes. While this means deep institutional knowledge, it also creates bottlenecks and key-person dependencies.'
            : 'Your organization has embraced automation in its workflows. Systems handle routine work, freeing people to focus on higher-value tasks.',
        'data_approach' => $isCentralized
            ? 'Data is well-organized and centralized. Leadership can access reliable information quickly, and reporting is generally trustworthy.'
            : 'Data is scattered across multiple systems and tools. Getting a single, reliable view of the business requires significant effort.',
        'connection_pattern' => $isSiloed
            ? 'Teams tend to work in departmental bubbles. Cross-functional collaboration happens but requires deliberate effort and often goes through leadership.'
            : 'Teams are well-connected and collaborate naturally. Information flows across departments, and shared tools keep everyone aligned.',
        'control_posture' => $isProactive
            ? 'Your organization plans ahead and spots problems early. Strategic thinking is strong, with clear roadmaps and regular review cycles.'
            : 'Your organization tends to operate in reactive mode. Issues are addressed as they arise, and planning horizons are typically short-term.',
        'cultural_dna' => "Your organization's culture reflects its {$archetype['name']} archetype. " .
            ($isManual ? 'Human expertise drives the work' : 'Technology amplifies the work') . ', ' .
            ($isCentralized ? 'data provides clarity' : 'data needs consolidation') . ', ' .
            ($isSiloed ? 'but teams need better bridges' : 'and teams collaborate well') . ', ' .
            ($isProactive ? 'with leadership always looking ahead.' : 'though more proactive planning would help.'),
        'superpowers' => [
            $isManual ? 'Deep institutional knowledge and expertise' : 'Efficient automated workflows',
            $isCentralized ? 'Reliable data and clear reporting' : 'Flexibility and team autonomy',
            $isSiloed ? 'Strong departmental focus and specialization' : 'Cross-functional collaboration',
            $isProactive ? 'Strategic thinking and forward planning' : 'Agility and quick response times',
        ],
        'superpower_emojis' => ["\xF0\x9F\x93\x8A", "\xF0\x9F\x8E\xAF", "\xF0\x9F\x93\x8B", "\xF0\x9F\x92\x8E"],
        'kryptonite' => [
            $isManual ? 'Manual processes create bottlenecks' : 'Over-reliance on automation can miss nuance',
            $isCentralized ? 'Centralized systems can become single points of failure' : 'Fragmented data causes conflicting reports',
            $isSiloed ? 'Teams miss opportunities to collaborate' : 'Too many meetings and coordination overhead',
            $isProactive ? 'Planning can slow down execution' : 'Constantly fighting fires drains the team',
        ],
        'kryptonite_emojis' => ["\xF0\x9F\x91\xA5", "\xF0\x9F\x94\x84", "\xF0\x9F\x98\x93", "\xF0\x9F\x93\x89"],
        'ideal_starting_points' => [
            $isManual ? 'Identify the top 3 manual processes to automate first' : 'Audit automations for gaps and inefficiencies',
            $isCentralized ? 'Extend data access to frontline teams' : 'Consolidate data into a single source of truth',
            $isSiloed ? 'Create cross-functional project teams' : 'Streamline collaboration tools to reduce noise',
        ],
        'famous_last_words' => $isManual
            ? '"We\'ve always done it this way and it works... mostly."'
            : '"The system handles it — I think."',
        'real_world_example' => 'A mid-sized company with ' . ($isManual ? 'dedicated teams following established procedures' : 'modern tools and automation') .
            ', ' . ($isCentralized ? 'solid data infrastructure' : 'data spread across many tools') .
            ', but struggling with ' . ($isSiloed ? 'getting departments to work together' : 'information overload') .
            ' and ' . ($isProactive ? 'turning plans into action fast enough' : 'staying ahead of problems instead of reacting to them') . '.',
        'why_animal' => "Like the {$archetype['animal']}, your organization embodies " .
            ($isProactive ? 'watchfulness and foresight' : 'adaptability and quick reflexes') . '. ' .
            ($isCentralized ? 'You gather information effectively' : 'You\'re resourceful across many environments') . ', ' .
            ($isSiloed ? 'but tend to operate in your own territory' : 'and thrive through group dynamics') . '.',
    ];
}
