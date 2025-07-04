import { create } from 'zustand';

export const useAlertStore = create((set) => ({
  alert: null,
  setAlert: (alert) => set({ alert }),
  clearAlert: () => set({ alert: null }),
}));
