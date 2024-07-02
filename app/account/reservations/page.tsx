import ReservationCard from '@/components/ReservationCard';
import { auth } from '@/lib/auth';
import { getBookings } from '@/lib/data-service';

export const metadata = {
  title: 'Reservations',
};

export default async function Reservations() {
  // CHANGE
  const session = await auth();
  const bookings: any = await getBookings(session?.user.guestId);
  console.log(bookings);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{' '}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking: any) => (
            <ReservationCard booking={booking} key={booking.id} />
          ))}
        </ul>
      )}
    </div>
  );
}
