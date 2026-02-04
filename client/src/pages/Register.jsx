import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardAction, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { userAuth } from '@/stores/userStores'
import { Button } from '@/components/ui/button'

const Register = () => {

  const { register, authUser, isRegistering } = userAuth()

  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("")
  const [ email, setEmail ] = useState("")
  const [ password, setPassword ] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    await register({ firstName, lastName, email, password })
  }

  return (
    <div className='flex items-center min-h-screen p-4 justify-center bg-slate-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold tracking-tight'>
            Register
          </CardTitle>
          <CardDescription>
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className='grid gap-4'>
            <div className="grid gap-2">
              <Label htmlFor='firstName'>First Name</Label>
              <Input 
              id="firstName"
              type='text'
              placeholder='John'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor='lastName'>Last Name</Label>
              <Input 
              id="lastName"
              type='text'
              placeholder='Doe'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor='email'>Email</Label>
              <Input 
              id="email"
              type='email'
              placeholder='youremail@email.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor='password'>Password</Label>
              <Input 
              id="password"
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col items-center justify-center'>
            <Button className='w-full mt-5' type='submit' disabled={isRegistering}>
              { isRegistering ? "Creating Account" : "Register" }
            </Button>

            <h1 className='mt-3'>Already have an account? <Link to='/login'><Button variant='link'>Login</Button></Link></h1>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Register