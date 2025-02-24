class FeatureSlider {
    constructor() {
        this.container = document.querySelector('.feature-grid');
        this.items = document.querySelectorAll('.feature-item');
        this.currentIndex = 0;
        this.itemsPerView = this.calculateItemsPerView();
        
        this.init();
        this.setupResizeListener();
    }

    init() {
        // Create slider controls
        this.createControls();
        
        // Add initial animation delays
        this.items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.2}s`;
        });

        // Initial update
        this.updateSlider();
    }

    calculateItemsPerView() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    }

    createControls() {
        // Create slider controls container
        const controls = document.createElement('div');
        controls.className = 'slider-controls';
        
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-button';
        prevButton.innerHTML = '←';
        prevButton.onclick = () => this.slide('prev');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'slider-button';
        nextButton.innerHTML = '→';
        nextButton.onclick = () => this.slide('next');
        
        controls.appendChild(prevButton);
        controls.appendChild(nextButton);
        
        // Add controls after the slider
        this.container.parentNode.insertBefore(controls, this.container.nextSibling);
        
        // Create dots
        this.createDots();
    }

    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        const totalDots = Math.ceil(this.items.length / this.itemsPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'dot';
            dot.onclick = () => this.goToSlide(i);
            dotsContainer.appendChild(dot);
        }
        
        this.container.parentNode.insertBefore(dotsContainer, this.container.nextSibling);
        this.dots = dotsContainer.querySelectorAll('.dot');
    }

    slide(direction) {
        if (direction === 'next') {
            this.currentIndex = Math.min(this.currentIndex + 1, this.items.length - this.itemsPerView);
        } else {
            this.currentIndex = Math.max(this.currentIndex - 1, 0);
        }
        
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentIndex = index * this.itemsPerView;
        this.updateSlider();
    }

    updateSlider() {
        // Update items position
        const offset = -this.currentIndex * (100 / this.itemsPerView);
        this.container.style.transform = `translateX(${offset}%)`;
        
        // Update dots
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === Math.floor(this.currentIndex / this.itemsPerView));
        });
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.itemsPerView = this.calculateItemsPerView();
                this.currentIndex = Math.min(this.currentIndex, this.items.length - this.itemsPerView);
                this.updateSlider();
            }, 250);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const commandItems = document.querySelectorAll('.command-item');
    const categories = document.querySelectorAll('.command-category');
    
    // Arama fonksiyonu
    function filterCommands() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').dataset.category;

        commandItems.forEach(item => {
            const commandName = item.querySelector('h3').textContent.toLowerCase();
            const commandDesc = item.querySelector('p').textContent.toLowerCase();
            const matchesSearch = commandName.includes(searchTerm) || commandDesc.includes(searchTerm);
            
            const category = item.closest('.command-category').dataset.category;
            const matchesCategory = activeCategory === 'all' || category === activeCategory;

            item.classList.toggle('hidden', !matchesSearch || !matchesCategory);
        });

        // Boş kategorileri gizle
        categories.forEach(category => {
            const hasVisibleCommands = [...category.querySelectorAll('.command-item')]
                .some(item => !item.classList.contains('hidden'));
            category.classList.toggle('hidden', !hasVisibleCommands);
        });
    }

    // Arama input event listener
    searchInput.addEventListener('input', filterCommands);

    // Kategori filtreleme
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterCommands();
        });
    });
});

// Initialize the slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeatureSlider();
});