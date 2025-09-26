// ==========================================
// BOOKING FORM FUNCTIONALITY
// ==========================================
class BookingManager {
    constructor() {
        this.form = document.getElementById('booking-form');
        this.progressSteps = document.querySelectorAll('.step');
        this.formSteps = document.querySelectorAll('.form-step');
        this.nextButtons = document.querySelectorAll('.next-step');
        this.prevButtons = document.querySelectorAll('.prev-step');
        this.submitBtn = document.querySelector('.submit-btn');
        this.successMessage = document.getElementById('success-message');
        this.bookingReference = document.getElementById('booking-reference');
        this.currentStep = 1;
        this.formData = {};
        this.validationRules = this.setupValidationRules();
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.loadSavedData();
        this.setupDateValidation();
    }
    setupEventListeners() {
        // Next step buttons
        this.nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = parseInt(btn.getAttribute('data-next'));
                this.goToStep(nextStep);
            });
        });
        // Previous step buttons
        this.prevButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prevStep = parseInt(btn.getAttribute('data-prev'));
                this.goToStep(prevStep);
            });
        });
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitForm();
            });
        }
        // Auto-save form data
        if (this.form) {
            this.form.addEventListener('input', () => {
                this.saveFormData();
            });
        }
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }
    setupValidationRules() {
        return {
            firstName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'First name must be at least 2 characters and contain only letters'
            },
            lastName: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Last name must be at least 2 characters and contain only letters'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[\d\s\-\(\)]{10,}$/,
                message: 'Please enter a valid phone number'
            },
            destination: {
                required: true,
                minLength: 2,
                message: 'Please enter your destination'
            },
            travelers: {
                required: true,
                message: 'Please select number of travelers'
            },
            departureDate: {
                required: true,
                custom: (value) => {
                    const date = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date >= today;
                },
                message: 'Departure date must be today or in the future'
            },
            returnDate: {
                required: true,
                custom: (value) => {
                    const returnDate = new Date(value);
                    const departureDate = new Date(document.getElementById('departureDate').value);
                    return returnDate > departureDate;
                },
                message: 'Return date must be after departure date'
            }
        };
    }
    setupDateValidation() {
        const today = new Date().toISOString().split('T')[0];
        const departureDateInput = document.getElementById('departureDate');
        const returnDateInput = document.getElementById('returnDate');
        if (departureDateInput) {
            departureDateInput.setAttribute('min', today);
            departureDateInput.addEventListener('change', () => {
                if (returnDateInput) {
                    returnDateInput.setAttribute('min', departureDateInput.value);
                    // Clear return date if it's before departure date
                    if (returnDateInput.value && returnDateInput.value <= departureDateInput.value) {
                        returnDateInput.value = '';
                    }
                }
            });
        }
    }
    goToStep(stepNumber) {
        if (stepNumber > this.currentStep) {
            // Validate current step before proceeding
            if (!this.validateCurrentStep()) {
                return;
            }
        }
        // Update current step
        this.currentStep = stepNumber;
        // Update progress indicators
        this.updateProgressSteps();
        // Show/hide form steps
        this.updateFormSteps();
        // Scroll to top of form
        this.scrollToTop();
    }
    updateProgressSteps() {
        this.progressSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
    }
    updateFormSteps() {
        this.formSteps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.style.display = 'block';
            } else {
                step.classList.remove('active');
                step.style.display = 'none';
            }
        });
    }
    validateCurrentStep() {
        const currentFormStep = document.getElementById(`step-${this.currentStep}`);
        if (!currentFormStep) return true;
        const inputs = currentFormStep.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        return isValid;
    }
    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        if (!rules) return true;
        // Clear previous error
        this.clearFieldError(field);
        // Required validation
        if (rules.required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        if (value) {
            // Length validation
            if (rules.minLength && value.length < rules.minLength) {
                this.showFieldError(field, rules.message);
                return false;
            }
            // Pattern validation
            if (rules.pattern && !rules.pattern.test(value)) {
                this.showFieldError(field, rules.message);
                return false;
            }
            // Custom validation
            if (rules.custom && !rules.custom(value)) {
                this.showFieldError(field, rules.message);
                return false;
            }
        }
        return true;
    }
    showFieldError(field, message) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
        field.classList.add('error');
    }
    clearFieldError(field) {
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
        field.classList.remove('error');
    }
    async submitForm() {
        // Validate all fields
        if (!this.validateAllFields()) {
            this.showNotification('Please correct the errors in the form', 'error');
            return;
        }
        // Show loading state
        this.showSubmitLoading(true);
        try {
            // Collect form data
            const formData = this.collectFormData();
            // Simulate API call
            await this.simulateSubmission(formData);
            // Generate booking reference
            const bookingRef = this.generateBookingReference();
            // Save booking data
            this.saveBookingData(formData, bookingRef);
            // Show success message
            this.showSuccessMessage(bookingRef);
        } catch (error) {
            console.error('Booking submission error:', error);
            this.showNotification('Booking submission failed. Please try again.', 'error');
        } finally {
            this.showSubmitLoading(false);
        }
    }
    validateAllFields() {
        const allInputs = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        allInputs.forEach(input => {
            if (input.hasAttribute('required') || this.validationRules[input.name]) {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            }
        });
        return isValid;
    }
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        // Basic form fields
        for (let [key, value] of formData.entries()) {
            if (key === 'interests') {
                if (!data.interests) data.interests = [];
                data.interests.push(value);
            } else {
                data[key] = value;
            }
        }
        // Add timestamp
        data.submissionDate = new Date().toISOString();
        return data;
    }
    async simulateSubmission(data) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simulate random success/failure (95% success rate)
        if (Math.random() < 0.05) {
            throw new Error('Submission failed');
        }
        return { success: true, data };
    }
    generateBookingReference() {
        const prefix = 'TE';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substr(2, 4).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    }
    saveBookingData(data, reference) {
        const bookingData = {
            reference,
            data,
            status: 'submitted',
            submissionDate: new Date().toISOString()
        };
        // Save to localStorage
        const existingBookings = JSON.parse(localStorage.getItem('travelBookings') || '[]');
        existingBookings.push(bookingData);
        localStorage.setItem('travelBookings', JSON.stringify(existingBookings));
        // Clear form data from localStorage
        localStorage.removeItem('bookingFormData');
    }
    showSuccessMessage(reference) {
        // Hide form
        this.form.style.display = 'none';
        // Show success message
        if (this.successMessage) {
            this.successMessage.style.display = 'block';
        }
        // Update booking reference
        if (this.bookingReference) {
            this.bookingReference.textContent = reference;
        }
        // Scroll to success message
        this.successMessage.scrollIntoView({ behavior: 'smooth' });
    }
    showSubmitLoading(show) {
        const submitSpinner = document.getElementById('submit-spinner');
        const submitText = this.submitBtn.querySelector('.submit-text');
        const submitIcon = this.submitBtn.querySelector('.submit-icon');
        if (show) {
            if (submitSpinner) submitSpinner.style.display = 'inline-flex';
            if (submitText) submitText.style.display = 'none';
            if (submitIcon) submitIcon.style.display = 'none';
            this.submitBtn.disabled = true;
        } else {
            if (submitSpinner) submitSpinner.style.display = 'none';
            if (submitText) submitText.style.display = 'inline';
            if (submitIcon) submitIcon.style.display = 'inline';
            this.submitBtn.disabled = false;
        }
    }
    saveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        localStorage.setItem('bookingFormData', JSON.stringify(data));
    }
    loadSavedData() {
        const savedData = localStorage.getItem('bookingFormData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                // Populate form fields
                Object.keys(data).forEach(key => {
                    const field = this.form.querySelector(`[name="${key}"]`);
                    if (field) {
                        if (field.type === 'checkbox') {
                            field.checked = data[key] === field.value;
                        } else {
                            field.value = data[key];
                        }
                    }
                });
            } catch (error) {
                console.warn('Failed to load saved form data:', error);
            }
        }
    }
    scrollToTop() {
        const bookingContainer = document.querySelector('.booking-container');
        if (bookingContainer) {
            bookingContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    showNotification(message, type = 'info') {
        // Simple notification - you could implement a toast system here
        alert(message);
    }
    // Method to get saved bookings
    getSavedBookings() {
        return JSON.parse(localStorage.getItem('travelBookings') || '[]');
    }
    // Method to clear all form data
    clearFormData() {
        this.form.reset();
        localStorage.removeItem('bookingFormData');
        // Reset to first step
        this.currentStep = 1;
        this.updateProgressSteps();
        this.updateFormSteps();
        // Clear all errors
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => {
            el.textContent = '';
            el.classList.remove('show');
        });
        const errorFields = this.form.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
        });
    }
    // Method to pre-fill destination from URL parameter
    preFileDestination() {
        const urlParams = new URLSearchParams(window.location.search);
        const destination = urlParams.get('destination');
        if (destination) {
            const destinationField = document.getElementById('destination');
            if (destinationField) {
                destinationField.value = destination;
            }
        }
    }
}
// Initialize booking manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('booking-form')) {
        window.bookingManager = new BookingManager();
        // Pre-fill destination if provided in URL
        bookingManager.preFileDestination();
    }
});
// CSS for booking form validation
const bookingStyles = document.createElement('style');
bookingStyles.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: var(--coral-sunset);
        box-shadow: 0 0 0 3px rgba(253, 164, 175, 0.1);
    }
    .error-message {
        display: none;
        color: var(--coral-sunset);
        font-size: 0.875rem;
        margin-top: 0.5rem;
    }
    .error-message.show {
        display: block;
    }
    .step.completed .step-number {
        background: var(--mint-fresh);
        color: var(--white);
    }
    .step.completed .step-number::after {
        content: '✓';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 0.8rem;
    }
    .step.completed .step-number span {
        opacity: 0;
    }
    .form-step {
        min-height: 400px;
    }
    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }
    .success-message {
        animation: fade-in 0.6s ease-out;
    }
    @media (max-width: 768px) {
        .form-step {
            min-height: auto;
        }
        .progress-steps {
            gap: 1rem;
        }
        .step-label {
            font-size: 0.75rem;
        }
    }
`;
document.head.appendChild(bookingStyles);
