document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    let isMenuOpen = false;

    // GSAP Timeline for Menu
    const menuTl = gsap.timeline({ 
        paused: true,
        onStart: () => {
            if (mobileMenu) mobileMenu.classList.add('active');
        },
        onReverseComplete: () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                gsap.set(mobileMenu, { xPercent: 100 });
            }
        }
    });

    if (mobileMenu) {
        gsap.set(mobileMenu, { xPercent: 100 });
        
        menuTl.to(mobileMenuOverlay, {
            opacity: 1,
            pointerEvents: 'auto',
            duration: 0.3,
            ease: 'power2.out'
        }).to(mobileMenu, {
            xPercent: 0,
            duration: 0.5,
            ease: 'expo.out'
        }, "-=0.1").from(".mobile-nav-item", {
            x: 15,
            opacity: 0,
            duration: 0.25,
            stagger: 0.04,
            ease: 'power1.out',
            clearProps: "all" // Clears GSAP styles after animation to let CSS take over
        }, "-=0.2");
    }

    function toggleMenu() {
        if (!mobileMenu || !mobileMenuBtn) return;
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            mobileMenuBtn.classList.add('is-active');
            if (navbar) navbar.classList.add('menu-is-open');
            menuTl.play();
            document.body.style.overflow = 'hidden';
        } else {
            mobileMenuBtn.classList.remove('is-active');
            if (navbar) navbar.classList.remove('menu-is-open');
            menuTl.reverse();
            document.body.style.overflow = '';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', toggleMenu);
    }

    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', toggleMenu);
    }

    // Mobile "Atuação" Submenu Toggle
    const mobileAtuacaoBtn = document.getElementById('mobile-atuacao-btn');
    const mobileAtuacaoSubmenu = document.getElementById('mobile-atuacao-submenu');
    const mobileAtuacaoArrow = document.getElementById('mobile-atuacao-arrow');

    if (mobileAtuacaoBtn && mobileAtuacaoSubmenu) {
        mobileAtuacaoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mobileAtuacaoSubmenu.classList.toggle('is-open');
            if (mobileAtuacaoArrow) {
                mobileAtuacaoArrow.classList.toggle('rotate-180', isOpen);
            }
        });
    }

    // Mobile "Impacto" Submenu Toggle
    const mobileImpactoBtn = document.getElementById('mobile-impacto-btn');
    const mobileImpactoSubmenu = document.getElementById('mobile-impacto-submenu');
    const mobileImpactoArrow = document.getElementById('mobile-impacto-arrow');

    if (mobileImpactoBtn && mobileImpactoSubmenu) {
        mobileImpactoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mobileImpactoSubmenu.classList.toggle('is-open');
            if (mobileImpactoArrow) {
                mobileImpactoArrow.classList.toggle('rotate-180', isOpen);
            }
        });
    }

    // Close menu on link click
    document.querySelectorAll('.nav-item, .mobile-nav-item, .mobile-sub-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Se for o botão de toggle do mobile, não fecha o menu principal
            if (link.id === 'mobile-atuacao-btn' || link.id === 'mobile-impacto-btn') return;
            
            if (isMenuOpen) toggleMenu();
        });
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) toggleMenu();
    });

    // Navbar Scroll Logic
    function updateNavbarOnScroll() {
        if (!navbar) return;
        if (window.scrollY > 40) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
    updateNavbarOnScroll();

    // Active link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-item, .mobile-nav-item, .dropdown-item, .mobile-sub-link').forEach(link => {
        const href = link.getAttribute('href');
        const text = link.textContent.trim();

        if (!href) {
            // Lógica para botões (como 'Atuação' no desktop/mobile)
            if (currentPath === 'polos.html' && text.includes('Atuação')) {
                link.classList.add('active');
            } else if (currentPath === 'impacto.html' && text.includes('Impacto')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
            return;
        }

        // Normalização simplificada para comparação de paths
        const normalizedHref = href.replace(/^\.\//, '').replace(/^\//, '');
        const normalizedCurrent = currentPath.replace(/^\//, '');

        if (normalizedHref === normalizedCurrent || (normalizedCurrent === 'index.html' && normalizedHref === '')) {
            link.classList.add('active');
        } else {
            // Caso especial para mantar o pai 'Atuação' ativo via texto se for um link (mobile)
            if (currentPath === 'polos.html' && text.includes('Atuação')) {
                link.classList.add('active');
            } else if (currentPath === 'impacto.html' && text.includes('Impacto')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
});
