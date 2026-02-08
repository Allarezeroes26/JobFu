export const jobStore = create((set) => ({
  jobs: [],
  employerJobs: [],
  currentJob: null,

  postingJob: false,
  deletingJob: false,
  gettingAllJob: false,
  loadingSingleJob: false,
  loadingEmployerJobs: false,

  jobPost: async (data) => {
    set({ postingJob: true })
    try {
      const res = await api.post('/api/jobs/post-job', data)
      toast.success('Job Posted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      set({ postingJob: false })
    }
  },

  deleteJob: async (id) => {
    set({ deletingJob: true })
    try {
      await api.delete(`/api/jobs/delete-job/${id}`)
      set((state) => ({
        employerJobs: state.employerJobs.filter(job => job._id !== id)
      }))
      toast.success('Delete Job Success!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      set({ deletingJob: false })
    }
  },

  getAllJobs: async () => {
    set({ gettingAllJob: true })
    try {
      const res = await api.get('/api/jobs/all-jobs')
      set({ jobs: res.data.jobs })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      set({ gettingAllJob: false })
    }
  },

  currentEmployerJobs: async () => {
    set({ loadingEmployerJobs: true })
    try {
      const res = await api.get('/api/jobs/my-jobs')
      set({ employerJobs: res.data.jobs })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      set({ loadingEmployerJobs: false })
    }
  },

  singleJob: async (id) => {
    set({ loadingSingleJob: true })
    try {
      const res = await api.get(`/api/jobs/job/${id}`)
      set({ currentJob: res.data.job })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      set({ loadingSingleJob: false })
    }
  }
}))