import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';
gsap.registerPlugin(ScrollTrigger, SplitText);
export function useMotion(route) {
  useEffect(() => {
    window.scrollTo(0, 0); const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; const fine = matchMedia('(pointer: fine)').matches; let lenis; let tick;
    if (!reduced) { lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: true }); lenis.on('scroll', ScrollTrigger.update); tick = time => lenis.raf(time * 1000); gsap.ticker.add(tick); }
    const ctx = gsap.context(() => {
      gsap.to('.scroll-progress', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
      if (!reduced) {
        gsap.fromTo('.route-page', { opacity: .6, y: 12 }, { opacity: 1, y: 0, duration: .55, ease: 'power3.out' });
        if (document.querySelector('.hero-title')) SplitText.create('.hero-title', { type: 'chars', autoSplit: true, aria: 'auto', onSplit(self) { return gsap.from(self.chars, { yPercent: 65, opacity: 0, duration: .85, stagger: .035, ease: 'expo.out' }); } });
        if (document.querySelector('.hero-portrait')) gsap.from('.hero-portrait', { rotation: 0, y: 30, duration: 1, ease: 'power3.out' });
        document.querySelectorAll('.reveal-title').forEach(el => gsap.from(el, { y: 24, opacity: .45, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } }));
        if (document.querySelector('.timeline-fill')) gsap.to('.timeline-fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: true } });
      }
    });
    const cursor = document.querySelector('.view-cursor'); const pointer = e => { if (!fine || reduced) return; gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: .12, overwrite: true }); const project = e.target.closest('[data-cursor="view"]'); cursor.classList.toggle('on', !!project); cursor.dataset.state = e.buttons ? 'drag' : project ? 'view' : e.target.closest('button,a') ? 'hover' : 'default'; }; const hide = () => cursor.classList.remove('on');
    window.addEventListener('pointermove', pointer); window.addEventListener('blur', hide); document.addEventListener('mouseleave', hide);
    const timer = setTimeout(() => ScrollTrigger.refresh(), 300); document.fonts.ready.then(() => ScrollTrigger.refresh());
    return () => { clearTimeout(timer); ctx.revert(); lenis?.destroy(); if (tick) gsap.ticker.remove(tick); window.removeEventListener('pointermove', pointer); window.removeEventListener('blur', hide); document.removeEventListener('mouseleave', hide); hide(); };
  }, [route]);
}
export function Magnetic({ children, className = '', ...props }) {
  function move(e) { if (!matchMedia('(pointer:fine)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return; const r = e.currentTarget.getBoundingClientRect(); gsap.to(e.currentTarget, { x: (e.clientX - r.left - r.width / 2) * .13, y: (e.clientY - r.top - r.height / 2) * .13, duration: .3 }); }
  return <button {...props} className={className} onPointerMove={move} onPointerLeave={e => gsap.to(e.currentTarget, { x: 0, y: 0, duration: .4 })}>{children}</button>;
}
