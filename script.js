/* =================================================================
   DAISY'S GIFT — SCRIPT
   -----------------------------------------------------------------
   Everything content-specific lives in CONFIG below. Change the
   text, timings, or reasons list there — you shouldn't need to
   touch the logic beneath it to customize the gift.
   ================================================================= */

(() => {
  'use strict';

  /* -----------------------------------------------------------
     CONFIG — edit this block to personalize the site
  ----------------------------------------------------------- */
  const CONFIG = {
    loadingDurationMs: 2600,

    letterText:
      "Thank you for always being there for me. You make every day brighter, " +
      "and I'm grateful for every moment we share together. Thank you for your " +
      "kindness, your support, and for being such an important part of my life. " +
      "I hope this small gift reminds you how much you are appreciated.",

    typewriterSpeedMs: 28, // lower = faster typing

    reasons: [
      { icon: '❤️', text: "You're thoughtful." },
      { icon: '🌸', text: "You're kind and caring." },
      { icon: '✨', text: "You're supportive." },
      { icon: '💖', text: 'You make life brighter.' },
      { icon: '🌷', text: "You're one of a kind." }
    ],

    // How many ambient hearts/sparkles drift across the screen per interval
    ambientHeartIntervalMs: 900,
    ambientSparkleIntervalMs: 1400,
    heartGlyphs: ['💗', '💕', '💖', '💓', '❤️'],
    sparkleGlyphs: ['✨', '⭐', '✦'],
  };

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------------
     Small helpers
  ----------------------------------------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* -----------------------------------------------------------
     1. LOADING SCREEN
  ----------------------------------------------------------- */
  function runLoadingScreen() {
    const loadingScreen = $('#loading-screen');
    const progressFill = $('#progress-fill');
    const progressTrack = $('#progress-track');
    const main = $('#main');
    const musicToggle = $('#music-toggle');

    // Spawn a few floating hearts inside the loading screen itself
    if (!prefersReducedMotion) {
      const loadingHeartTimer = setInterval(() => {
        spawnFloatingItem(loadingScreen, CONFIG.heartGlyphs, 'floating-heart');
      }, 350);
      loadingScreen.dataset.timerId = loadingHeartTimer;
    }

    const start = performance.now();
    const duration = prefersReducedMotion ? 600 : CONFIG.loadingDurationMs;

    function tick(now) {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      progressFill.style.width = pct + '%';
      progressTrack.setAttribute('aria-valuenow', String(pct));

      if (elapsed < duration) {
        requestAnimationFrame(tick);
      } else {
        finishLoading();
      }
    }
    requestAnimationFrame(tick);

    function finishLoading() {
      clearInterval(loadingScreen.dataset.timerId);
      loadingScreen.classList.add('is-hidden');
      main.hidden = false;
      musicToggle.hidden = false;
      setTimeout(() => {
        loadingScreen.remove();
      }, 900);
    }
  }

  /* -----------------------------------------------------------
     2. SCREEN NAVIGATION
     Every element with [data-target] swaps the visible .screen.
  ----------------------------------------------------------- */
  function initNavigation() {
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-target]');
      if (!trigger) return;
      const targetId = trigger.getAttribute('data-target');
      showScreen(targetId);
    });

    $('#start-btn').addEventListener('click', () => showScreen('menu-screen'));
  }

  function showScreen(id) {
    const current = $('.screen:not([hidden])', $('#main'));
    const next = document.getElementById(id);
    if (!next || next === current) return;

    if (current) current.hidden = true;
    next.hidden = false;
    // restart the entrance animation
    next.style.animation = 'none';
    // eslint-disable-next-line no-unused-expressions
    next.offsetHeight;
    next.style.animation = '';

    // Screen-specific setup
    if (id === 'letter-screen') startTypewriter();
    if (id === 'reasons-screen') renderReasons();

    // Move focus for screen-reader / keyboard users
    const heading = next.querySelector('h1, h2');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }

  /* -----------------------------------------------------------
     3. TYPEWRITER EFFECT (letter screen)
  ----------------------------------------------------------- */
  let typewriterStarted = false;
  function startTypewriter() {
    const el = $('#typewriter-text');
    if (typewriterStarted) return; // only type once per visit
    typewriterStarted = true;

    if (prefersReducedMotion) {
      el.textContent = CONFIG.letterText;
      return;
    }

    const text = CONFIG.letterText;
    let i = 0;
    el.textContent = '';

    function typeNext() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(typeNext, CONFIG.typewriterSpeedMs);
      }
    }
    typeNext();
  }

  /* -----------------------------------------------------------
     4. REASONS CARDS
  ----------------------------------------------------------- */
  let reasonsRendered = false;
  function renderReasons() {
    if (reasonsRendered) return;
    reasonsRendered = true;

    const grid = $('#reasons-grid');
    const frag = document.createDocumentFragment();

    CONFIG.reasons.forEach((reason, index) => {
      const li = document.createElement('li');
      li.className = 'reason-card';
      li.style.setProperty('--delay', String(index));
      li.innerHTML = `
        <span class="reason-icon" aria-hidden="true">${reason.icon}</span>
        <span class="reason-text">${reason.text}</span>
      `;
      frag.appendChild(li);
    });

    grid.appendChild(frag);
  }

  /* -----------------------------------------------------------
     5. AMBIENT FLOATING HEARTS + SPARKLES (runs on every screen)
  ----------------------------------------------------------- */
  function spawnFloatingItem(container, glyphs, className) {
    const el = document.createElement('span');
    el.className = className;
    el.textContent = glyphs[Math.floor(rand(0, glyphs.length))];
    el.style.left = rand(2, 96) + '%';
    el.style.fontSize = rand(0.9, 1.8).toFixed(2) + 'rem';
    el.style.setProperty('--drift', rand(-40, 40).toFixed(0) + 'px');

    const duration = rand(5, 9.5);
    el.style.animationDuration = duration.toFixed(2) + 's';

    if (className === 'sparkle') {
      el.style.top = rand(4, 92) + '%';
      el.style.left = rand(4, 96) + '%';
      el.style.bottom = 'auto';
      el.style.animationDuration = rand(1.4, 2.6).toFixed(2) + 's';
    }

    container.appendChild(el);
    setTimeout(() => el.remove(), duration * 1000 + 200);
  }

  function initAmbientEffects() {
    if (prefersReducedMotion) return;
    const layer = $('#ambient-layer');

    setInterval(() => {
      spawnFloatingItem(layer, CONFIG.heartGlyphs, 'floating-heart');
    }, CONFIG.ambientHeartIntervalMs);

    setInterval(() => {
      spawnFloatingItem(layer, CONFIG.sparkleGlyphs, 'sparkle');
    }, CONFIG.ambientSparkleIntervalMs);
  }

  /* -----------------------------------------------------------
     6. BACKGROUND MUSIC TOGGLE
  ----------------------------------------------------------- */
  function initMusic() {
    const audio = $('#bg-music');
    const toggle = $('#music-toggle');
    const icon = $('#music-icon');

    toggle.addEventListener('click', async () => {
      try {
        if (audio.paused) {
          await audio.play();
          toggle.classList.add('is-playing');
          toggle.setAttribute('aria-pressed', 'true');
          toggle.setAttribute('aria-label', 'Pause background music');
          icon.textContent = '🔊';
        } else {
          audio.pause();
          toggle.classList.remove('is-playing');
          toggle.setAttribute('aria-pressed', 'false');
          toggle.setAttribute('aria-label', 'Play background music');
          icon.textContent = '🔈';
        }
      } catch (err) {
        // Autoplay / missing file safeguard — fails silently for the user
        console.warn('Music could not be played. Add an mp3 to assets/music/.', err);
      }
    });
  }

  /* -----------------------------------------------------------
     7. CELEBRATE: confetti + hearts burst + glow
  ----------------------------------------------------------- */
  function initCelebrate() {
    const btn = $('#celebrate-btn');
    const card = $('#surprise-card');

    btn.addEventListener('click', () => {
      card.classList.remove('is-glowing');
      // eslint-disable-next-line no-unused-expressions
      card.offsetHeight;
      card.classList.add('is-glowing');

      launchConfetti();

      if (!prefersReducedMotion) {
        const layer = $('#ambient-layer');
        for (let i = 0; i < 18; i++) {
          setTimeout(() => spawnFloatingItem(layer, CONFIG.heartGlyphs, 'floating-heart'), i * 60);
        }
        for (let i = 0; i < 14; i++) {
          setTimeout(() => spawnFloatingItem(layer, CONFIG.sparkleGlyphs, 'sparkle'), i * 80);
        }
      }
    });
  }

  /* Lightweight canvas confetti — no external libraries required */
  function launchConfetti() {
    const canvas = $('#confetti-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FF8FA8', '#FFD97D', '#D9C6F5', '#E85D82', '#FFF4EE'];
    const count = prefersReducedMotion ? 0 : 140;
    const particles = Array.from({ length: count }, () => ({
      x: rand(0, canvas.width),
      y: rand(-canvas.height * 0.2, 0),
      w: rand(6, 11),
      h: rand(8, 14),
      color: colors[Math.floor(rand(0, colors.length))],
      speedY: rand(2, 5),
      speedX: rand(-1.5, 1.5),
      rotation: rand(0, 360),
      rotationSpeed: rand(-8, 8),
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));

    let frame = 0;
    const maxFrames = 220;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      frame++;
      if (frame < maxFrames && count > 0) {
        requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    draw();
  }

  window.addEventListener('resize', () => {
    const canvas = $('#confetti-canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  /* -----------------------------------------------------------
     INIT
  ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    runLoadingScreen();
    initNavigation();
    initAmbientEffects();
    initMusic();
    initCelebrate();
  });
})();
