'use client';

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Headline that assembles word by word. Falls back to a plain fade. */
export function WordReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h1',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'p';
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  const MotionTag = motion[Tag];

  if (reduced) {
    return (
      <MotionTag initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={className}>
        {text}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.045, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            aria-hidden
            className="inline-block"
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1, transition: { duration: 0.75, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/** Slow drift on a background image as the section passes. */
export function Parallax({
  children,
  distance = 70,
  className = '',
}: {
  children: ReactNode;
  distance?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? undefined : { y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  );
}

/** Thin accent bar across the top showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-accent"
    />
  );
}

/** Lifts on hover, settles on press. For cards that are links. */
export function Lift({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { y: -1 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
