import React, { useEffect, useState } from 'react'
import { employeeStore } from '../stores/employerStores'
import { jobStore } from '../stores/jobStores'
import { 
  Search, MapPin, Building2, Users, Star, ArrowRight, Loader2 
} from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Link } from 'react-router-dom'

const Companies = () => {
  const { employers, getAllEmployers, checkingEmployer } = employeeStore()
  const { jobs, getAllJobs } = jobStore()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    getAllEmployers()
    if (jobs.length === 0) getAllJobs()
  }, [])

  const filteredCompanies = employers.filter(company => 
    company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  ).map(company => {
    const activeJobs = jobs.filter(j => 
      (typeof j.employer === 'string' ? j.employer : j.employer?._id) === company._id
    ).length;
    return { ...company, activeJobs };
  });

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <Badge className="px-4 py-1 border-primary/30 text-primary bg-primary/5" variant="outline">
            Company Directory
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Find your next workplace
          </h1>
          <div className="relative max-w-2xl mx-auto mt-8">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search by company name..." 
              className="pl-12 h-12 text-lg rounded-2xl shadow-lg border-none ring-1 ring-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 mt-12">
        {checkingEmployer ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company._id} className="hover:shadow-xl transition-all border-muted-foreground/10 group overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center">
                      {company.profilePic ? (
                        <img src={company.profilePic} alt={company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-8 h-8 text-slate-400" />
                      )}
                    </div>
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                      {company.activeJobs} Jobs Open
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">{company.companyName}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{company.industry || 'General Industry'}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" /> {company.location || 'Remote / Global'}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                      {company.description || 'No description provided by the employer.'}
                    </p>
                  </div>
                </CardContent>

                <Separator />
                
                <CardFooter className="p-0">
                  <Link to={`/company/${company._id}`} className="w-full">
                    <Button variant="ghost" className="w-full h-14 rounded-none hover:bg-primary hover:text-white group">
                      View Company Profile 
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!checkingEmployer && filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No companies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Companies