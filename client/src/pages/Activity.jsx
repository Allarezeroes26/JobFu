import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Briefcase, MapPin, Calendar, ArrowRight } from 'lucide-react'
import { applicationStore } from '@/stores/applicationStores'

const Activity = () => {
  const { userApplicationData, fetchApplication, loadingApplications } = applicationStore()

  useEffect(() => {
    if (fetchApplication) fetchApplication()
  }, [])

  if (loadingApplications) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Fetching your applications...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Activity</h1>
        <p className="text-muted-foreground">Track the status of your submitted job applications.</p>
      </div>

      {!userApplicationData?.length ? (
        <Card className="border-dashed py-12">
          <CardContent className="flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-muted p-4 rounded-full">
              <Briefcase className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-lg">No applications yet</p>
              <p className="text-sm text-muted-foreground">You haven't applied to any jobs. Start your search today!</p>
            </div>
            <Button asChild className="mt-2">
              <Link to="/jobs">Browse Jobs</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {userApplicationData.map((app) => (
            <Card key={app._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-xl">{app.job?.title}</h3>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{app.job?.employer?.companyName}</span>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {app.job?.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <Badge variant={app.status === 'accepted' ? 'success' : app.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize">
                      {app.status || 'Pending'}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild className="gap-1">
                      <Link to={`/job/${app.job?._id}`}>
                        View Job <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Activity