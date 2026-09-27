// ===== shared.js — L'Atelier Augmenté =====

function loadPartial(selector, file, callback) {
  var el = document.querySelector(selector);
  if (!el) return;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', file, true);
  xhr.onload = function() {
    if (xhr.status === 200) {
      el.innerHTML = xhr.responseText;
      if (callback) callback();
    }
  };
  xhr.send();
}

function setActiveNav() {
  var page = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute('href') === page) {
      links[i].classList.add('active');
    }
  }
}

function initBurger() {
  var burger  = document.getElementById('nav-burger');
  var menu    = document.getElementById('nav-links');
  var overlay = document.getElementById('nav-overlay');

  if (!burger || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    var spans = burger.querySelectorAll('span');
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  }

  function closeMenu() {
    menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    var spans = burger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  burger.onclick = function() {
    if (menu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  if (overlay) {
    overlay.onclick = closeMenu;
  }

  var navLinks = menu.querySelectorAll('a');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].onclick = closeMenu;
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
}

function initNavScroll() {
  var nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// Chargement partials
loadPartial('#site-header', 'header.html', function() {
  setActiveNav();
  initBurger();
  initNavScroll();
});
loadPartial('#site-footer', 'footer.html');

// Scroll reveal
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

document.addEventListener('DOMContentLoaded', function() {
  var reveals = document.querySelectorAll('.reveal');
  for (var i = 0; i < reveals.length; i++) {
    revealObserver.observe(reveals[i]);
  }
});

// ===== CARROUSEL "PROJET PHARE" =====
// Fait défiler automatiquement plusieurs captures d'écran de L'Atelier des Maths dans le
// cadre façon navigateur (accueil + Créations). Demandé : "il serait bien d'avoir plusieurs
// copies d'écran qui défilent, montrant aussi les outils profs, le tableau interactif, le
// cahier, et le compte est bon et les automatismes".
function initFeaturedCarousel() {
  var carousels = document.querySelectorAll('.browser-mockup-carousel');
  for (var c = 0; c < carousels.length; c++) {
    (function(root) {
      var slides = root.querySelectorAll('.carousel-slide');
      var dots = root.querySelectorAll('.carousel-dot');
      var idx = 0;
      var timer = null;
      function show(n) {
        idx = (n + slides.length) % slides.length;
        for (var i = 0; i < slides.length; i++) slides[i].classList.toggle('active', i === idx);
        for (var i = 0; i < dots.length; i++) dots[i].classList.toggle('active', i === idx);
        var urlEl = root.querySelector('.browser-mockup-url');
        if (urlEl && slides[idx].dataset.url) urlEl.textContent = slides[idx].dataset.url;
      }
      function next() { show(idx + 1); }
      function restart() {
        if (timer) clearInterval(timer);
        timer = setInterval(next, 3200);
      }
      for (var i = 0; i < dots.length; i++) {
        (function(i) {
          dots[i].addEventListener('click', function() { show(i); restart(); });
        })(i);
      }
      show(0);
      restart();
    })(carousels[c]);
  }
}
document.addEventListener('DOMContentLoaded', initFeaturedCarousel);

/* Vidéos de L'Atelier des Maths en accordéon : un clic sur une vignette ouvre sa vidéo sur toute la
   largeur (une seule ouverte à la fois) ; nouveau clic sur la vignette ou sur « Voir la vidéo » : fermeture. */
function initAtelierVideos() {
  var BASE = 'https://maths.latelieraugmente.fr/assets/videos/';
  function fermer(t) {
    if (!t) return;
    var v = t.querySelector('video'); if (v) v.pause();
    var p = t.querySelector('.av-panel'); if (p) p.parentNode.removeChild(p);
    var g = t.querySelector('.av-go'); if (g) g.parentNode.removeChild(g);
    t.classList.remove('open'); t.setAttribute('aria-expanded', 'false');
  }
  function ouvrir(t) {
    var ouvertes = document.querySelectorAll('.av-tile.open');
    for (var i = 0; i < ouvertes.length; i++) fermer(ouvertes[i]);
    var nom = t.getAttribute('data-video'), q = t.getAttribute('data-v') ? '?v=' + t.getAttribute('data-v') : '';
    var titre = (t.querySelector('h3') || {}).textContent || '';
    var p = document.createElement('div'); p.className = 'av-panel';
    p.innerHTML = '<video controls playsinline preload="metadata" poster="' + BASE + nom + '.jpg' + q + '" aria-label="Vidéo : ' + titre.replace('Nouveau', '').replace(/"/g, '').trim() + '"><source src="' + BASE + nom + '.mp4' + q + '" type="video/mp4"></video>';
    p.addEventListener('click', function (e) { e.stopPropagation(); });
    t.appendChild(p); t.classList.add('open'); t.setAttribute('aria-expanded', 'true');
    var g = document.createElement('a'); g.className = 'av-go'; g.href = 'https://maths.latelieraugmente.fr'; g.target = '_blank'; g.rel = 'noopener'; g.textContent = 'Essayer sur la plateforme →';
    g.addEventListener('click', function (e) { e.stopPropagation(); });
    t.querySelector('.av-txt').appendChild(g);
    var v = p.querySelector('video'); var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
    setTimeout(function () { t.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 60);
  }
  var tuiles = document.querySelectorAll('.av-tile');
  for (var i = 0; i < tuiles.length; i++) {
    (function (t) {
      t.addEventListener('click', function () { if (t.classList.contains('open')) fermer(t); else ouvrir(t); });
      t.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); } });
    })(tuiles[i]);
  }
}
document.addEventListener('DOMContentLoaded', initAtelierVideos);
