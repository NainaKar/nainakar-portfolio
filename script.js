// ══════════════════════════════════════════════════════════════
//  3D BACKGROUND & GSAP SCROLL ANIMATIONS
//  Theme: Deep Berry, Wine, Maroon, and Rose Glow
// ══════════════════════════════════════════════════════════════

(function () {
  const canvas = document.querySelector('#bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // ── Particle Field (Stars & Cosmic Dust) ──
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 2800;
  const posArray = new Float32Array(starsCount * 3);
  const colorArray = new Float32Array(starsCount * 3);

  // Mostly neutral starlight with a rare berry star, so pink stays an accent
  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xf5f5f7),
    new THREE.Color(0xd2d2d7),
    new THREE.Color(0x86868b),
    new THREE.Color(0xe24366)
  ];

  for (let i = 0; i < starsCount; i++) {
    const i3 = i * 3;
    posArray[i3] = (Math.random() - 0.5) * 110;
    posArray[i3 + 1] = (Math.random() - 0.5) * 110;
    posArray[i3 + 2] = (Math.random() - 0.5) * 110;

    const chosenColor = palette[Math.floor(Math.random() * palette.length)];
    colorArray[i3] = chosenColor.r;
    colorArray[i3 + 1] = chosenColor.g;
    colorArray[i3 + 2] = chosenColor.b;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

  function createGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(245, 245, 247, 0.7)');
    grad.addColorStop(0.7, 'rgba(210, 210, 215, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(32, 32, 30, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  }

  const starsMaterial = new THREE.PointsMaterial({
    size: 0.22,
    map: createGlowTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const starMesh = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starMesh);

  // ── Floating Subtle Wireframe Polyhedron ──
  const geoIco = new THREE.IcosahedronGeometry(14, 1);
  const matIco = new THREE.MeshBasicMaterial({
    color: 0x86868b,
    wireframe: true,
    transparent: true,
    opacity: 0.08
  });
  const meshIco = new THREE.Mesh(geoIco, matIco);
  meshIco.position.set(20, -10, -25);
  scene.add(meshIco);

  camera.position.z = 24;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (event) => {
    targetMouseX = (event.clientX - windowHalfX) * 0.00015;
    targetMouseY = (event.clientY - windowHalfY) * 0.00015;
  }, { passive: true });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    starMesh.rotation.y = elapsedTime * 0.02 + mouseX * 2.0;
    starMesh.rotation.x = elapsedTime * 0.01 + mouseY * 2.0;

    meshIco.rotation.x = elapsedTime * 0.05;
    meshIco.rotation.y = elapsedTime * 0.07;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
})();

// ── GSAP ScrollTrigger Animations ──
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Sawad Hero Staggered Reveal (the sections below reveal via [data-reveal])
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  if (document.querySelector('.sawad-hero') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroTl.fromTo('.sawad-portrait-card', { opacity: 0, x: -40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1 })
      .fromTo('.sawad-title-block', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .fromTo('.sawad-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .fromTo('.sawad-stats-row .sawad-stat-unit', { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, '-=0.5')
      .fromTo('.sawad-cta-row', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
  }
});


// ══════════════════════════════════════════════════════════════
//  NAINA KAR PORTFOLIO — MAIN INTERACTIVITY ENGINE
//  Sawad Hero + Aakarsh Architecture + Berry/Wine Theme
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════
  //  1. PRELOADER: BOOT SEQUENCE
  // ══════════════════════════════════════════
  (function initPreloader() {
    const preloader = document.getElementById('preloader');
    const sleekFill = document.getElementById('preloaderSleekFill');
    const particlesContainer = document.getElementById('preloaderParticles');
    if (!preloader) return;

    // Spawn subtle floating particles inside preloader
    if (particlesContainer) {
      for (let i = 0; i < 60; i++) {
        const p = document.createElement('div');
        p.classList.add('preloader-particle');
        p.style.left = Math.random() * 100 + '%';
        p.style.bottom = -(Math.random() * 20) + '%';
        p.style.animationDuration = (2 + Math.random() * 2.5) + 's';
        p.style.animationDelay = (Math.random() * 1.5) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        particlesContainer.appendChild(p);
      }
    }

    const DURATION = 2200; // Fast and snappy
    const startTime = performance.now();
    let pageLoaded = false;
    let animationDone = false;

    function animateProgress(now) {
      const elapsed = now - startTime;
      let t = Math.min(elapsed / DURATION, 1);
      let eased = 1 - Math.pow(1 - t, 3);

      if (pageLoaded && eased >= 0.75) {
        eased = Math.min(eased + (1 - eased) * 0.15, 1);
      }

      if (sleekFill) {
        sleekFill.style.width = (eased * 100) + '%';
      }

      if (eased < 1) {
        requestAnimationFrame(animateProgress);
      } else {
        if (sleekFill) sleekFill.style.width = '100%';
        animationDone = true;
        dismissPreloader();
      }
    }

    requestAnimationFrame(animateProgress);

    function dismissPreloader() {
      if (!animationDone) return;
      setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.classList.add('page-loaded');
          window.dispatchEvent(new Event('preloaderComplete'));
        }, 600);
      }, 300);
    }

    window.addEventListener('load', () => {
      pageLoaded = true;
      if (animationDone) dismissPreloader();
    });

    // Fallback timer so page is never blocked
    setTimeout(() => {
      pageLoaded = true;
      animationDone = true;
      dismissPreloader();
    }, 3500);
  })();

  // ══════════════════════════════════════════
  //  2. CUSTOM CURSOR (DOT + OUTLINE)
  // ══════════════════════════════════════════
  (function initCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');
    if (!cursorDot || !cursorOutline) return;

    // Hide custom cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursorDot.style.display = 'none';
      cursorOutline.style.display = 'none';
      return;
    }

    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 450, fill: 'forwards' });
    }, { passive: true });

    const hoverables = document.querySelectorAll('a, button, .skill-card, .project-card, .profile-card, .cert-card, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });
  })();

  // ══════════════════════════════════════════
  //  4. FLOATING NAVBAR & ACTIVE SECTION TRACKING
  // ══════════════════════════════════════════
  (function initNavbar() {
    const header = document.getElementById('siteHeader');
    const crumb = document.getElementById('crumbCurrent');
    const links = document.getElementById('navLinks');
    const toggle = document.getElementById('navToggle');
    if (!header || !crumb || !links) return;

    const navLinks = links.querySelectorAll('.nav-link[data-section]');
    const names = { home: 'Home' };
    navLinks.forEach(link => { names[link.dataset.section] = link.textContent.trim(); });
    const sections = Object.keys(names).map(id => document.getElementById(id)).filter(Boolean);

    // The breadcrumb's last crumb and the active link follow the section in view
    function setActive(sectionId) {
      crumb.textContent = names[sectionId];
      navLinks.forEach(link => {
        const isActive = link.dataset.section === sectionId;
        link.classList.toggle('active', isActive);
        if (isActive) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }

    // A section is current while it crosses the middle band of the screen
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));

    function onScroll() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Tray of section links on tablets and phones
    function setTray(open) {
      links.classList.toggle('open', open);
      if (!toggle) return;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Hide sections' : 'Show sections');
    }
    if (toggle) toggle.addEventListener('click', () => setTray(!links.classList.contains('open')));
    navLinks.forEach(link => link.addEventListener('click', () => setTray(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setTray(false);
    });
  })();

  // ══════════════════════════════════════════
  //  5. SCROLL REVEALS FOR [data-reveal]
  // ══════════════════════════════════════════
  (function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!items.length || reduced || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('js-reveal');
    // Siblings arrive one after another, 70ms apart
    items.forEach(el => {
      const siblings = Array.from(el.parentElement.children).filter(c => c.hasAttribute('data-reveal'));
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 70}ms`;
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('is-in');
        // drop the stagger once arrived so hover feedback stays instant
        setTimeout(() => { el.style.transitionDelay = ''; }, 1300);
        observer.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => observer.observe(el));
  })();

  // ══════════════════════════════════════════
  //  6. PROJECT GALLERY ARROWS
  // ══════════════════════════════════════════
  (function initProjectRail() {
    const rail = document.getElementById('projectRail');
    const prev = document.querySelector('[data-rail="prev"]');
    const next = document.querySelector('[data-rail="next"]');
    if (!rail || !prev || !next) return;

    const step = () => {
      const card = rail.querySelector('.project-card');
      return card ? card.offsetWidth + 20 : rail.clientWidth * 0.8;
    };
    prev.addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

    function update() {
      prev.disabled = rail.scrollLeft <= 4;
      next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
    }
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  })();

  // ══════════════════════════════════════════
  //  7. TECHNICAL SKILLS CATEGORY FILTERING
  // ══════════════════════════════════════════
  (function initSkillFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skill-card[data-category]');
    let isFiltering = false;

    if (!filterBtns.length || !skillCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isFiltering) return;
        isFiltering = true;

        filterBtns.forEach(b => {
          b.classList.toggle('active', b === btn);
          b.setAttribute('aria-pressed', String(b === btn));
        });

        const filter = btn.dataset.filter;

        // Hide non-matching, show matching with staggered animation
        const visibleCards = Array.from(skillCards).filter(c => !c.classList.contains('d-none'));

        visibleCards.forEach((c, idx) => {
          setTimeout(() => c.classList.add('filter-hide'), idx * 20);
        });

        const hideDelay = visibleCards.length * 20 + 200;

        setTimeout(() => {
          let toShow = [];
          skillCards.forEach(c => {
            const cat = c.dataset.category;
            const match = filter === 'all' || cat === filter;
            c.style.transition = 'none';

            if (match) {
              c.classList.remove('d-none');
              c.classList.add('filter-hide');
              toShow.push(c);
            } else {
              c.classList.add('d-none');
            }
          });

          // Reflow
          skillCards.forEach(c => void c.offsetWidth);
          skillCards.forEach(c => c.style.transition = '');

          toShow.forEach((c, idx) => {
            setTimeout(() => c.classList.remove('filter-hide'), idx * 30);
          });

          setTimeout(() => {
            isFiltering = false;
          }, toShow.length * 30 + 250);
        }, hideDelay);
      });
    });
  })();

  // ══════════════════════════════════════════
  //  8. RESUME MODAL
  // ══════════════════════════════════════════
  (function initResumeModal() {
    const resumeModal = document.getElementById('resumeModal');
    const openBtns = document.querySelectorAll('.btn-view-resume, #openResumeBtn, #footerResumeBtn, #heroResumeBtn');
    const closeBtn = document.getElementById('closeResumeBtn');

    if (!resumeModal) return;

    let opener = null;

    function openModal(e) {
      if (e) e.preventDefault();
      opener = document.activeElement;
      resumeModal.classList.add('show');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      resumeModal.classList.remove('show');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('show')) closeModal();
    });
  })();

  // ══════════════════════════════════════════
  //  9. CONTACT FORM SUBMISSION
  // ══════════════════════════════════════════
  (function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // shortcut: no form backend, so the message is handed to the visitor's mail app; wire a form service to send directly
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;
      const data = new FormData(contactForm);
      const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;

      window.location.href = 'mailto:nainakar2000@gmail.com'
        + `?subject=${encodeURIComponent(data.get('subject'))}`
        + `&body=${encodeURIComponent(body)}`;

      btn.innerHTML = '<span>Opening your email app</span> <svg class="ico"><use href="#i-circle-check"/></svg>';
      btn.classList.add('is-sent');
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('is-sent');
      }, 4000);
    });
  })();

  // ══════════════════════════════════════════
  //  10. BACK TO TOP BUTTON
  // ══════════════════════════════════════════
  (function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });
  })();

});
