/* ═══════════════════════════════════════════════════════════
   NUVORA — Interactive JavaScript v2
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Navbar Scroll Effect ───
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Mobile Menu Toggle ───
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
        const spans = hamburger.querySelectorAll('span');
        if (hamburger.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
        });
    });

    // ─── Smooth Scroll ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ─── FAQ Accordion ───
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-question').addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ─── Pricing Toggle ───
    const pricingToggle = document.getElementById('pricingToggle');
    const toggleLabels = document.querySelectorAll('.toggle-label');
    const prices = document.querySelectorAll('.price[data-monthly]');
    let isAnnual = false;

    if (pricingToggle) {
        pricingToggle.addEventListener('click', () => {
            isAnnual = !isAnnual;
            pricingToggle.classList.toggle('active');
            toggleLabels.forEach(label => label.classList.toggle('active'));

            prices.forEach(price => {
                const monthly = price.getAttribute('data-monthly');
                const annual = price.getAttribute('data-annual');
                price.style.opacity = '0';
                price.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    price.textContent = isAnnual ? annual : monthly;
                    price.style.opacity = '1';
                    price.style.transform = 'translateY(0)';
                }, 200);
            });
        });
    }

    // ─── Scroll Reveal Animations ───
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(
        '.feature-card, .step-card, .testimonial-card, .pricing-card, .blog-card, .faq-item, .use-case-card, .value-card, .int-icon-card'
    ).forEach(el => observer.observe(el));

    // ─── Parallax Effect for Hero Orbs ───
    let ticking = false;
    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const orbs = document.querySelectorAll('.hero-orb');
                const x = (e.clientX / window.innerWidth - 0.5) * 2;
                const y = (e.clientY / window.innerHeight - 0.5) * 2;
                orbs.forEach((orb, i) => {
                    const speed = (i + 1) * 12;
                    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    });

    // ─── Active Nav Link Highlight ───
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (scrollY >= section.offsetTop - 200) {
                current = section.getAttribute('id');
            }
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${current}`) {
                link.style.color = '#0ea5e9';
            }
        });
    });

    // ─── Counter Animation for Metrics ───
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
    }, { threshold: 0.5 });

    document.querySelectorAll('.metric-value').forEach(el => metricObserver.observe(el));

    function animateCounter(el, target, finalText) {
        const duration = 2000;
        const startTime = performance.now();
        function update(currentTime) {
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
        }
        requestAnimationFrame(update);
    }

    // ─── Chart Bar Animation ───
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.bar').forEach((bar, i) => {
                    const height = bar.style.height;
                    bar.style.height = '0%';
                    setTimeout(() => {
                        bar.style.transition = `height 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s`;
                        bar.style.height = height;
                    }, 100);
                });
                chartObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const chartContainer = document.querySelector('.chart-bars');
    if (chartContainer) chartObserver.observe(chartContainer);

    // ─── Typing effect for hero badge ───
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        heroBadge.style.opacity = '0';
        heroBadge.style.transform = 'translateY(10px)';
        setTimeout(() => {
            heroBadge.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            heroBadge.style.opacity = '1';
            heroBadge.style.transform = 'translateY(0)';
        }, 300);
    }

    // ─── Hero title stagger animation ───
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 500);
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 700);
    }

    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.style.opacity = '0';
        heroCta.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroCta.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroCta.style.opacity = '1';
            heroCta.style.transform = 'translateY(0)';
        }, 900);
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'translateY(30px)';
        setTimeout(() => {
            heroVisual.style.transition = 'opacity 1s ease, transform 1s ease';
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'translateY(0)';
        }, 600);
    }

    // ─── Newsletter form interaction ───
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = newsletterForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = '✓ Subscribed!';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
                newsletterForm.querySelector('input').value = '';
            }, 3000);
        });
    }

    // ─── Comparison table row hover effect ───
    document.querySelectorAll('.comparison-table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.background = 'rgba(201, 169, 110, 0.03)';
        });
        row.addEventListener('mouseleave', () => {
            row.style.background = '';
        });
    });

    // ─── Lazy load images with fade-in ───
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
        }
    });

});
