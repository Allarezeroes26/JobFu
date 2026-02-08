import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import api from '../api/api';

export const jobStore = create((set) => ({
  jobData: null,
  postingJob: false,
  deletingJob: false,
  gettingAllJob: false,
  loadingSingleJob: false,
  loadingEmployerJobs: false,

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
  },

  deleteJob: async (id) => {
    set({ deletingJob: true })

    try {
      const response = await api.delete(`/api/jobs/delete-job/${id}`)
      toast.success('Delete Job Success!')
      set({ jobData: response.data })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message)
    } finally {
      set({deletingJob: false})
    }
  },

  getAllJobs: async () => {
    set({ gettingAllJob: true })
    try {
      const response = await api.get('/api/jobs/all-jobs')
      set({ jobData: response.data })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message)
    } finally {
      set({ gettingAllJob: false })
    }
  },

  currentEmployerJobs: async () => {
    set({ loadingEmployerJobs: true })
    try {
      const response = await api.get('/api/jobs/my-jobs')
      set({ jobData: response.data })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      toast.error(message)
    } finally {
      set({ loadingEmployerJobs: false })
    }
  },

  singleJob: async (id) => {
    set({ loadingSingleJob: true });

    try {
      const response = await api.get(`/api/jobs/job/${id}`);
      set({ jobData: response.data })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong'
      toast.error(message)
    } finally {
      set({ loadingSingleJob: false })
    }
  }
}));