document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const homeContainer = document.querySelector('.home-container');
    let lastScrollTop = 0;
    let timer;

    // --- Fonction de gestion du défilement ---
    function checkScroll() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Si l'utilisateur est en haut de la page
        if (scrollTop === 0) {
            header.classList.remove('solid');
            header.classList.add('transparent');
        } else {
            header.classList.remove('transparent');
            header.classList.add('solid');
        }
        
        // Si on défile vers le bas, cacher le header
        if (scrollTop > lastScrollTop && scrollTop > 50) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    }

    // --- Gestion du scroll principal ---
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Initialisation de l'état du header

    // --- Partie Inactivité Souris ---
    function changeHeaderState() {
        header.classList.remove('solid');
        header.classList.add('hidden');
    }

    function resetTimer() {
        clearTimeout(timer);
        
        // Vérifier si on est en haut de la page
        if (window.scrollY === 0) {
            header.classList.add('transparent');
            header.classList.remove('hidden');
        } else {
            header.classList.remove('transparent');
            header.classList.add('solid');
            
            // Réinitialiser le timer pour cacher le header après 3 secondes d'inactivité
            timer = setTimeout(changeHeaderState, 3000);
            
            // Si le header était caché, le montrer
            if (header.classList.contains('hidden')) {
                header.classList.remove('hidden');
            }
        }
    }

    document.addEventListener('mousemove', resetTimer);
    document.addEventListener('scroll', resetTimer);
    resetTimer();
    // --- Fin Partie Inactivité Souris ---

    // --- Scrolling agréable ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Chargement lent des images (lazy loading) ---
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const config = {
            rootMargin: '0px 0px 50px 0px',
            threshold: 0
        };
        
        let observer = new IntersectionObserver(function(entries, self) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    preloadImage(entry.target);
                    self.unobserve(entry.target);
                }
            });
        }, config);
        
        images.forEach(image => {
            observer.observe(image);
        });
        
        function preloadImage(img) {
            const src = img.getAttribute('data-src');
            if (!src) return;
            img.src = src;
        }
    }

    // --- Boutons interactifs ---
    document.querySelectorAll('.bouton a').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault(); // Empêcher le comportement par défaut du lien
            
            // Toggle la classe active sur le bouton cliqué
            this.classList.toggle('active');
            
            // Fermer les autres boutons actifs dans la même section
            const parentSection = this.closest('.bouton');
            if (parentSection) {
                parentSection.querySelectorAll('a.active').forEach(other => {
                    if (other !== this) {
                        other.classList.remove('active');
                    }
                });
            }
        });
    });

    // --- Gestion supplémentaire du scroll pour le homeContainer ---
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('hidden');
            homeContainer.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
            homeContainer.classList.remove('hidden');
        }
        
        lastScroll = currentScroll;
    });
});
