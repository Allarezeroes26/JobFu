import { create } from 'zustand';
import api from '../api/api'
import { toast } from 'react-hot-toast'

export const userAuth = create((set) => ({
    authUser: null,
    isChecking: false,
    isLogging: false,
    isRegistering: false,
    isUpdating: false,
    isDeleting: false,

    checkUser: async () => {

        set({ isChecking: true })

        try {
            const response = await api.get('/api/auth/check')
            set({ authUser: response.data })
        } catch (err) {
            set({ authUser: null })
        } finally {
            set({ isChecking: false })
        }
    },

    login: async ({ email, password }) => {
        set({ isLogging: true });

        try {
            const response = await api.post('/api/auth/login', { email, password })
            set({ authUser: response.data })
            toast.success('Login Successful')
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong'
            toast.error(message)
        } finally {
            set({ isLogging: false })
        }
    },
    register: async ({ firstName, lastName, email, password }) => {
        set({ isRegistering: true })
        
        try {
            const response = await api.post('/api/auth/register', { firstName, lastName, email, password })
            set({ authUser: response.data })
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong'
            toast.error(message)
        } finally {
            set({ isRegistering: false })
        }
    },

    logout: async () => {
        try {
            await api.post('/api/auth/logout')
            set({ authUser: null })
            toast.success('Logout Success')
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong!'
            toast.error(message)
        }
    },

    update: async (formData) => {
        set({ isUpdating: true })
        try {
            const res = await api.put('/api/auth/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })

            set({ authUser: res.data.user })
            toast.success('Account successfully updated!')
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'Something went wrong!'
            toast.error(message)
        } finally {
            set({ isUpdating: false })
        }
    },

    deleteAccount: async (id) => {
        set({ isDeleting: true })

        try {
            await api.delete(`/api/auth/delete/${id}`)
            set({ authUser: null })
            toast.success('Account deleted successfully')
        } catch (err) {
            const message = err.response?.data?.message || err.message || "Something went wrong!"
            toast.error(message)
        } finally {
            set({ isDeleting: false })
        }
    }
}))