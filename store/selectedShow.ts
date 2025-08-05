import { create } from "zustand"

interface SelectedShow {
    title: string
    subtitle: string
    bannerImage: string
    comedians: any[]
    date: any
    ticketUrl: string
}

interface SelectedShowState {
    selectedShow: SelectedShow | null
    setSelectedShow: (show: any) => void
}

export const useSelectedShowStore = create<SelectedShowState>((set) => ({
    selectedShow: null,
    setSelectedShow: (show) => set({ selectedShow: show }),
}))