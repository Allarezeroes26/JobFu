import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Loader } from 'lucide-react'
import MainLayout from './layout/MainLayout'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import { userAuth } from './stores/userStores'
import { useEffect } from 'react'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import PostJob from './pages/PostJob'
import EmployerForm from './pages/employerForm'
import {employeeStore} from './stores/employerStores'
import EmployerDashboard from './pages/EmployerDashboard'
import Job from './pages/Job'
import Companies from './pages/Companies'
import Company from './pages/Company'
import EmployerJobs from './pages/EmployerJobs'
import Activity from './pages/Activity'

function App() {

  const { checkUser, isChecking, authUser } = userAuth()
  const { checkEmployer, employeeData } = employeeStore() 

  useEffect(() => {
    const initApp = async () => {
      const user = await checkUser(); 
      
      if (user?.role === 'employer' || authUser?.role === 'employer') {
        checkEmployer();
      }
    };

    initApp();
  }, []);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin w-10 h-10"/>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout/>,
      children: [
        {
          index: true,
          element: <Homepage/>
        },
        {
          path: '/login',
          element: !authUser ? <Login/> : <Navigate to='/'/>
        },
        {
          path: '/register',
          element: !authUser ? <Register/> : <Navigate to='/'/>
        },
        {
          path: '/profile',
          element: authUser? <Profile/> : <Navigate to='/login'/>
        },
        {
          path: '/jobs',
          element: authUser ? <Jobs/> : <Navigate to='/login'/>
        },
        {
          path: '/post-job',
          element: authUser && employeeData ? <PostJob/> : <Navigate to='/login'/>
        },
        {
          path: '/employer-form',
          element: authUser ? <EmployerForm /> : <Navigate to='/login'/>
        },
        {
          path: '/employer-dashboard',
          element: authUser && employeeData ? <EmployerDashboard/> : <Navigate to='/login'/>
        },
        {
          path: '/job/:id',
          element: authUser ? <Job/> : <Navigate to='/login'/>
        },
        {
          path: '/companies',
          element: authUser ? <Companies /> : <Navigate to='/login'/>
        },
        {
          path: '/company/:id',
          element: authUser ? <Company/> : <Navigate to='/login'/>
        },
        {
          path: '/employer-jobs/:id',
          element: authUser && employeeData ? <EmployerJobs /> : <Navigate to='/login'/>
        },
        {
          path: '/activity',
          element: authUser ? <Activity /> : <Navigate to='/login'/>
        },
        
      ]
    }
  ])

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
