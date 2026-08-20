import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import type { Localized } from '../i18n';
import { localize, useLanguage } from '../i18n';

type Entry = { image: string; alt: Localized; category: string; categoryLabel?: Localized; title: Localized };

export function GalleryLightbox({ entries, index, onClose, onChange }: { entries: readonly Entry[]; index: number | null; onClose: () => void; onChange: (index: number) => void }) {
  const { locale, t } = useLanguage();
  useEffect(() => {
    if (index === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onChange((index + 1) % entries.length);
      if (event.key === 'ArrowLeft') onChange((index - 1 + entries.length) % entries.length);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [entries.length, index, onChange, onClose]);

  const entry = index === null ? null : entries[index];
  return <AnimatePresence>{entry && <motion.div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={localize(entry.title, locale)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <button className="lightbox-close" type="button" onClick={onClose} aria-label={t('gallery.close')}>×</button>
    <button className="lightbox-arrow lightbox-prev" type="button" aria-label={t('gallery.previous')} onClick={(event) => { event.stopPropagation(); onChange((index! - 1 + entries.length) % entries.length); }}>←</button>
    <motion.figure initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.36 }} onClick={(event) => event.stopPropagation()}>
      <img src={entry.image} alt={localize(entry.alt, locale)} />
      <figcaption><span>{entry.categoryLabel ? localize(entry.categoryLabel, locale) : t(`gallery.${entry.category}`)}</span>{localize(entry.title, locale)}</figcaption>
    </motion.figure>
    <button className="lightbox-arrow lightbox-next" type="button" aria-label={t('gallery.next')} onClick={(event) => { event.stopPropagation(); onChange((index! + 1) % entries.length); }}>→</button>
  </motion.div>}</AnimatePresence>;
}
