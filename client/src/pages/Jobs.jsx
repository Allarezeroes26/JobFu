import React, { useEffect, useState, useMemo } from 'react'
import { jobStore } from '@/stores/jobStores'
import { 
  Search, MapPin, Briefcase, DollarSign, Filter, 
  ChevronRight, Loader2, Calendar, X
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
  
  // --- Filter States ---
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState([])
  const [salaryRange, setSalaryRange] = useState({ min: "", max: "" })

  useEffect(() => {
    getAllJobs()
  }, [])

  // --- Filtering Logic ---
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           job.employer?.companyName?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      
      const matchesType = selectedTypes.length === 0 || 
                          selectedTypes.includes(job.jobType.toLowerCase());

      const jobMinSalary = job.salary?.min || 0;
      const jobMaxSalary = job.salary?.max || Infinity;
      const matchesSalary = (!salaryRange.min || jobMaxSalary >= Number(salaryRange.min)) &&
                           (!salaryRange.max || jobMinSalary <= Number(salaryRange.max));

      return matchesSearch && matchesLocation && matchesType && matchesSalary;
    })
  }, [jobs, searchQuery, locationQuery, selectedTypes, salaryRange]);

  // --- Handlers ---
  const handleTypeChange = (type) => {
    const lowerType = type.toLowerCase();
    setSelectedTypes(prev => 
      prev.includes(lowerType) 
        ? prev.filter(t => t !== lowerType) 
        : [...prev, lowerType]
    );
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationQuery("")
    setSelectedTypes([])
    setSalaryRange({ min: "", max: "" })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Search Hero Section */}
      <div className="bg-background border-b py-12 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Find your dream job</h1>
          <p className="text-muted-foreground text-lg">Browse through opportunities from top-tier companies.</p>
          
          <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto bg-card p-2 rounded-2xl shadow-xl border">
            <div className="flex-[1.5] relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title or company..." 
                className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Separator orientation="vertical" className="hidden md:block h-10 my-auto" />
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Location..." 
                className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
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
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs text-muted-foreground hover:text-primary">
                  Reset All
                </Button>
              </div>

              <div className="space-y-8 bg-card p-6 rounded-xl border shadow-sm">
                {/* Job Type Filter */}
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Job Type</Label>
                  <div className="grid gap-3">
                    {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox 
                          id={type} 
                          checked={selectedTypes.includes(type.toLowerCase())}
                          onCheckedChange={() => handleTypeChange(type)}
                        />
                        <Label htmlFor={type} className="text-sm font-medium cursor-pointer">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Salary Range Filter */}
                <div className="space-y-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Salary Range ($)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground ml-1">Min</span>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="h-9" 
                        value={salaryRange.min}
                        onChange={(e) => setSalaryRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground ml-1">Max</span>
                      <Input 
                        type="number" 
                        placeholder="Any" 
                        className="h-9" 
                        value={salaryRange.max}
                        onChange={(e) => setSalaryRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Jobs Feed */}
          <main className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-6 bg-card p-4 rounded-xl border shadow-sm">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">{filteredJobs.length}</span> results
              </p>
              
              {/* Active Filter Badges */}
              <div className="flex gap-2">
                {selectedTypes.map(type => (
                  <Badge key={type} variant="secondary" className="capitalize flex items-center gap-1 py-1">
                    {type}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleTypeChange(type)} />
                  </Badge>
                ))}
              </div>
            </div>

            {gettingAllJob ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground font-medium text-lg">Loading opportunities...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Link to={`/job/${job._id}`} key={job._id} className="block">
                    <Card className="hover:border-primary/40 hover:shadow-md transition-all duration-300 border-muted-foreground/10 overflow-hidden group">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                          <div className="flex gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center shrink-0 border group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                              <Briefcase className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                            </div>
                            
                            <div className="space-y-1">
                              <h2 className="text-xl font-bold group-hover:text-primary transition-colors text-slate-900">
                                {job.title}
                              </h2>
                              <div className="flex items-center gap-2 text-muted-foreground font-medium">
                                <span className="text-slate-700">
                                  {job.employer?.companyName || job.company?.name || job.companyName || "Company Name Unavailable"}
                                </span>
                                <span className="text-muted-foreground/30">•</span>
                                <span className="flex items-center gap-1 text-sm">
                                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                                </span>
                              </div>
                              
                              <div className="flex flex-wrap gap-2 pt-3">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none capitalize px-3">
                                  {job.jobType}
                                </Badge>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none px-3 font-semibold">
                                  <DollarSign className="w-3 h-3 mr-0.5" />
                                  {job.salary?.min.toLocaleString()} - {job.salary?.max.toLocaleString()}
                                </Badge>
                                <Badge variant="outline" className="text-slate-500 border-slate-200 capitalize">
                                  {job.category || "General"}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col justify-between items-center md:items-end border-t md:border-none pt-4 md:pt-0">
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </p>
                            <Button className="rounded-xl px-6 group-hover:bg-primary">
                              View details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
                
                {filteredJobs.length === 0 && (
                  <div className="text-center py-24 bg-card border-2 border-dashed rounded-3xl">
                    <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No jobs match your criteria</h3>
                    <p className="text-muted-foreground mt-2">Try removing some filters or searching for different keywords.</p>
                    <Button variant="link" onClick={clearFilters} className="mt-4">
                      Clear all filters
                    </Button>
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