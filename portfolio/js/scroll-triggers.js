/* ═══════════════════════════════════════════════════════════════
   scroll-triggers.js — GSAP ScrollTrigger + Lenis Smooth Scroll
   Neural Engineer Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initScrollTriggers() {
  gsap.registerPlugin(ScrollTrigger);

  const reduced = prefersReducedMotion();

  /* ── Lenis Smooth Scroll ── */
  if (typeof Lenis !== 'undefined' && !reduced) {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  if (reduced) return;

  const defaults = {
    start: 'top 85%',
    end: 'bottom 15%',
    toggleActions: 'play none none reverse'
  };

  /* ── ABOUT ── */
  const aboutRows = selectAll('#about .leader-row');
  if (aboutRows.length) {
    gsap.from(aboutRows, {
      scrollTrigger: { trigger: '#about', ...defaults },
      x: -40, opacity: 0 , stagger: 0.08, duration: 0.6, ease: EASE.snap
    });
  }

  const aboutSummary = select('.about-summary');
  if (aboutSummary) {
    gsap.from(aboutSummary, {
      scrollTrigger: { trigger: aboutSummary, ...defaults },
      y: 30, opacity: 0, duration: 0.8, ease: EASE.cinematic
    });
  }

  /* Schematic node stagger */
  const schNodes = selectAll('.schematic-node');
  if (schNodes.length) {
    gsap.from(schNodes, {
      scrollTrigger: { trigger: '.about-schematic', ...defaults },
      scale: 0, opacity: 0, stagger: 0.12, duration: 0.5, ease: EASE.impact,
      transformOrigin: 'center'
    });
  }

  /* ── LAB — Horizontal scroll on desktop ── */
  if (!isMobile()) {
    const labContainer = select('.lab-scroll-container');
    const labSection = select('#lab');
    if (labContainer && labSection) {
      const cards = selectAll('.lab-card');
      const totalScroll = labContainer.scrollWidth - window.innerWidth;

      if (totalScroll > 0) {
        gsap.to(labContainer, {
          x: -totalScroll,
          ease: 'none',
          scrollTrigger: {
            trigger: labSection,
            start: 'top top',
            end: '+=' + totalScroll * 1.5,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }
    }
  } else {
    /* Mobile: simple fade-in */
    const labCards = selectAll('.lab-card');
    gsap.from(labCards, {
      scrollTrigger: { trigger: '#lab', ...defaults },
      y: 50, opacity: 0, stagger: 0.15, duration: 0.6, ease: EASE.snap
    });
  }

  /* ── JOURNEY — Mission entries slide in ── */
  const missions = selectAll('.mission-entry');
  missions.forEach((m, i) => {
    gsap.from(m, {
      scrollTrigger: { trigger: m, start: 'top 90%', toggleActions: 'play none none reverse' },
      x: isMobile() ? 0 : -80,
      y: isMobile() ? 40 : 0,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.05,
      ease: EASE.snap
    });
  });

  /* ── SKILLS — Scale in ── */
  const skillSlots = selectAll('.skill-slot');
  if (skillSlots.length) {
    gsap.from(skillSlots, {
      scrollTrigger: { trigger: '#skills', ...defaults },
      scale: 0.8, opacity: 0, stagger: 0.04, duration: 0.5, ease: EASE.impact
    });
  }

  /* ── PROJECTS — Stagger reveal ── */
  const projCards = selectAll('.project-card');
  projCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, duration: 0.7, delay: i * 0.1, ease: EASE.cinematic
    });
  });

  /* ── CONTACT — Word reveal ── */
  const contactWords = selectAll('.contact-heading .word');
  if (contactWords.length) {
    gsap.from(contactWords, {
      scrollTrigger: { trigger: '#contact', start: 'top 80%' },
      opacity: 0, y: 15, stagger: 0.06, duration: 0.5, ease: EASE.snap
    });
  }

  /* ── Waveform Bars animation ── */
  const waveformBars = selectAll('.waveform-bar');
  if (waveformBars.length && !reduced) {
    function animateWaveform() {
      waveformBars.forEach(bar => {
        const h = random(4, 28);
        bar.style.height = h + 'px';
      });
      requestAnimationFrame(animateWaveform);
    }
    /* Only start when lab is visible */
    const labObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) animateWaveform();
      });
    }, { threshold: 0.1 });
    const labEl = document.getElementById('lab');
    if (labEl) labObs.observe(labEl);
  }
}
