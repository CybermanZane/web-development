export type ReservationRequest = {
  date: string;
  time: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
};

type ReservationResponse = {
  reservation: {
    id: string;
    status: string;
    created_at: string;
  };
  message: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';

export async function createReservation(reservation: ReservationRequest) {
  const response = await fetch(`${apiBaseUrl}/api/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...reservation,
      guests: Number(reservation.guests),
    }),
  });

  const payload = (await response.json().catch(() => null)) as ReservationResponse | { message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message ?? 'Reservation service is unavailable.');
  }

  return payload as ReservationResponse;
}
