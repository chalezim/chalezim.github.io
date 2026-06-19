/* ============================================
   CHALEZIM HOSPEDAGENS — JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ============================================
     NAVBAR — scroll effect + mobile toggle
     ============================================ */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  navToggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  // Close menu on outside click
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });

  /* ============================================
     HERO SLIDER
     ============================================ */
  const heroSlider  = document.getElementById('heroSlider');
  const heroSlides  = heroSlider ? heroSlider.querySelectorAll('.hero__slide') : [];
  const heroDots    = document.getElementById('heroDots');
  const heroPrev    = document.getElementById('heroPrev');
  const heroNext    = document.getElementById('heroNext');
  let heroIndex     = 0;
  let heroTimer     = null;
  const HERO_INTERVAL = 5000;

  if (heroSlides.length > 0) {
    // Create dots
    heroSlides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'hero__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para foto ' + (i + 1));
      dot.addEventListener('click', function () { goToHeroSlide(i); });
      heroDots.appendChild(dot);
    });

    function goToHeroSlide(index) {
      heroSlides[heroIndex].classList.remove('active');
      heroDots.children[heroIndex].classList.remove('active');
      heroIndex = (index + heroSlides.length) % heroSlides.length;
      heroSlides[heroIndex].classList.add('active');
      heroDots.children[heroIndex].classList.add('active');
    }

    function nextHeroSlide() { goToHeroSlide(heroIndex + 1); }
    function prevHeroSlide() { goToHeroSlide(heroIndex - 1); }

    function startHeroTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(nextHeroSlide, HERO_INTERVAL);
    }

    heroSlides[heroIndex].classList.add('active');
    startHeroTimer();

    heroPrev.addEventListener('click', function () { prevHeroSlide(); startHeroTimer(); });
    heroNext.addEventListener('click', function () { nextHeroSlide(); startHeroTimer(); });

    // Touch / swipe support for hero
    let heroTouchStartX = 0;
    heroSlider.addEventListener('touchstart', function (e) {
      heroTouchStartX = e.touches[0].clientX;
    }, { passive: true });
    heroSlider.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - heroTouchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextHeroSlide(); else prevHeroSlide();
        startHeroTimer();
      }
    }, { passive: true });
  }

  /* ============================================
     CHALÉ CARD SLIDERS
     ============================================ */
  document.querySelectorAll('[data-slider]').forEach(function (sliderEl) {
    const id       = sliderEl.dataset.slider;
    const slides   = sliderEl.querySelectorAll('.chale-card__slide');
    const dotsWrap = document.querySelector('[data-dots="' + id + '"]');
    const prevBtn  = document.querySelector('.chale-card__arrow--prev[data-target="' + id + '"]');
    const nextBtn  = document.querySelector('.chale-card__arrow--next[data-target="' + id + '"]');
    let current    = 0;

    if (slides.length === 0) return;

    // Build dots
    slides.forEach(function (_, i) {
      const dot = document.createElement('button');
      dot.className = 'chale-card__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Foto ' + (i + 1));
      dot.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      sliderEl.style.transform = 'translateX(-' + (current * 100) + '%)';
      dotsWrap.querySelectorAll('.chale-card__dot').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    prevBtn.addEventListener('click', function () { goTo(current - 1); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); });

    // Touch / swipe
    let startX = 0;
    sliderEl.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    sliderEl.addEventListener('touchend', function (e) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) goTo(current + 1); else goTo(current - 1);
      }
    }, { passive: true });
  });

  /* ============================================
     LIGHTBOX
     ============================================ */
  const lightbox        = document.getElementById('lightbox');
  const lightboxImg     = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose   = document.getElementById('lightboxClose');
  const lightboxPrev    = document.getElementById('lightboxPrev');
  const lightboxNext    = document.getElementById('lightboxNext');
  const galeriaItems    = Array.from(document.querySelectorAll('.galeria__item'));
  let lightboxIndex     = 0;

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = galeriaItems[lightboxIndex];
    lightboxImg.src    = item.dataset.src;
    lightboxImg.alt    = item.dataset.caption || '';
    lightboxCaption.textContent = item.dataset.caption || '';
  }

  function prevLightbox() {
    lightboxIndex = (lightboxIndex - 1 + galeriaItems.length) % galeriaItems.length;
    updateLightbox();
  }

  function nextLightbox() {
    lightboxIndex = (lightboxIndex + 1) % galeriaItems.length;
    updateLightbox();
  }

  galeriaItems.forEach(function (item, i) {
    item.addEventListener('click', function () { openLightbox(i); });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevLightbox);
  lightboxNext.addEventListener('click', nextLightbox);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')       closeLightbox();
    if (e.key === 'ArrowLeft')    prevLightbox();
    if (e.key === 'ArrowRight')   nextLightbox();
  });

  // Touch swipe on lightbox
  let lbTouchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    lbTouchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) nextLightbox(); else prevLightbox();
    }
  }, { passive: true });

  /* ============================================
     SCROLL REVEAL
     ============================================ */
  const revealEls = document.querySelectorAll(
    '.section__title, .section__eyebrow, .section__subtitle, ' +
    '.sobre__content, .sobre__image-wrap, ' +
    '.chale-card, .comodidade-item, .galeria__item, ' +
    '.localizacao__item, .contato__card, .area-comum__img, ' +
    '.footer__brand, .footer__links, .footer__contact, .footer__social'
  );

  revealEls.forEach(function (el) {
    el.classList.add('reveal');
  });

  function checkReveal() {
    const viewBottom = window.scrollY + window.innerHeight;
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top + window.scrollY < viewBottom - 60) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal(); // Run on load

  /* ============================================
     FOOTER YEAR
     ============================================ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============================================
     SMOOTH SCROLL OFFSET (for fixed navbar)
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
