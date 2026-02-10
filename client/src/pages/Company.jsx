import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Building2, MapPin, Globe, Users, 
  Briefcase, Mail, ArrowLeft, ExternalLink,
  Clock, DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { jobStore } from '../stores/jobStores'
import { employeeStore } from '../stores/employerStores'

const Company = () => {
  const { id } = useParams()
  const { jobs, getAllJobs } = jobStore()
  const { employers, getAllEmployers } = employeeStore()

  useEffect(() => {
    getAllJobs()
    getAllEmployers()
  }, [])

  const company = employers.find(emp => emp._id === id)
  
  const companyJobs = jobs.filter(job => job.employer?._id === id || job.employer === id)

  if (!company) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
          <p className="mt-4 text-lg font-medium">Loading company profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="h-48 md:h-64 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="container mx-auto px-4 h-full relative">
          <Link to="/jobs">
            <Button variant="ghost" className="text-white mt-6 hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-white p-6 flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-2xl mt-5 bg-white border-4 border-white shadow-lg -mt-20 overflow-hidden flex items-center justify-center">
                    {company.profilePic ? (
                      <img src={company.profilePic} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-16 h-16 text-slate-300" />
                    )}
                  </div>
                  <h1 className="mt-4 text-2xl font-bold text-slate-900">{company.companyName}</h1>
                  <Badge variant="secondary" className="mt-1">{company.industry}</Badge>
                  
                  <div className="grid grid-cols-2 w-full gap-4 mt-8">
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <p className="text-xl font-bold text-primary">{companyJobs.length}</p>
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground">Open Roles</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-slate-50">
                      <p className="text-xl font-bold text-primary">4.8</p>
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground">Rating</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4 border-t">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-slate-600">{company.location || "Global / Remote"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-slate-600">contact@{company.companyName.toLowerCase().replace(/\s/g, '')}.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-primary" />
                    <a href="#" className="text-blue-600 hover:underline flex items-center gap-1">
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-lg">Want to work here?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90 leading-relaxed">
                  Follow {company.companyName} to get notified whenever they post new opportunities.
                </p>
                <Button variant="secondary" className="w-full mt-4 font-bold">Follow Company</Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {company.description || "This company has not provided a detailed description yet."}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  Open Opportunities
                </h2>
                <span className="text-sm text-muted-foreground">{companyJobs.length} Jobs Found</span>
              </div>

              <div className="grid gap-4">
                {companyJobs.length > 0 ? companyJobs.map((job) => (
                  <Link key={job._id} to={`/job/${job._id}`}>
                    <Card className="hover:border-primary transition-all cursor-pointer group">
                      <CardContent className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                          <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.jobType}</span>
                            <span className="flex items-center gap-1 text-emerald-600 font-medium">
                              <DollarSign className="w-4 h-4" /> 
                              {job.salary?.min.toLocaleString()} - {job.salary?.max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" className="group-hover:bg-primary group-hover:text-white">View Details</Button>
                      </CardContent>
                    </Card>
                  </Link>
                )) : (
                  <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                    <p className="text-muted-foreground">No active job listings at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Company