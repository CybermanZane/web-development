import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { createReservation } from '../api/reservations';
import { useLanguage } from '../i18n';

type Fields = { guests: string; date: string; time: string; firstName: string; lastName: string; email: string; phone: string; occasion: string; notes: string };
const initialFields: Fields = { guests: '2', date: '', time: '', firstName: '', lastName: '', email: '', phone: '', occasion: '', notes: '' };

export function ReservationForm() {
  const { t } = useLanguage();
  const [fields, setFields] = useState(initialFields);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const update = (field: keyof Fields, value: string) => { setFields((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); setServerError(''); if (status !== 'idle') setStatus('idle'); };
  function validate() {
    const next: Partial<Fields> = {};
    if (!fields.guests || Number(fields.guests) < 1) next.guests = t('reservation.errorGuests');
    if (!fields.date) next.date = t('reservation.errorDate');
    if (!fields.time) next.time = t('reservation.errorTime');
    if (!fields.firstName.trim()) next.firstName = t('reservation.errorFirst');
    if (!fields.lastName.trim()) next.lastName = t('reservation.errorLast');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) next.email = t('reservation.errorEmail');
    if (fields.phone.replace(/\D/g, '').length < 7) next.phone = t('reservation.errorPhone');
    setErrors(next); return Object.keys(next).length === 0;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!validate()) { setStatus('error'); return; } setStatus('loading');
    try { await createReservation({ date: fields.date, time: fields.time, guests: fields.guests, name: `${fields.firstName} ${fields.lastName}`, email: fields.email, phone: fields.phone, notes: [fields.occasion && `${t('reservation.occasion')}: ${fields.occasion}`, fields.notes].filter(Boolean).join('\n') }); setFields(initialFields); setStatus('success'); }
    catch (error) { setStatus('error'); setServerError(error instanceof Error ? error.message : t('reservation.error')); }
  }
  const occasions = [['reservation.birthday', 'birthday'], ['reservation.anniversary', 'anniversary'], ['reservation.business', 'business'], ['reservation.romantic', 'romantic'], ['reservation.other', 'other']] as const;
  return <form className="reservation-form reservation-flow" onSubmit={submit} noValidate>
    <div className="reservation-step"><span>01</span><div><h3>{t('reservation.step1')}</h3><div className="form-grid compact-grid"><Field label={t('reservation.guests')} error={errors.guests}><select value={fields.guests} onChange={(event) => update('guests', event.target.value)} aria-invalid={Boolean(errors.guests)}>{[1,2,3,4,5,6,7,8,9,10].map((guest) => <option key={guest}>{guest}</option>)}</select></Field><Field label={t('reservation.date')} error={errors.date}><input type="date" min={minDate} value={fields.date} onChange={(event) => update('date', event.target.value)} aria-invalid={Boolean(errors.date)} /></Field><Field label={t('reservation.time')} error={errors.time}><select value={fields.time} onChange={(event) => update('time', event.target.value)} aria-invalid={Boolean(errors.time)}><option value="">{t('reservation.selectTime')}</option>{['18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map((time) => <option key={time}>{time}</option>)}</select></Field></div></div></div>
    <div className="reservation-step"><span>02</span><div><h3>{t('reservation.step2')}</h3><div className="form-grid compact-grid"><Field label={t('reservation.firstName')} error={errors.firstName}><input autoComplete="given-name" value={fields.firstName} onChange={(event) => update('firstName', event.target.value)} aria-invalid={Boolean(errors.firstName)} /></Field><Field label={t('reservation.lastName')} error={errors.lastName}><input autoComplete="family-name" value={fields.lastName} onChange={(event) => update('lastName', event.target.value)} aria-invalid={Boolean(errors.lastName)} /></Field><Field label={t('reservation.email')} error={errors.email}><input type="email" autoComplete="email" value={fields.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} /></Field><Field label={t('reservation.phone')} error={errors.phone}><input type="tel" autoComplete="tel" value={fields.phone} onChange={(event) => update('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} /></Field></div></div></div>
    <div className="reservation-step"><span>03</span><div><h3>{t('reservation.step3')}</h3><div className="form-grid compact-grid"><Field label={t('reservation.occasion')}><select value={fields.occasion} onChange={(event) => update('occasion', event.target.value)}><option value="">{t('reservation.noOccasion')}</option>{occasions.map(([key, value]) => <option key={value} value={t(key)}>{t(key)}</option>)}</select></Field><Field label={t('reservation.requests')}><textarea value={fields.notes} onChange={(event) => update('notes', event.target.value)} placeholder={t('reservation.placeholder')} /></Field></div></div></div>
    <div className="form-footer"><p>{t('reservation.footer')}</p><button className="primary-action" type="submit" disabled={status === 'loading'} aria-busy={status === 'loading'}>{status === 'loading' ? <><span className="button-spinner" />{t('reservation.loading')}</> : t('reservation.submit')}</button></div>
    <AnimatePresence>{status === 'success' && <Success onClose={() => setStatus('idle')} />}{status === 'error' && (Object.keys(errors).length > 0 || serverError) && <motion.p className="form-message error" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{serverError || t('reservation.error')}</motion.p>}</AnimatePresence>
  </form>;
}
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label><span>{label}</span>{children}{error && <small>{error}</small>}</label>; }
function Success({ onClose }: { onClose: () => void }) { const { t } = useLanguage(); return createPortal(<motion.div className="form-success-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="success-dialog" role="status"><span>✓</span><strong>{t('reservation.successTitle')}</strong><p>{t('reservation.successCopy')}</p><button className="success-dismiss" type="button" onClick={onClose}>{t('reservation.successClose')}</button></div></motion.div>, document.body); }
