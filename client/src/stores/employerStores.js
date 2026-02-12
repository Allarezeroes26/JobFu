import { create } from "zustand";
import { toast } from "react-hot-toast";
import api from "../api/api";

export const employeeStore = create((set, get) => ({
  employerProfile: null,
  employers: [],

  checkingEmployerProfile: false, // ✅ NEW
  checkingEmployersList: false,   // ✅ NEW
  creatingEmployer: false,
  updatingEmployer: false,

  checkEmployer: async () => {
    set({ checkingEmployerProfile: true });
    if (get().employerProfile) {
      set({ checkingEmployerProfile: false });
      return;
    }
    try {
      const res = await api.get("/api/employer/me");
      set({ employerProfile: res.data.employer });
    } catch {
      set({ employerProfile: null });
    } finally {
      set({ checkingEmployerProfile: false });
    }
  },

  getAllEmployers: async () => {
    set({ checkingEmployersList: true });
    try {
      const res = await api.get("/api/employer/all");
      set({ employers: res.data.employers || [] });
    } catch {
      toast.error("Failed to load companies");
    } finally {
      set({ checkingEmployersList: false });
    }
  },

  createEmployer: async (formData) => {
    set({ creatingEmployer: true });

    try {
      const res = await api.post("/api/employer/create", formData);

      set({ employerProfile: res.data.employer });
      toast.success("Employer profile created!");

      return { success: true };
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create profile"
      );
      return { success: false };
    } finally {
      set({ creatingEmployer: false });
    }
  },

  updateEmployer: async (data) => {
    set({ updatingEmployer: true });

    try {
      const res = await api.put("/api/employer/update", data);
      set({ employerProfile: res.data.employer });
      toast.success("Employer profile updated!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      set({ updatingEmployer: false });
    }
  },

}));