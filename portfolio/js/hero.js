/* ═══════════════════════════════════════════════════════════════
   hero.js — Boot Sequence, Text Scramble, Typewriter, Scroll CTA
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initBootSequence() {
  const bootScreen = document.getElementById('boot-sequence');
  if (!bootScreen) { initHeroAnimations(); return; }

  const lines = bootScreen.querySelectorAll('.boot-line');
  const progressFill = bootScreen.querySelector('.progress-fill');

  if (prefersReducedMotion()) {
    lines.forEach(l => l.style.opacity = 1);
    if (progressFill) progressFill.style.width = '100%';
    bootScreen.style.display = 'none';
    initHeroAnimations();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      bootScreen.classList.add('glitch-out');
      gsap.to(bootScreen, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
        ease: EASE.snappy,
        onComplete: () => {
          bootScreen.style.display = 'none';
          initHeroAnimations();
        }
      });
    }
  });

  tl.to(lines, {
    opacity: 1,
    stagger: 0.2,
    duration: 0.1,
    ease: 'none'
  });

  if (progressFill) {
    tl.to(progressFill, {
      width: '100%',
      duration: 0.8,
      ease: EASE.snappy
    }, '-=0.3');
  }

  tl.to({}, { duration: 0.3 });
}

function initHeroAnimations() {
  const heroName = document.getElementById('hero-name');
  const heroTagline = document.getElementById('hero-tagline');
  const heroTerminal = document.getElementById('hero-terminal');
  const scrollIndicator = document.getElementById('scroll-indicator');

  if (prefersReducedMotion()) {
    if (heroName) heroName.textContent = CONFIG.name;
    if (heroTagline) heroTagline.textContent = CONFIG.tagline;
    if (heroTerminal) heroTerminal.textContent = '> ' + CONFIG.terminalLine;
    if (scrollIndicator) scrollIndicator.style.opacity = 1;
    return;
  }

  /* Matrix Text Scramble */
  if (heroName) {
    const finalText = CONFIG.name;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let iterations = 0;

    const scramble = setInterval(() => {
      heroName.textContent = finalText
        .split('')
        .map((char, index) => {
          if (index < iterations) return finalText[index];
          if (char === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iterations += 1 / 3;
      if (iterations >= finalText.length) {
        clearInterval(scramble);
        heroName.textContent = finalText;
        setTimeout(typeTagline, 300);
      }
    }, 30);
  }

  /* Typewriter — Tagline */
  function typeTagline() {
    if (!heroTagline) { typeTerminal(); return; }
    const finalText = CONFIG.tagline;
    let i = 0;
    heroTagline.textContent = '';

    const interval = setInterval(() => {
      heroTagline.innerHTML = finalText.substring(0, i) + '<span class="cursor-blink"></span>';
      i++;
      if (i > finalText.length) {
        clearInterval(interval);
        heroTagline.textContent = finalText;
        setTimeout(typeTerminal, 400);
      }
    }, 40);
  }

  /* Typewriter — Terminal Line */
  function typeTerminal() {
    if (!heroTerminal) { revealScroll(); return; }
    const prefix = '> ';
    const finalText = CONFIG.terminalLine;
    let i = 0;
    heroTerminal.textContent = prefix;

    const interval = setInterval(() => {
      heroTerminal.innerHTML = prefix + finalText.substring(0, i) + '<span class="cursor-blink"></span>';
      i++;
      if (i > finalText.length) {
        clearInterval(interval);
        heroTerminal.innerHTML = prefix + finalText + '<span class="cursor-blink"></span>';
        revealScroll();
      }
    }, 25);
  }

  /* Scroll Indicator */
  function revealScroll() {
    if (scrollIndicator) {
      gsap.to(scrollIndicator, { opacity: 1, duration: 1, delay: 0.5, ease: EASE.smooth });
    }
  }
}

function initHeroInteractions() {
  const hero = document.getElementById('hero');
  if (!hero || isMobile()) return;

  hero.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      border: 1px solid var(--ocean-teal);
      pointer-events: none;
      left: ${e.offsetX}px;
      top: ${e.offsetY}px;
      width: 0; height: 0;
      transform: translate(-50%, -50%);
      opacity: 0.4;
    `;
    hero.appendChild(ripple);
    gsap.to(ripple, {
      width: 100, height: 100,
      opacity: 0,
      duration: 0.6,
      ease: EASE.smooth,
      onComplete: () => ripple.remove()
    });
  });
}
