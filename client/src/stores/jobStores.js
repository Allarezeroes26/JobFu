import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import api from '../api/api';

export const jobStore = create((set) => ({
  jobData: null,
  postingJob: false,

  jobPost: async (data) => {
    set({ postingJob: true });

    try {
      const response = await api.post('/api/jobs/post-job', data);
      set({ jobData: response.data });
      toast.success('Job Posted');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message);
    } finally {
      set({ postingJob: false });
    }
  }
}));