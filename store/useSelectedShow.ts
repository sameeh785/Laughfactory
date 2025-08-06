import { create } from "zustand"
import { IShow } from "@/interface/shows"



interface ISelectedShowState {
    selectedShow: IShow | null
    setSelectedShow: (show: IShow) => void
}

export const useSelectedShowStore = create<ISelectedShowState>((set) => ({
    selectedShow: null,
    setSelectedShow: (show) => set({ selectedShow: show }),
}))