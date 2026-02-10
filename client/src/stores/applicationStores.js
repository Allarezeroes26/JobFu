import { create } from "zustand";
import { toast } from 'react-hot-toast'
import api from '../api/api'


export const applicationStore = create((set) => ({
    applyingJob: false,
    applyJob: async (jobId) => {
        set({ applyingJob: true });

        try {
            await api.post(`/api/application/${jobId}`);
            toast.success("Job successfully applied");
        } catch (err) {
            const message =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong";
            toast.error(message);
        } finally {
            set({ applyingJob: false });
        }
    }
}))