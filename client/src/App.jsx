import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Loader } from 'lucide-react'
import MainLayout from './layout/MainLayout'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import { userAuth } from './stores/userStores'
import { useEffect } from 'react'


function App() {

  const { checkUser, isChecking, authUser } = userAuth()

  useEffect(() => {
    checkUser()
  }, [])

  if (isChecking) {
    return (
      <div className="flex items-center justify-center">
        <Loader className='animate-spin'/>
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
          element: authUser ? <Homepage/> : <Navigate to='/login'/>
        },
        {
          path: '/login',
          element: !authUser ? <Login/> : <Navigate to='/'/>
        },
        {
          path: '/register',
          element: !authUser ? <Register/> : <Navigate to='/'/>
        }
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
