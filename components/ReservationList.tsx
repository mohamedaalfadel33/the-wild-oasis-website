'use client';

import React, { useOptimistic } from 'react';
import ReservationCard from './ReservationCard';
import { deleteBooking } from '@/lib/actions';

type Bookings = {
  id: number;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  };
}[];

type Booking = {
  id: number;
  created_at: Date;
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  guestId: number;
  cabinId: number;
  cabins: {
    name: string;
    image: string;
  };
};

export default function ReservationList({ bookings }: { bookings: Bookings }) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (curBookings: any, bookingId: any) => {
      return curBookings.filter((booking: Booking) => booking.id !== bookingId);
    }
  );

  async function handelDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking: Booking) => (
        <ReservationCard
          booking={booking}
          key={booking.id}
          onDelete={handelDelete}
        />
      ))}
    </ul>
  );
}
