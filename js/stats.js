// ==========================================
// STATISTICS COUNTER ANIMATION
// ==========================================
class StatsCounter {
    constructor() {
        this.statsSection = document.querySelector('.stats-section');
        this.statNumbers = document.querySelectorAll('.stat-number');
        this.hasAnimated = false;
        this.init();
    }
    init() {
        if (this.statsSection && this.statNumbers.length > 0) {
            this.setupIntersectionObserver();
        }
    }
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.hasAnimated) {
                    this.animateCounters();
                    this.hasAnimated = true;
                }
            });
        }, options);
        observer.observe(this.statsSection);
    }
    animateCounters() {
        this.statNumbers.forEach(element => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const startTime = Date.now();
            const updateCounter = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Easing function for smooth animation
                const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(target * easeOutCubic);
                // Format the number based on its value
                if (target >= 10000) {
                    element.textContent = (current / 1000).toFixed(1) + 'K+';
                } else if (target >= 1000) {
                    element.textContent = (current / 1000).toFixed(1) + 'K';
                } else {
                    element.textContent = current + (target === 95 ? '%' : '');
                }
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    // Ensure final value is correct
                    if (target >= 10000) {
                        element.textContent = (target / 1000) + 'K+';
                    } else if (target >= 1000) {
                        element.textContent = (target / 1000) + 'K';
                    } else {
                        element.textContent = target + (target === 95 ? '%' : '');
                    }
                }
            };
            updateCounter();
        });
    }
    // Manual trigger for stats animation
    triggerAnimation() {
        if (!this.hasAnimated) {
            this.animateCounters();
            this.hasAnimated = true;
        }
    }
    // Reset animation (for development/testing)
    resetAnimation() {
        this.hasAnimated = false;
        this.statNumbers.forEach(element => {
            element.textContent = '0';
        });
    }
}
// Initialize stats counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.statsCounter = new StatsCounter();
});
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StatsCounter;
}
