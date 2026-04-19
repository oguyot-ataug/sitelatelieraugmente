// ===== shared.js — L'Atelier Augmenté =====

// ── Chargement header et footer depuis fichiers partagés ──
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

// Marquer le lien actif dans la nav
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// Init nav et footer
loadPartial('#site-header', 'header.html', () => {
  setActiveNav();
  initBurger();
});
loadPartial('#site-footer', 'footer.html');

// ── Nav scroll shadow ──
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Burger menu mobile ──
function initBurger() {
  const burger = document.querySelector('.nav-burger');
  const navLinks = document.querySelector('.nav-links');
  if (!burger || !navLinks) return;
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    const [s1, s2, s3] = burger.querySelectorAll('span');
    if (open) {
      s1.style.transform = 'translateY(6.5px) rotate(45deg)';
      s2.style.opacity = '0';
      s3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      [s1, s2, s3].forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ── Scroll reveal ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });

// Observer déclenché après chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
