// ==========================================
// PROJETS PAGE - FILTRES & INTERACTIONS
// ==========================================

// Filtres de projets
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-detail');

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            // Mise à jour des boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrage des projets
            projectCards.forEach(card => {
                const category = card.dataset.category;

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Animation d'apparition
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.classList.add('hidden');
                }
            });

            // Scroll smooth vers la section projets
            const portfolioSection = document.querySelector('.portfolio-projects');
            if (portfolioSection) {
                setTimeout(() => {
                    portfolioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });
}

// ==========================================
// GALERIE IMAGES - LIGHTBOX SIMPLE
// ==========================================
const galleryImages = document.querySelectorAll('.project-detail__gallery img, .project-detail__main-image img');

if (galleryImages.length > 0) {
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            // Créer overlay lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox__overlay"></div>
                <div class="lightbox__content">
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="lightbox__close">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            `;

            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';

            // Animation d'entrée
            setTimeout(() => {
                lightbox.classList.add('active');
            }, 10);

            // Fermeture
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                setTimeout(() => {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }, 300);
            };

            lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
            lightbox.querySelector('.lightbox__overlay').addEventListener('click', closeLightbox);

            // Fermeture avec ESC
            document.addEventListener('keydown', function escapeHandler(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escapeHandler);
                }
            });
        });
    });
}

// ==========================================
// ANIMATIONS AU SCROLL
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les projets
projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// ==========================================
// STATS ANIMATION (Compteurs)
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const isPercentage = target.toString().includes('%');
    const isMoney = target.toString().includes('M') || target.toString().includes('K');

    let numericTarget = parseFloat(target);
    const suffix = target.toString().replace(/[0-9.,]/g, '');

    const increment = numericTarget / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= numericTarget) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            if (isMoney) {
                element.textContent = Math.floor(current) + suffix;
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }
    }, 16);
}

// Observer pour les stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(statNumber => {
                if (!statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    const targetText = statNumber.textContent;
                    animateCounter(statNumber, targetText);
                }
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.project-stats').forEach(stats => {
    statsObserver.observe(stats);
});

// ==========================================
// STYLES LIGHTBOX (Injecté dynamiquement)
// ==========================================
const lightboxStyles = document.createElement('style');
lightboxStyles.textContent = `
    .lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .lightbox.active {
        opacity: 1;
    }

    .lightbox__overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(4px);
    }

    .lightbox__content {
        position: relative;
        z-index: 1;
        max-width: 90vw;
        max-height: 90vh;
        padding: var(--spacing-md);
    }

    .lightbox__content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: var(--radius-xl);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .lightbox__close {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        backdrop-filter: blur(8px);
    }

    .lightbox__close:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
    }

    .lightbox__close svg {
        color: white;
    }

    @media (max-width: 768px) {
        .lightbox__content {
            max-width: 95vw;
            padding: var(--spacing-sm);
        }

        .lightbox__close {
            top: var(--spacing-sm);
            right: var(--spacing-sm);
            width: 40px;
            height: 40px;
        }

        .lightbox__close svg {
            width: 24px;
            height: 24px;
        }
    }
`;
document.head.appendChild(lightboxStyles);

// ==========================================
// SMOOTH SCROLL POUR ANCRES
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        if (!href || href === '#') {
            e.preventDefault();
            return;
        }

        const target = document.querySelector(href);

        if (target) {
            e.preventDefault();
            const headerOffset = 100;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================
// LAZY LOADING OPTIMISÉ
// ==========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback avec IntersectionObserver
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==========================================
// PARTAGE SOCIAL (Optionnel)
// ==========================================
function shareProject(projectTitle, projectUrl) {
    if (navigator.share) {
        navigator.share({
            title: projectTitle,
            text: `Découvrez ce projet IATEK : ${projectTitle}`,
            url: projectUrl
        }).catch(err => console.log('Erreur de partage:', err));
    } else {
        // Fallback : copier le lien
        navigator.clipboard.writeText(projectUrl).then(() => {
            alert('Lien copié dans le presse-papiers !');
        });
    }
}

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page Projets chargée en ${pageLoadTime}ms`);
        }, 0);
    });
}

console.log('%c📂 Page Projets IATEK', 'color: #00D9FF; font-size: 16px; font-weight: bold;');
console.log('%c✨ Filtres actifs, Lightbox disponible', 'color: #7C3AED; font-size: 12px;');
