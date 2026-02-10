import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Mail, Phone, Calendar, 
  Download, CheckCircle, XCircle, Clock,
  MoreHorizontal, ExternalLink, User, Users
} from "lucide-react"
import { jobStore } from '@/stores/jobStores'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const EmployerJobs = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { employerJobs, currentEmployerJobs, loadingEmployerJobs } = jobStore()

  useEffect(() => {
    currentEmployerJobs()
  }, [])

  const job = employerJobs.find(j => j._id === id)

  if (loadingEmployerJobs) return <div className="p-20 text-center">Loading applicants...</div>
  if (!job) return <div className="p-20 text-center">Job not found.</div>

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        <div className="flex flex-col gap-4">
          <Button 
            variant="ghost" 
            className="w-fit -ml-2 text-muted-foreground"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{job.title}</h1>
              <div className="flex items-center gap-3 mt-2 text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <Badge variant="secondary">{job.applications?.length || 0} Total Applicants</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Pause Listing</Button>
              <Button>Edit Job</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">New Applications</p>
                <h3 className="text-2xl font-bold mt-1 text-blue-600">{job.applications?.length || 0}</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Shortlisted</p>
                <h3 className="text-2xl font-bold mt-1 text-green-600">0</h3>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardContent className="p-6">
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <h3 className="text-2xl font-bold mt-1 text-red-600">0</h3>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Candidates</CardTitle>
                <CardDescription>Review and manage everyone who applied for this position.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {job.applications && job.applications.length > 0 ? (
                    job.applications.map((app, index) => (
                      <div key={index} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{app.userName || "Applicant Name"}</h4>
                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> {app.userEmail || "email@example.com"}</span>
                              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Applied {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Download className="w-3.5 h-3.5" /> Resume
                          </Button>
                          <Separator orientation="vertical" className="h-8 mx-2 hidden md:block" />
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <XCircle className="w-5 h-5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600 hover:bg-green-50">
                            <CheckCircle className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-20 text-center">
                      <Users className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <p className="text-muted-foreground">No applications received yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployerJobs