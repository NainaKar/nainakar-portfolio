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
