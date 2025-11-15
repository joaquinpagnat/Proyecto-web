$(document).ready(function () {
    const $openModalButtons = $('[data-modal-target]');
    const $overlays = $('.modal-overlay');

    $openModalButtons.on('click', function (e) {
        e.preventDefault();
        const $button = $(this);
        const $modal = $($button.data('modalTarget'));
        if ($modal && $modal.attr('id') === 'modal-partido') {
            populateMatchModal($button, $modal);
        }
        openModal($modal);
    });

    $overlays.each(function () {
        const $overlay = $(this);
        $overlay.on('click', function (e) {
            if (e.target === this) closeModal($overlay);
        });
        const $closeButton = $overlay.find('.close-button');
        $closeButton.on('click', function () {
            closeModal($overlay);
        });
    });

    function openModal($modal) {
        if (!$modal.length) return;
        $modal.addClass('active');
    }

    function closeModal($modal) {
        if (!$modal.length) return;
        $modal.removeClass('active');
    }

    function populateMatchModal($button, $modal) {
        if (!$button.data('homeTeam')) {
            const $header = $modal.find('.match-modal-header');
            const $body = $modal.find('.match-modal-body');
            $header.hide();
            $body.html('<h4>Estadísticas no disponibles para partidos futuros.</h4>');
            return;
        }

        $modal.find('.match-modal-header').css('display', 'flex');
        const stats = $button.data('stats') ? JSON.parse($button.data('stats')) : {};

        $modal.find('.team-home img').attr('src', $button.data('homeLogo'));
        $modal.find('.team-home span').text($button.data('homeTeam'));
        $modal.find('.match-score').text(`${$button.data('homeScore')} - ${$button.data('awayScore')}`);
        $modal.find('.match-league').text($button.data('league'));
        $modal.find('.team-away img').attr('src', $button.data('awayLogo'));
        $modal.find('.team-away span').text($button.data('awayTeam'));

        if (stats.possession) {
            const homePoss = stats.possession;
            const awayPoss = 100 - homePoss;
            const $statRow = $modal.find('.stat-row[data-stat="possession"]');
            $statRow.find('.stat-value-home').text(`${homePoss}%`);
            $statRow.find('.stat-value-away').text(`${awayPoss}%`);
            $statRow.find('.stat-bar-inner').css('width', `${homePoss}%`);
        }
    }

    const $track = $('.carousel-track');
    if ($track.length) {
        const $slides = $track.children();
        const $nextButton = $('.carousel-button.next');
        const $prevButton = $('.carousel-button.prev');
        let slideWidth = $slides.length ? $slides.first().outerWidth() : 0;
        let currentIndex = 0;

        const getVisibleSlides = () => {
            const $window = $('.carousel-window');
            if (!$window.length) return 0;
            const windowWidth = $window.outerWidth();
            return slideWidth > 0 ? Math.floor(windowWidth / slideWidth) : 0;
        };

        const moveToSlide = (targetIndex) => {
            $track.css('transform', `translateX(-${slideWidth * targetIndex}px)`);
            currentIndex = targetIndex;
        };

        $nextButton.on('click', function () {
            const visibleSlides = getVisibleSlides();
            if ($slides.length <= visibleSlides) return;
            if (currentIndex >= $slides.length - visibleSlides) {
                moveToSlide(0);
            } else {
                moveToSlide(currentIndex + 1);
            }
        });

        $prevButton.on('click', function () {
            const visibleSlides = getVisibleSlides();
            if ($slides.length <= visibleSlides) return;
            if (currentIndex === 0) {
                moveToSlide($slides.length - visibleSlides);
            } else {
                moveToSlide(currentIndex - 1);
            }
        });

        $(window).on('resize', function () {
            slideWidth = $slides.length ? $slides.first().outerWidth() : 0;
            moveToSlide(currentIndex);
        });
    }

    const $darkModeToggle = $('#dark-mode-toggle');
    const $body = $('body');

    function applyTheme(theme) {
        if (theme === 'dark') {
            $body.addClass('dark-mode');
        } else {
            $body.removeClass('dark-mode');
        }
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
    }

    $darkModeToggle.on('click', function () {
        const isDarkMode = $body.hasClass('dark-mode');
        if (isDarkMode) {
            applyTheme('light');
            localStorage.setItem('theme', 'light');
        } else {
            applyTheme('dark');
            localStorage.setItem('theme', 'dark');
        }
    });
});

