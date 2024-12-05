import { create } from "zustand";
import axios from "axios";

const API_URL = process.env.NODE_ENV === "development"
  ? "http://localhost:5000/api/auth"  // Local development backend URL
  : "https://auth-dusky-phi.vercel.app/api/auth";  // Replace with your actual production backend URL

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      set({ isAuthenticated: true, user: response.data.user, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Error sending password reset email", isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null, message: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, { password: newPassword });
      set({ message: response.data.message, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error?.response?.data?.message || "Error resetting password", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
