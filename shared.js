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

// ── Lien actif ──
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── Menu burger slide-in ──
function initBurger() {
  const burger  = document.getElementById('nav-burger');
  const links   = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  if (!burger || !links) return;

  function openMenu() {
    links.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    const [s1, s2, s3] = burger.querySelectorAll('span');
    s1.style.transform = 'translateY(6.5px) rotate(45deg)';
    s2.style.opacity   = '0';
    s3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
  }

  function closeMenu() {
    links.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    burger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity   = '';
    });
  }

  burger.addEventListener('click', () => {
    links.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Clic sur l'overlay → ferme
  if (overlay) overlay.addEventListener('click', closeMenu);

  // Clic sur un lien → ferme
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Touche Échap → ferme
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

// ── Nav scroll shadow ──
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ── Chargement des partials ──
loadPartial('#site-header', 'header.html', () => {
  setActiveNav();
  initBurger();
  initNavScroll();
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
