// ========================================
// RSV ASSOCIATES - MAIN JAVASCRIPT (OPTIMIZED)
// ========================================

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function to reduce event firing
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // LOADER
    // ========================================
    
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.classList.remove('no-scroll');
            initAnimations();
        }, 2000);
    });
    
    // ========================================
    // NAVBAR - CACHED DOM REFERENCES
    // ========================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    // Cache scroll state
    let lastScrollY = 0;
    let isScrolled = false;
    
    // Optimized scroll handler with throttle
    const handleScroll = throttle(function() {
        lastScrollY = window.scrollY;
        
        // Update navbar style
        if (lastScrollY > 100) {
            if (!isScrolled) {
                navbar.classList.add('scrolled');
                isScrolled = true;
            }
        } else {
            if (isScrolled) {
                navbar.classList.remove('scrolled');
                isScrolled = false;
            }
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        // Show/hide back to top button
        toggleBackToTop();
        
        // Update parallax
        updateParallax();
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        this.classList.toggle('active');
        animateHamburger();
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Update active nav link - optimized
    function updateActiveNavLink() {
        const scrollY = lastScrollY;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Hamburger animation
    function animateHamburger() {
        const spans = navToggle.querySelectorAll('span');
        
        if (navToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    }
    
    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    // Event delegation for smooth scroll
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor && anchor.getAttribute('href') !== '#') {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
    
    // ========================================
    // COUNTER ANIMATION - INTERSECTION OBSERVER
    // ========================================
    
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        
        const counters = document.querySelectorAll('.stat-number[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }
    
    // ========================================
    // SCROLL ANIMATIONS (AOS-like) - INTERSECTION OBSERVER
    // ========================================
    
    function initAnimations() {
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, delay);
                    // Stop observing this element to save memory
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Trigger counter animation when stats section is visible
        const statsSection = document.querySelector('.hero-stats');
        if (statsSection) {
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !countersAnimated) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statsSection);
        }
    }
    
    // ========================================
    // TESTIMONIALS SLIDER - OPTIMIZED
    // ========================================
    
    const testimonialTrack = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    if (testimonialTrack) {
        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsToShow = 3;
        let autoSlideInterval;
        let isAutoSliding = true;
        
        // Update cards to show based on screen width
        function updateCardsToShow() {
            if (window.innerWidth < 768) {
                cardsToShow = 1;
            } else if (window.innerWidth < 992) {
                cardsToShow = 2;
            } else {
                cardsToShow = 3;
            }
        }
        
        // Create dots
        function createDots() {
            dotsContainer.innerHTML = '';
            const totalDots = Math.ceil(cards.length / cardsToShow);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    stopAutoSlide();
                    goToSlide(i);
                    startAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        // Update slider
        function updateSlider() {
            const cardWidth = cards[0].offsetWidth + 30;
            testimonialTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === Math.floor(currentIndex / cardsToShow));
            });
        }
        
        // Go to slide
        function goToSlide(index) {
            currentIndex = index * cardsToShow;
            if (currentIndex > cards.length - cardsToShow) {
                currentIndex = cards.length - cardsToShow;
            }
            updateSlider();
        }
        
        // Next slide
        function nextSlide() {
            currentIndex++;
            if (currentIndex > cards.length - cardsToShow) {
                currentIndex = 0;
            }
            updateSlider();
        }
        
        // Previous slide
        function prevSlide() {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = cards.length - cardsToShow;
            }
            updateSlider();
        }
        
        // Auto slide functions
        function startAutoSlide() {
            if (!isAutoSliding) return;
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function stopAutoSlide() {
            clearInterval(autoSlideInterval);
        }
        
        // Pause auto-slide on hover/interaction
        testimonialTrack.addEventListener('mouseenter', stopAutoSlide);
        testimonialTrack.addEventListener('mouseleave', startAutoSlide);
        
        // Event listeners
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
        
        // Initialize
        updateCardsToShow();
        createDots();
        startAutoSlide();
        
        // Handle resize with debounce
        window.addEventListener('resize', debounce(function() {
            stopAutoSlide();
            updateCardsToShow();
            createDots();
            currentIndex = 0;
            updateSlider();
            startAutoSlide();
        }, 250));
        
        // Stop auto-slide when user is not viewing the page
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                stopAutoSlide();
            } else {
                startAutoSlide();
            }
        });
    }
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    
    const backToTop = document.getElementById('back-to-top');
    let backToTopVisible = false;
    
    function toggleBackToTop() {
        if (lastScrollY > 500) {
            if (!backToTopVisible) {
                backToTop.classList.add('visible');
                backToTopVisible = true;
            }
        } else {
            if (backToTopVisible) {
                backToTop.classList.remove('visible');
                backToTopVisible = false;
            }
        }
    }
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ========================================
    // CONTACT FORM
    // ========================================
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            let isValid = true;
            const inputs = this.querySelectorAll('input, select, textarea');
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Show success message
                const btn = this.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = '#22c55e';
                btn.disabled = true;
                
                // Reset form
                this.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }
    
    // ========================================
    // PARALLAX EFFECT - OPTIMIZED
    // ========================================
    
    const heroPattern = document.querySelector('.hero-pattern');
    
    function updateParallax() {
        if (heroPattern && lastScrollY < window.innerHeight) {
            // Use transform for better performance (GPU accelerated)
            heroPattern.style.transform = `translateY(${lastScrollY * 0.3}px)`;
        }
    }
    
});
