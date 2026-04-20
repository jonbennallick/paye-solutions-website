document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.nav__hamburger');
  var mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-open');
      document.body.style.overflow = mobileMenu.classList.contains('is-open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    var mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('is-active');
        mobileMenu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Update copyright year
  var yearEl = document.querySelector('.footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Manage Cookies button (cookie policy page)
  var manageCookiesBtn = document.getElementById('manage-cookies-btn');
  if (manageCookiesBtn) {
    manageCookiesBtn.addEventListener('click', function () {
      resetCookieConsent();
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  }

  // Scroll-reveal animations
  var revealEls = document.querySelectorAll('.section, .cta-banner, .content-block');
  if (revealEls.length && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) {
      // Add stagger class to elements containing grids
      var hasGrid = el.querySelector('.card-grid, .stacked-boxes, .contact-grid');
      if (hasGrid) {
        hasGrid.classList.add('reveal-stagger');
      }
      // Don't animate page-headers (they have their own treatment)
      if (!el.classList.contains('page-header')) {
        el.classList.add('reveal');
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Also reveal any stagger containers inside
          var staggerEls = entry.target.querySelectorAll('.reveal-stagger');
          staggerEls.forEach(function (s) { s.classList.add('is-visible'); });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealEls.forEach(function (el) {
      if (el.classList.contains('reveal')) {
        observer.observe(el);
      }
    });
  }

  // Cookie consent banner
  var banner = document.querySelector('.cookie-banner');
  if (banner) {
    var consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setTimeout(function () {
        banner.classList.add('is-visible');
      }, 500);
    } else if (consent === 'accepted') {
      loadAnalytics();
    }

    var acceptBtn = banner.querySelector('.cookie-accept');
    var declineBtn = banner.querySelector('.cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'accepted');
        banner.classList.remove('is-visible');
        loadAnalytics();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookie_consent', 'declined');
        banner.classList.remove('is-visible');
      });
    }
  }
});

function loadAnalytics() {
  // [PLACEHOLDER: Replace GA_MEASUREMENT_ID with actual GA4 ID when provided]
  var gaId = 'GA_MEASUREMENT_ID';
  if (gaId === 'GA_MEASUREMENT_ID') return;
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
  document.head.appendChild(script);
  script.onload = function () {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', gaId);
  };
}

function resetCookieConsent() {
  localStorage.removeItem('cookie_consent');
  var banner = document.querySelector('.cookie-banner');
  if (banner) {
    banner.classList.add('is-visible');
  }
}
