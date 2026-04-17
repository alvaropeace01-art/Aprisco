document.addEventListener('DOMContentLoaded', function () {
    if (window.gsap) {
        gsap.registerPlugin(ScrollTrigger);

        // Força aceleração 3D para evitar jitter no scroll
        gsap.config({ force3D: true });

        // Entrance animations
        gsap.from('.reveal-on-load', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            ease: 'expo.out',
            stagger: 0.15
        });

        // Scroll animations
        gsap.utils.toArray('.reveal-on-scroll').forEach(function (el) {
            gsap.from(el, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Parallax for Hero Background
        gsap.to('.hero-bg', {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 0.8
            }
        });

        // Carousel Cidadania Logic - Optimized GSAP Loop
        const track = document.getElementById('carousel-track');
        const dotsContainer = document.getElementById('carousel-dots');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        const originalSlides = Array.from(track.children);
        const originalLength = originalSlides.length;
        
        // Clone slides to create infinite effect
        // Append all slides once more to the end
        originalSlides.forEach(slide => {
            const clone = slide.cloneNode(true);
            track.appendChild(clone);
        });
        
        // Prepend all slides once more to the beginning
        [...originalSlides].reverse().forEach(slide => {
            const clone = slide.cloneNode(true);
            track.insertBefore(clone, track.firstChild);
        });

        const allSlides = Array.from(track.children);
        let currentIndex = originalLength; // Start at the first original slide
        let isTransitioning = false;
        let autoPlayInterval;
        let autoPlayTimeout;

        // Create Dots (only for original slides)
        originalSlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (isTransitioning) return;
                goToSlide(index + originalLength);
                handleManualInteraction();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = Array.from(dotsContainer.children);

        // Manual Navigation
        prevBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            prevSlide();
            handleManualInteraction();
        });

        nextBtn.addEventListener('click', () => {
            if (isTransitioning) return;
            nextSlide();
            handleManualInteraction();
        });

        function handleManualInteraction() {
            clearInterval(autoPlayInterval);
            clearTimeout(autoPlayTimeout);
            autoPlayTimeout = setTimeout(() => {
                startAutoPlay();
            }, 3000);
        }

        function getVisibleSlides() {
            if (window.innerWidth >= 1024) return 3;
            if (window.innerWidth >= 640) return 2;
            return 1;
        }

        function updateCarousel(withTransition = true) {
            const visibleSlides = getVisibleSlides();
            // Precisão de sub-pixel para evitar "vazamento" de imagens vizinhas
            const slideWidth = allSlides[0].getBoundingClientRect().width;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            
            const offset = currentIndex * (slideWidth + gap);

            if (withTransition) {
                isTransitioning = true;
                gsap.to(track, {
                    x: -offset,
                    duration: 0.6,
                    ease: "power2.inOut",
                    onComplete: () => {
                        checkIndex();
                        isTransitioning = false;
                    }
                });
            } else {
                gsap.set(track, { x: -offset });
            }

            // Update Dots
            const dotIndex = currentIndex % originalLength;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === dotIndex);
            });
        }

        function checkIndex() {
            // Se chegou na parte clonada do final (passou todos os originais + clones do início)
            if (currentIndex >= originalLength * 2) {
                currentIndex = originalLength;
                updateCarousel(false);
            }
            // Se chegou na parte clonada do início
            if (currentIndex < originalLength) {
                currentIndex = originalLength * 2 - 1;
                if (getVisibleSlides() === 1) {
                  // Specific fix for 1 slide visible logic
                  if (currentIndex < originalLength) currentIndex = originalLength * 2 - 1;
                }
                updateCarousel(false);
            }
        }

        // Logic refined for infinite feel
        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            if (isTransitioning) return;
            currentIndex++;
            updateCarousel();
        }

        function prevSlide() {
            if (isTransitioning) return;
            currentIndex--;
            updateCarousel();
        }

        function startAutoPlay() {
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(nextSlide, 2000);
        }

        window.addEventListener('resize', () => {
            updateCarousel(false);
        });
        
        // Initial setup
        gsap.set(track, { x: 0 }); // Reset before positioning
        setTimeout(() => {
            updateCarousel(false);
            startAutoPlay();
        }, 100);
    }
});
