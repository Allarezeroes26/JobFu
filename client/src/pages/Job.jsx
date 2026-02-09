import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { jobStore } from '@/stores/jobStores'
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  ChevronLeft, 
  Building2, 
  Share2, 
  CheckCircle2,
  Loader2,
  ArrowRight
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const Job = () => {
  const { id } = useParams()
  const { currentJob, singleJob, loadingSingleJob } = jobStore()

  useEffect(() => {
    if (id) singleJob(id)
  }, [id, singleJob])

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
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      Posted on {new Date(currentJob.createdAt).toLocaleDateString()}
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

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Requirements</h3>
                  <div className="grid gap-3">
                    {currentJob.requirements?.map((req, index) => (
                      <div key={index} className="flex items-start gap-3 text-muted-foreground">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg sticky top-24">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Salary Range</span>
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                      Open
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold tracking-tight">
                      ${currentJob.salary?.min.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground font-medium">-</span>
                    <span className="text-3xl font-bold tracking-tight">
                      ${currentJob.salary?.max.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground italic">Estimates based on market data</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><Briefcase className="w-4 h-4" /> Job Type</span>
                    <span className="font-bold capitalize">{currentJob.jobType}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Work Location</span>
                    <span className="font-bold">{currentJob.location}</span>
                  </div>
                </div>

                <Button className="w-full h-12 text-lg font-bold gap-2 group shadow-lg">
                  Apply Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By clicking apply, you agree to our Terms of Service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-primary/5 border-primary/10">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-bold text-sm uppercase tracking-widest text-primary">About the Employer</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Join our mission to innovate. This company is a verified employer on JobFu.
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