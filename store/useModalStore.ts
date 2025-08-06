import { create } from 'zustand'

interface IModalState {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useModalStore = create<IModalState>((set) => ({
  isModalOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
}))
