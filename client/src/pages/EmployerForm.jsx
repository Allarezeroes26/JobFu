import React, { useRef, useState } from 'react'
import EmployeeBG from '../assets/employeeFormBG.jpg'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Globe, MapPin, Briefcase, Camera } from "lucide-react"
import { employeeStore } from '@/stores/employerStores'

const EmployerForm = () => {
  const { createEmployer, creatingEmployer } = employeeStore()

  const fileInputRef = useRef()
  const [previewPic, setPreviewPic] = useState(null)

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setPreviewPic(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData()

    formData.append("companyName", form.companyName.value)
    formData.append("industry", form.industry.value)
    formData.append("location", form.location.value)
    formData.append("website", form.website.value)
    formData.append("description", form.description.value)

    const profilePicFile = fileInputRef.current.files[0]
    if (profilePicFile) {
      formData.append("profilePic", profilePicFile)
    }

    await createEmployer(formData)
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      
      {/* LEFT */}
      <div className="hidden lg:flex relative bg-primary items-center justify-center p-12 overflow-hidden">
        <img
          src={EmployeeBG}
          alt="Branding"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-primary-foreground max-w-md">
          <h2 className="text-4xl font-bold mb-6">Build your hiring presence.</h2>
          <p className="text-lg opacity-90 mb-8">
            Tell candidates about your company culture and mission.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span>Post unlimited jobs</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <span>Reach global talent</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
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

              {/* LOGO */}
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-24 h-24 rounded-2xl bg-muted border-2 border-dashed flex items-center justify-center relative overflow-hidden cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  {previewPic ? (
                    <img src={previewPic} className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
                <Label className="text-xs text-muted-foreground">
                  Upload Company Logo
                </Label>
              </div>

              {/* COMPANY NAME */}
              <div className="grid gap-2">
                <Label htmlFor="companyName">Company Name</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="e.g. Acme Corp"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* INDUSTRY + LOCATION */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" placeholder="Technology" />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Headquarters</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="location"
                      name="location"
                      placeholder="San Francisco"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* WEBSITE */}
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    placeholder="https://company.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="grid gap-2">
                <Label htmlFor="description">About the Company</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your company culture and mission..."
                  className="min-h-[120px]"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg font-semibold"
                disabled={creatingEmployer}
              >
                {creatingEmployer ? "Creating..." : "Complete Setup"}
              </Button>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployerForm