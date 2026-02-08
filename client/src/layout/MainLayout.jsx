import Navbar from '@/components/Navbar'
import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'
import Footer from '@/components/Footer'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  )
}

export default MainLayout
