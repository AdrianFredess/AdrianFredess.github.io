// Fondo animado de "ondas fluidas"
(function initWaves() {
  const canvas = document.getElementById('bg-waves');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr, startTime = performance.now();
  const config = {
    waveCount: 3,
    amplitude: 28,
    wavelength: 420,
    speed: 0.5,
    baseAlpha: 0.08
  };

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function drawWave(offset, color) {
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 2) {
      const t = (x + offset) / config.wavelength;
      const y = height * 0.5 + Math.sin(t) * config.amplitude * 0.8 + Math.sin(t * 0.7) * config.amplitude * 0.2;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function animate(now) {
    const t = (now - startTime) * 0.001 * config.speed;
    ctx.clearRect(0, 0, width, height);

    drawWave(t * 120, `rgba(255,255,255,${config.baseAlpha})`);
    drawWave(t * 160 + 80, `rgba(255,255,255,${config.baseAlpha * 0.8})`);
    drawWave(t * 90 + 150, `rgba(255,255,255,${config.baseAlpha * 0.6})`);

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();

// Efecto de profundidad (parallax) en Hero
(function initHeroParallax() {
  const wrapper = document.querySelector('.hero-image-wrapper');
  const inner = document.querySelector('.hero-image-3d');
  if (!wrapper || !inner) return;

  wrapper.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = wrapper.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    inner.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(20px)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    inner.style.transform = `rotateY(0deg) rotateX(0deg) translateZ(0px)`;
  });
})();

// Gestión de Modales y Lightbox
(function initModals() {
  const openButtons = document.querySelectorAll('.open-modal');
  const closeButtons = document.querySelectorAll('.modal-close, .modal');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-modal');
      const modal = document.querySelector(modalId);
      if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Si el click es en el fondo del modal o en el botón cerrar
      if (e.target.classList.contains('modal') || e.target.closest('.modal-close')) {
        const modal = btn.closest('.modal') || e.target;
        if (modal && modal.classList.contains('modal')) {
          modal.classList.remove('open');
          document.body.style.overflow = '';
          const video = modal.querySelector('video');
          if (video) video.pause();
        }
      }
    });
  });

  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let galleryImages = [];
  let galleryIndex = 0;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    if (lightboxImg) {
      lightboxImg.removeAttribute('src');
      lightboxImg.alt = '';
    }
  };

  const showLightbox = (index) => {
    if (!lightbox || !lightboxImg || !galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const current = galleryImages[galleryIndex];
    lightboxImg.src = current.src;
    lightboxImg.alt = current.alt || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    const many = galleryImages.length > 1;
    if (lightboxPrev) lightboxPrev.hidden = !many;
    if (lightboxNext) lightboxNext.hidden = !many;
  };

  document.addEventListener('click', (e) => {
    const img = e.target.closest('.gallery-grid img');
    if (!img) return;
    const grid = img.closest('.gallery-grid');
    galleryImages = Array.from(grid.querySelectorAll('img'));
    showLightbox(galleryImages.indexOf(img));
  });

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.closest('.lightbox-close')) {
        closeLightbox();
      }
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(galleryIndex - 1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      showLightbox(galleryIndex + 1);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(galleryIndex - 1);
    if (e.key === 'ArrowRight') showLightbox(galleryIndex + 1);
  });
})();

// Navegación móvil
(function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const inner = document.querySelector('.mobile-menu-inner');
  const links = document.querySelectorAll('.mobile-links a');

  if (!toggle || !menu || !inner) return;

  const openMenu = () => {
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Cerrar menú');
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.classList.contains('open')) closeMenu();
    else openMenu();
  });

  // Cerrar con un tap fuera, no al empezar a scrollear
  let tapX = 0;
  let tapY = 0;
  document.addEventListener('pointerdown', (e) => {
    tapX = e.clientX;
    tapY = e.clientY;
  }, { passive: true });

  document.addEventListener('pointerup', (e) => {
    if (!menu.classList.contains('open')) return;
    if (inner.contains(e.target) || toggle.contains(e.target)) return;
    const moved = Math.abs(e.clientX - tapX) > 12 || Math.abs(e.clientY - tapY) > 12;
    if (moved) return;
    closeMenu();
  }, { passive: true });

  links.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();

// IntersectionObserver para revelar elementos al hacer scroll
(function initRevealOnScroll() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || els.length === 0) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
})();
