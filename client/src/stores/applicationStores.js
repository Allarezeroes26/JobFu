import { create } from "zustand";
import { toast } from 'react-hot-toast'
import api from '../api/api'
import { jobStore } from "./jobStores"; 
import { userAuth } from "./userStores";



export const applicationStore = create((set, get) => ({
    userApplicationData: null,
    loadingApplications: false,
    applyingJob: false,
    applyJob: async (jobId) => {
        set({ applyingJob: true });
        try {
        const res = await api.post(`/api/application/${jobId}`);

        const { authUser } = userAuth.getState();
        const { currentJob } = jobStore.getState();
        const newApplication = res.data.application;

        if (newApplication) {
            if (currentJob && currentJob._id === jobId) {
                jobStore.setState({
                currentJob: {
                    ...currentJob,
                    applications: [...(currentJob.applications || []), newApplication._id]
                }
                });
            }

            if (authUser) {
                userAuth.setState({
                authUser: {
                    ...authUser,
                    appliedJobs: [...(authUser.appliedJobs || []), newApplication._id]
                }
                });
            }
        }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply');
        } finally {
            set({ applyingJob: false });
        }
    },
    fetchApplication: async () => {
        set({ loadingApplications: true })
        try {
            const res = await api.get('/api/application/user-application')
            set({ userApplicationData: res.data.applications })
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Something went wrong!"
            toast.error(message)
        } finally {
            set({ loadingApplications: false })
        }
    },

    updateApplicationStatus: async (applicationId, status) => {
        try {
            const res = await api.put(`/api/application/status/${applicationId}`, { status });
            
            const { userApplicationData } = get();
            if (userApplicationData) {
                set({
                    userApplicationData: userApplicationData.map(app => 
                        app._id === applicationId ? { ...app, status } : app
                    )
                });
            }
            const { employerJobs } = jobStore.getState();
            if (employerJobs) {
                const updatedEmployerJobs = employerJobs.map(job => ({
                    ...job,
                    applications: job.applications.map(app => 
                        app._id === applicationId ? { ...app, status } : app
                    )
                }));
                
                jobStore.setState({ employerJobs: updatedEmployerJobs });
            }

            toast.success(`Application marked as ${status}`);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        }
    },
}))