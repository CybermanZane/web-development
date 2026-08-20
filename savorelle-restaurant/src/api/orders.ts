export type OrderRequest = {
  fulfillmentType: 'pickup' | 'delivery';
  deliveryZone?: 'central' | 'outer' | 'extended';
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    pickupTime?: string;
    note?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    apartment?: string;
    deliveryNote?: string;
  };
  items: { productId: string; quantity: number }[];
  paymentMethod: 'cash' | 'card';
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';
  cardLast4?: string;
  idempotencyKey: string;
};

export type OrderResponse = {
  order: {
    id: string;
    orderNumber: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
    paymentStatus: string;
    paymentMethod: string;
    createdAt: string;
  };
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function createOrder(order: OrderRequest) {
  const response = await fetch(`${apiBaseUrl}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });

  const payload = (await response.json().catch(() => null)) as OrderResponse | { message?: string } | null;
  if (!response.ok) {
    const message = payload && 'message' in payload ? payload.message : undefined;
    throw new Error(message ?? 'Narudžbu trenutno nije moguće sačuvati.');
  }
  return payload as OrderResponse;
}
