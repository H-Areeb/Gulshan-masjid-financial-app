import { create } from 'zustand';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => {
  const savedUser = JSON.parse(localStorage.getItem('user'));

  return {
    user: savedUser || null,
    token: localStorage.getItem('token') || null,

    setUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    },

    setToken: (token) => {
      localStorage.setItem('token', token);
      set({ token });
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully!');
      set({ token: null, user: null });
      window.location.href = '/'; // redirect to login
    },
  };
});
