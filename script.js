// ==========================================
// MENU HAMBURGER
// ==========================================
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');

if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Fermer le menu lors du clic sur un lien
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fermer le menu lors du clic en dehors
    document.addEventListener('click', (e) => {
        if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ==========================================
// HEADER SCROLL EFFECT - ULTRA COMPACT
// ==========================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Ajouter classe "scrolled" dès qu'on scroll un peu (50px)
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Ignore les liens vides ou # seulement
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }
        
        const target = document.querySelector(href);
        
        if (target) {
            e.preventDefault();
            const headerOffset = 80;
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
// ANIMATION AU SCROLL (Intersection Observer)
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

// Éléments à animer
const animateElements = document.querySelectorAll('.service-card, .project-card, .testimonial-card, .process-step, .stat-box');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==========================================
// FORM HANDLING - Connexion avec le backend
// ==========================================
const API_URL = 'https://backendiat.onrender.com/dept';
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Récupération des valeurs
        const formData = {
            nom: document.getElementById('nom').value.trim(),
            prenom: document.getElementById('prenom')?.value.trim() || '',
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone')?.value.trim() || '',
            service: document.getElementById('service')?.value || '',
            message: document.getElementById('message').value.trim()
        };

        // Validation basique
        if (!formData.nom || !formData.email || !formData.service || !formData.message) {
            showNotification('Veuillez remplir tous les champs obligatoires', 'error');
            return;
        }

        // Récupération du bouton de soumission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        try {
            // Désactiver le bouton et afficher un loader
            submitButton.disabled = true;
            submitButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Envoi en cours...
            `;

            // Envoi de la requête vers le backend
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Succès
                showNotification(data.message || 'Message envoyé avec succès ! Nous vous contacterons bientôt.', 'success');
                contactForm.reset();
            } else {
                // Erreur
                showNotification(data.message || 'Une erreur est survenue lors de l\'envoi', 'error');
            }

        } catch (error) {
            console.error('Erreur:', error);
            showNotification('Impossible de se connecter au serveur. Veuillez réessayer plus tard.', 'error');
        } finally {
            // Réactiver le bouton
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

// Fonction pour afficher les notifications
function showNotification(message, type = 'info') {
    // Supprimer les notifications existantes
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Créer la nouvelle notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${type === 'success'
                    ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                    : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                }
            </svg>
            <p>${message}</p>
        </div>
        <button class="notification__close" onclick="this.parentElement.remove()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    // Ajouter au body
    document.body.appendChild(notification);

    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('notification--show');
    }, 10);

    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
        notification.classList.remove('notification--show');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ==========================================
// ACTIVE LINK NAVIGATION
// ==========================================
const sections = document.querySelectorAll('section[id]');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
        
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Enlever l'active de tous les liens
            document.querySelectorAll('.nav__link').forEach(link => {
                link.style.color = '';
            });
            // Ajouter l'active au lien courant (sauf CTA)
            if (!navLink.classList.contains('nav__link--cta')) {
                navLink.style.color = 'var(--color-accent)';
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ==========================================
// COMPTEURS ANIMÉS POUR LES STATS
// ==========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Observer pour les stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-box__number, .stat__number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                const targetNumber = parseInt(statNumber.textContent);
                if (!isNaN(targetNumber)) {
                    animateCounter(statNumber, targetNumber);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-box, .stat').forEach(stat => {
    statsObserver.observe(stat);
});

// ==========================================
// PARALLAX EFFECT (léger) sur le hero
// ==========================================
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = hero.querySelector('.hero__bg');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    });
} else {
    // Fallback pour les navigateurs plus anciens
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ==========================================
// RÉVÉLATION DES OBSTACLES (PROBLEMS SECTION)
// ==========================================
const revealProblemsBtn = document.getElementById('revealProblemsBtn');
const problemsReveal = document.getElementById('problemsReveal');
const problemsGrid = document.getElementById('problemsGrid');

if (revealProblemsBtn && problemsReveal && problemsGrid) {
    revealProblemsBtn.addEventListener('click', () => {
        // Animation de disparition de la question
        problemsReveal.style.transition = 'all 0.6s ease';
        problemsReveal.style.opacity = '0';
        problemsReveal.style.transform = 'scale(0.9)';

        // Après l'animation, masquer la question et afficher les cards
        setTimeout(() => {
            problemsReveal.style.display = 'none';
            problemsGrid.style.display = 'grid';

            // Petit délai pour l'animation d'apparition
            setTimeout(() => {
                problemsGrid.classList.add('revealed');
            }, 50);
        }, 600);
    });
}

// ==========================================
// TOGGLE "VOIR PLUS" SERVICES
// ==========================================
const toggleServicesBtn = document.getElementById('toggleServices');
const servicesGridFull = document.querySelector('.services__grid--full');

if (toggleServicesBtn && servicesGridFull) {
    toggleServicesBtn.addEventListener('click', () => {
        const isHidden = servicesGridFull.style.display === 'none' || !servicesGridFull.style.display;
        const toggleText = toggleServicesBtn.querySelector('.toggle-text');
        const chevronDown = toggleServicesBtn.querySelector('.chevron-down');
        const chevronUp = toggleServicesBtn.querySelector('.chevron-up');

        if (isHidden) {
            servicesGridFull.style.display = 'grid';
            toggleText.textContent = 'Voir moins de services';
            chevronDown.style.display = 'none';
            chevronUp.style.display = 'block';

            // Scroll smooth vers les nouveaux services
            setTimeout(() => {
                servicesGridFull.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            servicesGridFull.style.display = 'none';
            toggleText.textContent = 'Voir les 3 autres services';
            chevronDown.style.display = 'block';
            chevronUp.style.display = 'none';
        }
    });
}

// ==========================================
// TOGGLE "VOIR PLUS" PROJETS
// ==========================================
const toggleProjectsBtn = document.getElementById('toggleProjects');
const projectsGridFull = document.querySelector('.projects__grid--full');

if (toggleProjectsBtn && projectsGridFull) {
    toggleProjectsBtn.addEventListener('click', () => {
        const isHidden = projectsGridFull.style.display === 'none' || !projectsGridFull.style.display;
        const toggleText = toggleProjectsBtn.querySelector('.toggle-text');
        const chevronDown = toggleProjectsBtn.querySelector('.chevron-down');
        const chevronUp = toggleProjectsBtn.querySelector('.chevron-up');

        if (isHidden) {
            projectsGridFull.style.display = 'grid';
            toggleText.textContent = 'Voir moins de projets';
            chevronDown.style.display = 'none';
            chevronUp.style.display = 'block';

            // Scroll smooth vers les nouveaux projets
            setTimeout(() => {
                projectsGridFull.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            projectsGridFull.style.display = 'none';
            toggleText.textContent = 'Voir les 3 autres projets';
            chevronDown.style.display = 'block';
            chevronUp.style.display = 'none';
        }
    });
}

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c🚀 Site développé par IATEK', 'color: #9DD33A; font-size: 18px; font-weight: bold;');
console.log('%c💼 Besoin de services de développement?', 'color: #153B66; font-size: 14px;');
console.log('%c📧 contact@iatek.com', 'color: #3A3A3A; font-size: 14px;');

// ==========================================
// EASTER EGG - Konami Code
// ==========================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
    
    if (konamiCode.join('') === konamiPattern.join('')) {
        console.log('%c🎮 Code Konami activé! Vous avez trouvé l\'easter egg!', 'color: #9DD33A; font-size: 20px; font-weight: bold;');
        document.body.style.animation = 'rainbow 3s infinite';
    }
});

// ==========================================
// PERFORMANCE MONITORING
// ==========================================
if (window.performance) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page chargée en ${pageLoadTime}ms`);
        }, 0);
    });
}