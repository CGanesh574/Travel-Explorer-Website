// ==========================================
// MAIN APPLICATION INITIALIZATION
// ==========================================
class TravelExplorerApp {
    constructor() {
        this.isLoaded = false;
        this.components = {};
        this.init();
    }
    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeApp();
            });
        } else {
            this.initializeApp();
        }
    }
    async initializeApp() {
        try {
            // Initialize core components
            this.initializeNavigation();
            this.initializeCurrency();
            this.initializeWeatherSystem();
            this.initializeImageLoading();
            this.initializeAnimations();
            this.initializePageSpecificFeatures();
            // Mark app as loaded
            this.isLoaded = true;
            // Dispatch custom event
            this.dispatchEvent('appLoaded');
            console.log('Travel Explorer App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
    initializeNavigation() {
        // Navigation is handled by navigation.js
        // This ensures mobile menu and scroll effects work
    }
    initializeCurrency() {
        // Initialize currency converter if available
        if (typeof CurrencyConverter !== 'undefined') {
            this.currencyConverter = CurrencyConverter.getInstance();
        }
    }
    async initializeWeatherSystem() {
        // Load weather data for all destination cards on the page
        const weatherBadges = document.querySelectorAll('.weather-badge');
        if (weatherBadges.length > 0 && window.weatherService) {
            // Load weather with staggered timing to avoid rate limits
            const promises = Array.from(weatherBadges).map((badge, index) => {
                return new Promise(resolve => {
                    setTimeout(async () => {
                        try {
                            const city = this.extractCityFromElement(badge);
                            if (city) {
                                await window.weatherService.updateWeatherBadge(city, badge.id);
                            }
                        } catch (error) {
                            console.warn(`Failed to load weather for badge ${badge.id}:`, error);
                        }
                        resolve();
                    }, index * 200); // 200ms delay between requests
                });
            });
            await Promise.all(promises);
        }
    }
    extractCityFromElement(element) {
        // Try to get city from various sources
        const card = element.closest('.destination-card');
        if (card) {
            const city = card.getAttribute('data-city');
            if (city) return city;
        }
        // Extract from ID (e.g., "weather-paris" -> "Paris")
        const id = element.id;
        if (id && id.startsWith('weather-')) {
            const citySlug = id.replace('weather-', '');
            return this.slugToCity(citySlug);
        }
        return null;
    }
    slugToCity(slug) {
        const cityMap = {
            'paris': 'Paris',
            'tokyo': 'Tokyo',
            'bali': 'Bali',
            'newyork': 'New York',
            'london': 'London',
            'santorini': 'Santorini',
            'maldives': 'Maldives',
            'kyoto': 'Kyoto',
            'dubai': 'Dubai',
            'sydney': 'Sydney',
            'amsterdam': 'Amsterdam',
            'reykjavik': 'Reykjavik',
            'capetown': 'Cape Town'
        };
        return cityMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
    }
    initializeImageLoading() {
        // Lazy loading for images
        const images = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Add loading class
                        img.classList.add('loading');
                        // Handle load event
                        img.addEventListener('load', () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                        });
                        // Handle error event
                        img.addEventListener('error', () => {
                            img.classList.remove('loading');
                            img.classList.add('error');
                            console.warn('Failed to load image:', img.src);
                        });
                        imageObserver.unobserve(img);
                    }
                });
            });
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => img.classList.add('loaded'));
        }
    }
    initializeAnimations() {
        // Intersection Observer for scroll animations
        const animatedElements = document.querySelectorAll('.destination-card, .value-card, .team-member');
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-fade-in');
                        animationObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            animatedElements.forEach(el => animationObserver.observe(el));
        }
    }
    initializePageSpecificFeatures() {
        const currentPage = this.getCurrentPage();
        switch (currentPage) {
            case 'index.html':
            case '':
                this.initializeHomePage();
                break;
            case 'destinations.html':
                this.initializeDestinationsPage();
                break;
            case 'booking.html':
                this.initializeBookingPage();
                break;
            case '404.html':
                this.initialize404Page();
                break;
        }
    }
    initializeHomePage() {
        // Hero section parallax effect
        this.setupParallaxEffect();
        // Floating elements animation
        this.setupFloatingElements();
        // Search functionality is handled by search.js
    }
    initializeDestinationsPage() {
        // Destinations filtering is handled by destinations.js
        console.log('Destinations page initialized');
    }
    initializeBookingPage() {
        // Booking form is handled by booking.js
        console.log('Booking page initialized');
    }
    initialize404Page() {
        // Add some fun animations to 404 page
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.5}s`;
        });
    }
    setupParallaxEffect() {
        const hero = document.querySelector('.hero');
        const heroBg = document.querySelector('.hero-bg');
        if (hero && heroBg) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                if (scrolled <= hero.offsetHeight) {
                    heroBg.style.transform = `translate3d(0, ${rate}px, 0)`;
                }
            });
        }
    }
    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.floating-element');
        floatingElements.forEach((element, index) => {
            // Add random animation delay
            const delay = Math.random() * 2;
            element.style.animationDelay = `${delay}s`;
            // Add random horizontal movement
            const moveX = (Math.random() - 0.5) * 20;
            element.style.setProperty('--move-x', `${moveX}px`);
        });
    }
    getCurrentPage() {
        return window.location.pathname.split('/').pop() || 'index.html';
    }
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: data
        });
        document.dispatchEvent(event);
    }
    // Utility methods
    showToast(message, type = 'info', duration = 3000) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        // Add toast styles if not already added
        if (!document.querySelector('#toast-styles')) {
            const styles = document.createElement('style');
            styles.id = 'toast-styles';
            styles.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    background: var(--white);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-lg);
                    z-index: 9999;
                    opacity: 0;
                    transform: translateX(100%);
                    transition: all 0.3s ease;
                    max-width: 300px;
                    border-left: 4px solid var(--ocean-blue);
                }
                .toast.toast-success {
                    border-left-color: var(--mint-fresh);
                }
                .toast.toast-error {
                    border-left-color: var(--coral-sunset);
                }
                .toast.show {
                    opacity: 1;
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }
        document.body.appendChild(toast);
        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);
        // Hide toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
    // Smooth scroll to element
    scrollTo(element, offset = 80) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    // Get device type
    getDeviceType() {
        const width = window.innerWidth;
        if (width <= 480) return 'mobile';
        if (width <= 768) return 'tablet';
        if (width <= 1024) return 'laptop';
        return 'desktop';
    }
    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Performance:', {
                        'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart + 'ms',
                        'Load Complete': perfData.loadEventEnd - perfData.loadEventStart + 'ms',
                        'Total Load Time': perfData.loadEventEnd - perfData.fetchStart + 'ms'
                    });
                }, 0);
            });
        }
    }
}
// Initialize the application
const app = new TravelExplorerApp();
// Make app globally available
window.travelExplorerApp = app;
// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(registrationError => {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}
// Global error handling
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
// Expose useful utilities globally
window.TravelExplorer = {
    showToast: app.showToast.bind(app),
    scrollTo: app.scrollTo.bind(app),
    getDeviceType: app.getDeviceType.bind(app)
};
