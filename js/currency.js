// Currency Conversion System
class CurrencyConverter {
    constructor() {
        this.currentCurrency = 'INR';
        this.rates = {
            USD: 1,
            EUR: 0.92,
            INR: 83.15,
            GBP: 0.79,
            JPY: 149.50,
            AUD: 1.53,
            CAD: 1.37
        };
        this.symbols = {
            USD: '$',
            EUR: '€',
            INR: '₹',
            GBP: '£',
            JPY: '¥',
            AUD: 'A$',
            CAD: 'C$'
        };
        this.init();
    }
    init() {
        this.createCurrencySelector();
        this.loadSavedCurrency();
        this.convertAllPrices();
        this.bindEvents();
    }
    createCurrencySelector() {
        // Only use INR - no selector needed
        return;
    }
    getCurrencyName(code) {
        const names = {
            USD: 'US Dollar',
            EUR: 'Euro',
            INR: 'Indian Rupee',
            GBP: 'British Pound',
            JPY: 'Japanese Yen',
            AUD: 'Australian Dollar',
            CAD: 'Canadian Dollar'
        };
        return names[code] || code;
    }
    bindEvents() {
        const button = document.getElementById('currencyButton');
        const menu = document.getElementById('currencyMenu');
        if (button && menu) {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                menu.classList.toggle('active');
            });
            menu.addEventListener('click', (e) => {
                const option = e.target.closest('.currency-option');
                if (option) {
                    const currency = option.dataset.currency;
                    this.changeCurrency(currency);
                    menu.classList.remove('active');
                }
            });
            document.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        }
    }
    changeCurrency(newCurrency) {
        if (this.rates[newCurrency]) {
            this.currentCurrency = newCurrency;
            localStorage.setItem('selectedCurrency', newCurrency);
            this.updateCurrencyButton();
            this.convertAllPrices();
        }
    }
    updateCurrencyButton() {
        const button = document.getElementById('currencyButton');
        if (button) {
            button.querySelector('.currency-symbol').textContent = this.symbols[this.currentCurrency];
            button.querySelector('.currency-code').textContent = this.currentCurrency;
        }
    }
    loadSavedCurrency() {
        const saved = localStorage.getItem('selectedCurrency');
        if (saved && this.rates[saved]) {
            this.currentCurrency = saved;
        }
    }
    convertPrice(usdPrice, targetCurrency = this.currentCurrency) {
        const rate = this.rates[targetCurrency];
        const convertedPrice = usdPrice * rate;
        // Format based on currency
        if (targetCurrency === 'JPY') {
            return Math.round(convertedPrice);
        } else if (targetCurrency === 'INR') {
            return Math.round(convertedPrice);
        } else {
            return Math.round(convertedPrice * 100) / 100;
        }
    }
    formatPrice(price, currency = this.currentCurrency) {
        const symbol = this.symbols[currency];
        const convertedPrice = this.convertPrice(price, currency);
        // Always format as INR without decimals
        const formatted = new Intl.NumberFormat('en-IN').format(Math.round(convertedPrice));
        return `₹${formatted}`;
    }
    convertAllPrices() {
        // Convert all price elements on the page
        const priceElements = document.querySelectorAll('[data-price]');
        priceElements.forEach(element => {
            const usdPrice = parseFloat(element.dataset.price);
            if (!isNaN(usdPrice)) {
                element.textContent = this.formatPrice(usdPrice);
            }
        });
        // Convert price ranges
        const priceRanges = document.querySelectorAll('[data-price-from][data-price-to]');
        priceRanges.forEach(element => {
            const fromPrice = parseFloat(element.dataset.priceFrom);
            const toPrice = parseFloat(element.dataset.priceTo);
            if (!isNaN(fromPrice) && !isNaN(toPrice)) {
                element.textContent = `${this.formatPrice(fromPrice)} - ${this.formatPrice(toPrice)}`;
            }
        });
    }
    // Static method for easy access
    static getInstance() {
        if (!window.currencyConverter) {
            window.currencyConverter = new CurrencyConverter();
        }
        return window.currencyConverter;
    }
}
// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CurrencyConverter;
}
