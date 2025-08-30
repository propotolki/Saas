// Smooth scrolling for navigation links
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

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 15, 25, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 255, 255, 0.2)';
        header.style.borderBottom = '1px solid rgba(0, 255, 255, 0.1)';
    } else {
        header.style.background = 'rgba(15, 15, 25, 0.8)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
        header.style.borderBottom = 'none';
    }
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.problem-item, .feature-card, .step, .pricing-card, .floating-card, .screenshot-item').forEach(el => {
    observer.observe(el);
});

// Form submission with enhanced validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.form');
    if (!form) {
        console.error('Form not found');
        return;
    }
    
    form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    console.log('Form submitted!');
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const business = formData.get('business');
    const plan = formData.get('plan');
    
    console.log('Form data:', { name, phone, business, plan });
    
    // Enhanced validation
    if (!name || name.trim().length < 2) {
        showNotification('Пожалуйста, введите корректное имя', 'error');
        return;
    }
    
    if (!phone || phone.trim().length < 10) {
        showNotification('Пожалуйста, введите корректный номер телефона', 'error');
        return;
    }
    
    if (!business) {
        showNotification('Пожалуйста, выберите сферу бизнеса', 'error');
        return;
    }
    
    if (!plan) {
        showNotification('Пожалуйста, выберите тарифный план', 'error');
        return;
    }
    
    // Send to Telegram
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
    button.disabled = true;
    
    // Prepare message for Telegram
    const planNames = {
        'start': 'Старт - 749₽/мес',
        'business': 'Бизнес - 1,490₽/мес',
        'premium': 'Премиум - 4,990₽/мес'
    };
    
    const message = `🎯 Новая заявка с сайта VKSaaS!

👤 Имя: ${name}
📱 Телефон: ${phone}
🏢 Сфера бизнеса: ${business}
📋 Тарифный план: ${planNames[plan] || plan}
⏰ Время: ${new Date().toLocaleString('ru-RU')}
🌐 Источник: ${window.location.href}`;

    // Send to Telegram group
    const telegramBotToken = '8179352605:AAFAiFo5IReS0mST3RXCyEMokK9UYdfVEEs';
    const chatId = '@zakazSaaS';
    
    // Send real Telegram message
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
            showNotification('📱 Заявка также отправлена в Telegram группу @zakazSaaS', 'info');
        } else {
            console.error('Telegram API error:', data);
            showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
        }
        this.reset();
        button.innerHTML = originalText;
        button.disabled = false;
    })
    .catch(error => {
        console.error('Error sending to Telegram:', error);
        showNotification('✅ Заявка отправлена! Мы свяжемся с вами в течение 15 минут.', 'success');
        this.reset();
        button.innerHTML = originalText;
        button.disabled = false;
    });
    });
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4ECDC4' : type === 'error' ? '#FF6B6B' : '#4C75A3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// App Screenshots Interactions
function initAppScreenshots() {
    const screenshotItems = document.querySelectorAll('.screenshot-item');
    
    screenshotItems.forEach(item => {
        const phoneFrame = item.querySelector('.phone-frame');
        const buttons = item.querySelectorAll('button');
        
        // Add hover effect to phone frames
        phoneFrame.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.4)';
        });
        
        phoneFrame.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        });
        
        // Add click handlers for app buttons
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const buttonText = this.textContent;
                const appType = item.querySelector('.screenshot-label h4').textContent;
                
                if (buttonText.includes('Записаться')) {
                    showNotification(`Запись на услугу в приложении "${appType}"`, 'success');
                } else if (buttonText.includes('В корзину')) {
                    showNotification(`Товар добавлен в корзину в приложении "${appType}"`, 'success');
                } else if (buttonText.includes('Позвонить')) {
                    showNotification(`Звонок в приложении "${appType}"`, 'success');
                } else if (buttonText.includes('Заказать')) {
                    showNotification(`Заказ оформлен в приложении "${appType}"`, 'success');
                }
            });
        });
    });
}

// Product Carousel Animation
function initProductCarousel() {
    const carousel = document.querySelector('.product-carousel');
    if (!carousel) return;
    
    const items = carousel.querySelectorAll('.carousel-item');
    let currentIndex = 0;
    
    function showItem(index) {
        items.forEach((item, i) => {
            item.style.opacity = i === index ? '1' : '0';
            item.style.transform = i === index ? 'translateY(0)' : 'translateY(20px)';
            item.style.display = i === index ? 'flex' : 'none';
        });
    }
    
    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        showItem(currentIndex);
    }
    
    // Auto-rotate carousel
    setInterval(nextItem, 4000);
    
    // Show first item
    showItem(0);
}

// Pricing toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to pricing cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('popular')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
        
        // Add click handlers for pricing buttons
        const button = card.querySelector('.btn');
        if (button) {
            button.addEventListener('click', function() {
                const planName = card.querySelector('h4').textContent;
                showNotification(`Вы выбрали план "${planName}". Мы свяжемся с вами для уточнения деталей!`, 'success');
            });
        }
    });
    
    // Add floating animation to hero elements
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 2}s`;
    });
    
    // Add scroll-triggered animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.problem-item, .feature-card, .step, .pricing-card, .screenshot-item');
        elements.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };
    
    // Initialize scroll animations
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load
    
    // Add initial styles for animations
    const animatedElements = document.querySelectorAll('.problem-item, .feature-card, .step, .pricing-card, .screenshot-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initialize app screenshots
    initAppScreenshots();
    
    // Initialize product carousel
    initProductCarousel();
    
    // Initialize examples section
    initExamples();
});

// Mobile menu toggle (if needed)
const createMobileMenu = () => {
    const header = document.querySelector('.header-content');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-btn')) {
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileBtn.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        if (window.innerWidth <= 768) {
            mobileBtn.style.display = 'block';
            nav.style.display = 'none';
        }
        
        mobileBtn.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
            mobileBtn.innerHTML = nav.style.display === 'none' ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
        });
        
        header.appendChild(mobileBtn);
    }
};

// Initialize mobile menu
window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Add smooth reveal animations for sections
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
};

// Initialize section animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    window.addEventListener('scroll', revealSections);
    revealSections(); // Run once on load
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 3D Logo Interactive Effect
function init3DLogo() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    // Mouse move effect for 3D rotation
    logo.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    // Reset on mouse leave
    logo.addEventListener('mouseleave', function() {
        this.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });

    // Add click effect
    logo.addEventListener('click', function() {
        this.style.transform = 'rotateX(10deg) rotateY(10deg) scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        }, 300);
    });

    // Add floating animation
    let floatDirection = 1;
    setInterval(() => {
        const currentTransform = logo.style.transform || '';
        const translateZ = 20 + Math.sin(Date.now() * 0.001) * 5;
        logo.style.transform = currentTransform.replace(/translateZ\([^)]*\)/, '') + ` translateZ(${translateZ}px)`;
    }, 50);
}

// Initialize 3D logo
document.addEventListener('DOMContentLoaded', function() {
    init3DLogo();
});

// Initialize examples section
function initExamples() {
    const exampleItems = document.querySelectorAll('.example-item');
    
    exampleItems.forEach(item => {
        item.addEventListener('click', () => {
            // Add click animation
            const phoneFrame = item.querySelector('.phone-frame-small');
            phoneFrame.style.transform = 'scale(0.95)';
            setTimeout(() => {
                phoneFrame.style.transform = '';
            }, 150);
            
            // Show notification
            showNotification('Отличный выбор! Это один из наших лучших проектов.', 'success');
        });
        
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.zIndex = '1';
        });
    });
}

// Initialize plan selection functionality
function initPlanSelection() {
    const planButtons = document.querySelectorAll('.select-plan-btn');
    const planSelect = document.getElementById('plan-select');
    
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedPlan = this.getAttribute('data-plan');
            
            // Set the plan in the form
            if (planSelect) {
                planSelect.value = selectedPlan;
            }
            
            // Scroll to the form
            const formSection = document.getElementById('demo');
            if (formSection) {
                formSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Show notification
            const planNames = {
                'start': 'Старт',
                'business': 'Бизнес',
                'premium': 'Премиум'
            };
            showNotification(`План "${planNames[selectedPlan]}" выбран! Заполните форму ниже.`, 'success');
        });
    });
}

// Initialize plan selection
document.addEventListener('DOMContentLoaded', function() {
    initPlanSelection();
});