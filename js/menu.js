import { getAllData, STORES } from './database.js';
import cart from './cart.js';

class Menu {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.currentCategory = 'all';
        this.init();
    }

    async init() {
        await this.loadMenuItems();
        this.setupEventListeners();
        this.renderMenu();
    }

    async loadMenuItems() {
        try {
            this.items = await getAllData(STORES.MENU_ITEMS);
            this.filteredItems = [...this.items];
        } catch (error) {
            console.error('Error loading menu items:', error);
        }
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.filterItems(category);
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    filterItems(category) {
        this.currentCategory = category;
        this.filteredItems = category === 'all' 
            ? [...this.items]
            : this.items.filter(item => item.category === category);
        this.renderMenu();
    }

    renderMenu() {
        const menuGrid = document.querySelector('.menu-grid');
        if (!menuGrid) return;

        menuGrid.innerHTML = this.filteredItems.map(item => `
            <div class="menu-item" data-category="${item.category}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.spicy ? '<span class="spicy-badge">Острое</span>' : ''}
                    ${item.vegetarian ? '<span class="vegetarian-badge">Вегетарианское</span>' : ''}
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="menu-item-details">
                        <p class="menu-item-price">${item.price} ₽</p>
                        <button class="add-to-cart-btn" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i>
                            В корзину
                        </button>
                    </div>
                    <div class="menu-item-ingredients">
                        <p>Состав: ${item.ingredients.join(', ')}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // Add event listeners for "Add to Cart" buttons
        menuGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.add-to-cart-btn').dataset.id);
                const menuItem = this.items.find(item => item.id === itemId);
                if (menuItem) {
                    cart.addItem(menuItem);
                    
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = 'Товар добавлен в корзину';
                    document.body.appendChild(successMessage);
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 2000);
                }
            });
        });
    }
}

// Initialize menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Menu();
});

// --- Новый скрипт для фильтрации по кухне и категории ---
let selectedCuisine = 'all';
let selectedCategory = 'all';

const filterButtons = document.querySelectorAll('.filter-btn');
const menuItems = document.querySelectorAll('.menu-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Если нажали "Все"
        if (button.dataset.cuisine === 'all') {
            selectedCuisine = 'all';
            selectedCategory = 'all';
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
        // Если нажали кухню
        else if (button.hasAttribute('data-cuisine')) {
            selectedCuisine = button.getAttribute('data-cuisine');
            selectedCategory = 'all';
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
        // Если нажали категорию
        else if (button.hasAttribute('data-category')) {
            selectedCategory = button.getAttribute('data-category');
            // Снять active только с категорий
            filterButtons.forEach(btn => {
                if (btn.hasAttribute('data-category')) btn.classList.remove('active');
            });
            button.classList.add('active');
        }
        // Фильтрация
        menuItems.forEach(item => {
            const itemCuisine = item.getAttribute('data-cuisine') || 'all';
            const itemCategory = item.getAttribute('data-category') || 'all';
            let show = true;
            if (selectedCuisine !== 'all' && itemCuisine !== selectedCuisine) show = false;
            if (selectedCategory !== 'all' && itemCategory !== selectedCategory) show = false;
            item.style.display = show ? 'block' : 'none';
        });
    });
});
// При загрузке показываем все
menuItems.forEach(item => item.style.display = 'block');

// --- Бургер-меню для мобильной навигации ---
document.addEventListener('DOMContentLoaded', function() {
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    if (burger && nav) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
});

// Поиск по меню
const menuSearch = document.getElementById('menuSearch');
let menuItems;
document.addEventListener('DOMContentLoaded', function() {
    menuItems = document.querySelectorAll('.menu-item');
    if (menuSearch) {
        menuSearch.addEventListener('input', function() {
            const query = menuSearch.value.trim().toLowerCase();
            menuItems.forEach(item => {
                const title = item.querySelector('.menu-item-title').textContent.toLowerCase();
                const desc = item.querySelector('.menu-item-description').textContent.toLowerCase();
                if (title.includes(query) || desc.includes(query)) {
                    item.style.display = '';
                    // Добавляем бейдж 'Пицца' если категория pizza
                    const badge = item.querySelector('.pizza-badge');
                    if (item.dataset.category === 'pizza') {
                        if (!badge) {
                            const badgeEl = document.createElement('span');
                            badgeEl.className = 'pizza-badge';
                            badgeEl.textContent = 'Пицца';
                            badgeEl.style.cssText = 'margin-left:0.7rem;background:#e67e22;color:#fff;padding:0.18em 0.7em;border-radius:10px;font-size:0.92em;font-weight:600;vertical-align:middle;';
                            item.querySelector('.menu-item-title').appendChild(badgeEl);
                        }
                    } else if (badge) {
                        badge.remove();
                    }
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.category-btn');
    const menuSection = document.getElementById('menu-section');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (category === 'all') {
                menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const targetDivider = document.querySelector('.category-divider[data-category="' + category + '"]');
                if (targetDivider) {
                    targetDivider.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за элементами меню
menuItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Плавная прокрутка для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Добавление товаров в корзину (если нужно)
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const menuItem = this.closest('.menu-item');
        const title = menuItem.querySelector('.menu-item-title').textContent;
        const price = menuItem.querySelector('.menu-item-price').textContent;
        
        // Здесь можно добавить логику корзины
        showNotification(`${title} добавлен в корзину!`);
    });
});

// Функция показа уведомлений
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--box-shadow);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Добавляем CSS анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
}); 