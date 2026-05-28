/* ============================================================
   ADITYA RAJ PORTFOLIO — script.js
   ============================================================ */

'use strict';

/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      // Trigger reveal for hero elements
      document.querySelectorAll('#hero .reveal-up').forEach(el => {
        setTimeout(() => el.classList.add('revealed'), 100);
      });
    }
  }, 1800);
});

/* ---- CUSTOM CURSOR ---- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  if (cursorDot) {
    cursorDot.style.left = cursorX + 'px';
    cursorDot.style.top = cursorY + 'px';
  }
});

function animateRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .service-card, .project-card, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing?.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hovering'));
});

/* ---- PARTICLE BACKGROUND ---- */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.color = Math.random() > 0.8 ? '#00d9ff' : '#c0c0c0';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  const COUNT = Math.min(120, Math.floor(W * H / 14000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = '#00d9ff';
          ctx.globalAlpha = (1 - dist / 100) * 0.06;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---- NAVBAR ---- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar?.classList.add('scrolled');
  } else {
    navbar?.classList.remove('scrolled');
  }
  updateActiveLink();
  showBackToTop();
});

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open');
  hamburger.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on link click
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Active link highlighting
function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (scrollPos >= top && scrollPos < top + height) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link?.classList.add('active');
    }
  });
}

/* ---- THEME TOGGLE ---- */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  if (themeIcon) {
    themeIcon.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
  }
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});

// Restore theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light-mode');
  if (themeIcon) themeIcon.className = 'fas fa-moon';
}

/* ---- TYPING ANIMATION ---- */
const roles = [
  'Digital Marketing Executive',
  'SEO Specialist',
  'Google Ads Expert',
  'Meta Ads Expert',
  'WordPress Expert',
  'Growth Strategist'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeWriter() {
  if (!typedEl) return;
  const current = roles[roleIndex];
  if (!isDeleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeWriter, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(typeWriter, isDeleting ? 50 : 80);
}

setTimeout(typeWriter, 2200);

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right').forEach(el => {
  // Skip hero items — revealed after loader
  if (!el.closest('#hero')) {
    revealObserver.observe(el);
  }
});

/* ---- ANIMATED COUNTERS ---- */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  let count = 0;
  const duration = 2000;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    count += step;
    if (count >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(count);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ---- SKILL BARS ---- */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target.querySelector('.skill-fill');
      const bar = entry.target.querySelector('.skill-bar');
      if (fill && bar) {
        const width = bar.getAttribute('data-width');
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));


/* ---- CONTACT FORM ---- */
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>Sending...</span> <i class="fas fa-spinner fa-spin"></i>';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
    form.reset();
    formSuccess?.classList.add('show');
    setTimeout(() => formSuccess?.classList.remove('show'), 5000);
  }, 1500);
});

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('backToTop');

function showBackToTop() {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
}

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- FLOATING WHATSAPP BUTTON ---- */
(function addWAFloat() {
  const wa = document.createElement('a');
  wa.href = 'https://wa.me/919953148717';
  wa.target = '_blank';
  wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat on WhatsApp');
  wa.className = 'wa-float';
  wa.innerHTML = '<i class="fab fa-whatsapp"></i>';
  document.body.appendChild(wa);
})();

/* ---- SMOOTH SCROLL FOR NAV LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- TILT EFFECT ON PROJECT CARDS ---- */
document.querySelectorAll('.project-card, .service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const mx = (x / rect.width - 0.5) * 10;
    const my = (y / rect.height - 0.5) * 10;
    card.style.transform = `perspective(800px) rotateY(${mx}deg) rotateX(${-my}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- GLITCH EFFECT ON LOGO (subtle) ---- */
(function glitchLogo() {
  const logo = document.querySelector('.nav-logo .logo-text');
  if (!logo) return;
  setInterval(() => {
    logo.style.textShadow = `2px 0 0 rgba(0,217,255,0.6), -2px 0 0 rgba(255,0,128,0.3)`;
    setTimeout(() => { logo.style.textShadow = ''; }, 80);
  }, 4000);
})();

/* ---- INTERSECTION OBSERVER: Timeline dots animate ---- */
document.querySelectorAll('.timeline-dot').forEach(dot => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        dot.style.transform = 'scale(1.5)';
        setTimeout(() => { dot.style.transform = 'scale(1)'; }, 300);
        obs.unobserve(dot);
      }
    });
  }, { threshold: 0.8 });
  obs.observe(dot);
});

console.log('%c Aditya Raj Portfolio ', 'background:#00d9ff;color:#000;font-family:monospace;font-size:14px;font-weight:bold;padding:4px 8px;');
console.log('%c Digital Marketing Executive | Delhi NCR ', 'color:#00d9ff;font-family:monospace;font-size:11px;');
