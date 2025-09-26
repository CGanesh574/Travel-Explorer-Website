// ==========================================
// WEATHER SERVICE - OpenWeatherMap API Integration
// ==========================================
class WeatherService {
    constructor() {
        this.apiKey = '951099e283aef56145acd8d9a92be63e';
        this.baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
        this.cache = new Map();
        this.cacheTimeout = 10 * 60 * 1000; // 10 minutes
    }
    // Get weather data for a city
    async getWeatherData(city) {
        try {
            // Check cache first
            const cacheKey = city.toLowerCase();
            const cachedData = this.cache.get(cacheKey);
            if (cachedData && Date.now() - cachedData.timestamp < this.cacheTimeout) {
                return cachedData.data;
            }
            // If API key is placeholder, return mock data
            if (this.apiKey === 'placeholder' || this.apiKey === 'YOUR_API_KEY') {
                return this.getMockWeatherData(city);
            }
            const url = `${this.baseUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(`City "${city}" not found`);
                } else if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else {
                    throw new Error(`Weather data unavailable (${response.status})`);
                }
            }
            const data = await response.json();
            const weatherData = this.formatWeatherData(data);
            // Cache the result
            this.cache.set(cacheKey, {
                data: weatherData,
                timestamp: Date.now()
            });
            return weatherData;
        } catch (error) {
            console.warn(`Weather API error for ${city}:`, error.message);
            // Return mock data as fallback
            return this.getMockWeatherData(city);
        }
    }
    // Format API response data
    formatWeatherData(data) {
        return {
            city: data.name,
            country: data.sys.country,
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            icon: this.getWeatherIcon(data.weather[0].main, data.weather[0].icon),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
            pressure: data.main.pressure,
            visibility: data.visibility ? Math.round(data.visibility / 1000) : 'N/A',
            cloudiness: data.clouds.all
        };
    }
    // Get appropriate weather icon
    getWeatherIcon(condition, iconCode) {
        const iconMap = {
            'Clear': 'fas fa-sun',
            'Clouds': 'fas fa-cloud',
            'Rain': 'fas fa-cloud-rain',
            'Drizzle': 'fas fa-cloud-drizzle',
            'Thunderstorm': 'fas fa-bolt',
            'Snow': 'fas fa-snowflake',
            'Mist': 'fas fa-smog',
            'Fog': 'fas fa-smog',
            'Haze': 'fas fa-smog'
        };
        // Use day/night variants if available
        if (iconCode) {
            if (iconCode.includes('n')) {
                return iconMap[condition] || 'fas fa-moon';
            }
        }
        return iconMap[condition] || 'fas fa-cloud';
    }
    // Mock weather data for development/fallback
    getMockWeatherData(city) {
        const mockData = {
            'Paris': {
                city: 'Paris',
                country: 'FR',
                temperature: 18,
                feelsLike: 20,
                description: 'partly cloudy',
                icon: 'fas fa-cloud-sun',
                humidity: 65,
                windSpeed: 12,
                pressure: 1013,
                visibility: 10,
                cloudiness: 40
            },
            'Tokyo': {
                city: 'Tokyo',
                country: 'JP',
                temperature: 22,
                feelsLike: 24,
                description: 'clear sky',
                icon: 'fas fa-sun',
                humidity: 58,
                windSpeed: 8,
                pressure: 1018,
                visibility: 15,
                cloudiness: 10
            },
            'New York': {
                city: 'New York',
                country: 'US',
                temperature: 15,
                feelsLike: 13,
                description: 'light rain',
                icon: 'fas fa-cloud-rain',
                humidity: 78,
                windSpeed: 15,
                pressure: 1008,
                visibility: 8,
                cloudiness: 80
            },
            'London': {
                city: 'London',
                country: 'GB',
                temperature: 12,
                feelsLike: 10,
                description: 'overcast clouds',
                icon: 'fas fa-cloud',
                humidity: 72,
                windSpeed: 10,
                pressure: 1015,
                visibility: 12,
                cloudiness: 90
            },
            'Bali': {
                city: 'Bali',
                country: 'ID',
                temperature: 28,
                feelsLike: 32,
                description: 'tropical sunny',
                icon: 'fas fa-sun',
                humidity: 75,
                windSpeed: 6,
                pressure: 1010,
                visibility: 20,
                cloudiness: 20
            },
            'Santorini': {
                city: 'Santorini',
                country: 'GR',
                temperature: 24,
                feelsLike: 26,
                description: 'clear sky',
                icon: 'fas fa-sun',
                humidity: 60,
                windSpeed: 14,
                pressure: 1020,
                visibility: 25,
                cloudiness: 5
            },
            'Maldives': {
                city: 'Maldives',
                country: 'MV',
                temperature: 30,
                feelsLike: 35,
                description: 'sunny',
                icon: 'fas fa-sun',
                humidity: 80,
                windSpeed: 8,
                pressure: 1012,
                visibility: 30,
                cloudiness: 15
            },
            'Kyoto': {
                city: 'Kyoto',
                country: 'JP',
                temperature: 20,
                feelsLike: 22,
                description: 'partly cloudy',
                icon: 'fas fa-cloud-sun',
                humidity: 68,
                windSpeed: 7,
                pressure: 1016,
                visibility: 18,
                cloudiness: 30
            },
            'Dubai': {
                city: 'Dubai',
                country: 'AE',
                temperature: 35,
                feelsLike: 42,
                description: 'clear sky',
                icon: 'fas fa-sun',
                humidity: 45,
                windSpeed: 12,
                pressure: 1008,
                visibility: 20,
                cloudiness: 0
            },
            'Sydney': {
                city: 'Sydney',
                country: 'AU',
                temperature: 25,
                feelsLike: 27,
                description: 'sunny',
                icon: 'fas fa-sun',
                humidity: 55,
                windSpeed: 18,
                pressure: 1022,
                visibility: 25,
                cloudiness: 10
            },
            'Amsterdam': {
                city: 'Amsterdam',
                country: 'NL',
                temperature: 16,
                feelsLike: 14,
                description: 'light drizzle',
                icon: 'fas fa-cloud-drizzle',
                humidity: 85,
                windSpeed: 13,
                pressure: 1011,
                visibility: 9,
                cloudiness: 75
            },
            'Reykjavik': {
                city: 'Reykjavik',
                country: 'IS',
                temperature: 8,
                feelsLike: 5,
                description: 'cloudy',
                icon: 'fas fa-cloud',
                humidity: 82,
                windSpeed: 22,
                pressure: 995,
                visibility: 15,
                cloudiness: 95
            },
            'Cape Town': {
                city: 'Cape Town',
                country: 'ZA',
                temperature: 22,
                feelsLike: 24,
                description: 'clear sky',
                icon: 'fas fa-sun',
                humidity: 62,
                windSpeed: 16,
                pressure: 1024,
                visibility: 30,
                cloudiness: 5
            }
        };
        // Return specific mock data or generate random data
        return mockData[city] || this.generateRandomWeatherData(city);
    }
    // Generate random weather data for unknown cities
    generateRandomWeatherData(city) {
        const conditions = [
            { desc: 'clear sky', icon: 'fas fa-sun' },
            { desc: 'partly cloudy', icon: 'fas fa-cloud-sun' },
            { desc: 'cloudy', icon: 'fas fa-cloud' },
            { desc: 'light rain', icon: 'fas fa-cloud-rain' }
        ];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
            city: city,
            country: 'XX',
            temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
            feelsLike: Math.floor(Math.random() * 30) + 5,
            description: randomCondition.desc,
            icon: randomCondition.icon,
            humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
            windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 km/h
            pressure: Math.floor(Math.random() * 50) + 990, // 990-1040 hPa
            visibility: Math.floor(Math.random() * 20) + 5, // 5-25 km
            cloudiness: Math.floor(Math.random() * 100)
        };
    }
    // Update weather badge on page
    async updateWeatherBadge(city, elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        try {
            // Show loading state
            element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading...</span>';
            const weather = await this.getWeatherData(city);
            // Update badge with weather data
            element.innerHTML = `<i class="${weather.icon}"></i> <span>${weather.temperature}°C</span>`;
            element.setAttribute('data-city', city);
            element.setAttribute('data-weather', JSON.stringify(weather));
        } catch (error) {
            console.error(`Failed to update weather badge for ${city}:`, error);
            element.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>N/A</span>';
        }
    }
    // Clear cache
    clearCache() {
        this.cache.clear();
    }
    // Get cached cities
    getCachedCities() {
        return Array.from(this.cache.keys());
    }
}
// Create global weather service instance
window.weatherService = new WeatherService();
// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WeatherService;
}
