/* ═══════════════════════════════════════════════════════════════
   scroll-triggers.js — GSAP ScrollTrigger + Lenis Smooth Scroll
   Neural Earth Portfolio
   ═══════════════════════════════════════════════════════════════ */

function initScrollTriggers() {
  gsap.registerPlugin(ScrollTrigger);

  const reduced = prefersReducedMotion();

  /* ── Lenis Smooth Scroll ── */
  if (typeof Lenis !== 'undefined' && !reduced) {
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* If reduced motion, set all reveals to final state and return */
  if (reduced) {
    selectAll('.reveal').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  const defaults = {
    start: 'top 85%',
    end: 'bottom 15%',
    toggleActions: 'play none none reverse'
  };

  /* ── ABOUT ── */
  const aboutParas = selectAll('#about .about-story p, #about .about-story h2, #about .about-code-block');
  if (aboutParas.length) {
    gsap.from(aboutParas, {
      scrollTrigger: { trigger: '#about', ...defaults },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: EASE.snappy
    });
  }

  const aboutTerminal = select('#about .about-terminal');
  if (aboutTerminal) {
    gsap.from(aboutTerminal, {
      scrollTrigger: { trigger: aboutTerminal, ...defaults },
      y: 60,
      opacity: 0,
      duration: 1,
      ease: EASE.cinematic
    });
  }

  const handNotes = selectAll('.handwritten-note');
  if (handNotes.length) {
    gsap.from(handNotes, {
      scrollTrigger: { trigger: '#about', ...defaults },
      opacity: 0,
      scale: 0.8,
      rotation: -10,
      stagger: 0.2,
      duration: 0.8,
      delay: 0.5,
      ease: EASE.elastic
    });
  }

  /* ── LAB ── */
  const labCards = selectAll('.experiment-card');
  if (labCards.length) {
    gsap.from(labCards, {
      scrollTrigger: { trigger: '#lab', ...defaults },
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: EASE.snappy
    });
  }

  /* ── JOURNEY ── */
  const commits = selectAll('.timeline-commit');
  if (commits.length) {
    commits.forEach((commit, i) => {
      gsap.from(commit, {
        scrollTrigger: {
          trigger: commit,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        rotateY: -15,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.05,
        ease: EASE.cinematic,
        transformOrigin: 'left center'
      });
    });
  }

  /* ── SKILLS ── */
  const skillNodes = selectAll('.skill-node');
  if (skillNodes.length) {
    gsap.from(skillNodes, {
      scrollTrigger: { trigger: '#skills', ...defaults },
      scale: 0,
      opacity: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: EASE.impact
    });
  }

  /* ── PROJECTS ── */
  const projectCards = selectAll('.project-card');
  if (projectCards.length) {
    projectCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: EASE.cinematic
      });
    });
  }

  /* ── CONTACT ── */
  const contactWords = selectAll('.contact-heading .word');
  if (contactWords.length) {
    gsap.from(contactWords, {
      scrollTrigger: { trigger: '#contact', start: 'top 80%' },
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.6,
      ease: EASE.snappy
    });
  }

  const contactTerminal = select('.contact-terminal');
  if (contactTerminal) {
    gsap.from(contactTerminal, {
      scrollTrigger: { trigger: contactTerminal, ...defaults },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: EASE.cinematic
    });
  }

  /* ── FOOTER ── */
  const footerText = select('.footer-text');
  if (footerText) {
    gsap.from(footerText, {
      scrollTrigger: { trigger: footerText, start: 'top 95%' },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: EASE.smooth
    });
  }
}
