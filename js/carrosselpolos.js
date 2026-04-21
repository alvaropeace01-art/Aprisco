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

        // Carousel Logic - Optimized GSAP Loop
        function initPolosCarousel(trackId, dotsId, prevBtnId, nextBtnId) {
            const track = document.getElementById(trackId);
            const dotsContainer = document.getElementById(dotsId);
            const prevBtn = document.getElementById(prevBtnId);
            const nextBtn = document.getElementById(nextBtnId);
            
            if (!track || !dotsContainer) return;

            const originalSlides = Array.from(track.children);
            const originalLength = originalSlides.length;
            
            // Clone slides to create infinite effect
            originalSlides.forEach(slide => {
                const clone = slide.cloneNode(true);
                track.appendChild(clone);
            });
            
            [...originalSlides].reverse().forEach(slide => {
                const clone = slide.cloneNode(true);
                track.insertBefore(clone, track.firstChild);
            });

            const allSlides = Array.from(track.children);
            let currentIndex = originalLength;
            let isTransitioning = false;
            let autoPlayInterval;
            let autoPlayTimeout;

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

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    prevSlide();
                    handleManualInteraction();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    nextSlide();
                    handleManualInteraction();
                });
            }

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

                const dotIndex = currentIndex % originalLength;
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === dotIndex);
                });
            }

            function checkIndex() {
                if (currentIndex >= originalLength * 2) {
                    currentIndex = originalLength;
                    updateCarousel(false);
                }
                if (currentIndex < originalLength) {
                    currentIndex = originalLength * 2 - 1;
                    if (getVisibleSlides() === 1) {
                      if (currentIndex < originalLength) currentIndex = originalLength * 2 - 1;
                    }
                    updateCarousel(false);
                }
            }

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
            
            gsap.set(track, { x: 0 });
            setTimeout(() => {
                updateCarousel(false);
                startAutoPlay();
            }, 100);
        }

        // Initialize carousels
        initPolosCarousel('carousel-track', 'carousel-dots', 'prev-btn', 'next-btn');
        initPolosCarousel('cultura-track', 'cultura-dots', 'cultura-prev-btn', 'cultura-next-btn');
    }
});
