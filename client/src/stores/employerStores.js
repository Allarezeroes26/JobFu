import { create } from "zustand";
import { toast } from 'react-hot-toast';
import api from '../api/api';

export const employeeStore = create((set) => ({
  employeeData: null,
  employers: [],
  checkingEmployer: false,
  creatingEmployer: false,
  updatingEmployer: false,

  checkEmployer: async () => {
    set({ checkingEmployer: true });
    try {
      const response = await api.get('/api/employer/me');
      set({ employeeData: response.data.employer });
    } catch (err) {
      set({ employeeData: null });
    } finally {
      set({ checkingEmployer: false });
    }
  },

  createEmployer: async (formData) => {
    set({ creatingEmployer: true });
    try {
      const res = await api.post("/api/employer/create", formData);
      // Ensure we extract the employer object from the response
      set({ employeeData: res.data.employer || res.data });
      toast.success("Employer profile created!");
      return { success: true };
    } catch (error) {
      // Extract specific backend error message
      const message = error.response?.data?.message || "Failed to create profile";
      toast.error(message);
      return { success: false };
    } finally {
      set({ creatingEmployer: false });
    }
  },

  updateEmployer: async (data) => {
    set({ updatingEmployer: true });
    try {
      const response = await api.put('/api/employer/update', data);
      set({ employeeData: response.data.employer });
      toast.success('Employer profile updated!');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      set({ updatingEmployer: false });
    }
  },

  getAllEmployers: async () => {
    set({ checkingEmployer: true });
    try {
      const response = await api.get('/api/employer/all');
      set({ employers: response.data.employers || [] });
    } catch (err) {
      toast.error('Failed to load companies');
    } finally {
      set({ checkingEmployer: false });
    }
  }
}));