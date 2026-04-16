/**
 * Interactive Quiz Flow Controller
 * Handles single-question-at-a-time navigation, answer selection, and result submission.
 */
(function () {
    'use strict';

    // ── State ──────────────────────────────────────────────
    let currentQuestion = 0;
    const answers = {};
    const slides = document.querySelectorAll('.question-slide');
    const totalQuestions = TOTAL_QUESTIONS; // set by PHP
    const progressBar = document.getElementById('progress-bar');
    const currentQEl = document.getElementById('current-q');
    const btnPrev = document.getElementById('btn-prev');
    const dots = document.querySelectorAll('.dot');
    const quizNav = document.getElementById('quiz-nav');
    const emailSlide = document.getElementById('email-slide');
    const loadingSlide = document.getElementById('loading-slide');

    // ── Initialize ─────────────────────────────────────────
    function init() {
        // Bind option buttons
        document.querySelectorAll('.option-btn').forEach(function (btn) {
            btn.addEventListener('click', handleOptionClick);
        });

        // Bind prev button
        btnPrev.addEventListener('click', goBack);

        // Bind email form
        document.getElementById('email-form').addEventListener('submit', handleEmailSubmit);
        document.getElementById('skip-email').addEventListener('click', function (e) {
            e.preventDefault();
            submitQuiz('', '', '');
        });

        // Keyboard navigation
        document.addEventListener('keydown', handleKeypress);

        updateUI();
    }

    // ── Option Selection ───────────────────────────────────
    function handleOptionClick(e) {
        var btn = e.currentTarget;
        var qIndex = parseInt(btn.getAttribute('data-question'));
        var optIndex = parseInt(btn.getAttribute('data-option'));

        // Store answer
        answers[qIndex] = optIndex;

        // Visual feedback
        var slide = btn.closest('.question-slide');
        slide.querySelectorAll('.option-btn').forEach(function (b) {
            b.classList.remove('selected');
        });
        btn.classList.add('selected');

        // Auto-advance after brief delay
        setTimeout(function () {
            goNext();
        }, 350);
    }

    // ── Navigation ─────────────────────────────────────────
    function goNext() {
        if (currentQuestion < totalQuestions - 1) {
            // Next question
            currentQuestion++;
            showSlide(currentQuestion);
        } else if (currentQuestion === totalQuestions - 1) {
            // Show email capture
            showEmailSlide();
        }
    }

    function goBack() {
        if (currentQuestion > 0) {
            currentQuestion--;
            showSlide(currentQuestion);
        }
    }

    function showSlide(index) {
        // Hide all question slides
        slides.forEach(function (s) {
            s.classList.remove('active', 'slide-left', 'slide-right');
        });

        // Show target slide
        var target = document.querySelector('.question-slide[data-question="' + index + '"]');
        if (target) {
            target.classList.add('active');
        }

        // Restore previous answer if any
        if (answers[index] !== undefined) {
            var btns = target.querySelectorAll('.option-btn');
            btns.forEach(function (b) { b.classList.remove('selected'); });
            if (btns[answers[index]]) {
                btns[answers[index]].classList.add('selected');
            }
        }

        updateUI();
    }

    function showEmailSlide() {
        slides.forEach(function (s) {
            s.classList.remove('active');
        });
        emailSlide.classList.add('active');
        quizNav.style.display = 'none';

        // Focus name input
        setTimeout(function () {
            document.getElementById('user-name').focus();
        }, 300);
    }

    function showLoadingSlide() {
        slides.forEach(function (s) {
            s.classList.remove('active');
        });
        loadingSlide.classList.add('active');
        quizNav.style.display = 'none';

        // Animate loading steps
        var steps = loadingSlide.querySelectorAll('.loading-step');
        steps.forEach(function (step, i) {
            setTimeout(function () {
                step.classList.add('active');
                if (i > 0) {
                    steps[i - 1].classList.add('done');
                }
            }, 800 * (i + 1));
        });
    }

    // ── UI Updates ─────────────────────────────────────────
    function updateUI() {
        // Progress bar
        var progress = ((currentQuestion + 1) / totalQuestions) * 100;
        progressBar.style.width = progress + '%';

        // Question counter
        currentQEl.textContent = currentQuestion + 1;

        // Prev button
        btnPrev.disabled = currentQuestion === 0;

        // Dots
        dots.forEach(function (dot, i) {
            dot.classList.remove('active', 'answered');
            if (i === currentQuestion) dot.classList.add('active');
            if (answers[i] !== undefined) dot.classList.add('answered');
        });
    }

    // ── Keyboard ───────────────────────────────────────────
    function handleKeypress(e) {
        // a/b/c/d or 1/2/3/4 to select options
        var keyMap = { 'a': 0, 'b': 1, 'c': 2, 'd': 3, '1': 0, '2': 1, '3': 2, '4': 3 };
        if (keyMap[e.key.toLowerCase()] !== undefined && !emailSlide.classList.contains('active')) {
            var optIndex = keyMap[e.key.toLowerCase()];
            var slide = document.querySelector('.question-slide[data-question="' + currentQuestion + '"]');
            if (slide) {
                var btns = slide.querySelectorAll('.option-btn');
                if (btns[optIndex]) {
                    btns[optIndex].click();
                }
            }
        }

        // Left arrow = back
        if (e.key === 'ArrowLeft') {
            goBack();
        }
    }

    // ── Submission ─────────────────────────────────────────
    function handleEmailSubmit(e) {
        e.preventDefault();
        var name = document.getElementById('user-name').value.trim();
        var email = document.getElementById('user-email').value.trim();
        var company = document.getElementById('user-company').value.trim();
        submitQuiz(name, email, company);
    }

    function submitQuiz(name, email, company) {
        // Show loading
        showLoadingSlide();

        var payload = {
            answers: answers,
            name: name,
            email: email,
            company: company,
        };

        fetch('api/process.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(function (res) { return res.json(); })
        .then(function (data) {
            if (data.success && data.redirect) {
                // Small delay for loading animation to complete
                setTimeout(function () {
                    window.location.href = data.redirect;
                }, 2000);
            } else {
                alert('Something went wrong: ' + (data.error || 'Unknown error'));
                showEmailSlide();
            }
        })
        .catch(function (err) {
            console.error('Submission error:', err);
            alert('Network error. Please try again.');
            showEmailSlide();
        });
    }

    // ── Boot ───────────────────────────────────────────────
    init();
})();
