document.addEventListener('DOMContentLoaded', () => {

    // 0. Initialize Lenis (Smooth Scroll) - Modo Líquido Zero Atrito
    const lenis = new Lenis({
        duration: 1.5,
        lerp: 0.1, // Suavidade extrema na desaceleração
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 1. Scrolled Navbar State
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const hamburger = document.querySelector('.hamburger');
    let menuOpen = false;

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuOpen = !menuOpen;
            navLinks.classList.toggle('active');

            // Hamburger animation effect class trigger
            if (menuOpen) {
                menuBtn.classList.add('is-active');
                menuBtn.setAttribute('aria-expanded', 'true');
            } else {
                menuBtn.classList.remove('is-active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link, .btn-primary').forEach(link => {
        link.addEventListener('click', () => {
            if (menuOpen) {
                menuBtn.click(); // Trigger close
            }
        });
    });

    // 3. Intersection Observer for Fade-In Elements
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // 4. Smooth scrolling mitigado e passado nativamente para CSS
    // 5. Legal Modals LGPD Logic
    const openModalBtns = document.querySelectorAll('.open-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const modalOverlays = document.querySelectorAll('.legal-modal-overlay');

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.legal-modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    modalOverlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modalOverlays.forEach(overlay => {
                if (overlay.classList.contains('active')) {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    });

    // 6. Cookie Consent LocalStorage Logic
    const cookieBanner = document.getElementById('cookie-banner');
    const btnAcceptAll = document.getElementById('btn-accept-all');
    const btnAcceptNecessary = document.getElementById('btn-accept-necessary');

    // Mostra o painel com 2s de atraso caso o usuário nunca o tenha aceitado localmente
    if (cookieBanner && !localStorage.getItem('perozim_cookie_consent')) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
            document.body.classList.add('has-cookie-banner');
        }, 2000);
    }

    const closeCookieBanner = (preference) => {
        localStorage.setItem('perozim_cookie_consent', preference);
        cookieBanner.classList.remove('show');
        document.body.classList.remove('has-cookie-banner');
    };

    if (btnAcceptAll) {
        btnAcceptAll.addEventListener('click', () => closeCookieBanner('all'));
    }

    if (btnAcceptNecessary) {
        btnAcceptNecessary.addEventListener('click', () => closeCookieBanner('necessary'));
    }

    // Disparador manual para abrir a Modal diretamente do Banner de Cookie
    const cookieModalLink = document.getElementById('cookie-policy-link');
    if (cookieModalLink) {
        cookieModalLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = cookieModalLink.getAttribute('data-target');
            const targetModal = document.getElementById(targetId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // 7. Lenis Anchor Link Support
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -100, // Ajuste para o header fixo
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // 8. Security Alert Logic (Anti-Golpe)
    const securityAlert = document.getElementById('security-alert');
    const closeSecurityAlertBtn = document.getElementById('close-security-alert');

    const checkSecurityDisplay = () => {
        // 1. Verifica se foi um refresh (F5)
        const navigationType = performance.getEntriesByType("navigation")[0]?.type;
        const isReload = navigationType === 'reload';

        // 2. Verifica se veio de fora (URL direta ou site externo)
        // Se o referer não contiver o nosso host, é uma entrada "nova"
        const isDirectEntry = !document.referrer || !document.referrer.includes(window.location.hostname);

        // Mostra o alerta se for REFRESH ou ENTRADA DIRETA
        if (securityAlert && (isReload || isDirectEntry)) {
            setTimeout(() => {
                securityAlert.classList.add('active');
                document.body.style.overflow = 'hidden';
            }, 200); // Reduzido para 200ms (quase instantâneo)
        }
    };

    if (securityAlert) {
        checkSecurityDisplay();
    }

    const dismissAlert = () => {
        if (securityAlert) {
            securityAlert.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeSecurityAlertBtn) {
        closeSecurityAlertBtn.addEventListener('click', dismissAlert);
    }

    if (securityAlert) {
        securityAlert.addEventListener('click', (e) => {
            if (e.target === securityAlert) {
                dismissAlert();
            }
        });
    }

});


