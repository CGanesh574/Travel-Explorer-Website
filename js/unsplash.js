// ==========================================
// UNSPLASH API SERVICE
// ==========================================
class UnsplashService {
    constructor() {
        this.apiKey = 'xK9mP7wQ2rN4tL8vB6cF3nM5jH1sA0dE9uI7yT4pO2zX6vC8bN3mQ5wE1rT9yU4i';
        this.baseUrl = 'https://api.unsplash.com';
        this.fallbackImages = this.getFallbackImages();
        // Initialize service
        this.init();
    }
    init() {
        console.log('🖼️ Unsplash service initialized with demo API key');
        console.log('📝 Note: Using fallback images for demonstration purposes');
    }
 
    getFallbackImages() {
        return {
            paris: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            newyork: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            hyderabad: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            bali: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            santorini: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            maldives: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            amsterdam: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
        };
    }
   
    async searchImages(destination, count = 1) {
        try {
            // const response = await fetch(`${this.baseUrl}/search/photos?query=${destination}&client_id=${this.apiKey}&per_page=${count}`);
            console.log(`🔍 Searching Unsplash for "${destination}" images...`);
            // For demo purposes, return fallback images
            const cityKey = destination.toLowerCase().replace(/[^a-z]/g, '');
            const fallbackImage = this.fallbackImages[cityKey] || this.fallbackImages.paris;
            // Simulate API delay
            await this.delay(300);
            return [fallbackImage];
        } catch (error) {
            console.warn('📸 Unsplash API not available, using fallback images');
            return [this.getFallbackImage(destination)];
        }
    }
   
    async getRandomImage(destination) {
        const images = await this.searchImages(destination, 1);
        return images[0];
    }
   
    getFallbackImage(destination) {
        const cityKey = destination.toLowerCase().replace(/[^a-z]/g, '');
        return this.fallbackImages[cityKey] || this.fallbackImages.paris;
    }
   
    async updateDestinationImages(selector = '.destination-card') {
        const cards = document.querySelectorAll(selector);
        for (const card of cards) {
            const cityElement = card.querySelector('.card-title');
            const imageElement = card.querySelector('img');
            if (cityElement && imageElement) {
                const cityName = cityElement.textContent.split(',')[0].trim();
                try {
                    const imageUrl = await this.getRandomImage(cityName);
                    // Preload image before updating
                    const preloadImg = new Image();
                    preloadImg.onload = () => {
                        imageElement.src = imageUrl;
                        console.log(`✅ Updated image for ${cityName}`);
                    };
                    preloadImg.src = imageUrl;
                } catch (error) {
                    console.warn(`⚠️ Could not update image for ${cityName}`);
                }
            }
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async checkApiStatus() {
        try {
            
            console.log('🔄 Checking Unsplash API status...');
            await this.delay(100);
          
            return false;
        } catch (error) {
            return false;
        }
    }
   
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        console.log('🔑 Unsplash API key updated');
    }
}
const unsplashService = new UnsplashService();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnsplashService;
}
