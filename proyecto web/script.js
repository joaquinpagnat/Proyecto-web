document.addEventListener('DOMContentLoaded', () => {

    // ===== LÓGICA PARA VENTANAS MODALES =====
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const overlays = document.querySelectorAll('.modal-overlay');

    openModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const modal = document.querySelector(button.dataset.modalTarget);

            if (modal && modal.id === 'modal-partido') {
                populateMatchModal(button, modal);
            }
            
            openModal(modal);
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
        const closeButton = overlay.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                closeModal(overlay);
            });
        }
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
    }
    
    function populateMatchModal(button, modal) {
        if (!button.dataset.homeTeam) {
            // Maneja el caso de "VER DETALLES" sin datos de partido
            // Por ejemplo, podrías limpiar la modal o mostrar un mensaje
            const header = modal.querySelector('.match-modal-header');
            const body = modal.querySelector('.match-modal-body');
            header.style.display = 'none';
            body.innerHTML = '<h4>Estadísticas no disponibles para partidos futuros.</h4>';
            return;
        }

        // Si hay datos, asegúrate de que el contenido sea visible
        modal.querySelector('.match-modal-header').style.display = 'flex';
        // (Aquí podrías restaurar el contenido del body si lo cambiaste antes)

        const stats = JSON.parse(button.dataset.stats || '{}');

        modal.querySelector('.match-modal-header .team-home img').src = button.dataset.homeLogo;
        modal.querySelector('.match-modal-header .team-home span').innerText = button.dataset.homeTeam;
        modal.querySelector('.match-modal-header .match-score').innerText = `${button.dataset.homeScore} - ${button.dataset.awayScore}`;
        modal.querySelector('.match-modal-header .match-league').innerText = button.dataset.league;
        modal.querySelector('.match-modal-header .team-away img').src = button.dataset.awayLogo;
        modal.querySelector('.match-modal-header .team-away span').innerText = button.dataset.awayTeam;

        // Llenar estadísticas (asegurándose de que 'stats' no sea nulo)
        if (stats.possession) {
            modal.querySelector('.stat-row[data-stat="possession"] .stat-value-home').innerText = `${stats.possession}%`;
            modal.querySelector('.stat-row[data-stat="possession"] .stat-value-away').innerText = `${100 - stats.possession}%`;
            modal.querySelector('.stat-row[data-stat="possession"] .stat-bar-inner').style.width = `${stats.possession}%`;
        }
        
        // (y así con el resto de las estadísticas)
        // ...
    }

    // ===== LÓGICA PARA EL CARRUSEL =====
    const track = document.querySelector('.carousel-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.carousel-button.next');
        const prevButton = document.querySelector('.carousel-button.prev');
        let slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
        let currentIndex = 0;

        const getVisibleSlides = () => {
            if (!document.querySelector('.carousel-window')) return 0;
            const windowWidth = document.querySelector('.carousel-window').offsetWidth;
            return slideWidth > 0 ? Math.floor(windowWidth / slideWidth) : 0;
        };

        const moveToSlide = (targetIndex) => {
            if (track) {
               track.style.transform = 'translateX(-' + slideWidth * targetIndex + 'px)';
               currentIndex = targetIndex;
            }
        };

        if (nextButton && prevButton) {
            nextButton.addEventListener('click', () => {
                const visibleSlides = getVisibleSlides();
                if (slides.length <= visibleSlides) return;
                
                if (currentIndex >= slides.length - visibleSlides) {
                    moveToSlide(0);
                } else {
                    moveToSlide(currentIndex + 1);
                }
            });

            prevButton.addEventListener('click', () => {
                const visibleSlides = getVisibleSlides();
                if (slides.length <= visibleSlides) return;

                if (currentIndex === 0) {
                    moveToSlide(slides.length - visibleSlides);
                } else {
                    moveToSlide(currentIndex - 1);
                }
            });
        }
        
        window.addEventListener('resize', () => {
            slideWidth = slides.length > 0 ? slides[0].getBoundingClientRect().width : 0;
            moveToSlide(currentIndex);
        });
    }

    // ===== LÓGICA PARA EL MODO OSCURO (DARK MODE) =====
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            applyTheme('dark');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        const isDarkMode = body.classList.contains('dark-mode');
        if (isDarkMode) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

});