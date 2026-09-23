import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null, // { name: 'Dinas Pendidikan DKI', role: 'stakeholder' } | null
  isAuthenticated: false,

  login: (role) => {
    const userData = role === 'stakeholder' 
      ? { name: 'Tim Perencana Disdik', role: 'stakeholder', email: 'disdik@jakarta.go.id' }
      : { name: 'Operator GIS Data', role: 'operator', email: 'admin.gis@jakarta.go.id' };

    set({ user: userData, isAuthenticated: true });
  },

  logout: () => set({ user: null, isAuthenticated: false }),
}));