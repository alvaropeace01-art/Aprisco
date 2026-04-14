document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('[data-target]');
    const speed = 200; // Velocidade da animação

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.textContent.replace(/[^\d]/g, '')) || 0;
        
        if (count < target) {
            counter.textContent = Math.ceil(count + (target - count) / speed);
            setTimeout(() => animateCounter(counter), 20);
        } else {
            counter.textContent = target.toLocaleString() + (counter.getAttribute('data-target').includes('+') ? '+' : '');
        }
    }

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const countersInView = entry.target.querySelectorAll('[data-target]');
                countersInView.forEach(animateCounter);
                observer.unobserve(entry.target);
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5
    });

    const statsSection = document.getElementById('impacto-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});
