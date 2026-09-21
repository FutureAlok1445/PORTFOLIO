import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedHeadingProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  tag?: 'h1' | 'h2' | 'h3';
}

export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  lines,
  className = 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight',
  lineClassName = '',
  tag: Tag = 'h2',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const lineElements = containerRef.current?.querySelectorAll('.line-inner');
      if (lineElements && lineElements.length > 0) {
        gsap.fromTo(
          lineElements,
          { y: '105%', opacity: 0 },
          {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [lines]);

  return (
    <div ref={containerRef} className={className}>
      <Tag className="contents">
        {lines.map((line, idx) => (
          <span key={idx} className="block overflow-hidden pb-1">
            <span className={`line-inner block ${lineClassName}`}>
              {line}
            </span>
          </span>
        ))}
      </Tag>
    </div>
  );
};
