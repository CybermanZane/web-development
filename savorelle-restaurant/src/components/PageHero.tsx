import { motion } from 'framer-motion';
import { Eyebrow } from './Section';
import { useReducedMotion } from '../hooks/useReducedMotion';

type PageHeroProps = { label: string; title: string; copy: string; image: string; imageAlt: string };

export function PageHero({ label, title, copy, image, imageAlt }: PageHeroProps) {
  const reducedMotion = useReducedMotion();
  return (
    <section className="editorial-hero section-shell">
      <div className="editorial-hero-copy">
        <motion.div initial={reducedMotion ? false : { opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>
          <Eyebrow>{label}</Eyebrow>
          <h1>{title}</h1>
          <p>{copy}</p>
        </motion.div>
      </div>
      <motion.div className="editorial-hero-image" initial={reducedMotion ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)', scale: 1.07 }} animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)', scale: 1 }} transition={{ delay: 0.14, duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <img src={image} alt={imageAlt} />
      </motion.div>
    </section>
  );
}
