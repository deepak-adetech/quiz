<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Operational Archetype Quiz | <?= SITE_NAME ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="landing-page">
        <nav class="nav">
            <a href="<?= SITE_URL ?>" class="nav-logo"><?= SITE_NAME ?></a>
        </nav>

        <main class="landing-hero">
            <div class="hero-badge">FREE ASSESSMENT</div>
            <h1 class="hero-title">
                What's Your<br>
                <span class="hero-highlight">Operational Archetype?</span>
            </h1>
            <p class="hero-subtitle">
                Discover how your organization really operates. This 2-minute quiz reveals your
                unique operational DNA across 4 critical dimensions — and shows you exactly
                where to start improving.
            </p>

            <div class="hero-dimensions">
                <div class="dimension-pill">
                    <span class="pill-icon">&#9881;&#65039;</span>
                    <span>Execution</span>
                </div>
                <div class="dimension-pill">
                    <span class="pill-icon">&#128202;</span>
                    <span>Data</span>
                </div>
                <div class="dimension-pill">
                    <span class="pill-icon">&#128279;</span>
                    <span>Connection</span>
                </div>
                <div class="dimension-pill">
                    <span class="pill-icon">&#127919;</span>
                    <span>Control</span>
                </div>
            </div>

            <a href="quiz.php" class="btn-primary btn-large">
                Take the Quiz
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </a>
            <p class="hero-meta">12 questions &middot; Takes ~2 minutes &middot; Free</p>

            <div class="hero-social-proof">
                <div class="proof-avatars">
                    <div class="avatar" style="background:#4F46E5;">A</div>
                    <div class="avatar" style="background:#059669;">M</div>
                    <div class="avatar" style="background:#DC2626;">K</div>
                    <div class="avatar" style="background:#D97706;">S</div>
                    <div class="avatar" style="background:#7C3AED;">R</div>
                </div>
                <span class="proof-text">Trusted by 500+ business leaders</span>
            </div>
        </main>

        <section class="landing-preview">
            <h2 class="section-title">What You'll Discover</h2>
            <div class="preview-grid">
                <div class="preview-card">
                    <div class="preview-icon">&#128209;</div>
                    <h3>Your Archetype</h3>
                    <p>One of 16 unique operational profiles that reveals how your organization truly works.</p>
                </div>
                <div class="preview-card">
                    <div class="preview-icon">&#10024;</div>
                    <h3>Your Superpowers</h3>
                    <p>The operational strengths you should double down on and leverage for growth.</p>
                </div>
                <div class="preview-card">
                    <div class="preview-icon">&#9888;&#65039;</div>
                    <h3>Your Kryptonite</h3>
                    <p>Hidden weaknesses that silently drain time, money, and team morale.</p>
                </div>
                <div class="preview-card">
                    <div class="preview-icon">&#127937;</div>
                    <h3>Action Plan</h3>
                    <p>Concrete starting points tailored to your specific operational profile.</p>
                </div>
            </div>
        </section>

        <footer class="landing-footer">
            <p>&copy; <?= date('Y') ?> <?= SITE_NAME ?>. All rights reserved.</p>
        </footer>
    </div>
</body>
</html>
