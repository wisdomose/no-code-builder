import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutState {
  leftWidth: number
  rightWidth: number
  isLeftCollapsed: boolean
  isRightCollapsed: boolean
  setLeftWidth: (width: number) => void
  setRightWidth: (width: number) => void
  toggleLeftCollapse: () => void
  toggleRightCollapse: () => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      leftWidth: 260,
      rightWidth: 320,
      isLeftCollapsed: false,
      isRightCollapsed: false,
      setLeftWidth: (width) => set({ leftWidth: width }),
      setRightWidth: (width) => set({ rightWidth: width }),
      toggleLeftCollapse: () => set((state) => ({ isLeftCollapsed: !state.isLeftCollapsed })),
      toggleRightCollapse: () => set((state) => ({ isRightCollapsed: !state.isRightCollapsed })),
    }),
    {
      name: 'layout-storage',
    }
  )
)
