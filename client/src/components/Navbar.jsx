import React from 'react'
import { Button } from '@/components/ui/button'
import { userAuth } from '../stores/userStores'
import { Link } from 'react-router-dom'
import { 
  BriefcaseBusiness, 
  LogOut, 
  User, 
  Menu,
  Search, 
  Building2, 
  History, 
  PlusCircle, 
  Settings, 
  LayoutDashboard 
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const Navbar = () => {
  const { authUser, logout } = userAuth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to='/'>
          <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <BriefcaseBusiness className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="cursor-default text-xl font-bold tracking-tight">
                JobFu
              </span>
          </div>
        </Link>

        {authUser ? <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to='/jobs'><Button variant='link'>Find Jobs</Button></Link>
          <Link to='/companies'><Button variant='link'>Companies</Button></Link>
          <Button variant='link'>My Activity</Button>
        </div> : ""}

        <div className="flex items-center gap-4">
          {authUser ? (
            <>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to='/profile'>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  { authUser?.role === 'employer' && (
                    <Link to='/employer-dashboard'>
                      <DropdownMenuItem>Employer Dashboard</DropdownMenuItem>
                    </Link>
                  )}
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
          
          {authUser && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-80 flex flex-col">
                <SheetHeader className="border-b pb-6 text-left">
                  <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
                    <div className="bg-primary p-1.5 rounded-lg">
                      <BriefcaseBusiness className="h-6 w-6 text-primary-foreground" />
                    </div>
                    JobFu
                  </SheetTitle>
                  <SheetDescription className="text-sm font-medium text-muted-foreground">
                    Your gateway to professional growth.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-1 py-6 flex-1 overflow-y-auto">
                  <div className="px-2 pb-4">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Main Menu
                    </p>
                    <Link to="/jobs">
                      <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4 hover:bg-primary/5 hover:text-primary">
                        <Search className="h-4 w-4" />
                        Find Jobs
                      </Button>
                    </Link>
                    <Link to='/companies'>
                      <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4 hover:bg-primary/5 hover:text-primary">
                        <Building2 className="h-4 w-4" />
                        Companies
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4 hover:bg-primary/5 hover:text-primary">
                      <History className="h-4 w-4" />
                      My Activity
                    </Button>
                  </div>

                  <DropdownMenuSeparator className="mx-4" />

                  <div className="px-2 py-4">
                    <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                      Account & Dashboard
                    </p>
                    {authUser?.role === "employer" && (
                      <>
                        <Link to="/employer-dashboard">
                          <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4">
                            <LayoutDashboard className="h-4 w-4" />
                            Employer Dashboard
                          </Button>
                        </Link>
                      </>
                    )}
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4">
                        <User className="h-4 w-4" />
                        My Profile
                      </Button>
                    </Link>
                    <Button variant="ghost" className="w-full justify-start gap-3 h-11 px-4">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 mt-auto">
                  <Button
                    onClick={logout}
                    variant="ghost"
                    className="w-full justify-start mb-2 gap-3 h-11 px-4 text-destructive hover:bg-destructive/5 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar