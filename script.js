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

  // Colors from theme: #881144, #E24366, #FF69B4, #FDE8EB, #800021
  const palette = [
    new THREE.Color(0x881144),
    new THREE.Color(0xe24366),
    new THREE.Color(0xff69b4),
    new THREE.Color(0xfde8eb),
    new THREE.Color(0x800021)
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
    grad.addColorStop(0.3, 'rgba(255, 105, 180, 0.8)');
    grad.addColorStop(0.7, 'rgba(226, 67, 102, 0.3)');
    grad.addColorStop(1, 'rgba(128, 0, 33, 0)');
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
    color: 0x881144,
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

  // Sawad Hero Staggered Reveal
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  
  if (document.querySelector('.sawad-hero')) {
    heroTl.fromTo('.sawad-portrait-card', { opacity: 0, x: -40, scale: 0.96 }, { opacity: 1, x: 0, scale: 1, duration: 1 })
      .fromTo('.sawad-title-block', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
      .fromTo('.sawad-desc', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .fromTo('.sawad-stats-row .sawad-stat-unit', { opacity: 0, y: 25 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.8 }, '-=0.5')
      .fromTo('.sawad-cta-row', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');
  }

  // Section Titles Animation
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.fromTo(title,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: title,
          start: 'top 88%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Timeline Items Animation
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
    const isLeft = item.classList.contains('left');
    gsap.fromTo(item,
      { opacity: 0, x: isLeft ? -60 : 60 },
      {
        opacity: 1,
        x: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Project Cards Stagger
  const projectCards = document.querySelectorAll('.experience-card');
  if (projectCards.length) {
    gsap.fromTo(projectCards,
      { opacity: 0, y: 50, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: '.experience-grid',
          start: 'top 82%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Skill Cards Stagger
  const skillCards = document.querySelectorAll('.skill-grid .skill-card');
  if (skillCards.length) {
    gsap.fromTo(skillCards,
      { opacity: 0, y: 25, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: 'power2.out',
        stagger: { each: 0.04, from: 'start' },
        scrollTrigger: {
          trigger: '.skill-grid',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Contact Container Fade & Blur
  const contactCard = document.querySelector('.contact-card');
  if (contactCard) {
    gsap.fromTo(contactCard,
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contactCard,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
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
  //  2. SCROLL PROGRESS BAR
  // ══════════════════════════════════════════
  (function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    }, { passive: true });
  })();

  // ══════════════════════════════════════════
  //  3. CUSTOM CURSOR (DOT + OUTLINE)
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

    const hoverables = document.querySelectorAll('a, button, .skill-card, .experience-card, .profile-card, .cert-item, input, textarea');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovered'));
    });
  })();

  // ══════════════════════════════════════════
  //  4. FLOATING NAVBAR & ACTIVE SECTION TRACKING
  // ══════════════════════════════════════════
  (function initNavbar() {
    const nav = document.getElementById('siteNav');
    const indicator = document.getElementById('navIndicator');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    if (!nav || !navLinks.length) return;

    const sections = Array.from(navLinks)
      .map(link => document.getElementById(link.dataset.section))
      .filter(Boolean);

    let currentActive = 'home';

    function updateIndicator(activeLink) {
      if (!activeLink || !indicator) return;
      const pill = nav.querySelector('.nav-pill');
      if (!pill) return;

      const pillRect = pill.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();

      indicator.style.left = (linkRect.left - pillRect.left) + 'px';
      indicator.style.width = linkRect.width + 'px';
    }

    function setActive(sectionId) {
      if (sectionId === currentActive) return;
      currentActive = sectionId;

      navLinks.forEach(link => {
        if (link.dataset.section === sectionId) {
          link.classList.add('active');
          updateIndicator(link);
        } else {
          link.classList.remove('active');
        }
      });
    }

    // IntersectionObserver for tracking current section
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    }, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    });

    sections.forEach(s => observer.observe(s));

    // Show floating nav with smooth visibility
    function checkNavVisibility() {
      const scrollY = window.scrollY;
      if (scrollY > 150) {
        nav.classList.add('nav-visible');
        const activeLink = nav.querySelector('.nav-link.active') || navLinks[0];
        updateIndicator(activeLink);
      } else {
        nav.classList.remove('nav-visible');
      }
    }

    window.addEventListener('scroll', checkNavVisibility, { passive: true });
    window.addEventListener('resize', () => {
      const activeLink = nav.querySelector('.nav-link.active') || navLinks[0];
      updateIndicator(activeLink);
    }, { passive: true });

    // Smooth scroll on click
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.dataset.section;
        const target = document.getElementById(targetId);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
          setActive(targetId);
        }
      });
    });

    // Initial check
    setTimeout(() => {
      const initialLink = nav.querySelector('.nav-link.active') || navLinks[0];
      updateIndicator(initialLink);
    }, 500);
  })();

  // ══════════════════════════════════════════
  //  5. TIMELINE SCROLL PROGRESS FILL
  // ══════════════════════════════════════════
  (function initTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    const progress = timeline.querySelector('.timeline-progress');
    const dots = timeline.querySelectorAll('.timeline-dot');
    if (!progress) return;

    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const startOffset = windowHeight * 0.55;
      let scrollDistance = startOffset - rect.top;

      let pct = (scrollDistance / rect.height) * 100;
      pct = Math.max(0, Math.min(100, pct));
      progress.style.height = `${pct}%`;

      const progressBottom = progress.getBoundingClientRect().bottom;
      dots.forEach(dot => {
        const dotTop = dot.getBoundingClientRect().top;
        if (progressBottom > dotTop) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }, { passive: true });
  })();

  // ══════════════════════════════════════════
  //  6. INTERACTIVE 3D GLASS CARD TILT & GLOW
  // ══════════════════════════════════════════
  (function initCardEffects() {
    const cards = document.querySelectorAll('.experience-card, .cert-item, .profile-card, .sawad-stat-box');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
    });

    // Tilt for main About glass card
    const aboutCard = document.querySelector('.about-glass-card');
    if (aboutCard) {
      aboutCard.addEventListener('mousemove', (e) => {
        const rect = aboutCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotX = ((y - centerY) / centerY) * -6;
        const rotY = ((x - centerX) / centerX) * 6;

        aboutCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.01, 1.01, 1.01)`;
      });

      aboutCard.addEventListener('mouseleave', () => {
        aboutCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    }
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

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

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

    function openModal(e) {
      if (e) e.preventDefault();
      resumeModal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      resumeModal.classList.remove('show');
      document.body.style.overflow = 'auto';
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

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalHTML = btn.innerHTML;

      btn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
      btn.style.opacity = '0.75';
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        btn.innerHTML = '<span>Message Delivered!</span> <i class="fa-solid fa-circle-check"></i>';
        btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        btn.style.borderColor = '#34d399';
        btn.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.4)';
        contactForm.reset();

        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.boxShadow = '';
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'all';
        }, 3500);
      }, 1200);
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
