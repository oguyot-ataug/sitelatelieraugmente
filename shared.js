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
