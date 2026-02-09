import React, { useEffect, useState } from 'react'
import { jobStore } from '@/stores/jobStores'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter, 
  ChevronRight, 
  Loader2,
  Calendar
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom'

const Jobs = () => {
  const { jobs, getAllJobs, gettingAllJob } = jobStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getAllJobs()
  }, [getAllJobs])

  // Simple client-side search filter
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Hero Section */}
      <div className="bg-background border-b py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Find your dream job</h1>
          <p className="text-muted-foreground text-lg">Browse through thousands of opportunities from top-tier companies.</p>
          
          <div className="flex flex-col md:flex-row gap-3 max-w-3xl mx-auto bg-card p-2 rounded-2xl shadow-xl border">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title, keywords..." 
                className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-10" />
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Location..." 
                className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
              />
            </div>
            <Button size="lg" className="px-8 rounded-xl font-semibold">Search</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              <div className="space-y-6">
                {/* Job Type Filter */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Job Type</Label>
                  {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <Label htmlFor={type} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Salary Range Filter */}
                <div className="space-y-3">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Salary Range</Label>
                  <div className="grid gap-2">
                    <Input type="number" placeholder="Min" className="h-8" />
                    <Input type="number" placeholder="Max" className="h-8" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs Feed */}
          <main className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredJobs.length}</span> results
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Sort by:</span>
                <select className="bg-transparent font-bold outline-none">
                  <option>Newest</option>
                  <option>Salary</option>
                </select>
              </div>
            </div>

            {gettingAllJob ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium">Fetching opportunities...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link to={`/job/${job._id}`} key={job._id} className="block group">
                    <Card className="hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                          <div className="flex gap-4">
                            {/* Company Logo Placeholder */}
                            <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0 border group-hover:bg-primary/5 transition-colors">
                              <Briefcase className="w-7 h-7 text-muted-foreground group-hover:text-primary" />
                            </div>
                            
                            <div className="space-y-1">
                              <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                                {job.title}
                              </h2>
                              <p className="text-muted-foreground font-medium flex items-center gap-1.5">
                                {job.employer?.companyName || "Company Name"} 
                                <span className="text-xs text-muted-foreground/50">•</span>
                                <span className="text-sm">{job.location}</span>
                              </p>
                              
                              <div className="flex flex-wrap gap-2 pt-2">
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 capitalize">
                                  {job.jobType}
                                </Badge>
                                <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-50">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {job.salary?.min.toLocaleString()} - {job.salary?.max.toLocaleString()}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {job.category}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between items-end gap-4">
                            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                            <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                              View Details <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                
                {filteredJobs.length === 0 && (
                  <div className="text-center py-20 border-2 border-dashed rounded-3xl">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search filters or keywords.</p>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default Jobs