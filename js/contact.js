// Contact Form Handler
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    init() {
        if (this.form) {
            this.bindEvents();
        }
    }
    bindEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        // Remove existing error
        this.clearError(field);
        // Check required fields
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        // Phone validation (if provided)
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }
        if (!isValid) {
            this.showError(field, errorMessage);
        }
        return isValid;
    }
    showError(field, message) {
        field.classList.add('error');
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
    clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }
    async handleSubmit() {
        if (!this.validateForm()) {
            this.showNotification('Please fix the errors above', 'error');
            return;
        }
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);
            // Log form data (in real app, this would be sent to server)
            console.log('Contact form submitted:', data);
            // Show success message
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }
    showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 class="success-title">Message Sent Successfully!</h3>
                <p class="success-text">
                    Thank you for contacting Travel Explorer. 
                    Our team will get back to you within 24 hours.
                </p>
                <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Continue Exploring
                </button>
            </div>
        `;
        document.body.appendChild(overlay);
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.remove();
            }
        }, 5000);
    }
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        document.body.appendChild(notification);
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 4000);
    }
}
// FAQ Interactivity
class FAQSection {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }
    init() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggleFAQ(item));
            }
        });
    }
    toggleFAQ(item) {
        const isActive = item.classList.contains('active');
        // Close all other FAQs
        this.faqItems.forEach(faqItem => {
            faqItem.classList.remove('active');
        });
        // Toggle current FAQ
        if (!isActive) {
            item.classList.add('active');
        }
    }
}
// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactForm();
    new FAQSection();
});
// Export for use in main.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContactForm, FAQSection };
}
