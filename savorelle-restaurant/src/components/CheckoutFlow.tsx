import { AnimatePresence, motion } from 'framer-motion';
import { type FormEvent, useMemo, useState } from 'react';
import { createOrder, type OrderResponse } from '../api/orders';
import { formatPrice } from '../data/menu';
import { useLanguage } from '../i18n';

type CheckoutItem = { id: string; name: string; price: number; quantity: number };
type CheckoutFlowProps = {
  items: CheckoutItem[];
  fulfillmentType: 'pickup' | 'delivery';
  deliveryZone: 'central' | 'outer' | 'extended';
  subtotal: number;
  deliveryFee: number;
  total: number;
  onBack: () => void;
  onStartOver: () => void;
};
type PaymentMethod = 'cash' | 'card';
type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
type Customer = Record<'firstName' | 'lastName' | 'email' | 'phoneCountry' | 'phone' | 'pickupTime' | 'note' | 'address' | 'city' | 'postalCode' | 'apartment' | 'deliveryNote', string>;

const emptyCustomer: Customer = { firstName: '', lastName: '', email: '', phoneCountry: '+387', phone: '', pickupTime: '', note: '', address: '', city: '', postalCode: '', apartment: '', deliveryNote: '' };
const steps = ['Narudžba', 'Podaci', 'Plaćanje', 'Potvrda'];
const ease = [0.22, 1, 0.36, 1] as const;

function detectBrand(number: string): CardBrand {
  if (/^4/.test(number)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(number)) return 'mastercard';
  if (/^3[47]/.test(number)) return 'amex';
  if (/^(6011|65|64[4-9])/.test(number)) return 'discover';
  return 'unknown';
}
function formatNumber(value: string) { return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
function formatExpiry(value: string) { const digits = value.replace(/\D/g, '').slice(0, 4); return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits; }
function cardLabel(brand: CardBrand) { return brand === 'unknown' ? 'SAVORELLE' : brand === 'amex' ? 'AMERICAN EXPRESS' : brand.toUpperCase(); }

function CardPreview({ number, name, expiry, brand, flipped }: { number: string; name: string; expiry: string; brand: CardBrand; flipped: boolean }) {
  return <div className={`payment-card-scene ${flipped ? 'is-flipped' : ''}`} aria-label="Pregled platne kartice">
    <motion.div className={`payment-card ${brand}`} layout transition={{ duration: .35, ease }}>
      <div className="payment-card-front"><div className="payment-card-top"><span className="payment-card-chip" /><b>{cardLabel(brand)}</b></div><strong className="payment-card-number">{number || '•••• •••• •••• ••••'}</strong><div className="payment-card-bottom"><span><small>IME NA KARTICI</small>{name || 'VAŠE IME'}</span><span><small>VRIJEDI DO</small>{expiry || 'MM / YY'}</span></div></div>
      <div className="payment-card-back"><div className="magnetic-strip" /><div className="payment-card-cvv"><small>CVC / CVV</small><b>•••</b></div><p>Savorelle online payment</p></div>
    </motion.div>
  </div>;
}

export function CheckoutFlow({ items, fulfillmentType, deliveryZone, subtotal, deliveryFee, total, onBack, onStartOver }: CheckoutFlowProps) {
  const { locale } = useLanguage();
  const [step, setStep] = useState(2);
  const [review, setReview] = useState(false);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardFocus, setCardFocus] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [confirmation, setConfirmation] = useState<OrderResponse['order'] | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const brand = useMemo(() => detectBrand(cardNumber.replace(/\s/g, '')), [cardNumber]);

  const updateCustomer = (key: keyof Customer, value: string) => {
    setCustomer((current) => ({ ...current, [key]: value }));
    setDetailsSubmitted(false);
  };
  const detailsMessage = () => {
    const missing = [
      customer.firstName.trim().length < 2 && 'ime', customer.lastName.trim().length < 2 && 'prezime',
      !/\S+@\S+\.\S+/.test(customer.email) && 'ispravan email', customer.phone.trim().length < 7 && 'telefon',
      !customer.pickupTime && `vrijeme ${fulfillmentType === 'delivery' ? 'dostave' : 'preuzimanja'}`,
      fulfillmentType === 'delivery' && !customer.address.trim() && 'adresa', fulfillmentType === 'delivery' && !customer.city.trim() && 'grad',
      fulfillmentType === 'delivery' && !customer.postalCode.trim() && 'poštanski broj',
    ].filter(Boolean);
    return `Provjerite sljedeće: ${missing.join(', ')}.`;
  };
  const cardMessage = () => {
    if (cardName.trim().length < 2) return 'Unesite ime koje piše na kartici.';
    if (cardNumber.replace(/\s/g, '').length < 15) return 'Broj kartice mora sadržavati najmanje 15 cifara.';
    if (!/^\d{2}\s\/\s\d{2}$/.test(expiry)) return 'Datum isteka unesite u formatu MM / YY, na primjer 06 / 27.';
    if (cvc.length < 3) return 'CVC / CVV mora sadržavati najmanje 3 cifre.';
    return '';
  };
  const detailsValid = () => {
    const basic = customer.firstName.trim().length >= 2 && customer.lastName.trim().length >= 2 && /\S+@\S+\.\S+/.test(customer.email) && customer.phone.trim().length >= 7 && customer.pickupTime;
    return fulfillmentType === 'delivery' ? basic && customer.address.trim() && customer.city.trim() && customer.postalCode.trim() : basic;
  };
  const cardValid = () => cardNumber.replace(/\s/g, '').length >= 15 && cardName.trim().length >= 2 && /^\d{2}\s\/\s\d{2}$/.test(expiry) && cvc.length >= 3;

  function nextDetails(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!detailsValid()) { setFormError(detailsMessage()); return; } setFormError(''); setDetailsSubmitted(true); setReview(false); setStep(3); }
  function continueFromPayment() { if (paymentMethod === 'card' && !cardValid()) { setFormError(cardMessage()); return; } setFormError(''); setReview(true); }
  async function submitOrder() {
    setIsSubmitting(true); setServerError('');
    try {
      const customerForOrder = { ...customer, phone: `${customer.phoneCountry} ${customer.phone.trim()}` };
      const response = await createOrder({ fulfillmentType, deliveryZone: fulfillmentType === 'delivery' ? deliveryZone : undefined, customer: customerForOrder, items: items.map((item) => ({ productId: item.id, quantity: item.quantity })), paymentMethod, cardBrand: paymentMethod === 'card' ? brand : undefined, cardLast4: paymentMethod === 'card' ? cardNumber.replace(/\s/g, '').slice(-4) : undefined, idempotencyKey });
      setConfirmation(response.order); setStep(4);
    } catch (error) { setServerError(error instanceof Error ? error.message : 'Narudžbu trenutno nije moguće sačuvati.'); }
    finally { setIsSubmitting(false); }
  }

  const unlockedStep = confirmation ? 4 : detailsSubmitted ? 3 : 2;
  const changeStep = (target: number) => {
    if (target === 1) { onBack(); return; }
    if (target > unlockedStep) return;
    if (target === 2) { setReview(false); setStep(2); return; }
    if (target === 3) { setStep(3); return; }
    if (target === 4 && confirmation) setStep(4);
  };
  const progress = <nav className="checkout-progress" aria-label="Koraci narudžbe">{steps.map((label, index) => { const number = index + 1; const current = number === step; const complete = number < step; const locked = number > unlockedStep; return <button type="button" key={label} disabled={locked} aria-current={current ? 'step' : undefined} className={`${current ? 'is-current' : ''} ${complete ? 'is-complete' : ''} ${locked ? 'is-locked' : ''}`} onClick={() => changeStep(number)}><span>{String(number).padStart(2, '0')}</span><b>{label}</b></button>; })}</nav>;
  const summary = <aside className="checkout-summary"><span className="checkout-kicker">Pregled narudžbe</span>{items.map((item) => <div className="checkout-item" key={item.id}><span>{item.quantity} × {item.name}<small>{formatPrice(item.price, locale)} po komadu</small></span><strong>{formatPrice(item.price * item.quantity, locale)}</strong></div>)}<div className="checkout-totals"><div><span>Osnovna cijena</span><strong>{formatPrice(subtotal, locale)}</strong></div><div><span>Dostava</span><strong>{formatPrice(deliveryFee, locale)}</strong></div><div className="checkout-total"><span>Ukupno za platiti</span><strong>{formatPrice(total, locale)}</strong></div></div></aside>;
  const encouragement = step === 2 ? 'Još malo: unesite svoje podatke i nastavljamo prema sigurnom plaćanju.' : step === 3 && !review ? 'Odaberite način plaćanja. Vaša narudžba je skoro spremna.' : step === 3 ? 'Sve izgleda dobro. Potvrdite narudžbu kada ste spremni.' : 'Narudžba je uspješno zaprimljena. Hvala što birate Savorelle.';

  return <section className="checkout-shell section-shell" aria-labelledby="checkout-title"><div className="checkout-heading"><span className="eyebrow"><i /> Sigurna narudžba</span><h1 id="checkout-title">Dovršite svoju narudžbu.</h1><p className="checkout-encouragement" aria-live="polite">{encouragement}</p></div>{progress}
    <AnimatePresence mode="wait"><motion.div key={`${step}-${review}`} className="checkout-stage" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .42, ease }}>
      {step === 2 && <div className="checkout-grid"><form className="checkout-form" noValidate onSubmit={nextDetails}><div className="checkout-form-heading"><span>02</span><div><h2>Vaši podaci</h2><p>{fulfillmentType === 'delivery' ? 'Podaci potrebni za preciznu dostavu.' : 'Recite nam kada želite preuzeti narudžbu.'}</p></div></div><div className="checkout-fields"><label>Ime<input value={customer.firstName} onChange={(event) => updateCustomer('firstName', event.target.value)} autoComplete="given-name" required /></label><label>Prezime<input value={customer.lastName} onChange={(event) => updateCustomer('lastName', event.target.value)} autoComplete="family-name" required /></label><label className={`field-with-icon icon-email ${customer.email ? 'has-value' : ''}`}>Email<input type="email" value={customer.email} onChange={(event) => updateCustomer('email', event.target.value)} autoComplete="email" required /></label><label className="phone-field">Telefon<span className="phone-input-group"><select value={customer.phoneCountry} onChange={(event) => updateCustomer('phoneCountry', event.target.value)} aria-label="Pozivni broj države"><option value="+387">🇧🇦 +387</option><option value="+385">🇭🇷 +385</option><option value="+381">🇷🇸 +381</option><option value="+43">🇦🇹 +43</option><option value="+49">🇩🇪 +49</option><option value="+44">🇬🇧 +44</option></select><input type="tel" value={customer.phone} onChange={(event) => updateCustomer('phone', event.target.value.replace(/[^\d\s()-]/g, ''))} autoComplete="tel-national" inputMode="tel" placeholder="61 234 567" required /></span></label><label className="checkout-wide field-with-icon icon-time">Vrijeme {fulfillmentType === 'delivery' ? 'dostave' : 'preuzimanja'}<select value={customer.pickupTime} onChange={(event) => updateCustomer('pickupTime', event.target.value)} required><option value="">Odaberite vrijeme</option><option>Za 20–30 minuta</option><option>Za 30–45 minuta</option><option>Za 45–60 minuta</option></select></label>{fulfillmentType === 'delivery' && <><label className="checkout-wide">Adresa<input value={customer.address} onChange={(event) => updateCustomer('address', event.target.value)} autoComplete="street-address" required /></label><label>Grad<input value={customer.city} onChange={(event) => updateCustomer('city', event.target.value)} autoComplete="address-level2" required /></label><label>Poštanski broj<input value={customer.postalCode} onChange={(event) => updateCustomer('postalCode', event.target.value)} autoComplete="postal-code" required /></label><label className="checkout-wide"><span className="field-label">Sprat / broj stana <em>Opcionalno</em></span><input value={customer.apartment} onChange={(event) => updateCustomer('apartment', event.target.value)} /></label><label className="checkout-wide"><span className="field-label">Napomena za dostavljača <em>Opcionalno</em></span><textarea value={customer.deliveryNote} onChange={(event) => updateCustomer('deliveryNote', event.target.value)} /></label></>}<label className="checkout-wide"><span className="field-label">Napomena za restoran <em>Opcionalno</em></span><textarea value={customer.note} onChange={(event) => updateCustomer('note', event.target.value)} /></label></div>{formError && <p className="checkout-error" role="alert">{formError}</p>}<button className="primary-action" type="submit">Nastavite na plaćanje <span>↗</span></button></form>{summary}</div>}
      {step === 3 && !review && <div className="checkout-grid payment-layout"><div className="checkout-form"><div className="checkout-form-heading"><span>03</span><div><h2>Način plaćanja</h2><p>Odaberite opciju koja vam najviše odgovara.</p></div></div><div className="payment-options"><button type="button" className={`payment-option ${paymentMethod === 'cash' ? 'is-active' : ''}`} onClick={() => { setPaymentMethod('cash'); setFormError(''); setReview(true); }}><span className="payment-option-mark">01</span><span><b>Plaćanje gotovinom pri preuzimanju</b><small>Platite gotovinom kada preuzmete narudžbu.</small></span></button><button type="button" className={`payment-option ${paymentMethod === 'card' ? 'is-active' : ''}`} onClick={() => setPaymentMethod('card')}><span className="payment-option-mark">02</span><span><b>Plaćanje karticom</b><small>Sigurno online plaćanje debitnom ili kreditnom karticom.</small></span></button></div>{paymentMethod === 'card' && <div className="card-payment"><CardPreview number={cardNumber} name={cardName} expiry={expiry} brand={brand} flipped={cardFocus} /><div className="card-form"><label>Ime na kartici<input value={cardName} onFocus={() => setCardFocus(false)} onChange={(event) => setCardName(event.target.value.toUpperCase())} placeholder="MEMSUD DEDOVIĆ" autoComplete="cc-name" /></label><label>Broj kartice<input inputMode="numeric" value={cardNumber} onFocus={() => setCardFocus(false)} onChange={(event) => setCardNumber(formatNumber(event.target.value))} placeholder="4242 4242 4242 4242" autoComplete="cc-number" /></label><div><label>Datum isteka<input inputMode="numeric" value={expiry} onFocus={() => setCardFocus(false)} onChange={(event) => setExpiry(formatExpiry(event.target.value))} placeholder="MM / YY" autoComplete="cc-exp" /></label><label>CVC / CVV<input inputMode="numeric" value={cvc} onFocus={() => setCardFocus(true)} onBlur={() => setCardFocus(false)} onChange={(event) => setCvc(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" autoComplete="cc-csc" /></label></div><p className="card-security-note">Podaci kartice se ne šalju Savorelle serveru. Ovaj prikaz je demo priprema za Stripe Elements.</p></div></div>}{formError && <p className="checkout-error" role="alert">{formError}</p>}{paymentMethod === 'card' && <button className="primary-action" type="button" onClick={continueFromPayment}>Pregled narudžbe <span>↗</span></button>}</div>{summary}</div>}
      {step === 3 && review && <div className="checkout-grid"><div className="checkout-form order-review"><div className="checkout-form-heading"><span>03</span><div><h2>Potvrdite detalje</h2><p>Provjerite narudžbu prije konačne potvrde.</p></div></div><div className="review-details"><div><small>NAČIN PREUZIMANJA</small><b>{fulfillmentType === 'delivery' ? 'Dostava' : 'Preuzimanje'} · {customer.pickupTime}</b></div><div><small>KUPAC</small><b>{customer.firstName} {customer.lastName}<br />{customer.phoneCountry} {customer.phone}<br />{customer.email}</b></div>{fulfillmentType === 'delivery' && <div><small>ADRESA DOSTAVE</small><b>{customer.address}, {customer.city} {customer.postalCode}{customer.apartment ? ` · ${customer.apartment}` : ''}</b></div>}{(customer.note || customer.deliveryNote) && <div><small>NAPOMENA</small><b>{customer.deliveryNote || customer.note}</b></div>}<div><small>PLAĆANJE</small><b>{paymentMethod === 'cash' ? 'Gotovina pri preuzimanju' : `${cardLabel(brand)} •••• ${cardNumber.replace(/\s/g, '').slice(-4)}`}</b></div></div>{serverError && <p className="checkout-error" role="alert">{serverError}</p>}<button className="primary-action" type="button" disabled={isSubmitting} onClick={submitOrder}>{isSubmitting ? 'Spremamo narudžbu...' : paymentMethod === 'card' ? `Potvrdi demo plaćanje · ${formatPrice(total, locale)}` : 'Potvrdi narudžbu'} <span>↗</span></button>{paymentMethod === 'card' && <p className="demo-payment-notice">Demo režim: kartica neće biti naplaćena. Za stvarnu naplatu dodaje se Stripe Payment Element i webhook potvrda.</p>}</div>{summary}</div>}
      {step === 4 && confirmation && <div className="confirmation-panel"><span className="confirmation-check">✓</span><span className="checkout-kicker">Narudžba je zaprimljena</span><h2>Hvala, {customer.firstName}.</h2><p>{paymentMethod === 'cash' ? 'Narudžbu smo sačuvali. Plaćanje je predviđeno pri preuzimanju.' : 'Narudžbu smo sačuvali u demo kartičnom režimu. Stvarna naplata nije izvršena.'}</p><div className="confirmation-grid"><div><small>BROJ NARUDŽBE</small><b>{confirmation.orderNumber}</b></div><div><small>UKUPNO</small><b>{formatPrice(confirmation.total, locale)}</b></div><div><small>PREUZIMANJE</small><b>{fulfillmentType === 'delivery' ? 'Dostava' : 'Preuzimanje'} · {customer.pickupTime}</b></div><div><small>PLAĆANJE</small><b>{paymentMethod === 'cash' ? 'Plaćanje pri preuzimanju' : `${cardLabel(brand)} •••• ${cardNumber.replace(/\s/g, '').slice(-4)}`}</b></div></div>{summary}<button className="secondary-action" type="button" onClick={onStartOver}>Nova narudžba</button></div>}
    </motion.div></AnimatePresence></section>;
}
