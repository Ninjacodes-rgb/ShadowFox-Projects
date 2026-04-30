document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor Logic
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const interactiveElements = document.querySelectorAll('a, button, .player-card');

    if (window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Add a slight delay for the follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                follower.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                follower.classList.remove('active');
            });
        });
    }

    // 2. Parallax Effect on Hero Section
    const parallaxEl = document.querySelector('[data-parallax]');
    const parallaxReverseEl = document.querySelector('[data-parallax-reverse]');

    if (window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

            if (parallaxEl) {
                parallaxEl.style.transform = `translate(${xAxis}px, ${yAxis}px)`;
            }
            if (parallaxReverseEl) {
                parallaxReverseEl.style.transform = `translate(${-xAxis * 1.5}px, ${-yAxis * 1.5}px)`;
            }
        });
    }

    // 3. Scroll Reveal Animations with Intersection Observer
    const revealElements = document.querySelectorAll('.fade-in-scroll');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Reveal Text Animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = 0;
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
            heroTitle.style.opacity = 1;
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    // 5. Hash-based Routing Logic
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-links a');

    function handleRoute() {
        let hash = window.location.hash || '#hero';
        
        // Hide all pages
        pages.forEach(page => page.classList.remove('active'));
        
        // Show target page
        const targetPage = document.querySelector(hash);
        if (targetPage) {
            targetPage.classList.add('active');
            
            // Re-trigger animations if needed
            const hiddenElements = targetPage.querySelectorAll('.fade-in-scroll:not(.visible)');
            hiddenElements.forEach(el => revealOnScroll.observe(el));
        }

        // Update nav active states if needed
        navLinks.forEach(link => {
            if (link.getAttribute('href') === hash) {
                link.style.color = 'var(--kkr-gold)';
            } else {
                link.style.color = 'var(--text-main)';
            }
        });
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call on initial load

    // 6. Trivia Game Logic
    const quizData = [
        {
            question: "In which year did KKR win their first IPL title?",
            options: ["2010", "2012", "2014", "2024"],
            correct: 1
        },
        {
            question: "Who holds the record for the highest individual score by a KKR batsman in an IPL match?",
            options: ["Brendon McCullum", "Sunil Narine", "Andre Russell", "Venkatesh Iyer"],
            correct: 0
        },
        {
            question: "Who is the current head coach of KKR (as of 2024)?",
            options: ["Jacques Kallis", "Brendon McCullum", "Chandrakant Pandit", "Trevor Bayliss"],
            correct: 2
        },
        {
            question: "Which player famously hit 5 consecutive sixes in the final over to win a match for KKR?",
            options: ["Andre Russell", "Rinku Singh", "Pat Cummins", "Sunil Narine"],
            correct: 1
        },
        {
            question: "What is KKR's official team anthem/motto?",
            options: ["Whistle Podu", "Play Bold", "Korbo Lorbo Jeetbo", "Halla Bol"],
            correct: 2
        }
    ];

    let currentQuestion = 0;
    let score = 0;

    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const currentQSpan = document.getElementById('current-q');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const finalScoreSpan = document.getElementById('final-score');
    const restartBtn = document.getElementById('restart-btn');

    function loadQuestion() {
        const q = quizData[currentQuestion];
        questionText.textContent = q.question;
        currentQSpan.textContent = currentQuestion + 1;
        optionsContainer.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.classList.add('quiz-option');
            btn.textContent = opt;
            btn.addEventListener('click', () => selectAnswer(index, btn));
            optionsContainer.appendChild(btn);
        });
    }

    function selectAnswer(index, btn) {
        const isCorrect = index === quizData[currentQuestion].correct;
        
        // Disable all buttons
        const allBtns = optionsContainer.querySelectorAll('.quiz-option');
        allBtns.forEach(b => b.style.pointerEvents = 'none');

        if (isCorrect) {
            btn.classList.add('correct');
            score++;
        } else {
            btn.classList.add('wrong');
            // Highlight correct answer
            allBtns[quizData[currentQuestion].correct].classList.add('correct');
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < quizData.length) {
                loadQuestion();
            } else {
                showResults();
            }
        }, 1500);
    }

    function showResults() {
        quizScreen.classList.add('quiz-hidden');
        resultScreen.classList.remove('quiz-hidden');
        finalScoreSpan.textContent = score;
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            quizScreen.classList.remove('quiz-hidden');
            resultScreen.classList.add('quiz-hidden');
            loadQuestion();
        });
    }

    // Initialize Quiz
    if (questionText && optionsContainer) {
        loadQuestion();
    }
});
