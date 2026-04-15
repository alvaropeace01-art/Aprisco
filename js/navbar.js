document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuBtn ? mobileMenuBtn.querySelector('svg') : null;
    let isMenuOpen = false;

    function setMenuState(open) {
        if (!mobileMenu || !mobileMenuBtn) return;

        isMenuOpen = open;
        mobileMenu.classList.toggle('is-open', open);
        mobileMenu.classList.toggle('hidden', !open);

        mobileMenuBtn.setAttribute('aria-expanded', String(open));
        mobileMenuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

        if (mobileMenuIcon) {
            mobileMenuIcon.style.transform = open ? 'rotate(90deg)' : 'rotate(0deg)';
            mobileMenuIcon.style.transition = 'transform 0.28s ease';
        }
    }

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function () {
            setMenuState(!isMenuOpen);
        });

        document.addEventListener('click', function (event) {
            const clickedOutside = !mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target);
            if (isMenuOpen && clickedOutside) {
                setMenuState(false);
            }
        });

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenuState(false);
            });
        });

        setMenuState(false);
    }

    function updateNavbarOnScroll() {
        if (!navbar) return;
        if (window.scrollY > 24) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    }

    updateNavbarOnScroll();
    window.addEventListener('scroll', updateNavbarOnScroll, { passive: true });
});
