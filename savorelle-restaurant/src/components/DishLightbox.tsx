import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLanguage } from '../i18n';

type DishLightboxProps = {
  image: string | null;
  title: string;
  onClose: () => void;
};

export function DishLightbox({ image, title, onClose }: DishLightboxProps) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!image) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [image, onClose]);

  return <AnimatePresence>{image && <motion.div className="dish-lightbox" role="dialog" aria-modal="true" aria-label={title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
    <button className="lightbox-close" type="button" onClick={onClose} aria-label={t('gallery.close')}>×</button>
    <motion.figure initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(event) => event.stopPropagation()}>
      <img src={image} alt={title} />
      <figcaption>{title}</figcaption>
    </motion.figure>
  </motion.div>}</AnimatePresence>;
}
