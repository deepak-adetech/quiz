<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/questions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz | <?= SITE_NAME ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="quiz-page">
        <nav class="nav">
            <a href="index.php" class="nav-logo"><?= SITE_NAME ?></a>
            <div class="nav-progress">
                <span class="progress-text">Question <span id="current-q">1</span> of <?= count($questions) ?></span>
            </div>
        </nav>

        <div class="quiz-container">
            <!-- Progress Bar -->
            <div class="progress-bar-wrap">
                <div class="progress-bar" id="progress-bar" style="width: 0%"></div>
            </div>

            <!-- Questions -->
            <div class="questions-wrapper" id="questions-wrapper">
                <?php foreach ($questions as $index => $q): ?>
                <div class="question-slide <?= $index === 0 ? 'active' : '' ?>" data-question="<?= $index ?>">
                    <div class="question-category">
                        <?php
                        $categoryLabels = [
                            'execution' => 'Execution Style',
                            'data' => 'Data & Systems',
                            'connection' => 'Team Connection',
                            'control' => 'Operational Control',
                        ];
                        echo $categoryLabels[$q['dimension']] ?? $q['dimension'];
                        ?>
                    </div>
                    <h2 class="question-text"><?= htmlspecialchars($q['text']) ?></h2>
                    <div class="options-list">
                        <?php foreach ($q['options'] as $optIndex => $opt): ?>
                        <button class="option-btn" data-question="<?= $index ?>" data-option="<?= $optIndex ?>">
                            <span class="option-letter"><?= chr(65 + $optIndex) ?></span>
                            <span class="option-text"><?= htmlspecialchars($opt['text']) ?></span>
                        </button>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endforeach; ?>

                <!-- Email Capture (after last question) -->
                <div class="question-slide" data-question="email" id="email-slide">
                    <div class="email-capture">
                        <div class="email-icon">&#128232;</div>
                        <h2 class="question-text">Almost there! Where should we send your results?</h2>
                        <p class="email-subtitle">Get your personalized Operational Archetype report with detailed insights and action steps.</p>
                        <form id="email-form" class="email-form">
                            <div class="form-row">
                                <input type="text" id="user-name" name="name" placeholder="Your name" required class="form-input">
                            </div>
                            <div class="form-row">
                                <input type="email" id="user-email" name="email" placeholder="your@email.com" required class="form-input">
                            </div>
                            <div class="form-row">
                                <input type="text" id="user-company" name="company" placeholder="Company name (optional)" class="form-input">
                            </div>
                            <button type="submit" class="btn-primary btn-large btn-full" id="submit-btn">
                                See My Results
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </form>
                        <button class="skip-link" id="skip-email">Skip and see results</button>
                    </div>
                </div>

                <!-- Loading State -->
                <div class="question-slide" data-question="loading" id="loading-slide">
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <h2 class="loading-title">Analyzing your operational DNA...</h2>
                        <p class="loading-text">Our AI is generating your personalized archetype report.</p>
                        <div class="loading-steps">
                            <div class="loading-step active" id="step-1">Calculating dimension scores...</div>
                            <div class="loading-step" id="step-2">Identifying your archetype...</div>
                            <div class="loading-step" id="step-3">Generating insights and recommendations...</div>
                            <div class="loading-step" id="step-4">Preparing your report...</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <div class="quiz-nav" id="quiz-nav">
                <button class="btn-secondary" id="btn-prev" disabled>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M15.833 10H4.167M10 15.833L4.167 10 10 4.167" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Back
                </button>
                <div class="quiz-dots" id="quiz-dots">
                    <?php for ($i = 0; $i < count($questions); $i++): ?>
                    <span class="dot <?= $i === 0 ? 'active' : '' ?>" data-dot="<?= $i ?>"></span>
                    <?php endfor; ?>
                </div>
                <div id="nav-spacer"></div>
            </div>
        </div>
    </div>

    <!-- Pass questions data to JS -->
    <script>
        const TOTAL_QUESTIONS = <?= count($questions) ?>;
    </script>
    <script src="js/quiz.js"></script>
</body>
</html>
