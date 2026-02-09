import React, { useEffect } from 'react'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Plus, 
  MoreVertical, 
  ArrowUpRight,
  Clock,
  MapPin,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { jobStore } from '@/stores/jobStores'
import PostJob from './PostJob'

const EmployerDashboard = () => {
  const { employerJobs, currentEmployerJobs, loadingEmployerJobs } = jobStore();

  useEffect(() => {
    currentEmployerJobs()
  }, [currentEmployerJobs])

  const totalApplicants = employerJobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
  const activeJobs = employerJobs.filter(job => job.status === 'open').length;

  const stats = [
    { title: "Active Listings", value: activeJobs, icon: Briefcase, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Applicants", value: totalApplicants, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Engagement", value: "+24%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Avg. Salary", value: "$72k", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ]

  return (
    <div className="min-h-screen bg-muted/20 p-4 md:p-10">
      <div className="container mx-auto max-w-7xl space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employer Dashboard</h1>
            <p className="text-muted-foreground">Manage your listings and track applicant progress.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-lg">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Jobs</CardTitle>
                <CardDescription>You have {employerJobs.length} listings</CardDescription>
              </div>
              <Button variant="outline" size="sm">Download CSV</Button>
            </CardHeader>
            <CardContent>
              {loadingEmployerJobs ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="space-y-4">
                  {employerJobs.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl">
                      No jobs posted yet.
                    </div>
                  )}
                  {employerJobs.map((job) => (
                    <div key={job._id} className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-all">
                      <div className="space-y-1">
                        <h4 className="font-bold group-hover:text-primary transition-colors">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {job.applications?.length || 0} Applicants</span>
                          <span className="flex items-center gap-1 capitalize"><Briefcase className="w-3 h-3" /> {job.jobType}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location || 'Remote'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={job.status === "open" ? "default" : "secondary"}
                          className={job.status === 'open' ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {job.status}
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
               <div className="p-6 relative z-10">
                  <p className="text-primary-foreground/80 text-sm font-medium">Hiring Success Rate</p>
                  <h3 className="text-3xl font-bold">88%</h3>
                  <div className="mt-4 flex items-center text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    <span>Higher than last quarter</span>
                  </div>
               </div>
               <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader><CardTitle className="text-lg">Tips for Employers</CardTitle></CardHeader>
              <CardContent className="text-sm space-y-4 text-muted-foreground">
                <p>💡 <strong className="text-foreground">Speed Matters:</strong> Candidates are 50% more likely to accept if contacted within 48 hours.</p>
                <p>💡 <strong className="text-foreground">Salary Transparency:</strong> Including a max salary of <span className="text-foreground font-medium">${Math.max(...employerJobs.map(j => j.salary?.max || 0), 0).toLocaleString()}</span> increases views by 30%.</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EmployerDashboard