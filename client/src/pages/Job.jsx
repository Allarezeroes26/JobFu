import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobStore } from '@/stores/jobStores'
import { 
  MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, 
  Building2, Share2, CheckCircle2, Loader2, ArrowRight, AlertCircle, Lock
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { applicationStore } from '@/stores/applicationStores'
import { userAuth } from '@/stores/userStores'

const Job = () => {
  const { id } = useParams()
  
  const { authUser } = userAuth() 
  
  const { currentJob, singleJob, loadingSingleJob } = jobStore()
  const { applyJob, applyingJob } = applicationStore() 

  useEffect(() => {
    if (id) singleJob(id)
  }, [id, singleJob])
  const isAuthenticated = !!authUser;
  
  const isOwnListing = authUser?.role === 'employer' && authUser?._id === currentJob?.employer?._id;
  
  const hasAlreadyApplied = currentJob?.applications?.some(appId => {
    const idToCompare = appId?._id || appId;  
    return authUser?.appliedJobs?.some(userAppId => {
      const userAppStr = userAppId?._id || userAppId;
      return userAppStr?.toString() === idToCompare?.toString();
    });
  });
  const isEmployer = authUser?.role === 'employer';

  if (loadingSingleJob) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Loading job details...</p>
      </div>
    )
  }

  if (!currentJob) return <div className="text-center py-20">Job not found.</div>

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b">
        <div className="container mx-auto max-w-5xl py-4 px-4">
          <Link to="/jobs" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
            <ChevronLeft className="w-4 h-4" /> Back to all jobs
          </Link>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-8 space-y-6">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10 capitalize">
                      {currentJob.category}
                    </Badge>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{currentJob.title}</h1>
                  
                  <div className="flex flex-wrap gap-y-2 gap-x-6 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4" />
                      <span className="font-semibold text-foreground">{currentJob.employer?.companyName || "Unknown Company"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {currentJob.location}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="prose prose-slate max-w-none">
                  <h3 className="text-xl font-bold mb-4">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {currentJob.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">
                      ${currentJob.salary?.min.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-medium">-</span>
                    <span className="text-3xl font-bold tracking-tight">
                      ${currentJob.salary?.max.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  {!isAuthenticated ? (
                    <Button asChild className="w-full h-12 font-bold gap-2">
                      <Link to="/login">
                        <Lock className="w-4 h-4" /> Login to Apply
                      </Link>
                    </Button>
                  ) : isOwnListing ? (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex flex-col items-center text-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <p className="text-sm font-bold text-amber-900">Your Listing</p>
                      <p className="text-xs text-amber-700">You cannot apply to your own job post.</p>
                      <Button asChild variant="link" className="text-xs text-amber-900 h-auto p-0 underline">
                        <Link to="/employer-dashboard">Go to Dashboard</Link>
                      </Button>
                    </div>
                  ) : hasAlreadyApplied ? (
                    <Button 
                      disabled 
                      className="w-full h-12 bg-emerald-100 text-emerald-700 border border-emerald-200 disabled:opacity-100 disabled:cursor-not-allowed font-bold gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Already Applied
                    </Button>
                  ) : isEmployer ? (
                    <div className="bg-slate-100 p-4 rounded-xl text-center">
                      <p className="text-xs font-medium text-slate-500">Employer accounts cannot apply for jobs.</p>
                    </div>
                  ) : (
                    <Button
                      className="w-full h-12 text-lg font-bold gap-2 group shadow-lg"
                      onClick={() => applyJob(currentJob._id)}
                      disabled={applyingJob}
                    >
                      {applyingJob ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          Apply Now
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <p className="text-center text-xs text-muted-foreground">
                  Job posted on {new Date(currentJob.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary">Employer Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  This role is managed by {currentJob.employer?.companyName || "a verified employer"}.
                </p>
                <Button variant="link" className="p-0 h-auto text-primary font-bold">
                  View Company Profile
                </Button>
              </CardContent>
            </Card>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Job