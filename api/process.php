<?php
/**
 * API Endpoint: Process quiz answers and generate results via Claude API
 *
 * Expects POST JSON: { answers: {0: 2, 1: 1, ...}, name: "", email: "", company: "" }
 * Returns JSON: { success: true, redirect: "results.php?id=..." }
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../data/questions.php';
require_once __DIR__ . '/../includes/claude-api.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Parse input
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['answers'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request body']);
    exit;
}

$answers = $input['answers'];
$userName = trim($input['name'] ?? '');
$userEmail = trim($input['email'] ?? '');
$userCompany = trim($input['company'] ?? '');

// Validate all questions answered
if (count($answers) < count($questions)) {
    http_response_code(400);
    echo json_encode(['error' => 'Please answer all questions']);
    exit;
}

// Calculate archetype
$result = calculateArchetype($answers);
$code = $result['code'];
$scores = $result['scores'];
$percentages = $result['percentages'];

// Get archetype metadata
$archetype = $archetypes[$code] ?? $archetypes['MCSP'];

// Call Claude API for detailed results
$aiResults = null;
if (CLAUDE_API_KEY !== 'YOUR_CLAUDE_API_KEY_HERE') {
    $aiResults = callClaudeAPI($code, $scores, $percentages, $archetype, $userName);
}

// Fallback if API fails or no key
if (!$aiResults) {
    $aiResults = generateFallbackResults($code, $archetype);
}

// Store results in session
$_SESSION['quiz_results'] = [
    'code' => $code,
    'scores' => $scores,
    'percentages' => $percentages,
    'archetype' => $archetype,
    'details' => $aiResults,
    'user' => [
        'name' => $userName,
        'email' => $userEmail,
        'company' => $userCompany,
    ],
    'timestamp' => time(),
];

// Generate a unique result ID
$resultId = substr(md5($code . time() . $userEmail), 0, 12);
$_SESSION['result_id'] = $resultId;

echo json_encode([
    'success' => true,
    'redirect' => 'results.php?id=' . $resultId,
]);
