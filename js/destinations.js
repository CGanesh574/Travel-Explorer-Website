// ==========================================
// DESTINATIONS PAGE FUNCTIONALITY
// ==========================================
class DestinationsManager {
    constructor() {
        this.destinationsGrid = document.getElementById('destinations-grid');
        this.searchInput = document.getElementById('destination-search');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.loadMoreBtn = document.getElementById('load-more-btn');
        this.allDestinations = [];
        this.filteredDestinations = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.itemsPerPage = 12;
        this.currentPage = 1;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.loadInitialWeatherData();
        this.checkURLParameters();
        this.initializeFiltering();
    }
    setupEventListeners() {
        // Search functionality
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterAndDisplayDestinations();
            });
        }
        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setActiveFilter(btn);
                this.currentFilter = btn.getAttribute('data-filter');
                this.filterAndDisplayDestinations();
            });
        });
        // Load more button
        if (this.loadMoreBtn) {
            this.loadMoreBtn.addEventListener('click', () => {
                this.loadMoreDestinations();
            });
        }
    }
    setActiveFilter(activeBtn) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    initializeFiltering() {
        // Get all destination cards
        const destinationCards = document.querySelectorAll('.destination-card');
        this.allDestinations = Array.from(destinationCards).map(card => {
            const city = card.getAttribute('data-city');
            const category = card.getAttribute('data-category') || '';
            const title = card.querySelector('.card-title')?.textContent || '';
            const description = card.querySelector('.card-description')?.textContent || '';
            return {
                element: card,
                city: city,
                category: category,
                title: title.toLowerCase(),
                description: description.toLowerCase(),
                visible: true
            };
        });
        this.filteredDestinations = [...this.allDestinations];
        this.updateDisplayedDestinations();
    }
    checkURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        if (filter === 'indian') {
            // Set the Indian Destinations filter as active
            this.currentFilter = 'indian';
            // Update the active filter button
            this.filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === 'indian') {
                    btn.classList.add('active');
                }
            });
        }
    }
    filterAndDisplayDestinations() {
        this.filteredDestinations = this.allDestinations.filter(dest => {
            // Category filter
            const categoryMatch = this.currentFilter === 'all' || 
                                dest.category.includes(this.currentFilter);
            // Search filter
            const searchMatch = this.searchQuery === '' ||
                              dest.title.includes(this.searchQuery) ||
                              dest.description.includes(this.searchQuery) ||
                              dest.city.toLowerCase().includes(this.searchQuery);
            return categoryMatch && searchMatch;
        });
        this.currentPage = 1;
        this.updateDisplayedDestinations();
    }
    updateDisplayedDestinations() {
        // Hide all destinations first
        this.allDestinations.forEach(dest => {
            dest.element.style.display = 'none';
            dest.visible = false;
        });
        // Show filtered destinations
        const startIndex = 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        const destinationsToShow = this.filteredDestinations.slice(startIndex, endIndex);
        destinationsToShow.forEach(dest => {
            dest.element.style.display = 'block';
            dest.visible = true;
            // Add animation
            dest.element.style.opacity = '0';
            dest.element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                dest.element.style.opacity = '1';
                dest.element.style.transform = 'translateY(0)';
                dest.element.style.transition = 'all 0.3s ease-out';
            }, 50);
        });
        // Update load more button
        this.updateLoadMoreButton();
        // Show no results message if needed
        this.showNoResultsIfNeeded();
    }
    loadMoreDestinations() {
        this.currentPage++;
        this.updateDisplayedDestinations();
    }
    updateLoadMoreButton() {
        if (!this.loadMoreBtn) return;
        const totalShown = this.currentPage * this.itemsPerPage;
        const hasMore = totalShown < this.filteredDestinations.length;
        if (hasMore) {
            this.loadMoreBtn.style.display = 'block';
            const remaining = this.filteredDestinations.length - totalShown;
            this.loadMoreBtn.innerHTML = `
                Load More Destinations (${remaining} remaining)
                <i class="fas fa-chevron-down"></i>
            `;
        } else {
            this.loadMoreBtn.style.display = 'none';
        }
    }
    showNoResultsIfNeeded() {
        if (this.filteredDestinations.length === 0) {
            this.showNoResults();
        } else {
            this.hideNoResults();
        }
    }
    showNoResults() {
        // Remove existing no-results message
        this.hideNoResults();
        const noResultsHTML = `
            <div class="no-results-destinations" style="grid-column: 1 / -1;">
                <div class="no-results-content">
                    <div class="no-results-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h3>No destinations found</h3>
                    <p>We couldn't find any destinations matching your search criteria.</p>
                    <div class="no-results-actions">
                        <button class="btn-ghost" onclick="destinationsManager.clearFilters()">
                            <i class="fas fa-undo"></i>
                            Clear Filters
                        </button>
                        <a href="index.html" class="btn-hero">
                            <i class="fas fa-home"></i>
                            Back to Home
                        </a>
                    </div>
                </div>
            </div>
        `;
        if (this.destinationsGrid) {
            this.destinationsGrid.insertAdjacentHTML('beforeend', noResultsHTML);
        }
    }
    hideNoResults() {
        const noResults = document.querySelector('.no-results-destinations');
        if (noResults) {
            noResults.remove();
        }
    }
    clearFilters() {
        // Reset search
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.searchQuery = '';
        // Reset filter
        this.currentFilter = 'all';
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === 'all') {
                btn.classList.add('active');
            }
        });
        // Reset page
        this.currentPage = 1;
        // Update display
        this.filterAndDisplayDestinations();
    }
    async loadInitialWeatherData() {
        // Load weather data for all visible destinations
        const weatherPromises = [];
        this.allDestinations.forEach(dest => {
            if (dest.city) {
                const promise = this.loadWeatherForDestination(dest.city);
                weatherPromises.push(promise);
            }
        });
        // Load weather data with staggered timing to avoid API rate limits
        for (let i = 0; i < weatherPromises.length; i++) {
            setTimeout(() => {
                weatherPromises[i];
            }, i * 200); // Stagger requests by 200ms
        }
    }
    async loadWeatherForDestination(city) {
        try {
            const elementId = `weather-${city.toLowerCase().replace(/\s+/g, '')}`;
            await window.weatherService.updateWeatherBadge(city, elementId);
        } catch (error) {
            console.warn(`Failed to load weather for ${city}:`, error);
        }
    }
    // Method to add new destinations dynamically
    addDestination(destinationData) {
        const cardHTML = this.createDestinationCard(destinationData);
        if (this.destinationsGrid) {
            this.destinationsGrid.insertAdjacentHTML('beforeend', cardHTML);
            // Re-initialize filtering with new destination
            this.initializeFiltering();
            // Load weather for new destination
            this.loadWeatherForDestination(destinationData.city);
        }
    }
    createDestinationCard(data) {
        const cardId = data.city.toLowerCase().replace(/\s+/g, '');
        return `
            <div class="destination-card" data-city="${data.city}" data-category="${data.category}">
                <div class="card-image">
                    <img src="${data.image}" alt="${data.city}, ${data.country}" loading="lazy">
                    <div class="weather-badge" id="weather-${cardId}">
                        <i class="fas fa-sun"></i>
                        <span>Loading...</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${data.city}, ${data.country}</h3>
                    <p class="card-description">${data.description}</p>
                    <div class="card-tags">
                        ${data.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="btn-accent weather-btn" data-city="${data.city}">
                        <i class="fas fa-cloud-sun"></i>
                        View Weather
                    </button>
                </div>
            </div>
        `;
    }
    // Get statistics about destinations
    getStats() {
        const stats = {
            total: this.allDestinations.length,
            visible: this.filteredDestinations.length,
            byCategory: {}
        };
        // Count by category
        this.allDestinations.forEach(dest => {
            const categories = dest.category.split(' ');
            categories.forEach(category => {
                if (category) {
                    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
                }
            });
        });
        return stats;
    }
}
// Initialize destinations manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('destinations-grid')) {
        window.destinationsManager = new DestinationsManager();
    }
});
// CSS for destinations page
const destinationsStyles = document.createElement('style');
destinationsStyles.textContent = `
    .no-results-destinations {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 400px;
        background: var(--light-gray);
        border-radius: var(--radius-2xl);
        margin: 2rem 0;
    }
    .no-results-content {
        text-align: center;
        padding: 2rem;
        max-width: 500px;
    }
    .no-results-content .no-results-icon {
        font-size: 4rem;
        color: var(--medium-gray);
        margin-bottom: 1.5rem;
    }
    .no-results-content h3 {
        color: var(--charcoal);
        margin-bottom: 1rem;
    }
    .no-results-content p {
        color: var(--dark-gray);
        margin-bottom: 2rem;
        line-height: 1.6;
    }
    .no-results-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
    }
    .destination-card {
        transition: all 0.3s ease-out;
    }
    .destination-card.filtered-out {
        opacity: 0;
        transform: scale(0.8);
        pointer-events: none;
    }
    .filter-buttons .filter-btn {
        position: relative;
        overflow: hidden;
    }
    .filter-buttons .filter-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.6s;
    }
    .filter-buttons .filter-btn:hover::before {
        left: 100%;
    }
    @media (max-width: 768px) {
        .no-results-actions {
            flex-direction: column;
            align-items: center;
        }
        .no-results-actions .btn-hero,
        .no-results-actions .btn-ghost {
            width: 100%;
            max-width: 250px;
        }
    }
`;
document.head.appendChild(destinationsStyles);
