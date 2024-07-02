import React from 'react';
import DateSelector from './DateSelector';
import ReservationForm from './ReservationForm';
import { getBookedDatesByCabinId, getSettings } from '@/lib/data-service';
import { auth } from '@/lib/auth';
import LoginMessage from './LoginMessage';

export default async function Reservation({ cabin }: any) {
  const [settings, bookedDates] = await Promise.all([
    getSettings(),
    getBookedDatesByCabinId(cabin.id),
  ]);

  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 main-h-[400px] ">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}
