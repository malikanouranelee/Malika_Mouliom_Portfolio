/* ===================================
   PORTFOLIO - MAIN.JS
   Fonctionnalités JavaScript
   =================================== */

// ===================================
// 1. INITIALISATION AU CHARGEMENT
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    setActivePage();
});

// ===================================
// 2. NAVIGATION
// ===================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.navbar nav ul');
    const navLinks = document.querySelectorAll('.navbar nav a');
    
    // Effet au scroll - navbar devient plus compacte
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Menu hamburger mobile
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fermer le menu au clic sur un lien
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Fermer le menu si on clique à l'extérieur
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
}

// ===================================
// 3. PAGE ACTIVE DANS LA NAVIGATION
// ===================================
function setActivePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar nav a');
    
    navLinks.forEach(link => {
        // Retirer la classe active de tous les liens
        link.classList.remove('active');
        
        // Ajouter la classe active au lien correspondant à la page actuelle
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===================================
// 4. ANIMATIONS AU SCROLL
// ===================================
function initScrollAnimations() {
    // Sélectionner tous les éléments à animer
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    // Options pour l'Intersection Observer
    const observerOptions = {
        threshold: 0.1,        // L'élément doit être visible à 10%
        rootMargin: '0px 0px -50px 0px'  // Déclencher un peu avant
    };
    
    // Créer l'observateur
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Ajouter la classe 'visible' quand l'élément entre dans le viewport
                entry.target.classList.add('visible');
                
                // Optionnel : arrêter d'observer après l'animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ===================================
// 5. BOUTON RETOUR EN HAUT
// ===================================
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        // Afficher/masquer le bouton selon la position du scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Retour en haut au clic
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// 6. FORMULAIRE DE CONTACT
// ===================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };
            
            // Validation basique
            if (!validateForm(formData)) {
                return;
            }
            
            // Simuler l'envoi (à remplacer par votre backend)
            sendContactForm(formData);
        });
    }
}

// Fonction de validation
function validateForm(data) {
    // Vérifier que tous les champs sont remplis
    if (!data.name || !data.email || !data.subject || !data.message) {
        showMessage('Veuillez remplir tous les champs.', 'error');
        return false;
    }
    
    // Vérifier le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Veuillez entrer une adresse email valide.', 'error');
        return false;
    }
    
    // Vérifier la longueur du message
    if (data.message.length < 10) {
        showMessage('Votre message doit contenir au moins 10 caractères.', 'error');
        return false;
    }
    
    return true;
}

// Fonction d'envoi du formulaire
function sendContactForm(data) {
    // Afficher un message de chargement
    showMessage('Envoi en cours...', 'info');
    
    /* ============================================
       IMPORTANT : À PERSONNALISER
       ============================================*/
       
      const formspreeEndpoint = 'https://formspree.io/f/xnjbjdgr';

        fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        })
        .then(response => {
            if (response.ok) {
                showMessage('Message envoyé avec succès !', 'success');
                document.getElementById('contact-form').reset();
            } else {
                return response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        showMessage(data["errors"].map(error => error["message"]).join(", "), 'error');
                    } else {
                        showMessage('Oups ! Un problème est survenu.', 'error');
                    }
                })
            }
        })
        .catch(error => {
            showMessage('Erreur réseau. Veuillez vérifier votre connexion.', 'error');
        });
   /* ============================================ */
    
    // Pour l'instant, simulation d'envoi réussi après 1 seconde
    setTimeout(function() {
        showMessage('Message envoyé avec succès ! Je vous répondrai rapidement.', 'success');
        document.getElementById('contact-form').reset();
    }, 1000);
}

// Fonction pour afficher les messages
function showMessage(message, type) {
    // Supprimer les anciens messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer le nouveau message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Styles en fonction du type
    messageDiv.style.padding = '1rem';
    messageDiv.style.marginTop = '1rem';
    messageDiv.style.borderRadius = '4px';
    messageDiv.style.textAlign = 'center';
    messageDiv.style.fontWeight = '500';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = 'rgba(76, 175, 80, 0.2)';
        messageDiv.style.border = '1px solid #4CAF50';
        messageDiv.style.color = '#4CAF50';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = 'rgba(244, 67, 54, 0.2)';
        messageDiv.style.border = '1px solid #f44336';
        messageDiv.style.color = '#f44336';
    } else {
        messageDiv.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
        messageDiv.style.border = '1px solid #d4af37';
        messageDiv.style.color = '#d4af37';
    }
    
    // Ajouter le message après le formulaire
    const form = document.getElementById('contact-form');
    form.appendChild(messageDiv);
    
    // Faire défiler jusqu'au message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Supprimer le message après 5 secondes
    if (type !== 'info') {
        setTimeout(function() {
            messageDiv.style.opacity = '0';
            messageDiv.style.transition = 'opacity 0.5s ease';
            setTimeout(function() {
                messageDiv.remove();
            }, 500);
        }, 5000);
    }
}

// ===================================
// 7. ANIMATIONS DES BARRES DE COMPÉTENCES
// (Pour la page skills.html)
// ===================================
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const targetWidth = progressBar.getAttribute('data-width') || progressBar.style.width;
                
                // Animation de 0 à la largeur cible
                progressBar.style.width = '0';
                setTimeout(function() {
                    progressBar.style.width = targetWidth;
                }, 100);
                
                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);
    
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Initialiser l'animation des compétences si on est sur la page skills
if (document.querySelector('.skills-grid')) {
    animateSkillBars();
}

// ===================================
// 8. UTILITAIRES
// ===================================

// Smooth scroll pour les liens d'ancrage (si vous en avez)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Ignorer les # vides
        if (href === '#' || href === '#!') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// 9. CONSOLE MESSAGE (Optionnel)
// ===================================
console.log('%c👋 Bienvenue sur mon portfolio !', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%cSi vous inspectez le code, vous êtes peut-être développeur ? Contactez-moi ! 😊', 'color: #a0a0a0; font-size: 14px;');