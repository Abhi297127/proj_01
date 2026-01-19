/* ========================================
   CORPORATE READY - VANILLA JAVASCRIPT
   Custom Typing Effect, Navigation, & Animations
   ======================================== */

// ===== Configuration =====
const CONFIG = {
    typingTexts: [
        "Prepare for Corporate Life",
        "Build Professional Skills",
        "Understand Corporate Culture",
        "Master Workplace Etiquette",
        "Succeed in Your First Job"
    ],
    typingSpeed: 50,           // ms per character
    deletingSpeed: 30,         // ms per character
    pauseTime: 2000,           // ms between cycles
    scrollThreshold: 0.2       // Intersection observer threshold
};

// ===== Typing Effect Implementation =====
class TypingEffect {
    constructor(elementId, textArray, config) {
        this.element = document.getElementById(elementId);
        this.textArray = textArray;
        this.config = config;
        this.currentIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (!this.element) return;
        this.typeText();
    }

    typeText() {
        const currentText = this.textArray[this.currentIndex];
        
        // Typing phase
        if (!this.isDeleting && this.charIndex < currentText.length) {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            setTimeout(() => this.typeText(), this.config.typingSpeed);
        }
        // Pause at end of text
        else if (!this.isDeleting && this.charIndex === currentText.length) {
            this.isDeleting = true;
            setTimeout(() => this.typeText(), this.config.pauseTime);
        }
        // Deleting phase
        else if (this.isDeleting && this.charIndex > 0) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.typeText(), this.config.deletingSpeed);
        }
        // Move to next text
        else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.textArray.length;
            setTimeout(() => this.typeText(), this.config.pauseTime / 2);
        }
    }
}

// ===== Navigation Handler =====
class NavigationHandler {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Hamburger menu toggle
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when link is clicked
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Active link highlighting on scroll
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    updateActiveLink() {
        let current = '';

        // Get all sections
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Check if section is in viewport
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        // Update active class on nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }
}

// ===== Intersection Observer for Scroll Animations =====
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.scrollThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            this.observerOptions
        );
        this.init();
    }

    init() {
        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.skill-card, .culture-card, .timeline-item, .resource-category'
        );
        animatedElements.forEach(el => this.observer.observe(el));
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in animation
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                entry.target.style.opacity = '0';
                
                // Add stagger effect for multiple elements
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ===== Smooth Scroll Polyfill for older browsers =====
function initSmoothScroll() {
    if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const top = targetElement.offsetTop;
                    smoothScrollTo(top, 800);
                }
            });
        });
    }
}

function smoothScrollTo(targetY, duration) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let start = null;

    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(progress / duration, 1);

        // Easing function (ease-in-out)
        const ease = percent < 0.5 
            ? 2 * percent * percent 
            : -1 + (4 - 2 * percent) * percent;

        window.scrollY = startY + distance * ease;
        window.scrollTo(0, startY + distance * ease);

        if (progress < duration) {
            requestAnimationFrame(step);
        }
    };

    requestAnimationFrame(step);
}

// ===== Button Click Handlers =====
function initButtonHandlers() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            btn.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 600);
        });

        // Touch feedback for mobile
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.98)';
        });

        btn.addEventListener('touchend', () => {
            btn.style.transform = 'scale(1)';
        });
    });
}

// ===== Performance: Lazy load external resources =====
function lazyLoadResources() {
    const links = document.querySelectorAll('a[href*="http"]');
    links.forEach(link => {
        // Add rel attributes for security
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('target', '_blank');
    });
}

// ===== Accessibility: Keyboard Navigation =====
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes menu
        if (e.key === 'Escape') {
            const navHandler = window.navigationHandler;
            if (navHandler) {
                navHandler.closeMenu();
            }
        }

        // Skip to main content (Accessibility)
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const mainContent = document.querySelector('main') || document.querySelector('section');
            if (mainContent) {
                mainContent.focus();
            }
        }
    });
}

// ===== Responsive Image Loading =====
function initResponsiveImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add lazy loading
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Add error handling
        img.addEventListener('error', () => {
            img.style.backgroundColor = '#ddd';
            img.alt = 'Image failed to load';
        });
    });
}

// ===== Performance Monitoring =====
function initPerformanceMonitoring() {
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const timing = window.performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                console.log(`%cPage Load Time: ${loadTime}ms`, 'color: #0066cc; font-weight: bold;');
                console.log(`%cCorporate Ready - Website loaded successfully!`, 'color: #4caf50; font-weight: bold;');
            }, 0);
        });
    }
}

// ===== Print Optimization =====
function initPrintStyles() {
    const mediaQueryList = window.matchMedia('print');
    mediaQueryList.addListener((mql) => {
        if (mql.matches) {
            console.log('Print mode activated');
        }
    });
}

// ===== Initialize All Features =====
function initializeApp() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('%cInitializing Corporate Ready Application...', 'color: #0066cc; font-weight: bold;');

        // 1. Initialize Typing Effect
        const typingEffect = new TypingEffect('typingText', CONFIG.typingTexts, CONFIG);
        console.log('✓ Typing effect initialized');

        // 2. Initialize Navigation
        window.navigationHandler = new NavigationHandler();
        console.log('✓ Navigation handler initialized');

        // 3. Initialize Scroll Animations
        const scrollAnimations = new ScrollAnimations();
        console.log('✓ Scroll animations initialized');

        // 4. Initialize Button Handlers
        initButtonHandlers();
        console.log('✓ Button handlers initialized');

        // 5. Initialize Smooth Scroll
        initSmoothScroll();
        console.log('✓ Smooth scroll initialized');

        // 6. Lazy Load Resources
        lazyLoadResources();
        console.log('✓ Resources optimized');

        // 7. Initialize Keyboard Navigation
        initKeyboardNavigation();
        console.log('✓ Keyboard navigation initialized');

        // 8. Initialize Responsive Images
        initResponsiveImages();
        console.log('✓ Responsive images initialized');

        // 9. Initialize Performance Monitoring
        initPerformanceMonitoring();

        // 10. Initialize Print Styles
        initPrintStyles();

        console.log('%cApplication ready! 🚀', 'color: #4caf50; font-weight: bold;');
    }
}

// ===== Start Application =====
initializeApp();

// ===== Additional Utility Functions =====

/**
 * Detect if user prefers dark mode
 */
function detectDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log('Dark mode preference detected');
        return true;
    }
    return false;
}

/**
 * Get viewport dimensions
 */
function getViewport() {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight)
    };
}

/**
 * Debounce function for performance optimization
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function for performance optimization
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Add class with animation
 */
function addClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/**
 * Remove class with animation
 */
function removeClassWithDelay(element, className, delay = 0) {
    setTimeout(() => {
        element.classList.remove(className);
    }, delay);
}

// ===== Export functions for external use (if needed) =====
window.CorporateReady = {
    getViewport,
    isElementInViewport,
    debounce,
    throttle,
    detectDarkMode,
    addClassWithDelay,
    removeClassWithDelay,
    CONFIG
};

console.log('%cCorporate Ready v1.0 - Ready for Production', 'color: #0066cc; font-weight: bold; font-size: 14px;');
