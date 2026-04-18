/* ═══════════════════════════════════════════════════════════════
   hero.js — Boot Sequence, Text Scramble, Descent Indicator
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initBootSequence() {
  const boot = document.getElementById('boot-sequence');
  if (!boot) { initHeroAnimations(); return; }

  const lines = boot.querySelectorAll('.boot-line');
  const fill = boot.querySelector('.progress-fill');

  if (prefersReducedMotion()) {
    lines.forEach(l => l.style.opacity = 1);
    if (fill) fill.style.width = '100%';
    boot.style.display = 'none';
    initHeroAnimations();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      /* Hangar door exit: split top/bottom */
      const topHalf = document.createElement('div');
      const botHalf = document.createElement('div');
      const shared = 'position:fixed;left:0;right:0;background:var(--void-black);z-index:9998;pointer-events:none;';
      topHalf.style.cssText = shared + 'top:0;height:50%;';
      botHalf.style.cssText = shared + 'bottom:0;height:50%;';
      boot.style.display = 'none';
      document.body.appendChild(topHalf);
      document.body.appendChild(botHalf);

      gsap.to(topHalf, { y: '-100%', duration: 0.8, ease: EASE.expo,
        onComplete: () => topHalf.remove() });
      gsap.to(botHalf, { y: '100%', duration: 0.8, ease: EASE.expo,
        onComplete: () => botHalf.remove() });

      initHeroAnimations();
    }
  });

  tl.to(lines, { opacity: 1, stagger: 0.15, duration: 0.05, ease: 'none' });
  if (fill) tl.to(fill, { width: '100%', duration: 0.6, ease: EASE.snap }, '-=0.2');
  tl.to({}, { duration: 0.3 });
}

function initHeroAnimations() {
  const heroName = document.getElementById('hero-name');
  const heroTelemetry = document.getElementById('hero-telemetry');
  const descent = document.getElementById('hero-descent');

  if (prefersReducedMotion()) {
    if (heroName) heroName.textContent = CONFIG.name;
    if (heroTelemetry) heroTelemetry.textContent = CONFIG.telemetry;
    if (descent) descent.style.opacity = 1;
    return;
  }

  /* Matrix Text Scramble */
  if (heroName) {
    const final = CONFIG.name;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&_-+=<>[]{}';
    let iter = 0;

    const scramble = setInterval(() => {
      heroName.textContent = final.split('').map((c, i) => {
        if (i < iter) return final[i];
        if (c === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      iter += 0.4;
      if (iter >= final.length) {
        clearInterval(scramble);
        heroName.textContent = final;

        /* Glitch flash on reveal */
        heroName.classList.add('glitch-reveal');
        setTimeout(() => heroName.classList.remove('glitch-reveal'), 150);

        setTimeout(typeTelemetry, 300);
      }
    }, 30);
  }

  function typeTelemetry() {
    if (!heroTelemetry) { showDescent(); return; }
    const final = CONFIG.telemetry;
    let i = 0;
    heroTelemetry.textContent = '';

    const interval = setInterval(() => {
      heroTelemetry.innerHTML = final.substring(0, i) + '<span class="cursor-blink"></span>';
      i++;
      if (i > final.length) {
        clearInterval(interval);
        heroTelemetry.innerHTML = final + '<span class="cursor-blink"></span>';
        showDescent();
      }
    }, 20);
  }

  function showDescent() {
    if (descent) {
      gsap.to(descent, { opacity: 1, duration: 1, delay: 0.5, ease: EASE.smooth });
    }
  }
}
