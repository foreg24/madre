/* ============================================
   MOTHER'S DAY - Interactive Experience
   Shared JavaScript for index1 & index2
   ============================================ */

class MothersDayApp {
  constructor(config) {
    this.config = config;
    this.currentScreen = 'gift';
    this.photos = [];
    this.loadingReady = false;   // fotos cargadas
    this.timerReady  = false;    // 3 s cumplidos
    this.init();
  }

  init() {
    this.createScreens();
    this.bindEvents();
    this.createGiftSparkles();
    this.spawnAmbientPetals();   // pétalos en todas las pantallas desde el inicio
    this.startLoadingTimer();
    this.loadPhotos();
  }

  /* ─────────────────────────────────────────
     CREAR PANTALLAS
  ───────────────────────────────────────── */
  createScreens() {
    const body = document.body;

    /* ── Loading ── */
    const loading = document.createElement('div');
    loading.className = 'loading-screen';
    loading.id = 'loading-screen';
    loading.innerHTML = `
      <div class="loading-inner">
        <div class="loading-petals" id="loading-petals"></div>
        <div class="loading-heart">💖</div>
        <div class="loading-text">Preparando algo especial...</div>
        <div class="loading-dots"><span></span><span></span><span></span></div>
      </div>
    `;
    body.appendChild(loading);
    this._spawnLoadingPetals();

    /* ── Screen 1: Regalo ── */
    const screenGift = document.createElement('div');
    screenGift.className = 'screen-gift';
    screenGift.id = 'screen-gift';
    screenGift.innerHTML = `
      <div class="gift-scene" id="gift-scene">

        <!-- Caja del regalo -->
        <div class="gift-container" id="gift-container">
          <div class="gift-box" id="gift-box">
            <!-- Tapa (z-index: 3) -->
            <div class="gift-lid" id="gift-lid">
              <div class="gift-lid-ribbon"></div>
              <div class="gift-lid-bow">
                <div class="bow-left"></div>
                <div class="bow-right"></div>
                <div class="bow-knot"></div>
              </div>
            </div>

            <!-- Sobre que sale de dentro del regalo (z-index: 2, entre tapa y cuerpo) -->
            <div class="gift-envelope-pop" id="gift-envelope-pop">
              <div class="gep-back"></div>
              <div class="gep-front">
                <div class="gep-flap"></div>
                <div class="gep-heart">💌</div>
              </div>
            </div>

            <!-- Cuerpo (z-index: 2, detrás del sobre) -->
            <div class="gift-body">
              <div class="gift-body-ribbon"></div>
              <div class="gift-body-shine"></div>
            </div>
          </div>
          <div class="gift-sparkles" id="gift-sparkles"></div>
        </div>

        <div class="tap-hint" id="tap-hint">✦ toca para abrir ✦</div>
      </div>
    `;
    body.appendChild(screenGift);

    /* ── Screen 2: Sobre ── */
    const screenEnvelope = document.createElement('div');
    screenEnvelope.className = 'screen-envelope';
    screenEnvelope.id = 'screen-envelope';
    screenEnvelope.innerHTML = `
      <div class="envelope-wrapper" id="envelope-wrapper">
        <div class="envelope" id="envelope">
          <div class="envelope-back"></div>
          <div class="envelope-front">
            <div class="envelope-stamp">
              <span class="heart">💝</span>
            </div>
            <div class="envelope-label">
              <div class="to">${this.config.envelopeTo}</div>
              <div class="divider"></div>
              <div class="from">${this.config.envelopeFrom}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    body.appendChild(screenEnvelope);

    /* ── Screen 3: Carta ── */
    const screenLetter = document.createElement('div');
    screenLetter.className = 'screen-letter';
    screenLetter.id = 'screen-letter';
    const letterParagraphs = this.config.letterText.map(p => `<p>${p}</p>`).join('');
    screenLetter.innerHTML = `
      <div class="letter-container" id="letter-container">
        <div class="letter-header">
          <span class="heart-icon">💗</span>
          <h2>${this.config.letterTitle}</h2>
          <div class="subtitle">${this.config.letterSubtitle}</div>
        </div>
        <div class="letter-body">${letterParagraphs}</div>
        <div class="letter-flowers" id="letter-flowers">
          <button class="flower-btn" data-flower="1">🌹</button>
          <button class="flower-btn" data-flower="2">🌷</button>
          <button class="flower-btn" data-flower="3">🌸</button>
        </div>
        <div class="flower-hint">✦ toca una flor para continuar ✦</div>
      </div>
    `;
    body.appendChild(screenLetter);

    /* ── Screen 4: Collage ── */
    const screenCollage = document.createElement('div');
    screenCollage.className = 'screen-collage';
    screenCollage.id = 'screen-collage';
    screenCollage.innerHTML = `
      <div class="collage-decorations" id="collage-decorations"></div>
      <div class="collage-header">
        <h1>${this.config.collageTitle}</h1>
        <p>${this.config.collageSubtitle}</p>
      </div>
      <div class="collage-grid" id="collage-grid"></div>
    `;
    body.appendChild(screenCollage);

    /* ── Lightbox ── */
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lightbox-close">×</button>
      <img src="" alt="Foto" id="lightbox-img">
    `;
    body.appendChild(lightbox);

    /* ── Partículas globales ── */
    const particles = document.createElement('div');
    particles.className = 'particles-container';
    particles.id = 'particles-container';
    body.appendChild(particles);
  }

  /* ─────────────────────────────────────────
     EVENTOS
  ───────────────────────────────────────── */
  bindEvents() {
    const giftContainer = document.getElementById('gift-container');
    giftContainer.addEventListener('click',      () => this.openGift());
    giftContainer.addEventListener('touchstart', (e) => { e.preventDefault(); this.openGift(); }, { passive: false });

    const envelopeWrapper = document.getElementById('envelope-wrapper');
    envelopeWrapper.addEventListener('click',      () => this.openEnvelope());
    envelopeWrapper.addEventListener('touchstart', (e) => { e.preventDefault(); this.openEnvelope(); }, { passive: false });

    document.querySelectorAll('.flower-btn').forEach(f => {
      f.addEventListener('click',      () => this.openCollage());
      f.addEventListener('touchstart', (e) => { e.preventDefault(); this.openCollage(); }, { passive: false });
    });

    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-close').addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('active'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('active'); });
  }

  /* ─────────────────────────────────────────
     LOADING: mínimo 3 segundos
  ───────────────────────────────────────── */
  startLoadingTimer() {
    setTimeout(() => {
      this.timerReady = true;
      this._tryHideLoading();
    }, 3000);
  }

  _tryHideLoading() {
    if (this.timerReady && this.loadingReady) {
      const loading = document.getElementById('loading-screen');
      if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 700);
      }
    }
  }

  hideLoading() {
    this.loadingReady = true;
    this._tryHideLoading();
  }

  /* ─────────────────────────────────────────
     PÉTALOS AMBIENTE (todas las pantallas)
  ───────────────────────────────────────── */
  spawnAmbientPetals() {
    const container = document.getElementById('particles-container');
    const symbols = ['🌸', '🌺', '✨', '💮', '🌷'];
    const total = 18;

    for (let i = 0; i < total; i++) {
      const p = document.createElement('div');
      p.className = 'ambient-petal';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        font-size: ${10 + Math.random() * 14}px;
        animation-duration: ${10 + Math.random() * 14}s;
        animation-delay: ${Math.random() * 12}s;
        opacity: 0;
      `;
      container.appendChild(p);
    }
  }

  _spawnLoadingPetals() {
    const container = document.getElementById('loading-petals');
    if (!container) return;
    const symbols = ['🌸', '💕', '✨', '🌺', '💗'];
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'loading-petal';
      p.textContent = symbols[i % symbols.length];
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        animation-duration: ${3 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 2}s;
        font-size: ${12 + Math.random() * 10}px;
      `;
      container.appendChild(p);
    }
  }

  /* ─────────────────────────────────────────
     SPARKLES DEL REGALO
  ───────────────────────────────────────── */
  createGiftSparkles() {
    const container = document.getElementById('gift-sparkles');
    const colors = ['#c9a96e', '#e8d5b0', '#f48fb1', '#ffd700', '#fff'];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('div');
      s.className = 'sparkle';
      s.style.left              = `${Math.random() * 100}%`;
      s.style.top               = `${Math.random() * 100}%`;
      s.style.background        = colors[Math.floor(Math.random() * colors.length)];
      s.style.width             = `${4 + Math.random() * 6}px`;
      s.style.height            = s.style.width;
      s.style.animationDelay    = `${Math.random() * 2}s`;
      s.style.animationDuration = `${1.2 + Math.random() * 1.2}s`;
      container.appendChild(s);
    }
  }

  /* ─────────────────────────────────────────
     ABRIR REGALO — tapa sube, sobre asoma al medio
  ───────────────────────────────────────── */
  openGift() {
    if (this.currentScreen !== 'gift') return;
    this.currentScreen = 'opening';

    const lid         = document.getElementById('gift-lid');
    const envelopePop = document.getElementById('gift-envelope-pop');
    const tapHint     = document.getElementById('tap-hint');
    const scene       = document.getElementById('gift-scene');

    // Ocultar hint
    tapHint.style.opacity    = '0';
    tapHint.style.transition = 'opacity 0.3s';

    // 1. Tapa flota hacia arriba
    lid.classList.add('opening');

    // 2. Sobre asoma desde dentro de la caja (queda suspendido a la mitad)
    setTimeout(() => {
      envelopePop.classList.add('visible');
    }, 450);

    // 3. Confeti
    setTimeout(() => this.spawnConfetti(), 600);

    // 4. El sobre late un momento, luego el usuario puede tocar
    //    Al tocar el sobre se va a la pantalla del sobre grande
    setTimeout(() => {
      envelopePop.classList.add('tappable');
      envelopePop.style.pointerEvents = 'auto';
      envelopePop.style.cursor        = 'pointer';

      const goNext = () => {
        envelopePop.removeEventListener('click',      goNext);
        envelopePop.removeEventListener('touchstart', goNext);
        envelopePop.classList.add('fly');
        lid.classList.add('fly-lid');
        setTimeout(() => {
          scene.style.transition = 'opacity 0.5s';
          scene.style.opacity    = '0';
          setTimeout(() => {
            document.getElementById('screen-gift').classList.add('hidden');
            this.showEnvelope();
          }, 500);
        }, 500);
      };

      envelopePop.addEventListener('click',      goNext);
      envelopePop.addEventListener('touchstart', (e) => { e.preventDefault(); goNext(); }, { passive: false });
    }, 1000);
  }

  /* ─────────────────────────────────────────
     MOSTRAR SOBRE
  ───────────────────────────────────────── */
  showEnvelope() {
    this.currentScreen = 'envelope';
    const screenEnvelope = document.getElementById('screen-envelope');
    screenEnvelope.classList.add('active');

    const envelope = document.getElementById('envelope');
    envelope.style.transform  = 'translateY(60px) scale(0.75)';
    envelope.style.opacity    = '0';

    setTimeout(() => {
      envelope.style.transition = 'all 0.9s cubic-bezier(0.34,1.56,0.64,1)';
      envelope.style.transform  = 'translateY(0) scale(1)';
      envelope.style.opacity    = '1';
    }, 80);
  }

  /* ─────────────────────────────────────────
     ABRIR SOBRE
  ───────────────────────────────────────── */
  openEnvelope() {
    if (this.currentScreen !== 'envelope') return;
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    envelopeWrapper.classList.add('opening');
    setTimeout(() => {
      document.getElementById('screen-envelope').classList.add('fade-out');
      this.showLetter();
    }, 600);
  }

  /* ─────────────────────────────────────────
     MOSTRAR CARTA
  ───────────────────────────────────────── */
  showLetter() {
    this.currentScreen = 'letter';
    const screenLetter = document.getElementById('screen-letter');
    screenLetter.classList.add('active');
    setTimeout(() => {
      document.getElementById('letter-container').classList.add('visible');
    }, 100);
  }

  /* ─────────────────────────────────────────
     ABRIR COLLAGE
  ───────────────────────────────────────── */
  openCollage() {
    if (this.currentScreen !== 'letter') return;
    const screenLetter = document.getElementById('screen-letter');
    screenLetter.style.transition = 'opacity 0.6s ease';
    screenLetter.style.opacity    = '0';
    setTimeout(() => {
      screenLetter.classList.remove('active');
      this.showCollage();
    }, 600);
  }

  showCollage() {
    this.currentScreen = 'collage';
    const screenCollage = document.getElementById('screen-collage');
    screenCollage.classList.add('active');
    this.renderCollage();
    this.createFloatingHearts();

    const photos = document.querySelectorAll('.photo-item');
    photos.forEach((photo, i) => {
      photo.style.opacity   = '0';
      photo.style.transform = 'scale(0.75) rotate(var(--rotation, 0deg))';
      setTimeout(() => {
        photo.style.transition = 'all 0.55s cubic-bezier(0.34,1.56,0.64,1)';
        photo.style.opacity    = '1';
        photo.style.transform  = 'rotate(var(--rotation, 0deg)) translateX(var(--nudge-x,0px)) translateY(var(--nudge-y,0px))';
      }, 60 + i * 90);
    });
  }

  /* ─────────────────────────────────────────
     FOTOS
  ───────────────────────────────────────── */
  async loadPhotos() {
    const assetsPath = this.config.assetsPath;
    try {
      const response = await fetch(`${assetsPath}/config.json`);
      if (response.ok) {
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          this.photos = data.photos.map(p => ({
            src:     `${assetsPath}/${p.filename}`,
            caption: p.caption || ''
          }));
          this.hideLoading();
          return;
        }
      }
    } catch (e) {
      console.log('No config.json found, auto-detecting photos...');
    }
    await this.autoDetectPhotos(assetsPath);
  }

  async autoDetectPhotos(assetsPath) {
    const extensions  = ['.jpeg', '.jpg', '.png', '.webp', '.gif'];
    const maxPhotos   = 50;
    const foundPhotos = [];

    for (let i = 1; i <= maxPhotos; i++) {
      let found = false;
      for (const ext of extensions) {
        const url    = `${assetsPath}/photo${i}${ext}`;
        const exists = await this.checkImageExists(url);
        if (exists) { foundPhotos.push({ src: url, caption: `Foto ${i}` }); found = true; break; }
      }
      if (!found) {
        for (const ext of extensions) {
          const url    = `${assetsPath}/image${i}${ext}`;
          const exists = await this.checkImageExists(url);
          if (exists) { foundPhotos.push({ src: url, caption: `Foto ${i}` }); found = true; break; }
        }
      }
      if (!found && foundPhotos.length > 0 && i > foundPhotos.length + 2) break;
    }

    if (foundPhotos.length > 0) {
      this.photos = foundPhotos;
    } else {
      this.useDemoPhotos();
    }
    this.hideLoading();
  }

  checkImageExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload  = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src     = url;
      setTimeout(() => resolve(false), 3000);
    });
  }

  useDemoPhotos() {
    this.photos = [
      { src: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400', caption: 'Momentos especiales' },
      { src: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400', caption: 'Amor infinito' },
      { src: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400', caption: 'Recuerdos felices' },
      { src: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=400', caption: 'Familia' },
      { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=400', caption: 'Sonrisas' },
      { src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400', caption: 'Alegría' },
    ];
  }

  /* ─────────────────────────────────────────
     COLLAGE
  ───────────────────────────────────────── */
  renderCollage() {
    const grid     = document.getElementById('collage-grid');
    const count    = this.photos.length;
    grid.innerHTML = '';
    const cssCount = Math.min(count, 20);
    grid.className = `collage-grid count-${cssCount}`;

    this.photos.forEach((photo, i) => {
      const item = document.createElement('div');
      item.className = 'photo-item polaroid';
      item.setAttribute('data-caption', photo.caption || `Foto ${i + 1}`);
      const img    = document.createElement('img');
      img.src      = photo.src;
      img.alt      = photo.caption || `Foto ${i + 1}`;
      img.loading  = 'lazy';
      item.appendChild(img);
      item.addEventListener('click', () => this.openLightbox(photo.src));
      grid.appendChild(item);
    });
  }

  openLightbox(src) {
    const lightbox    = document.getElementById('lightbox');
    document.getElementById('lightbox-img').src = src;
    lightbox.classList.add('active');
  }

  createFloatingHearts() {
    const container  = document.getElementById('collage-decorations');
    if (!container) return;
    container.innerHTML = '';
    const symbols = ['💕', '💖', '💗', '💝', '💘', '🌸', '🌹', '✨', '🌺', '💮'];
    for (let i = 0; i < 20; i++) {
      const h = document.createElement('div');
      h.className        = 'floating-heart';
      h.textContent      = symbols[Math.floor(Math.random() * symbols.length)];
      h.style.left       = `${Math.random() * 100}%`;
      h.style.fontSize   = `${13 + Math.random() * 14}px`;
      h.style.animationDuration  = `${7 + Math.random() * 9}s`;
      h.style.animationDelay     = `${Math.random() * 6}s`;
      container.appendChild(h);
    }
  }

  /* ─────────────────────────────────────────
     CONFETI
  ───────────────────────────────────────── */
  spawnConfetti() {
    const container = document.getElementById('particles-container');
    const colors    = ['#b5174e', '#f48fb1', '#c9a96e', '#ff4081', '#ffeb3b', '#fff', '#fce8ef'];
    const shapes    = ['50%', '2px', '0%'];

    for (let i = 0; i < 70; i++) {
      const piece = document.createElement('div');
      piece.className       = 'confetti-piece';
      piece.style.left      = `${Math.random() * 100}%`;
      piece.style.top       = `${-10 - Math.random() * 20}px`;
      piece.style.background     = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width          = `${5 + Math.random() * 10}px`;
      piece.style.height         = `${5 + Math.random() * 10}px`;
      piece.style.borderRadius   = shapes[Math.floor(Math.random() * shapes.length)];
      piece.style.animationDuration  = `${2 + Math.random() * 2.5}s`;
      piece.style.animationDelay     = `${Math.random() * 0.6}s`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }
  }
}

/* ─────────────────────────────────────────
   BOOTSTRAP
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const scriptTag = document.querySelector('script[data-config]');
  let config = {};
  if (scriptTag) {
    try { config = JSON.parse(scriptTag.getAttribute('data-config')); }
    catch (e) { console.error('Error parsing config:', e); }
  }

  const defaultConfig = {
    assetsPath:      './assets',
    envelopeTo:      'Para: Mi hermosa mamá',
    envelopeFrom:    'De: Tu hij@ favorit@',
    letterTitle:     '¡Eres la mejor mamá!',
    letterSubtitle:  'Gracias por tu amor infinito',
    letterText: [
      'Querida mamá,',
      'En este día tan especial, quiero recordarte lo increíble que eres. Tu amor incondicional ha sido mi mayor tesoro y mi guía en cada paso del camino.',
      'Cada sonrisa tuya ilumina mi mundo. Cada abrazo tuyo me da la paz que necesito. Eres mi refugio, mi inspiración y mi mayor bendición.',
      'Gracias por cada sacrificio, por cada noche en vela, por cada palabra de aliento. Gracias por ser mi ejemplo de fortaleza, amor y perseverancia.',
      'No hay palabras suficientes para describir todo lo que significas para mí. Solo sé que te amo con todo mi corazón, hoy y siempre.',
      '¡Feliz Día de las Madres! 💕'
    ],
    collageTitle:    'Nuestros Momentos',
    collageSubtitle: 'Cada foto es un recuerdo lleno de amor'
  };

  window.mothersDayApp = new MothersDayApp({ ...defaultConfig, ...config });
});