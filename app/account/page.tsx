import { auth } from '@/lib/auth';
import React from 'react';

export const metadata = {
  title: 'Guest area',
};

export default async function Account() {
  const session = await auth();

  return (
    <h2 className="font-semibold text-2xl text-accent-400 mb-7">
      Welcome, {session?.user?.name?.split(' ').at(0)}
    </h2>
  );
}
