import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { type PointerEvent, useCallback, useEffect, useState } from 'react';
import { formatPrice, getMenuImage, menuItems } from '../data/menu';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { localize, useLanguage } from '../i18n';

const ease = [0.22, 1, 0.36, 1] as const;
const heroDishIds = ['savorelle-burger', 'frutti-risotto', 'chicken-main', 'tiramisu'];
const heroDishes = heroDishIds.map((id) => menuItems.find((item) => item.id === id)).filter((item) => item !== undefined);

export function Hero() {
  const { locale, t } = useLanguage();
  const reducedMotion = useReducedMotion();
  const [activeDishIndex, setActiveDishIndex] = useState(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const plateX = useSpring(useTransform(pointerX, [-0.5, 0.5], [-10, 10]), { stiffness: 90, damping: 22 });
  const plateY = useSpring(useTransform(pointerY, [-0.5, 0.5], [-8, 8]), { stiffness: 90, damping: 22 });

  const handlePointerMove = useCallback((event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  }, [pointerX, pointerY, reducedMotion]);

  const resetPointer = useCallback(() => {
    pointerX.set(0);
    pointerY.set(0);
  }, [pointerX, pointerY]);

  useEffect(() => {
    if (reducedMotion) return;
    const rotation = window.setInterval(() => setActiveDishIndex((index) => (index + 1) % heroDishes.length), 10_000);
    return () => window.clearInterval(rotation);
  }, [reducedMotion]);

  const activeDish = heroDishes[activeDishIndex];

  return (
    <section
      className="hero"
      id="home"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="hero-board">
        <div className="hero-content">
          <motion.p
            className="hero-kicker"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease }}
          >
            {t('hero.kicker')}
          </motion.p>
          <h1 id="hero-title" aria-label={`${t('hero.line1')} ${t('hero.line2')} ${t('hero.line3')}`}>
            <motion.span
              className="hero-line"
              initial={reducedMotion ? false : { opacity: 0, y: '105%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.82, ease }}
            >
              {t('hero.line1')}
            </motion.span>
            <motion.span
              className="hero-line"
              initial={reducedMotion ? false : { opacity: 0, y: '105%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.19, duration: 0.82, ease }}
            >
              {t('hero.line2')}
            </motion.span>
            <motion.span
              className="hero-line hero-line-accent"
              initial={reducedMotion ? false : { opacity: 0, y: '105%' }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.82, ease }}
            >
              {t('hero.line3')}
            </motion.span>
          </h1>
          <motion.p
            className="hero-statement"
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.7, ease }}
          >
            {t('hero.copy')}
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.66, ease }}
          >
            <a className="primary-action" href="/reservations">
              {t('hero.reserve')}
              <span aria-hidden="true">↗</span>
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-plate-reveal"
          initial={reducedMotion ? false : { clipPath: 'inset(10% 10% 10% 10% round 50%)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 50%)', opacity: 1 }}
          transition={{ delay: 0.24, duration: 1.05, ease }}
        >
          <motion.div
            className="hero-plate"
            style={reducedMotion ? undefined : { x: plateX, y: plateY }}
            initial={reducedMotion ? false : { scale: 1.11 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.24, duration: 1.2, ease }}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                className="hero-dish-image"
                key={activeDish.id}
                src={getMenuImage(activeDish)}
                alt={localize(activeDish.name, locale)}
                initial={reducedMotion ? false : { opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease }}
              />
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <div className="hero-dish-banner" aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeDish.id}
              initial={reducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.38, ease }}
            >
              <span>Jelo sedmice</span>
              <strong>{localize(activeDish.name, locale)}</strong>
              <b>{formatPrice(activeDish.price, locale)}</b>
              <small>{String(activeDishIndex + 1).padStart(2, '0')} / {String(heroDishes.length).padStart(2, '0')}</small>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.div
          className="hero-feature-card"
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66, duration: 0.72, ease }}
          aria-label={t('hero.kicker')}
        >
          <div>
            <span aria-hidden="true">★</span>
            <p><strong>{t('hero.feature1.title')}</strong>{t('hero.feature1.copy')}</p>
          </div>
          <div>
            <span aria-hidden="true">◒</span>
            <p><strong>{t('hero.feature2.title')}</strong>{t('hero.feature2.copy')}</p>
          </div>
          <div>
            <span aria-hidden="true">●</span>
            <p><strong>{t('hero.feature3.title')}</strong>{t('hero.feature3.copy')}</p>
          </div>
        </motion.div>

        <svg className="hero-arrow" viewBox="0 0 210 92" aria-hidden="true">
          <path d="M4 54c43-33 84-35 121-5 23 18 48 24 77 5" />
          <path d="M174 34l30 20-29 21" />
        </svg>
      </div>
    </section>
  );
}
