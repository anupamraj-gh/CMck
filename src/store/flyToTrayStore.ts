import { create } from 'zustand'

export interface FlightRect {
  top: number
  left: number
  width: number
  height: number
}

export interface Flight {
  id: string
  imageSrc: string
  fromRect: FlightRect
}

interface FlyToTrayState {
  flights: Flight[]
  launch: (flight: Omit<Flight, 'id'>) => void
  complete: (id: string) => void
}

/** Ephemeral, unpersisted — just a queue of in-flight "card flying to the tray" animations. */
export const useFlyToTrayStore = create<FlyToTrayState>((set) => ({
  flights: [],

  launch: (flight) =>
    set((state) => ({
      flights: [...state.flights, { ...flight, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }],
    })),

  complete: (id) =>
    set((state) => ({
      flights: state.flights.filter((f) => f.id !== id),
    })),
}))
