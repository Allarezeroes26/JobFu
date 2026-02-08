import React from 'react'
import { 
  Users, 
  Briefcase, 
  Eye, 
  CheckCircle2, 
  Plus, 
  MoreVertical, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import PostJob from './PostJob'

const EmployerDashboard = () => {
  const stats = [
    { title: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-600" },
    { title: "Total Applicants", value: "248", icon: Users, color: "text-purple-600" },
    { title: "New Messages", value: "5", icon: CheckCircle2, color: "text-green-600" },
    { title: "Profile Views", value: "1.2k", icon: Eye, color: "text-orange-600" },
  ]

  const recentJobs = [
    { id: 1, title: "Senior Frontend Engineer", apps: 45, status: "Active", date: "2 days ago" },
    { id: 2, title: "Product Designer", apps: 12, status: "Active", date: "5 days ago" },
    { id: 3, title: "Backend Developer", apps: 89, status: "Paused", date: "1 week ago" },
  ]

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-10">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening with your listings.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg">
                <Plus className="w-4 h-4" /> Post New Job
              </Button>
          </DialogTrigger>
          <DialogContent>
            <PostJob />
          </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Jobs</CardTitle>
                <CardDescription>You have 12 active listings this month.</CardDescription>
              </div>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/30 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-bold">{job.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.apps} Applicants</span>
                        <span>•</span>
                        <span>Posted {job.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={job.status === "Active" ? "default" : "secondary"}>
                        {job.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hiring Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold">High Demand</p>
                  <p className="text-xs text-muted-foreground">Frontend roles are getting 40% more traffic this week.</p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm font-semibold italic">"Pro Tip: Jobs with salary ranges get 3x more qualified applicants."</p>
              </div>

              <div className="pt-4">
                <Button variant="outline" className="w-full text-xs h-9">Download Report</Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard