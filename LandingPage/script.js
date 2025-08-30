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
document.querySelectorAll('.solution-item, .story-item, .stat-item, .floating-card').forEach(el => {
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
        const interest = formData.get('interest');
        const message = formData.get('message');
        
        console.log('Form data:', { name, phone, interest, message });
        
        // Enhanced validation
        if (!name || name.trim().length < 2) {
            showNotification('Пожалуйста, введите корректное имя', 'error');
            return;
        }
        
        if (!phone || phone.trim().length < 10) {
            showNotification('Пожалуйста, введите корректный номер телефона', 'error');
            return;
        }
        
        if (!interest) {
            showNotification('Пожалуйста, выберите интересующее решение', 'error');
            return;
        }
        
        // Send to Telegram
        const button = this.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправляем...';
        button.disabled = true;
        
        // Prepare message for Telegram
        const telegramMessage = `
🔔 *Новая заявка с посадочной страницы*

👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
🎯 *Интерес:* ${getInterestText(interest)}
💬 *Сообщение:* ${message || 'Не указано'}

🌐 *Источник:* SaaS Solutions Landing Page
        `;
        
        // Telegram Bot API - отправка в личку и группу
const botToken = '8179352605:AAFAiFo5IReS0mST3RXCyEMokK9UYdfVEEs';
const chatId = '@zakazSaaS';
const groupId = '@zakazSaaS';
        
        // Отправляем в личку
        const sendToChat = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });
        
        // Отправляем в группу
        const sendToGroup = fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: groupId,
                text: telegramMessage,
                parse_mode: 'Markdown'
            })
        });
        
        // Ждем отправки в оба места
        Promise.all([sendToChat, sendToGroup])
        .then(responses => Promise.all(responses.map(r => r.json())))
        .then(results => {
            const [chatResult, groupResult] = results;
            if (chatResult.ok && groupResult.ok) {
                showNotification('Спасибо! Мы свяжемся с вами в течение 15 минут.', 'success');
                form.reset();
            } else {
                throw new Error('Telegram API error');
            }
        })
        .catch(error => {
            console.error('Error sending to Telegram:', error);
            showNotification('Произошла ошибка при отправке. Попробуйте позже.', 'error');
        })
        .finally(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        });
    });
});

// Helper function to get interest text
function getInterestText(interest) {
    const interests = {
        'vksaas': 'VKSaaS - мини-приложения ВК',
        'excelsaas': 'ExcelSaaS - скрипты для таблиц',
        'both': 'Оба решения'
    };
    return interests[interest] || interest;
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#00FF88' : type === 'error' ? '#FF0066' : '#00D4FF'};
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(10px);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

// Parallax effect for floating cards
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        card.style.transform = `translateY(${yPos}px)`;
    });
});

// Solution cards hover effects
document.querySelectorAll('.solution-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Comparison table row hover effects
document.querySelectorAll('.comparison-row').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(0, 212, 255, 0.1)';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
    });
});

// Stats counter animation
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace(/\D/g, ''));
        const suffix = stat.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + suffix;
        }, 50);
    });
}

// Trigger stats animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Mobile menu toggle (if needed)
function createMobileMenu() {
    const header = document.querySelector('.header-content');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-menu-toggle')) {
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        mobileToggle.style.cssText = `
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 1.5rem;
            cursor: pointer;
            display: block;
        `;
        
        mobileToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-open');
        });
        
        header.appendChild(mobileToggle);
        
        // Add mobile styles
        const mobileStyles = `
            @media (max-width: 768px) {
                .nav {
                    position: fixed;
                    top: 100%;
                    left: 0;
                    width: 100%;
                    background: var(--darker-bg);
                    flex-direction: column;
                    padding: 2rem;
                    transform: translateY(-100%);
                    transition: transform 0.3s ease;
                    border-top: 1px solid var(--border-color);
                }
                
                .nav.mobile-open {
                    transform: translateY(0);
                }
                
                .nav a {
                    padding: 1rem 0;
                    border-bottom: 1px solid var(--border-color);
                }
                
                .nav a:last-child {
                    border-bottom: none;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize mobile menu
window.addEventListener('load', createMobileMenu);
window.addEventListener('resize', createMobileMenu);

// Smooth reveal animation for sections
const revealSections = document.querySelectorAll('.solutions, .comparison, .about, .contact');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealSections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    revealObserver.observe(section);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add CSS for loading state
const loadingStyles = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::after {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--dark-bg);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        border: 3px solid var(--border-color);
        border-top: 3px solid var(--primary-color);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        z-index: 10000;
        transform: translate(-50%, -50%);
    }
    
    @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;

const loadingStyleSheet = document.createElement('style');
loadingStyleSheet.textContent = loadingStyles;
document.head.appendChild(loadingStyleSheet);

