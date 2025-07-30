// --- Бургер-меню для мобильной навигации с затемнением фона ---
document.addEventListener('DOMContentLoaded', function() {
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.getElementById('mainNav');
    const body = document.body;
    
    // Функция для открытия/закрытия меню
    function toggleMenu() {
        burgerBtn.classList.toggle('active');
        mainNav.classList.toggle('active');
        body.classList.toggle('menu-open');
    }
    
    // Обработчик клика по бургер-кнопке
    if (burgerBtn) {
        burgerBtn.addEventListener('click', toggleMenu);
    }
    
    // Закрытие меню при клике на ссылку
    const navLinks = mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 900) {
                toggleMenu();
            }
        });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(e.target) && 
            !burgerBtn.contains(e.target)) {
            toggleMenu();
        }
    });
    
    // Закрытие меню при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 900 && mainNav.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Плавная прокрутка для якорных ссылок
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Добавляем CSS для анимации меню
    const style = document.createElement('style');
    style.textContent = `
        body.menu-open {
            overflow: hidden;
        }
        
        #mainNav {
            transition: all 0.3s ease;
        }
        
        @media (max-width: 900px) {
            #mainNav {
                position: fixed;
                top: 80px;
                left: 0;
                width: 100%;
                background: var(--dark-bg);
                flex-direction: column;
                padding: 2rem 0;
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                box-shadow: 0 4px 20px rgba(139, 69, 19, 0.2);
            }
            
            #mainNav.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
            
            #mainNav a {
                padding: 1rem 2rem;
                margin: 0.5rem 0;
                border-radius: var(--border-radius);
                transition: all 0.3s ease;
                font-size: 1.1rem;
            }
            
            #mainNav a:hover {
                background: var(--accent);
                transform: translateX(10px);
            }
        }
        
        @media (max-width: 600px) {
            #mainNav {
                top: 70px;
            }
        }
    `;
    document.head.appendChild(style);
});

// Preloader logic (only on first visit per session)
document.addEventListener('DOMContentLoaded', function() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    if (sessionStorage.getItem('seaToriPreloaderShown')) {
        preloader.style.display = 'none';
        return;
    }
    sessionStorage.setItem('seaToriPreloaderShown', '1');
    setTimeout(() => {
        preloader.classList.add('hide');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }, 3000);
}); 