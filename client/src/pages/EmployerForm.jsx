import React, { useState } from 'react'
import EmployeeBG from '../assets/employeeFormBG.jpg'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Globe, MapPin, Briefcase, Camera } from "lucide-react"
import { employeeStore } from '@/stores/employerStores'

const EmployerForm = () => {

    const { createEmployer } = employeeStore()

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    website: "",
    location: "",
    description: "",
    profilePic: ""
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Creating Employer Profile:", formData)
  }


  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      <div className="hidden lg:flex relative bg-primary items-center justify-center p-12 overflow-hidden">
        <img 
          src={EmployeeBG} 
          alt="Branding" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="text-4xl font-bold mb-6">Build your hiring presence.</h2>
          <p className="text-lg opacity-90 mb-8">
            Tell candidates about your company culture, mission, and why they should join your team.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg"><Briefcase className="w-5 h-5" /></div>
              <span>Post unlimited job listings</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg"><Globe className="w-5 h-5" /></div>
              <span>Global reach to top talent</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 bg-muted/20">
        <Card className="w-full max-w-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Employer Profile</CardTitle>
            <CardDescription>
              Set up your company details to start posting jobs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex flex-col items-center gap-4 mb-4">
                <div className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed flex items-center justify-center relative overflow-hidden group">
                  <Camera className="w-8 h-8 text-muted-foreground group-hover:scale-110 transition-transform" />
                  <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setFormData({...formData, profilePic: e.target.value})}
                  />
                </div>
                <Label className="text-xs text-muted-foreground">Upload Company Logo</Label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="companyName" 
                    placeholder="e.g. Acme Corp" 
                    className="pl-10"
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    placeholder="e.g. Technology" 
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Headquarters</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input 
                      id="location" 
                      placeholder="e.g. San Francisco" 
                      className="pl-10"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="website">Website URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input 
                    id="website" 
                    type="url"
                    placeholder="https://company.com" 
                    className="pl-10"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">About the Company</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your company's mission and culture..." 
                  className="min-h-[120px] resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg font-semibold">
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployerForm