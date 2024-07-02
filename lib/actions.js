'use server';

import { revalidatePath } from 'next/cache';
import { auth, signIn, signOut } from './auth';
import { supabase } from './supabase';
import { getBookings } from './data-service';
import { redirect } from 'next/navigation';
import { NUMBER_OF_CHARACTERS } from '@/constants';

export async function updateGuest(fromData) {
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const nationalID = fromData.get('nationalID');
  const [nationality, countryFlag] = fromData.get('nationality').split('%');

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error('Please provide a valid national ID');

  const updateData = { nationality, countryFlag, nationalID };
  const { data, error } = await supabase

    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId);

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function createBooking(bookingData, fromData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: fromData.get('numGuests'),
    observations: fromData.get('observations').slice(0, NUMBER_OF_CHARACTERS),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    console.error(error);
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect('/cabins/thankyou');
}

export async function deleteBooking(bookingId) {
  // await new Promise((res) => setTimeout(res, 2000));
  const session = await auth();

  if (!session) throw new Error('You must be logged in');

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('Your are not allowed to delete this booking');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    throw new Error('Booking could not be deleted');
  }

  revalidatePath('/account/reservations');
}

export async function updateBooking(fromData) {
  const bookingId = Number(fromData.get('bookingId'));

  // 1) Auth
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  //2)authorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error('Your are not allowed to update this booking');

  //3)building updateData

  const updatedData = {
    numGuests: Number(fromData.get('numGuests')),
    observations: fromData.get('observations').slice(0, NUMBER_OF_CHARACTERS),
  };

  // 4)Mutation
  const { error } = await supabase
    .from('bookings')
    .update(updatedData)
    .eq('id', bookingId)
    .select()
    .single();

  //5)Error Handling
  if (error) {
    throw new Error('Booking could not be updated');
  }

  //6)revalidation
  revalidatePath(`/account/reservations/edit/${bookingId}`);

  //7)redirect
  redirect('/account/reservations');
}

export async function signInAction() {
  await signIn('google', {
    redirectTo: '/account',
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
