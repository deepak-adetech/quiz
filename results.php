<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/data/questions.php';

// Get results from session
$results = $_SESSION['quiz_results'] ?? null;

if (!$results) {
    header('Location: quiz.php');
    exit;
}

$code = $results['code'];
$scores = $results['scores'];
$pct = $results['percentages'];
$arch = $results['archetype'];
$d = $results['details'];
$user = $results['user'];

$userName = $user['name'] ?: 'Your Organization';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($arch['name']) ?> — Your Operational Archetype | <?= SITE_NAME ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">

    <!-- Open Graph -->
    <meta property="og:title" content="I'm <?= htmlspecialchars($arch['name']) ?> — What's Your Operational Archetype?">
    <meta property="og:description" content="<?= htmlspecialchars($arch['tagline']) ?>">
    <meta property="og:type" content="website">
</head>
<body>
    <div class="results-page">
        <nav class="nav">
            <a href="index.php" class="nav-logo"><?= SITE_NAME ?></a>
            <a href="quiz.php" class="btn-secondary btn-small">Retake Quiz</a>
        </nav>

        <main class="results-container">

            <!-- ─── HERO: ARCHETYPE HEADER ─── -->
            <section class="result-hero">
                <div class="archetype-icon"><?= $arch['emoji'] ?></div>
                <h1 class="archetype-name"><?= htmlspecialchars($arch['name']) ?></h1>
                <div class="archetype-code"><?= $code ?></div>
                <p class="archetype-tagline"><em><?= htmlspecialchars($arch['tagline']) ?></em></p>
            </section>

            <!-- ─── DIMENSION SCORES ─── -->
            <section class="result-section scores-section">
                <h2 class="section-heading">Your Operational DNA</h2>
                <div class="dimension-scores">
                    <div class="dimension-row">
                        <div class="dim-labels">
                            <span class="dim-low">Manual</span>
                            <span class="dim-name">Execution</span>
                            <span class="dim-high">Automated</span>
                        </div>
                        <div class="dim-bar-track">
                            <div class="dim-bar-fill" style="width: <?= $pct['execution'] ?>%;" data-pct="<?= $pct['execution'] ?>"></div>
                            <div class="dim-bar-marker" style="left: <?= $pct['execution'] ?>%;"></div>
                        </div>
                        <div class="dim-score"><?= $pct['execution'] ?>%</div>
                    </div>
                    <div class="dimension-row">
                        <div class="dim-labels">
                            <span class="dim-low">Fragmented</span>
                            <span class="dim-name">Data</span>
                            <span class="dim-high">Centralized</span>
                        </div>
                        <div class="dim-bar-track">
                            <div class="dim-bar-fill" style="width: <?= $pct['data'] ?>%;" data-pct="<?= $pct['data'] ?>"></div>
                            <div class="dim-bar-marker" style="left: <?= $pct['data'] ?>%;"></div>
                        </div>
                        <div class="dim-score"><?= $pct['data'] ?>%</div>
                    </div>
                    <div class="dimension-row">
                        <div class="dim-labels">
                            <span class="dim-low">Siloed</span>
                            <span class="dim-name">Connection</span>
                            <span class="dim-high">Integrated</span>
                        </div>
                        <div class="dim-bar-track">
                            <div class="dim-bar-fill" style="width: <?= $pct['connection'] ?>%;" data-pct="<?= $pct['connection'] ?>"></div>
                            <div class="dim-bar-marker" style="left: <?= $pct['connection'] ?>%;"></div>
                        </div>
                        <div class="dim-score"><?= $pct['connection'] ?>%</div>
                    </div>
                    <div class="dimension-row">
                        <div class="dim-labels">
                            <span class="dim-low">Reactive</span>
                            <span class="dim-name">Control</span>
                            <span class="dim-high">Proactive</span>
                        </div>
                        <div class="dim-bar-track">
                            <div class="dim-bar-fill" style="width: <?= $pct['control'] ?>%;" data-pct="<?= $pct['control'] ?>"></div>
                            <div class="dim-bar-marker" style="left: <?= $pct['control'] ?>%;"></div>
                        </div>
                        <div class="dim-score"><?= $pct['control'] ?>%</div>
                    </div>
                </div>
            </section>

            <!-- ─── TWO-COLUMN: CHARACTERISTICS + SUPERPOWERS/KRYPTONITE ─── -->
            <section class="result-section result-two-col">
                <!-- Left: Characteristics -->
                <div class="result-card card-characteristics">
                    <h2 class="card-heading">
                        <span class="card-icon">&#128196;</span>
                        Characteristics
                    </h2>
                    <div class="char-item">
                        <h4 class="char-label">EXECUTION STYLE</h4>
                        <p><?= htmlspecialchars($d['execution_style']) ?></p>
                    </div>
                    <div class="char-item">
                        <h4 class="char-label">DATA APPROACH</h4>
                        <p><?= htmlspecialchars($d['data_approach']) ?></p>
                    </div>
                    <div class="char-item">
                        <h4 class="char-label">CONNECTION PATTERN</h4>
                        <p><?= htmlspecialchars($d['connection_pattern']) ?></p>
                    </div>
                    <div class="char-item">
                        <h4 class="char-label">CONTROL POSTURE</h4>
                        <p><?= htmlspecialchars($d['control_posture']) ?></p>
                    </div>
                    <div class="char-item">
                        <h4 class="char-label">CULTURAL DNA</h4>
                        <p><?= htmlspecialchars($d['cultural_dna']) ?></p>
                    </div>
                </div>

                <!-- Right: Superpowers + Kryptonite -->
                <div class="result-right-col">
                    <div class="result-card card-superpowers">
                        <h2 class="card-heading">
                            <span class="card-icon">&#10024;</span>
                            Superpowers
                        </h2>
                        <ul class="trait-list">
                            <?php foreach ($d['superpowers'] as $i => $power): ?>
                            <li>
                                <span class="trait-emoji"><?= $d['superpower_emojis'][$i] ?? '&#10004;' ?></span>
                                <?= htmlspecialchars($power) ?>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>

                    <div class="result-card card-kryptonite">
                        <h2 class="card-heading">
                            <span class="card-icon">&#9888;&#65039;</span>
                            Kryptonite
                        </h2>
                        <ul class="trait-list">
                            <?php foreach ($d['kryptonite'] as $i => $weak): ?>
                            <li>
                                <span class="trait-emoji"><?= $d['kryptonite_emojis'][$i] ?? '&#10060;' ?></span>
                                <?= htmlspecialchars($weak) ?>
                            </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- ─── THREE-COLUMN: STARTING POINTS / FAMOUS LAST WORDS / REAL WORLD ─── -->
            <section class="result-section result-three-col">
                <div class="result-card card-starting">
                    <h2 class="card-heading">
                        <span class="card-icon">&#127919;</span>
                        Ideal Starting Point
                    </h2>
                    <ol class="starting-list">
                        <?php foreach ($d['ideal_starting_points'] as $i => $step): ?>
                        <li>
                            <span class="step-num"><?= $i + 1 ?></span>
                            <?= htmlspecialchars($step) ?>
                        </li>
                        <?php endforeach; ?>
                    </ol>
                </div>

                <div class="result-card card-famous">
                    <h2 class="card-heading">
                        <span class="card-icon">&#128172;</span>
                        Famous Last Words
                    </h2>
                    <p class="famous-quote"><?= htmlspecialchars($d['famous_last_words']) ?></p>
                </div>

                <div class="result-card card-example">
                    <h2 class="card-heading">Real World Example</h2>
                    <p><?= htmlspecialchars($d['real_world_example']) ?></p>
                </div>
            </section>

            <!-- ─── SPIRIT ANIMAL ─── -->
            <section class="result-section">
                <div class="result-card card-animal">
                    <div class="animal-header">
                        <span class="animal-emoji"><?= $arch['animal_emoji'] ?></span>
                        <h2 class="card-heading">Why <?= htmlspecialchars($arch['animal']) ?>?</h2>
                    </div>
                    <p class="animal-text"><?= htmlspecialchars($d['why_animal']) ?></p>
                </div>
            </section>

            <!-- ─── CTA ─── -->
            <section class="result-section result-cta">
                <div class="cta-card">
                    <h2>Ready to Transform Your Operations?</h2>
                    <p>Now that you know your archetype, let's build a roadmap to level up your operational maturity.</p>
                    <div class="cta-buttons">
                        <a href="<?= SITE_URL ?>" class="btn-primary btn-large">
                            Book a Strategy Call
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M4.167 10h11.666M10 4.167L15.833 10 10 15.833" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </a>
                        <button class="btn-secondary btn-large" onclick="window.print()">
                            &#128424; Download Report
                        </button>
                    </div>
                    <div class="share-section">
                        <p class="share-label">Share your archetype:</p>
                        <div class="share-buttons">
                            <button class="share-btn" onclick="shareResult('twitter')" title="Share on X/Twitter">
                                &#120143;
                            </button>
                            <button class="share-btn" onclick="shareResult('linkedin')" title="Share on LinkedIn">
                                in
                            </button>
                            <button class="share-btn" onclick="shareResult('copy')" title="Copy link">
                                &#128279;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

        </main>

        <footer class="landing-footer">
            <p>&copy; <?= date('Y') ?> <?= SITE_NAME ?>. All rights reserved.</p>
        </footer>
    </div>

    <script>
        // Animate dimension bars on load
        document.addEventListener('DOMContentLoaded', function() {
            const bars = document.querySelectorAll('.dim-bar-fill');
            bars.forEach(function(bar, i) {
                const pct = bar.getAttribute('data-pct');
                bar.style.width = '0%';
                setTimeout(function() {
                    bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    bar.style.width = pct + '%';
                }, 200 + (i * 150));
            });

            const markers = document.querySelectorAll('.dim-bar-marker');
            markers.forEach(function(marker, i) {
                const left = marker.style.left;
                marker.style.left = '0%';
                setTimeout(function() {
                    marker.style.transition = 'left 1s cubic-bezier(0.4, 0, 0.2, 1)';
                    marker.style.left = left;
                }, 200 + (i * 150));
            });
        });

        function shareResult(platform) {
            const text = "I'm <?= addslashes($arch['name']) ?> (<?= $code ?>) — <?= addslashes($arch['tagline']) ?> Take the quiz:";
            const url = window.location.href;

            switch(platform) {
                case 'twitter':
                    window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank');
                    break;
                case 'linkedin':
                    window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url), '_blank');
                    break;
                case 'copy':
                    navigator.clipboard.writeText(url).then(function() {
                        var btn = event.target.closest('.share-btn');
                        btn.textContent = '\u2713';
                        setTimeout(function() { btn.innerHTML = '&#128279;'; }, 2000);
                    });
                    break;
            }
        }
    </script>
</body>
</html>
