// ==========================================
// SEARCH FUNCTIONALITY
// ==========================================
class SearchManager {
    constructor() {
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.searchSpinner = document.getElementById('search-spinner');
        this.resultsSection = document.getElementById('search-results');
        this.resultsGrid = document.getElementById('results-grid');
        this.popularButtons = document.querySelectorAll('.popular-btn');
        this.searchTimeout = null;
        this.minSearchLength = 2;
        this.init();
    }
    init() {
        this.setupSearchEvents();
        this.setupPopularButtons();
    }
    setupSearchEvents() {
        if (this.searchInput && this.searchBtn) {
            // Search button click
            this.searchBtn.addEventListener('click', () => {
                this.performSearch();
            });
            // Enter key search
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch();
                }
            });
            // Real-time search (debounced)
            this.searchInput.addEventListener('input', () => {
                this.debounceSearch();
            });
        }
    }
    setupPopularButtons() {
        this.popularButtons.forEach(button => {
            button.addEventListener('click', () => {
                const city = button.getAttribute('data-city');
                const country = button.getAttribute('data-country');
                if (country === 'India') {
                    // Navigate to destinations page with Indian filter
                    window.location.href = 'destinations.html?filter=indian';
                } else if (city) {
                    this.searchInput.value = city;
                    this.performSearch();
                }
            });
        });
    }
    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            const query = this.searchInput.value.trim();
            if (query.length >= this.minSearchLength) {
                this.performSearch();
            } else if (query.length === 0) {
                this.hideResults();
            }
        }, 500);
    }
    async performSearch() {
        const query = this.searchInput.value.trim();
        if (query.length < this.minSearchLength) {
            this.showError('Please enter at least 2 characters');
            return;
        }
        try {
            this.showLoading(true);
            // Simulate search delay for better UX
            await new Promise(resolve => setTimeout(resolve, 300));
            const results = await this.searchDestinations(query);
            this.displayResults(results, query);
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Search failed. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    async searchDestinations(query) {
        // In a real app, this would call a search API
        // For now, we'll simulate search with predefined destinations
        const destinations = [
            {
                name: 'Paris',
                country: 'France',
                description: 'The City of Light with iconic landmarks and world-class cuisine',
                image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=500&h=300&fit=crop',
                tags: ['city', 'culture', 'romantic']
            },
            {
                name: 'Tokyo',
                country: 'Japan',
                description: 'Modern metropolis blending tradition with cutting-edge technology',
                image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500&h=300&fit=crop',
                tags: ['city', 'culture', 'modern']
            },
            {
                name: 'Bali',
                country: 'Indonesia',
                description: 'Tropical paradise with beautiful beaches and lush rice terraces',
                image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=500&h=300&fit=crop',
                tags: ['beach', 'nature', 'tropical']
            },
            {
                name: 'New York',
                country: 'USA',
                description: 'The Big Apple - iconic skyline and endless entertainment',
                image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop',
                tags: ['city', 'urban', 'entertainment']
            },
            {
                name: 'London',
                country: 'United Kingdom',
                description: 'Historic charm meets modern sophistication',
                image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop',
                tags: ['city', 'culture', 'historic']
            },
            {
                name: 'Santorini',
                country: 'Greece',
                description: 'Stunning white-washed buildings overlooking the Aegean Sea',
                image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=500&h=300&fit=crop',
                tags: ['beach', 'culture', 'romantic']
            },
            {
                name: 'Maldives',
                country: 'Maldives',
                description: 'Crystal clear waters and overwater bungalows in paradise',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
                tags: ['beach', 'luxury', 'tropical']
            },
            {
                name: 'Dubai',
                country: 'UAE',
                description: 'Futuristic skyline and luxury shopping in the desert',
                image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500&h=300&fit=crop',
                tags: ['city', 'luxury', 'modern']
            },
            {
                name: 'Sydney',
                country: 'Australia',
                description: 'Iconic harbor, beautiful beaches, and vibrant city life',
                image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&h=300&fit=crop',
                tags: ['city', 'beach', 'urban']
            },
            {
                name: 'Amsterdam',
                country: 'Netherlands',
                description: 'Charming canals, historic architecture, and vibrant culture',
                image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=500&h=300&fit=crop',
                tags: ['city', 'culture', 'historic']
            }
        ];
        // Filter destinations based on search query
        const lowerQuery = query.toLowerCase();
        return destinations.filter(dest => 
            dest.name.toLowerCase().includes(lowerQuery) ||
            dest.country.toLowerCase().includes(lowerQuery) ||
            dest.description.toLowerCase().includes(lowerQuery) ||
            dest.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }
    displayResults(results, query) {
        if (!this.resultsSection || !this.resultsGrid) return;
        if (results.length === 0) {
            this.showNoResults(query);
            return;
        }
        // Update section title
        const sectionTitle = this.resultsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = `Search Results for "${query}" (${results.length} found)`;
        }
        // Generate results HTML
        this.resultsGrid.innerHTML = results.map(dest => 
            this.createResultCard(dest)
        ).join('');
        // Show results section
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Load weather data for results
        this.loadWeatherForResults(results);
    }
    createResultCard(destination) {
        const cardId = destination.name.toLowerCase().replace(/\s+/g, '-');
        return `
            <div class="destination-card" data-city="${destination.name}">
                <div class="card-image">
                    <img src="${destination.image}" alt="${destination.name}, ${destination.country}" loading="lazy">
                    <div class="weather-badge" id="weather-${cardId}">
                        <i class="fas fa-sun"></i>
                        <span>Loading...</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${destination.name}, ${destination.country}</h3>
                    <p class="card-description">${destination.description}</p>
                    <div class="card-tags">
                        ${destination.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <button class="btn-accent weather-btn" data-city="${destination.name}">
                        <i class="fas fa-cloud-sun"></i>
                        View Weather
                    </button>
                </div>
            </div>
        `;
    }
    async loadWeatherForResults(results) {
        // Load weather data for each result
        for (const dest of results) {
            const cardId = dest.name.toLowerCase().replace(/\s+/g, '-');
            const elementId = `weather-${cardId}`;
            try {
                await window.weatherService.updateWeatherBadge(dest.name, elementId);
            } catch (error) {
                console.warn(`Failed to load weather for ${dest.name}:`, error);
            }
        }
        // Re-setup weather button event listeners for new cards
        this.setupWeatherButtons();
    }
    setupWeatherButtons() {
        const weatherButtons = this.resultsGrid.querySelectorAll('.weather-btn');
        weatherButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const city = button.getAttribute('data-city');
                if (city && window.modal) {
                    window.modal.openWeatherModal(city);
                }
            });
        });
    }
    showNoResults(query) {
        if (!this.resultsGrid) return;
        const sectionTitle = this.resultsSection.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = `No results found for "${query}"`;
        }
        this.resultsGrid.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>No destinations found</h3>
                <p>We couldn't find any destinations matching "${query}". Try searching for:</p>
                <ul>
                    <li>City names (e.g., Paris, Tokyo, New York)</li>
                    <li>Country names (e.g., Japan, France, Italy)</li>
                    <li>Travel types (e.g., beach, city, culture)</li>
                </ul>
                <div class="no-results-suggestions">
                    <p>Popular searches:</p>
                    <div class="suggestion-buttons">
                        <button class="popular-btn" onclick="searchManager.searchSuggestion('Paris')">Paris</button>
                        <button class="popular-btn" onclick="searchManager.searchSuggestion('Beach')">Beach</button>
                        <button class="popular-btn" onclick="searchManager.searchSuggestion('Culture')">Culture</button>
                        <button class="popular-btn" onclick="searchManager.searchSuggestion('City')">City</button>
                    </div>
                </div>
            </div>
        `;
        this.resultsSection.style.display = 'block';
        this.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    searchSuggestion(query) {
        this.searchInput.value = query;
        this.performSearch();
    }
    showLoading(show) {
        if (this.searchSpinner && this.searchBtn) {
            const searchText = this.searchBtn.querySelector('.search-text');
            if (show) {
                this.searchSpinner.style.display = 'block';
                if (searchText) searchText.style.display = 'none';
                this.searchBtn.disabled = true;
            } else {
                this.searchSpinner.style.display = 'none';
                if (searchText) searchText.style.display = 'inline';
                this.searchBtn.disabled = false;
            }
        }
    }
    showError(message) {
        // You could implement a toast notification system here
        console.error('Search error:', message);
        alert(message); // Simple fallback
    }
    hideResults() {
        if (this.resultsSection) {
            this.resultsSection.style.display = 'none';
        }
    }
    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.hideResults();
    }
}
// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});
// CSS for search components
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        grid-column: 1 / -1;
    }
    .no-results-icon {
        font-size: 4rem;
        color: var(--medium-gray);
        margin-bottom: 1.5rem;
    }
    .no-results h3 {
        color: var(--charcoal);
        margin-bottom: 1rem;
    }
    .no-results p {
        color: var(--dark-gray);
        margin-bottom: 1rem;
    }
    .no-results ul {
        text-align: left;
        max-width: 400px;
        margin: 0 auto 2rem;
        color: var(--dark-gray);
    }
    .no-results-suggestions {
        margin-top: 2rem;
    }
    .suggestion-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        margin-top: 1rem;
    }
    .suggestion-buttons .popular-btn {
        padding: 0.5rem 1rem;
        background: var(--light-gray);
        color: var(--dark-gray);
        border: 1px solid var(--light-muted);
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.9rem;
    }
    .suggestion-buttons .popular-btn:hover {
        background: var(--ocean-blue);
        color: var(--white);
        border-color: var(--ocean-blue);
    }
`;
document.head.appendChild(searchStyles);
