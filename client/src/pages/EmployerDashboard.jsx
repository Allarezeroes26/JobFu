import React, { useEffect, useState } from 'react'
import { 
  Users, Briefcase, TrendingUp, Plus, MoreVertical, 
  MapPin, Loader2, Trash, Edit, Building2, CheckCircle2, AlertTriangle
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogClose, DialogTrigger 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { jobStore } from '@/stores/jobStores'
import { employeeStore } from '../stores/employerStores'
import { useNavigate } from 'react-router-dom'
import PostJob from './PostJob'

const EmployerDashboard = () => {
  const { employerJobs, currentEmployerJobs, loadingEmployerJobs, deleteJob } = jobStore();
  const { employerProfile, updateEmployer, updatingEmployer } = employeeStore();
  
  const [editingJob, setEditingJob] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  
  const [jobToDelete, setJobToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    currentEmployerJobs();
  }, []);

  const totalApplicants = (employerJobs || []).reduce(
    (acc, job) => acc + (job.applications?.length || 0),
    0
  );
  const activeJobs = employerJobs.filter(job => job.status === 'open').length;
  
  const navigate = useNavigate()

  const stats = [
    { title: "Active Listings", value: activeJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Applicants", value: totalApplicants, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ]

  const confirmDelete = async () => {
    if (jobToDelete) {
      await deleteJob(jobToDelete);
      setIsDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const success = await updateEmployer(formData);
    if (success) setIsProfileDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-10">
      <div className="container mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back, {employerProfile?.companyName || "Employer"}
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
                      <div 
                        key={job._id} 
                        className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                      >
                        <div
                          className="space-y-1 cursor-pointer flex-1"
                          onClick={() => navigate(`/employer-jobs/${job._id}`)}
                        >
                          <h4 className="font-semibold text-slate-800">{job.title}</h4>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3"/> {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3"/> {job.applications?.length || 0} Applicants
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">{job.jobType}</Badge>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="w-4 h-4"/>
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={(e) => {
                                  e.stopPropagation();
                                  setEditingJob(job);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-2"/> Edit
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => {
                                  e.stopPropagation();
                                  setJobToDelete(job._id);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
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

          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded bg-white overflow-hidden flex items-center justify-center border-2 border-white/20">
                    {employerProfile?.profilePic ? (
                        <img src={employerProfile.profilePic} alt="logo" className="w-full h-full object-cover" />
                    ) : (
                        <Building2 className="w-6 h-6 text-slate-900" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{employerProfile?.companyName || "Company Profile"}</CardTitle>
                    <p className="text-xs text-slate-400">{employerProfile?.industry || "Industry not set"}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-xs text-slate-300 line-clamp-2">
                  {employerProfile?.description || "No company description added yet."}
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                   <div className="text-xs">
                      <p className="text-slate-400">Location</p>
                      <p>{employerProfile?.location || "Remote"}</p>
                   </div>
                   <Button 
                    variant="link" 
                    onClick={() => setIsProfileDialogOpen(true)}
                    className="text-blue-400 p-0 h-auto text-xs hover:text-blue-300"
                   >
                    Edit Profile
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleProfileUpdate}>
            <DialogHeader>
              <DialogTitle>Edit Company Profile</DialogTitle>
              <DialogDescription>Update your company identity and contact information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-6">
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" name="companyName" defaultValue={employerProfile?.companyName} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" defaultValue={employerProfile?.industry} placeholder="e.g. Technology" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={employerProfile?.location} placeholder="e.g. New York, USA" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Company Bio</Label>
                <Textarea id="description" name="description" defaultValue={employerProfile?.description} className="min-h-[100px] resize-none" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Company Logo</Label>
                <Input id="logo" name="profilePic" type="file" accept="image/*" className="cursor-pointer" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
              <Button type="submit" disabled={updatingEmployer}>
                {updatingEmployer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Job Listing</DialogTitle>
            <DialogDescription>Update the details for the position of {editingJob?.title}.</DialogDescription>
          </DialogHeader>
          <PostJob 
            initialData={editingJob} 
            mode="edit" 
            onSuccess={() => {
                setIsEditDialogOpen(false);
                currentEmployerJobs(); 
            }} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center">Confirm Deletion</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete this job listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2">
            <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Listing</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EmployerDashboard