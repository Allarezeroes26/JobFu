import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationStore } from '../stores/applicationStores'
import { cn } from "@/lib/utils"
import { 
  ArrowLeft, Mail, Calendar, Download, CheckCircle, 
  XCircle, Clock, User, Users, Briefcase, 
  FileText, MapPin, Eye
} from "lucide-react"
import { jobStore } from '@/stores/jobStores'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const EmployerJobs = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { employerJobs, currentEmployerJobs, loadingEmployerJobs } = jobStore()
  const { updateApplicationStatus } = applicationStore()

  useEffect(() => {
    currentEmployerJobs()
  }, [])

  const job = employerJobs.find(j => j._id === id)

  const handleViewCandidate = async (appId, currentStatus) => {
    if (currentStatus === 'applied') {
      await updateApplicationStatus(appId, 'seen')
    }
  }

  if (loadingEmployerJobs) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading applicant data...</p>
      </div>
    </div>
  )
  
  if (!job) return <div className="p-20 text-center text-slate-500">Job listing not found.</div>

  return (
    <div className="min-h-screen bg-[#FDFDFF] p-4 md:p-10">
      <div className="container mx-auto max-w-6xl space-y-8">
        
        <div className="space-y-6">
          <Button 
            variant="ghost" 
            className="group text-slate-500 hover:text-primary p-0 hover:bg-transparent"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> 
            Back to Dashboard
          </Button>
          
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{job.title}</h1>
                <Badge className="bg-emerald-50 text-emerald-600 border-none capitalize">{job.status}</Badge>
              </div>
              <div className="flex items-center gap-5 text-slate-400 font-medium">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {job.location}</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4"/> {job.applications?.length || 0} Applicants</span>
              </div>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-2xl font-bold">Candidates</CardTitle>
            <CardDescription>Review details and manage the hiring status of your applicants.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {job.applications?.length > 0 ? (
                job.applications.map((app, index) => {
                  const user = app.applicant; 
                  const fullName = `${user?.firstName || 'Unknown'} ${user?.lastName || ''}`;
                  const initials = `${user?.firstName?.[0] || '?'}${user?.lastName?.[0] || ''}`;
                  const hasResume = !!user?.resume;

                  return (
                    <div key={app._id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                      
                      <Dialog onOpenChange={(open) => open && handleViewCandidate(app._id, app.status)}>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-5 cursor-pointer group flex-1">
                            <Avatar className="h-16 w-16 border-4 border-white shadow-sm transition-transform group-hover:scale-105">
                              <AvatarImage src={user?.profilePic} className="object-cover" />
                              <AvatarFallback className="bg-slate-900 text-white font-bold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-xl group-hover:text-primary transition-colors">
                                {fullName}
                              </h4>
                              <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium">
                                <span className="flex items-center gap-1.5"><Mail className="w-4 h-4"/> {user?.email}</span>
                                <Badge 
                                  variant="outline" 
                                  className={cn(
                                    "text-[10px] uppercase font-bold py-0",
                                    app.status === 'accepted' ? 'text-emerald-500 border-emerald-200 bg-emerald-50' :
                                    app.status === 'rejected' ? 'text-rose-500 border-rose-200 bg-rose-50' : 'text-slate-400'
                                  )}
                                >
                                  {app.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </DialogTrigger>
                        
                        <DialogContent className="max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[92vh] md:h-[85vh] overflow-hidden p-0 border-none rounded-[2.5rem] shadow-2xl flex flex-col">
                          <div className="relative shrink-0">
                            <div className="h-32 md:h-48 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 w-full" />
                            <div className="absolute -bottom-10 md:-bottom-12 left-6 md:left-10 right-6 md:right-10 flex items-end justify-between">
                              <div className="flex items-end gap-4 md:gap-6">
                                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-[4px] md:border-[6px] border-white shadow-xl shrink-0">
                                  <AvatarImage src={user?.profilePic} className="object-cover" />
                                  <AvatarFallback className="text-2xl md:text-4xl font-black bg-slate-100">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="mb-2 md:mb-4 space-y-2 md:space-y-4 min-w-0">
                                  <h2 className="text-2xl md:text-4xl font-black text-white drop-shadow-md truncate">{fullName}</h2>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge className="bg-primary/20 text-white border-none backdrop-blur-md text-[10px] md:text-xs">
                                      Candidate Status: {app.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 overflow-y-auto mt-12 md:mt-16 px-6 md:px-10 pb-10 custom-scrollbar">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
                              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                                <section className="space-y-3">
                                  <h3 className="font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" /> Professional Summary
                                  </h3>
                                  <p className="text-slate-600 leading-relaxed text-sm md:text-lg italic bg-slate-50/50 p-6 rounded-2xl border-l-4 border-primary">
                                    "{user?.description || "No professional bio provided."}"
                                  </p>
                                </section>

                                <section className="space-y-5">
                                  <h3 className="font-bold text-slate-900 text-lg md:text-xl flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-primary" /> Experience
                                  </h3>
                                  <div className="space-y-4">
                                    {user?.experience?.map((exp, i) => (
                                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                                        <h4 className="font-black text-slate-800 text-base uppercase">{exp.role}</h4>
                                        <p className="text-primary font-bold text-sm">{exp.company}</p>
                                        <p className="text-slate-500 text-sm mt-2">{exp.desc}</p>
                                      </div>
                                    ))}
                                  </div>
                                </section>
                              </div>

                              <div className="lg:col-span-5 xl:col-span-4">
                                <div className="lg:sticky lg:top-6 bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6 shadow-2xl">
                                  <div className="text-center space-y-2">
                                    <h4 className="font-bold text-xl">Decision Center</h4>
                                    <p className="text-slate-400 text-sm">Update hiring stage</p>
                                  </div>

                                  <div className="space-y-3">
\                                    <Button 
                                      onClick={() => updateApplicationStatus(app._id, 'reviewed')}
                                      disabled={app.status === 'reviewed' || app.status === 'accepted' || app.status === 'rejected'}
                                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold py-7"
                                    >
                                      {app.status === 'reviewed' ? 'Reviewed' : 'Mark as Reviewed'}
                                    </Button>

                                    <div className="grid grid-cols-2 gap-3">
                                      <Button 
                                        onClick={() => updateApplicationStatus(app._id, 'accepted')}
                                        disabled={app.status === 'accepted'}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-7 font-bold"
                                      >
                                        Accept
                                      </Button>
                                      <Button 
                                        onClick={() => updateApplicationStatus(app._id, 'rejected')}
                                        disabled={app.status === 'rejected'}
                                        variant="ghost" 
                                        className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 py-7 font-bold"
                                      >
                                        Reject
                                      </Button>
                                    </div>

                                    {hasResume && (
                                      <Button variant="outline" asChild className="w-full border-slate-700 bg-transparent text-white hover:bg-slate-800 rounded-xl py-7 mt-4">
                                        <a href={user.resume} target="_blank" rel="noopener noreferrer">
                                          <Download className="w-4 h-4 mr-2" /> View Full Resume
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateApplicationStatus(app._id, 'rejected')}
                            className="rounded-full text-rose-500 hover:bg-rose-50 h-10 w-10"
                          >
                            <XCircle className="w-6 h-6" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => updateApplicationStatus(app._id, 'accepted')}
                            className="rounded-full text-emerald-500 hover:bg-emerald-50 h-10 w-10"
                          >
                            <CheckCircle className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="py-32 text-center text-slate-400">No applicants yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployerJobs