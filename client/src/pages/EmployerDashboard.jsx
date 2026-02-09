import React, { useEffect, useState } from 'react'
import { 
  Users, Briefcase, TrendingUp, Plus, MoreVertical, 
  ArrowUpRight, Clock, MapPin, Loader2, Trash, Edit, 
  Lightbulb, Building2, ExternalLink, Mail, CheckCircle2
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup, 
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogClose, DialogTrigger 
} from "@/components/ui/dialog"
import { jobStore } from '@/stores/jobStores'
import { employeeStore } from '../stores/employerStores'
import PostJob from './PostJob'

const EmployerDashboard = () => {
  const { employerJobs, currentEmployerJobs, loadingEmployerJobs, deleteJob } = jobStore();
  const { employeeData, checkEmployer, checkingEmployer } = employeeStore();

  const [editingJob, setEditingJob] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    currentEmployerJobs();
    checkEmployer(); // Fetch company profile
  }, []);

  // Logical Helpers
  const totalApplicants = employerJobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
  const activeJobs = employerJobs.filter(job => job.status === 'open').length;
  const recentApplicants = employerJobs
    .flatMap(job => job.applications.map(app => ({ ...app, jobTitle: job.title })))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5); // Get top 5 recent

  const stats = [
    { title: "Active Listings", value: activeJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Applicants", value: totalApplicants, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Engagement", value: "+24%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Company Views", value: "1.2k", icon: CheckCircle2, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  const handleDelete = async (id) => {
    await deleteJob(id)
  }

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-10">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        {/* TOP NAV / WELCOME */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {employeeData?.companyName || "Employer"}
            </h1>
            <p className="text-muted-foreground font-medium">Here's what's happening with your recruitment.</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2 shadow-md">
                  <Plus className="w-4 h-4" /> Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Post a New Job</DialogTitle>
                  <DialogDescription>Create a detailed job listing to attract the best talent.</DialogDescription>
                </DialogHeader>
                <PostJob />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* MAIN COLUMN: LISTINGS */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Job Listings</CardTitle>
                  <CardDescription>Manage and monitor your open roles.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-primary">View All</Button>
              </CardHeader>
              <CardContent className="p-0">
                {loadingEmployerJobs ? (
                  <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>
                ) : (
                  <div className="divide-y divide-border">
                    {employerJobs.length === 0 && (
                      <div className="text-center py-16">
                        <Briefcase className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                      </div>
                    )}
                    {employerJobs.map((job) => (
                      <div key={job._id} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-slate-800">{job.title}</h4>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3"/> {job.location}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3"/> {job.applications?.length || 0} Applicants</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">{job.jobType}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4"/></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onSelect={() => { setEditingJob(job); setIsEditDialogOpen(true); }}>
                                <Edit className="w-4 h-4 mr-2"/> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onSelect={() => handleDelete(job._id)}>
                                <Trash className="w-4 h-4 mr-2"/> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* COMPANY PROFILE CARD */}
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded bg-white/10 flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employeeData?.companyName || "Company Profile"}</CardTitle>
                    <p className="text-xs text-slate-400">{employeeData?.industry || "Industry not set"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2">
                  {employeeData?.description || "No company description added yet."}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                   <div className="text-xs">
                      <p className="text-slate-400">Location</p>
                      <p>{employeeData?.location || "Remote"}</p>
                   </div>
                   <Button variant="link" className="text-white p-0 h-auto text-xs">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>

            {/* RECENT APPLICANTS */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Applicants</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {recentApplicants.length > 0 ? recentApplicants.map((app, i) => (
                    <div key={i} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {app.userName?.charAt(0) || "A"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{app.userName || "Anonymous"}</p>
                        <p className="text-xs text-muted-foreground truncate">Applied for {app.jobTitle}</p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )) : (
                    <div className="p-8 text-center text-xs text-muted-foreground">No recent applications</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* TIP OF THE DAY */}
            <Card className="border-none shadow-sm bg-amber-50 border border-amber-100">
              <CardContent className="p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-900 uppercase">Hiring Tip</p>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Personalized rejection emails improve your employer brand rating by 20%.
                  </p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Job Listing</DialogTitle>
          </DialogHeader>
          <PostJob initialData={editingJob} mode="edit" onSuccess={() => setIsEditDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployerDashboard