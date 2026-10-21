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
