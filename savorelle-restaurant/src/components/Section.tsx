import { motion, type MotionProps } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  variant?: 'rise' | 'slide' | 'image' | 'fade';
}> &
  MotionProps;

const revealVariants = {
  rise: { opacity: 0, y: 34, scale: 0.985 },
  slide: { opacity: 0, x: -28 },
  image: { opacity: 0, scale: 1.05, clipPath: 'inset(8% 0 0 0)' },
  fade: { opacity: 0, y: 28, scale: 0.985 },
};

export function Reveal({ children, className, delay = 0, variant = 'rise', ...props }: RevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className} {...(props as object)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={revealVariants[variant]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, clipPath: 'inset(0 0 0 0)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: variant === 'image' ? 0.82 : 0.68, delay, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <p className="eyebrow">{children}</p>;
}
