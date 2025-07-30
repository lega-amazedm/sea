document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slideshow-arrow.prev');
    const nextBtn = document.querySelector('.slideshow-arrow.next');
    
    let currentSlide = 0;
    let slideInterval;
    
    // Функция для показа слайда
    function showSlide(index) {
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Убираем активный класс со всех точек
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Показываем текущий слайд
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Функция для следующего слайда
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    // Функция для предыдущего слайда
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    // Автоматическое переключение слайдов
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000); // 5 секунд
    }
    
    function stopSlideShow() {
        clearInterval(slideInterval);
    }
    
    // Обработчики событий для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        });
    }
    
    // Обработчики событий для точек
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            stopSlideShow();
            showSlide(index);
            startSlideShow();
        });
    });
    
    // Остановка автопереключения при наведении мыши
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        slideshow.addEventListener('mouseenter', stopSlideShow);
        slideshow.addEventListener('mouseleave', startSlideShow);
    }
    
    // Управление с клавиатуры
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopSlideShow();
            prevSlide();
            startSlideShow();
        } else if (e.key === 'ArrowRight') {
            stopSlideShow();
            nextSlide();
            startSlideShow();
        }
    });
    
    // Свайп для мобильных устройств
    let startX = 0;
    let endX = 0;
    
    if (slideshow) {
        slideshow.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });
        
        slideshow.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                stopSlideShow();
                nextSlide();
                startSlideShow();
            } else {
                // Свайп вправо - предыдущий слайд
                stopSlideShow();
                prevSlide();
                startSlideShow();
            }
        }
    }
    
    // Инициализация
    showSlide(0);
    startSlideShow();
    
    // Предзагрузка изображений для плавной работы
    slides.forEach(slide => {
        const backgroundImage = slide.style.backgroundImage;
        if (backgroundImage) {
            const url = backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
            const img = new Image();
            img.src = url;
        }
    });
}); 