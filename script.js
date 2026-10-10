/* ═══════════════════════════════════════════════════════════
   NUVORA — High Performance & Fully Responsive JavaScript
   Instant Loading • Zero Delays • Mobile First
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    }

    // ─── Mobile Menu Toggle ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        const toggleMenu = (open) => {
            const shouldOpen = open !== undefined ? open : !navLinks.classList.contains('active');
            navLinks.classList.toggle('active', shouldOpen);
            hamburger.classList.toggle('active', shouldOpen);
            hamburger.setAttribute('aria-expanded', shouldOpen);
            document.body.style.overflow = shouldOpen ? 'hidden' : '';

            const spans = hamburger.querySelectorAll('span');
            if (shouldOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        };

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close on nav link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close on click outside
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                toggleMenu(false);
            }
        });

        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }

    // ─── Smooth Anchor Scroll with Navbar Offset ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navHeight = navbar ? navbar.offsetHeight : 70;
                const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── FAQ Accordion ───
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        }
    });

    // ─── Pricing Toggle (Monthly / Annual) ───
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const prices = document.querySelectorAll('.price[data-monthly]');
    let isAnnual = false;

    if (pricingToggle) {
        pricingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            pricingToggle.classList.toggle('active', isAnnual);
            toggleLabels.forEach(label => label.classList.toggle('active'));

            prices.forEach(price => {
                const monthly = price.getAttribute('data-monthly');
                const annual = price.getAttribute('data-annual');
                price.textContent = isAnnual ? annual : monthly;
            });
        });
    }

    // ─── Active Nav Link on Scroll ───
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0 && navLinks) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.pageYOffset + 120;
            sections.forEach(section => {
                if (scrollPos >= section.offsetTop) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.querySelectorAll('a[href^="#"]').forEach(link => {
                if (link.getAttribute('href') === `#${current}`) {
                    link.style.color = 'var(--gold)';
                } else {
                    link.style.color = '';
                }
            });
        }, { passive: true });
    }

    // ─── Metric Counter Animation ───
    const animateCounter = (el, target, finalText) => {
        const duration = 1500;
        const startTime = performance.now();
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            if (progress < 1) {
                if (target >= 100) el.textContent = Math.floor(current).toLocaleString();
                else el.textContent = current.toFixed(1);
                requestAnimationFrame(update);
            } else {
                el.textContent = finalText;
            }
        };
        requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window) {
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const finalText = el.textContent;
                    const target = parseFloat(el.getAttribute('data-target'));
                    if (target && !el.classList.contains('counted')) {
                        el.classList.add('counted');
                        animateCounter(el, target, finalText);
                    }
                    metricObserver.unobserve(el);
                }
            });
        }, { threshold: 0.2 });
        document.querySelectorAll('.metric-value').forEach(el => metricObserver.observe(el));
    }

    // ─── Chart Bar Animation ───
    const chartContainer = document.querySelector('.chart-bars');
    if (chartContainer && 'IntersectionObserver' in window) {
        const chartObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.bar').forEach((bar, i) => {
                        const targetHeight = bar.getAttribute('data-height') || bar.style.height;
                        bar.style.height = '0%';
                        requestAnimationFrame(() => {
                            bar.style.transition = `height 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.04}s`;
                            bar.style.height = targetHeight;
                        });
                    });
                    chartObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        chartObserver.observe(chartContainer);
    }

    // ─── Subtle Parallax for Hero Orbs (Desktop Only) ───
    if (window.innerWidth > 991) {
        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const orbs = document.querySelectorAll('.hero-orb');
                    const x = (e.clientX / window.innerWidth - 0.5) * 2;
                    const y = (e.clientY / window.innerHeight - 0.5) * 2;
                    orbs.forEach((orb, i) => {
                        const speed = (i + 1) * 8;
                        orb.style.transform = `translate3d(${x * speed}px, ${y * speed}px, 0)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ─── Newsletter Form ───
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            btn.style.color = '#ffffff';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                newsletterForm.querySelector('input').value = '';
            }, 3000);
        });
    }

    // ─── Instant Image Display (No Delays, No Layout Shifts) ───
    document.querySelectorAll('img').forEach(img => {
        img.style.opacity = '1';
    });

});
