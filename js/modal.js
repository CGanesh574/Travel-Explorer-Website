// ==========================================
// MODAL FUNCTIONALITY
// ==========================================
class Modal {
    constructor() {
        this.overlay = document.getElementById('weather-modal-overlay');
        this.modal = document.getElementById('weather-modal');
        this.content = document.getElementById('modal-content');
        this.closeBtn = document.getElementById('modal-close');
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.setupWeatherButtons();
    }
    setupEventListeners() {
        // Close modal events
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }
        if (this.overlay) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.closeModal();
                }
            });
        }
        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.closeModal();
            }
        });
    }
    setupWeatherButtons() {
        // Find all weather buttons on the page
        const weatherButtons = document.querySelectorAll('.weather-btn, [data-city]');
        weatherButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const city = button.getAttribute('data-city');
                if (city) {
                    this.openWeatherModal(city);
                }
            });
        });
    }
    async openWeatherModal(city) {
        try {
            this.showLoading();
            this.openModal();
            // Get weather data
            const weather = await window.weatherService.getWeatherData(city);
            // Render weather content
            this.renderWeatherContent(weather);
        } catch (error) {
            console.error('Error opening weather modal:', error);
            this.renderErrorContent(city, error.message);
        }
    }
    showLoading() {
        if (this.content) {
            this.content.innerHTML = `
                <div class="modal-loading">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                    </div>
                    <p>Loading weather data...</p>
                </div>
            `;
        }
    }
    renderWeatherContent(weather) {
        if (!this.content) return;
        this.content.innerHTML = `
            <div class="weather-header">
                <h2 class="weather-location">${weather.city}, ${weather.country}</h2>
            </div>
            <div class="weather-main">
                <div class="weather-icon">
                    <i class="${weather.icon}"></i>
                </div>
                <div class="weather-temp">${weather.temperature}°C</div>
            </div>
            <p class="weather-description">${weather.description}</p>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-thermometer-half"></i>
                    </div>
                    <div class="weather-detail-value">${weather.feelsLike}°C</div>
                    <div class="weather-detail-label">Feels like</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-tint"></i>
                    </div>
                    <div class="weather-detail-value">${weather.humidity}%</div>
                    <div class="weather-detail-label">Humidity</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-wind"></i>
                    </div>
                    <div class="weather-detail-value">${weather.windSpeed} km/h</div>
                    <div class="weather-detail-label">Wind Speed</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-gauge"></i>
                    </div>
                    <div class="weather-detail-value">${weather.pressure} hPa</div>
                    <div class="weather-detail-label">Pressure</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-eye"></i>
                    </div>
                    <div class="weather-detail-value">${weather.visibility} km</div>
                    <div class="weather-detail-label">Visibility</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-icon">
                        <i class="fas fa-cloud"></i>
                    </div>
                    <div class="weather-detail-value">${weather.cloudiness}%</div>
                    <div class="weather-detail-label">Cloudiness</div>
                </div>
            </div>
            <div class="weather-actions" style="margin-top: 2rem; text-align: center;">
                <a href="booking.html" class="btn-hero">
                    <i class="fas fa-plane"></i>
                    Plan Trip to ${weather.city}
                </a>
            </div>
        `;
    }
    renderErrorContent(city, errorMessage) {
        if (!this.content) return;
        this.content.innerHTML = `
            <div class="weather-error">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Weather Data Unavailable</h3>
                <p>Sorry, we couldn't fetch weather data for <strong>${city}</strong>.</p>
                <p class="error-details">${errorMessage}</p>
                <div class="error-actions">
                    <button class="btn-ghost" onclick="modal.closeModal()">
                        <i class="fas fa-times"></i>
                        Close
                    </button>
                </div>
            </div>
        `;
    }
    openModal() {
        if (this.overlay) {
            this.overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            // Focus management for accessibility
            setTimeout(() => {
                if (this.closeBtn) {
                    this.closeBtn.focus();
                }
            }, 100);
        }
    }
    closeModal() {
        if (this.overlay) {
            this.overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
    isOpen() {
        return this.overlay && this.overlay.style.display === 'flex';
    }
    // Generic modal method for other content
    openCustomModal(content, title = '') {
        if (!this.content) return;
        this.content.innerHTML = `
            ${title ? `<h2 style="margin-bottom: 1.5rem; text-align: center;">${title}</h2>` : ''}
            ${content}
        `;
        this.openModal();
    }
}
// Initialize modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modal = new Modal();
});
// CSS for modal loading states
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .modal-loading {
        text-align: center;
        padding: 2rem;
    }
    .modal-loading .loading-spinner {
        margin-bottom: 1rem;
    }
    .modal-loading p {
        color: var(--dark-gray);
        margin: 0;
    }
    .weather-error {
        text-align: center;
        padding: 1rem;
    }
    .weather-error .error-icon {
        font-size: 3rem;
        color: var(--coral-sunset);
        margin-bottom: 1rem;
    }
    .weather-error h3 {
        color: var(--charcoal);
        margin-bottom: 1rem;
    }
    .weather-error p {
        color: var(--dark-gray);
        margin-bottom: 0.5rem;
    }
    .weather-error .error-details {
        font-size: 0.9rem;
        color: var(--medium-gray);
        font-style: italic;
    }
    .weather-error .error-actions {
        margin-top: 1.5rem;
    }
    .weather-actions {
        margin-top: 2rem;
        text-align: center;
    }
`;
document.head.appendChild(modalStyles);
