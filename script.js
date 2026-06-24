// ========================================
// RSV ASSOCIATES - MAIN JAVASCRIPT
// ========================================

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
    // NAVBAR
    // ========================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavLink();
        
        // Show/hide back to top button
        toggleBackToTop();
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
        
        // Animate hamburger
        this.classList.toggle('active');
    });
    
    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Update active nav link
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;
        
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
    
    // ========================================
    // SMOOTH SCROLL
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // COUNTER ANIMATION
    // ========================================
    
    function animateCounters() {
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
    // SCROLL ANIMATIONS (AOS-like)
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
                    if (entry.isIntersecting) {
                        animateCounters();
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            statsObserver.observe(statsSection);
        }
    }
    
    // ========================================
    // TESTIMONIALS SLIDER
    // ========================================
    
    const testimonialTrack = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('testimonial-dots');
    
    if (testimonialTrack) {
        const cards = testimonialTrack.querySelectorAll('.testimonial-card');
        let currentIndex = 0;
        let cardsToShow = 3;
        
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
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }
        
        // Update slider
        function updateSlider() {
            const cardWidth = cards[0].offsetWidth + 30; // Including gap
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
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Initialize
        updateCardsToShow();
        createDots();
        
        // Auto slide
        setInterval(nextSlide, 5000);
        
        // Handle resize
        window.addEventListener('resize', function() {
            updateCardsToShow();
            createDots();
            currentIndex = 0;
            updateSlider();
        });
    }
    
    // ========================================
    // BACK TO TOP BUTTON
    // ========================================
    
    const backToTop = document.getElementById('back-to-top');
    
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
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
                // Show success message (in a real implementation, you'd send this to a server)
                const btn = this.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = '#22c55e';
                
                // Reset form
                this.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 3000);
            }
        });
    }
    
    // ========================================
    // PARALLAX EFFECT (optional)
    // ========================================
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroPattern = document.querySelector('.hero-pattern');
        
        if (heroPattern && scrolled < window.innerHeight) {
            heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
    });
    
    // ========================================
    // NAVBAR HAMBURGER ANIMATION
    // ========================================
    
    navToggle.addEventListener('click', function() {
        const spans = this.querySelectorAll('span');
        
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
});
