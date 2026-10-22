// ══════════════════════════════════════════════════════════════
//  NAINA KAR PORTFOLIO — PLM EDITORIAL INTERACTIVITY ENGINE
// ══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // 1. Header scroll shadow & background blur
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('is-scrolled');
      } else {
        siteHeader.classList.remove('is-scrolled');
      }
    }, { passive: true });
  }

  // 2. Mobile navigation toggle
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#FAF7F2';
        navLinks.style.padding = '20px';
        navLinks.style.borderBottom = '1.5px dashed #161616';
        navLinks.style.gap = '16px';
      }
    });

    // Close mobile nav on click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // 3. Technical Skills Interactive Tabs (Matching Screenshots 1 & 2)
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillCards = document.querySelectorAll('.skill-card');

  if (skillTabs.length && skillCards.length) {
    skillTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;

        skillCards.forEach(card => {
          const categories = card.dataset.category || '';
          if (filter === 'all' || categories.includes(filter)) {
            card.classList.remove('d-none');
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 20);
          } else {
            card.classList.add('d-none');
          }
        });
      });
    });
  }

  // 4. Resume modal open/close
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtns = document.querySelectorAll('.btn-view-resume');
  const closeResumeBtn = document.getElementById('closeResumeBtn');

  if (resumeModal) {
    openResumeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    if (closeResumeBtn) {
      closeResumeBtn.addEventListener('click', () => {
        resumeModal.classList.remove('show');
        document.body.style.overflow = '';
      });
    }

    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.classList.contains('show')) {
        resumeModal.classList.remove('show');
        document.body.style.overflow = '';
      }
    });
  }

  // 5. Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="pill-dot"></span><span>Sending Note...</span>';
      submitBtn.style.opacity = '0.8';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.innerHTML = '<span class="pill-dot" style="background:#2ecc71;"></span><span>Message Sent! ✉</span>';
        submitBtn.style.background = '#D4EDE2';
        contactForm.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.opacity = '1';
          submitBtn.style.pointerEvents = '';
        }, 3000);
      }, 1000);
    });
  }

  // 6. Smooth active link tracking on scroll
  const sections = document.querySelectorAll('main[id], section[id]');
  const navAnchorLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navAnchorLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  }, { passive: true });

});
