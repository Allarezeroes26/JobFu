import React, { useEffect, useState } from 'react'
import { Search, MapPin, Building2, Clock, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Photo from '../assets/jud.jpg'
import { jobStore } from '../stores/jobStores'
import { Link, useNavigate } from 'react-router-dom'

const Homepage = () => {
  const { jobs, getAllJobs, gettingAllJob } = jobStore()
  const navigate = useNavigate()
  
  const [searchTitle, setSearchTitle] = useState("")
  const [searchLocation, setSearchLocation] = useState("")

  useEffect(() => {
    getAllJobs()
  }, [])

  const handleSearch = () => {
    navigate('/jobs')
  }

  const featuredJobs = jobs.slice(0, 4)

  return (
    <div className="min-h-screen">
      <section className="px-6 py-15 md:py-24 md:px-20 border-b bg-slate-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
              EASY WAY TO GET YOUR <span className="text-primary">DREAM JOB</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[500px]">
              Explore thousands of job opportunities with <span className='font-bold'>JobFu</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 p-2 border rounded-xl bg-card shadow-xl mt-8">
              <div className="flex items-center flex-1 px-3 gap-2 border-b sm:border-b-0 sm:border-r">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Job title or keyword" 
                  className="border-0 focus-visible:ring-0 shadow-none" 
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
              <div className="flex items-center flex-1 px-3 gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <Input 
                  placeholder="Location" 
                  className="border-0 focus-visible:ring-0 shadow-none" 
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                />
              </div>
              <Button size="lg" className="rounded-lg px-8" onClick={handleSearch}>Search</Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center relative">
            <div className="w-full max-w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-background rotate-2 relative z-10">
              <img src={Photo} className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" alt="Professional" />
            </div>
            <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
            <p className="text-muted-foreground">Hand-picked opportunities for you</p>
          </div>
          <Link to="/jobs">
            <Button variant="ghost" className="text-primary mt-4 md:mt-0 font-bold hover:text-primary hover:bg-primary/5">
              View all jobs
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {gettingAllJob ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary w-8 h-8" /></div>
          ) : (
            featuredJobs.map((job) => (
              <Card key={job._id} className="hover:shadow-md transition-all cursor-pointer border-l-4 hover:border-l-primary group">
                <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                      {job.employer?.profilePic ? (
                        <img src={job.employer.profilePic} alt="logo" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-none mb-1 group-hover:text-primary transition-colors">{job.title}</h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-1">
                        <span className="font-medium text-slate-700">{job.employer?.companyName || "Verified Employer"}</span> 
                        • {job.location}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary" className="font-normal capitalize">{job.jobType}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-0 pt-4 md:pt-0">
                    <div className="text-right">
                      <p className="font-bold text-primary">
                        ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground text-right">per year</p>
                    </div>
                    <Link to={`/job/${job._id}`}>
                        <Button variant="outline">Details</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Homepage