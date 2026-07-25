import { create } from 'zustand'

interface TraySheetState {
  isOpen: boolean
  editingItemId: string | null
  open: () => void
  close: () => void
  editItem: (id: string) => void
  closeEdit: () => void
}

export const useTraySheetStore = create<TraySheetState>((set) => ({
  isOpen: false,
  editingItemId: null,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false, editingItemId: null }),
  editItem: (id) => set({ editingItemId: id }),
  closeEdit: () => set({ editingItemId: null }),
}))
