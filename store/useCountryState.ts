import { IState } from '@/interface/payment'
import { create } from 'zustand'   

interface ICountryState {
  states: IState[]
  setStates: (states: IState[]) => void
}

export const useCountryState = create<ICountryState>((set) => ({
  states: [],
  setStates: (states: IState[]) => set({ states }),
}))
