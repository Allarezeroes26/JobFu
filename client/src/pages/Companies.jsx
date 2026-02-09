import React, { useEffect, useState, useMemo } from 'react'
import { jobStore } from '@/stores/jobStores'
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ExternalLink, 
  Building2, 
  Users, 
  Star,
  ArrowRight
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom'

const Companies = () => {
  const { jobs, getAllJobs, gettingAllJob } = jobStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getAllJobs()
  }, [])

  const companies = useMemo(() => {
    const companyMap = new Map();

    jobs.forEach(job => {
      if (job.employer && typeof job.employer === 'object') {
        const id = job.employer._id;
        if (!companyMap.has(id)) {
          companyMap.set(id, {
            ...job.employer,
            jobCount: 1,
            locations: new Set([job.location])
          });
        } else {
          const existing = companyMap.get(id);
          existing.jobCount += 1;
          existing.locations.add(job.location);
        }
      }
    });

    return Array.from(companyMap.values());
  }, [jobs]);

  const filteredCompanies = companies.filter(company => 
    company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <Badge variant="outline" className="px-4 py-1 border-primary/30 text-primary bg-primary/5">
            Directory
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Explore Top Companies
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the best places to work and find the company culture that fits your career goals.
          </p>
          
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by company name..." 
              className="pl-12 h-12 text-lg rounded-2xl shadow-lg border-muted-foreground/10 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Showing {filteredCompanies.length} Organizations
          </h2>
        </div>

        {gettingAllJob ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-64 animate-pulse bg-card/50" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company._id} className="hover:shadow-xl transition-all duration-300 border-muted-foreground/10 flex flex-col group">
                <CardContent className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none">
                      {company.jobCount} Active Jobs
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                    {company.companyName}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {Array.from(company.locations)[0]} {company.locations.size > 1 && `+${company.locations.size - 1} more`}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> 50-200 Employees
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> 4.8
                    </span>
                  </div>
                </CardContent>

                <Separator />
                
                <CardFooter className="p-4 bg-muted/20">
                  <Link to={`/company/${company._id}`} className="w-full">
                    <Button variant="ghost" className="w-full group/btn hover:bg-primary hover:text-white transition-all">
                      View Profile 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed rounded-3xl">
                <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900">No companies found</h3>
                <p className="text-muted-foreground">Try searching with a different name.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Companies