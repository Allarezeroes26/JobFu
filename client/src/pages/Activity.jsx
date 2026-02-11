import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Loader2, Briefcase, MapPin, Calendar, 
  ArrowRight, CheckCircle2, Clock, Eye, 
  XCircle, Search 
} from 'lucide-react'
import { applicationStore } from '@/stores/applicationStores'
import { cn } from "@/lib/utils"

const Activity = () => {
  const { userApplicationData, fetchApplication, loadingApplications } = applicationStore()

  useEffect(() => {
    if (fetchApplication) fetchApplication()
  }, [])

  const steps = ["applied", "seen", "reviewed", "accepted"]
  
  const getStepStatus = (currentStatus, stepName) => {
    if (currentStatus === "rejected") return "rejected"
    
    const statusIdx = steps.indexOf(currentStatus)
    const stepIdx = steps.indexOf(stepName)
    
    if (statusIdx >= stepIdx) return "completed"
    return "pending"
  }

  const getProgressWidth = (status) => {
    if (status === "rejected") return "0%"
    switch (status) {
      case "applied": return "0%"
      case "seen": return "33.33%"
      case "reviewed": return "66.66%"
      case "accepted": return "100%"
      default: return "0%"
    }
  }

  if (loadingApplications) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Fetching your applications...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Your Activity</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Track the real-time status of your job applications.
        </p>
      </div>

      {!userApplicationData?.length ? (
        <Card className="border-dashed border-2 py-20 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center gap-6">
            <div className="bg-white p-6 rounded-full shadow-sm">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <p className="font-bold text-2xl text-slate-800">No applications found</p>
              <p className="text-slate-500 max-w-xs mx-auto">
                You haven't applied to any jobs yet. Your journey starts with a single click!
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/jobs">Browse Available Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-8">
          {userApplicationData.map((app) => {
            const isRejected = app.status === "rejected"
            const currentSteps = isRejected ? ["applied", "rejected"] : steps

            return (
              <Card key={app._id} className="group border-none shadow-xl shadow-slate-200/60 rounded-[2rem] overflow-hidden transition-all hover:translate-y-[-2px]">
                <CardContent className="p-0">
                  <div className="p-8 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2">
                        <h3 className="font-black text-2xl text-slate-900 group-hover:text-primary transition-colors">
                          {app.job?.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm font-medium text-slate-500">
                          <span className="text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
                            {app.job?.employer?.companyName}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-slate-400" /> {app.job?.location}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-slate-400" /> 
                            Applied {new Date(app.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-start md:self-center">
                        <Badge 
                          className={cn(
                            "capitalize px-4 py-1.5 rounded-full text-xs font-bold border-none shadow-sm",
                            app.status === 'accepted' ? 'bg-emerald-500 text-white' : 
                            isRejected ? 'bg-rose-500 text-white' : 'bg-slate-800 text-white'
                          )}
                        >
                          {app.status || 'Pending'}
                        </Badge>
                        <Button variant="outline" size="sm" asChild className="rounded-full border-slate-200 hover:bg-slate-50">
                          <Link to={`/job/${app.job?._id}`}>
                            Job Details <ArrowRight className="ml-2 w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="px-8 pb-10 pt-6 bg-slate-50/50 border-t border-slate-100/80">
                    <div className="relative flex justify-between w-full max-w-3xl mx-auto">
                      <div className="absolute top-5 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 rounded-full" />
                      
                      {!isRejected && (
                        <div 
                          className="absolute top-5 left-0 h-1 bg-primary -translate-y-1/2 transition-all duration-1000 ease-in-out rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" 
                          style={{ width: getProgressWidth(app.status) }}
                        />
                      )}

                      {currentSteps.map((step) => {
                        const status = getStepStatus(app.status, step)
                        const isStepRejected = step === "rejected"
                        
                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500",
                              status === "completed" 
                                ? "border-white bg-primary text-white scale-110 shadow-lg" 
                                : isStepRejected 
                                  ? "border-white bg-rose-500 text-white scale-110 shadow-lg" 
                                  : "border-slate-50 bg-slate-200 text-slate-500"
                            )}>
                              {status === "completed" ? (
                                <CheckCircle2 className="w-5 h-5 stroke-[3px]" />
                              ) : isStepRejected ? (
                                <XCircle className="w-5 h-5 stroke-[3px]" />
                              ) : step === "applied" ? (
                                <Clock className="w-5 h-5" />
                              ) : step === "seen" ? (
                                <Eye className="w-5 h-5" />
                              ) : (
                                <Search className="w-5 h-5" />
                              )}
                            </div>
                            <span className={cn(
                              "text-[11px] font-black uppercase tracking-tighter transition-colors duration-500",
                              status === "completed" ? "text-primary" : 
                              isStepRejected ? "text-rose-500" : "text-slate-400"
                            )}>
                              {step}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Activity