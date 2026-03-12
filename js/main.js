/* =============================================================================
   UNTWINE ATELIER — Main JavaScript
   ============================================================================= */

(function () {
  'use strict';

  // ─── NAVBAR: scroll state ───────────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  // ─── MOBILE NAV: toggle ─────────────────────────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any nav link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }


  // ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  // Always show hero content immediately
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    setTimeout(() => heroContent.classList.add('visible'), 100);
  }


  // ─── FAQ ACCORDION ──────────────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    if (!btn || !answer) return;

    // Measure height for smooth animation
    function getHeight() {
      answer.removeAttribute('hidden');
      const h = answer.scrollHeight;
      answer.setAttribute('hidden', '');
      return h;
    }

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Collapse all others
      faqItems.forEach(other => {
        if (other === item) return;
        const otherBtn = other.querySelector('.faq-q');
        const otherAns = other.querySelector('.faq-a');
        if (otherBtn && otherAns) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAns.style.maxHeight = '0px';
          setTimeout(() => otherAns.setAttribute('hidden', ''), 350);
        }
      });

      if (isExpanded) {
        // Collapse
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        requestAnimationFrame(() => {
          answer.style.maxHeight = '0px';
        });
        setTimeout(() => answer.setAttribute('hidden', ''), 400);
      } else {
        // Expand
        btn.setAttribute('aria-expanded', 'true');
        answer.removeAttribute('hidden');
        answer.style.maxHeight = '0px';
        const h = answer.scrollHeight;
        requestAnimationFrame(() => {
          answer.style.maxHeight = h + 'px';
        });
        // Let natural height take over after animation
        setTimeout(() => { answer.style.maxHeight = 'none'; }, 420);
      }
    });
  });


  // ─── ACTIVE NAV LINK: highlight on scroll ───────────────────────────────────
  const sections  = document.querySelectorAll('section[id], div[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => sectionObserver.observe(s));


  // ─── HERO PARALLAX (subtle, desktop only) ───────────────────────────────────
  const heroHeadline = document.querySelector('.hero-headline');
  const heroSub      = document.querySelector('.hero-sub');

  if (heroHeadline && window.matchMedia('(min-width: 900px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        const factor = y * 0.18;
        heroHeadline.style.transform = `translateY(${factor}px)`;
        if (heroSub) heroSub.style.transform = `translateY(${factor * 0.6}px)`;
      }
    }, { passive: true });
  }


  // ─── CURSOR: gold dot on hover over CTAs (desktop only) ─────────────────────
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed; top: 0; left: 0; z-index: 9999;
      width: 8px; height: 8px; border-radius: 50%;
      background: #C9A96E; pointer-events: none; opacity: 0;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1), width 0.3s, height 0.3s;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });

    // Expand on hoverable elements
    const hoverEls = document.querySelectorAll('a, button, .service-card, .tcard, .why-item');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursor.style.width   = '32px';
        cursor.style.height  = '32px';
        cursor.style.background = 'rgba(201,169,110,0.35)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width   = '8px';
        cursor.style.height  = '8px';
        cursor.style.background = '#C9A96E';
      });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });
  }


  // ─── MARQUEE: pause on hover ─────────────────────────────────────────────────
  const marqueeSection = document.querySelector('.marquee-section');
  const marqueeTrack   = document.querySelector('.marquee-track');
  if (marqueeSection && marqueeTrack) {
    marqueeSection.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeSection.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }


  // ─── SMOOTH ANCHOR: ensure mobile offset ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id  = anchor.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
