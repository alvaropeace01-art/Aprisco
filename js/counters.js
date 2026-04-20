document.addEventListener('DOMContentLoaded', function () {
    const statsSection = document.getElementById('impacto-stats');
    if (!statsSection) return;

    const counters = statsSection.querySelectorAll('[data-target]');
    if (!counters.length) return;

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        const prefix = counter.getAttribute('data-prefix') || '';
        const suffix = counter.getAttribute('data-suffix') || '';
        const duration = 1200;
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const value = Math.floor(target * eased);

            counter.textContent = `${prefix}${value.toLocaleString('pt-BR')}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
            }
        }

        requestAnimationFrame(update);
    }

    const VISIBILITY_THRESHOLD = 0.45;

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            const counter = entry.target;

            if (!entry.isIntersecting) return;
            if (entry.intersectionRatio < VISIBILITY_THRESHOLD) return;
            if (counter.dataset.animated === 'true') return;

            counter.dataset.animated = 'true';
            animateCounter(counter);
            obs.unobserve(counter);
        });
    }, {
        threshold: [VISIBILITY_THRESHOLD]
    });

    counters.forEach(function (counter) {
        observer.observe(counter);
    });
});
