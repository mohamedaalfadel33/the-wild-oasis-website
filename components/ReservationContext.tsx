'use client';

import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext<any | undefined>(undefined);

const initState = { from: undefined, to: undefined };

function ReservationProvider({ children }: { children: React.ReactNode }) {
  const [range, setRange] = useState<any>(initState);

  const resetRange = () => setRange(initState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
}

function useReservation() {
  const context = useContext(ReservationContext);

  if (!context) {
    throw new Error(
      'ReservationContext must be used within ReservationProvider'
    );
  }

  return context;
}

export { ReservationProvider, useReservation };
