// ===== shared.js — L'Atelier Augmenté =====

// ── Chargement header et footer ──
function loadPartial(selector, file, callback) {
  const el = document.querySelector(selector);
  if (!el) return;
  fetch(file)
    .then(r => r.text())
    .then(html => {
      el.innerHTML = html;
      if (callback) callback();
    })
    .catch(() => console.warn('Partial non trouvé :', file));
}

// Lien actif dans la nav
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// Burger menu
function initBurger() {
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;

  // Supprimer anciens listeners en clonant
  const newBurger = burger.cloneNode(true);
  burger.parentNode.replaceChild(newBurger, burger);

  function openMenu() {
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden'; // bloquer scroll fond
    const [s1, s2, s3] = newBurger.querySelectorAll('span');
    s1.style.transform = 'translateY(6.5px) rotate(45deg)';
    s2.style.opacity = '0';
    s3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    newBurger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  }

  newBurger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Fermer au clic sur un lien
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  // Fermer en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open')
        && !navLinks.contains(e.target)
        && !newBurger.contains(e.target)) {
      closeMenu();
    }
  });

  // Fermer avec la touche Echap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Chargement des partials ──
loadPartial('#site-header', 'header.html', () => {
  setActiveNav();
  initBurger();
  // Nav scroll shadow (après injection header)
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }
});
loadPartial('#site-footer', 'footer.html');

// ── Scroll reveal ──
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});
