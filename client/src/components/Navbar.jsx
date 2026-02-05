import React from 'react'
import { Button } from '@/components/ui/button'
import { userAuth } from '../stores/userStores'
import { Link } from 'react-router-dom'
import { 
  BriefcaseBusiness, 
  LogOut, 
  User, 
  Menu 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const { authUser, logout } = userAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <BriefcaseBusiness className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="cursor-default text-xl font-bold tracking-tight">
              JobFu
            </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {/* <a href="/jobs" className="transition-colors hover:text-primary">Find Jobs</a>
          <a href="/companies" className="transition-colors hover:text-primary">Companies</a>
          <a href="/activity" className="transition-colors hover:text-primary">My Activity</a> */}
          <Button variant='link'>Find Jobs</Button>
          <Button variant='link'>Companies</Button>
          <Button variant='link'>My Activity</Button>
        </div>

        {/* Action Buttons / Profile */}
        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              <Button variant="ghost" className="hidden md:flex">Post a Job</Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to='/login'><Button variant="ghost">Login</Button></Link>
              <Link to='/register'><Button>Sign Up</Button></Link>
            </div>
          )}
          
          {/* Mobile Menu Toggle (Simplified) */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar