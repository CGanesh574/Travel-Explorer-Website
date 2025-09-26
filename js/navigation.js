// ==========================================
// NAVIGATION FUNCTIONALITY
// ==========================================
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    init() {
        this.setupMobileMenu();
        this.setupScrollEffect();
        this.setupActiveLinks();
        this.setupSmoothScrolling();
    }
    // Mobile menu toggle functionality
    setupMobileMenu() {
        if (this.navToggle && this.navMenu) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
            // Close mobile menu when clicking on links
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            });
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navbar.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });
        }
    }
    toggleMobileMenu() {
        this.navToggle.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open', this.navMenu.classList.contains('active'));
    }
    closeMobileMenu() {
        this.navToggle.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    // Navbar scroll effect
    setupScrollEffect() {
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }
    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    // Active link highlighting
    setupActiveLinks() {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Remove existing active class
            link.classList.remove('active');
            // Add active class to current page link
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    // Smooth scrolling for anchor links
    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            // Check if it's an anchor link (starts with #)
            if (href && href.startsWith('#')) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.smoothScrollTo(href);
                });
            }
        });
    }
    smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    // Update active link programmatically
    setActiveLink(page) {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
            }
        });
    }
    // Show/hide navbar
    showNavbar() {
        this.navbar.style.transform = 'translateY(0)';
    }
    hideNavbar() {
        this.navbar.style.transform = 'translateY(-100%)';
    }
}
// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.navigation = new Navigation();
});
// CSS for menu-open body state
const style = document.createElement('style');
style.textContent = `
    body.menu-open {
        overflow: hidden;
    }
    @media (max-width: 768px) {
        body.menu-open {
            overflow: hidden;
            position: fixed;
            width: 100%;
        }
    }
`;
document.head.appendChild(style);
