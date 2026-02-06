import React from 'react'
import { Search, Briefcase, MapPin, TrendingUp, Building2, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Photo from '../assets/jud.jpg'


const Homepage = () => {
  const categories = [
    { name: "Design", open: "120+ Jobs" },
    { name: "Marketing", open: "85+ Jobs" },
    { name: "Education", open: "40+ Jobs" },
    { name: "Finance", open: "60+ Jobs" },
    { name: "Technology", open: "210+ Jobs" },
    { name: "Health", open: "95+ Jobs" }
  ]

  const featuredJobs = [
    {
      title: "Senior Frontend Engineer",
      company: "TechFlow",
      location: "Remote",
      salary: "$120k - $160k",
      type: "Full-time",
      posted: "2h ago"
    },
    {
      title: "Product Designer",
      company: "CreativeCo",
      location: "New York, NY",
      salary: "$90k - $130k",
      type: "Contract",
      posted: "5h ago"
    },
    {
      title: "Backend Developer",
      company: "DataSync",
      location: "Hybrid",
      salary: "$110k - $150k",
      type: "Full-time",
      posted: "1d ago"
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="px-6 py-15 md:py-24 md:px-20 border-b bg-slate-100">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-tight">
              EASY WAY TO GET YOUR <span className="text-primary">DREAM JOB</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[500px]">
              Explore thousands of job opportunities with <span className='font-bold'>JobFu</span>. It's your future. Let's find it together.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 p-2 border rounded-xl bg-card shadow-xl mt-8">
              <div className="flex items-center flex-1 px-3 gap-2 border-b sm:border-b-0 sm:border-r">
                <Search className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Job title or keyword" className="border-0 focus-visible:ring-0 shadow-none" />
              </div>
              <div className="flex items-center flex-1 px-3 gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <Input placeholder="Location" className="border-0 focus-visible:ring-0 shadow-none" />
              </div>
              <Button size="lg" className="rounded-lg px-8">Search</Button>
            </div>
          </div>

          <div className="hidden md:flex justify-center">
            <div className="w-full max-w-[450px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-background rotate-2">
              <img 
                src={Photo} 
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500" 
                alt="Professional"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-20 py-20 container mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 md:mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Jobs</h2>
            <p className="text-muted-foreground">Hand-picked opportunities for you</p>
          </div>
          <Button variant="ghost" className="text-primary mt-4 md:mt-0 font-bold hover:text-primary hover:bg-primary/5">
            View all jobs
          </Button>
        </div>

        <div className="grid gap-4">
          {featuredJobs.map((job, i) => (
            <Card key={i} className="hover:shadow-md transition-all cursor-pointer border-l-4 hover:border-l-primary">
              <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-none mb-1">{job.title}</h3>
                    <p className="text-muted-foreground text-sm flex items-center gap-1">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary" className="font-normal">{job.type}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {job.posted}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t md:border-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="font-bold text-primary">{job.salary}</p>
                    <p className="text-xs text-muted-foreground text-right">per year</p>
                  </div>
                  <Button variant="outline">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="px-6 py-20 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Browse by Category</h2>
            <p className="text-muted-foreground mt-2">Explore roles by your field of expertise</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Card key={cat.name} className="hover:bg-card hover:border-primary transition-all cursor-pointer group">
                <CardHeader className="p-4 text-center">
                  <CardTitle className="text-base group-hover:text-primary">{cat.name}</CardTitle>
                  <CardDescription className="text-xs">{cat.open}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 container mx-auto">
        <Card className="bg-primary text-primary-foreground overflow-hidden relative">
          <CardContent className="p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="text-center md:text-left space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Post a job today</h2>
              <p className="text-primary-foreground/80 text-lg max-w-[500px]">
                Connect with the best talent in the industry. Start building your dream team now.
              </p>
            </div>
            <Button size="lg" variant="secondary" className="px-10 h-14 text-lg font-bold">
              Post a Job for Free
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Homepage