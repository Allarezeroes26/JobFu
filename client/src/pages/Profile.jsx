import React, { useState, useRef } from 'react'
import { userAuth } from '../stores/userStores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogClose, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, MapPin, Briefcase, GraduationCap, 
  FileText, Pencil, ExternalLink, Loader2, Camera 
} from 'lucide-react'

const Profile = () => {
  const { authUser, isChecking, update } = userAuth()
  const fileInputRef = useRef()
  const [previewPic, setPreviewPic] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPreviewPic(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    const formElement = e.target
    const formData = new FormData()

    formData.append("firstName", formElement.firstName.value)
    formData.append("lastName", formElement.lastName.value)
    formData.append("education", formElement.education.value)
    formData.append("description", formElement.description.value)
    formData.append("skills", formElement.skills.value.split(',').map(s => s.trim()).join(','))

    // Add profile picture file if selected
    const profilePicFile = fileInputRef.current.files[0]
    if (profilePicFile) formData.append("profilePic", profilePicFile)

    // Add resume file if selected
    const resumeFile = formElement.resume.files[0]
    if (resumeFile) formData.append("resume", resumeFile)

    try {
      await update(formData)
    } finally {
      setIsUpdating(false)
    }
  }
  
  if (isChecking || !authUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const initials = `${authUser?.firstName?.[0] || ""}${authUser?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="space-y-6">
          <Card className="text-center overflow-hidden">
            <div className="h-24 bg-primary/10 w-full" />
            <CardContent className="pt-0 -mt-12">
              <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-sm">
                <AvatarImage src={authUser?.profilePic} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{authUser?.firstName} {authUser?.lastName}</h2>
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {authUser?.address || "Location not set"}
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full mt-6 gap-2">
                    <Pencil className="h-4 w-4" /> Edit Profile
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader className="p-6 pb-0">
                      <DialogTitle className="text-2xl font-bold">Edit Profile</DialogTitle>
                      <DialogDescription>Update your professional persona for Job Fu recruiters.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="p-6 space-y-6">
                      <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl py-6 border-2 border-dashed">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                          <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
                            <AvatarImage src={previewPic || authUser?.profilePic} />
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                        <p className="text-sm font-medium mt-3">Profile Picture</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" name="firstName" defaultValue={authUser.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" name="lastName" defaultValue={authUser.lastName} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="education">Education</Label>
                          <Input id="education" name="education" defaultValue={authUser.education} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Professional Summary</Label>
                          <Textarea id="description" name="description" defaultValue={authUser.description} className="min-h-[100px]" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="skills">Skills (Comma separated)</Label>
                          <Input id="skills" name="skills" defaultValue={authUser.skills?.join(', ')} />
                        </div>
                        
                        <div className="space-y-2 md:col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <Label htmlFor="resume" className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" /> 
                            Update Resume (PDF preferred) *10mb limit
                          </Label>
                          <Input 
                            id="resume" 
                            name="resume" 
                            type='file' 
                            accept=".pdf,.doc,.docx"
                            className="bg-background cursor-pointer" 
                          />
                          {authUser.resume && (
                            <p className="text-[10px] text-muted-foreground mt-1 italic">
                              Current: {authUser.resumeName || "Resume uploaded"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <DialogFooter className="bg-slate-50 p-4 rounded-b-lg gap-2 mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          {/* CONTACT INFO CARD */}
          <Card>
            <CardHeader><CardTitle className="text-sm font-semibold uppercase text-muted-foreground">Contact Info</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm"><Mail className="h-4 w-4 text-primary" /> <span>{authUser?.email}</span></div>
              <div className="flex items-center gap-3 text-sm"><Briefcase className="h-4 w-4 text-primary" /> <span>Open to Work</span></div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
            <CardContent><p className="text-muted-foreground leading-relaxed">{authUser?.description || "No bio yet."}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Skills & Expertise</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {authUser?.skills?.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <GraduationCap className="h-5 w-5 text-primary" /><CardTitle className="text-lg">Education</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm font-medium">{authUser?.education || "Not specified"}</p></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /><CardTitle className="text-lg">Resume</CardTitle>
              </CardHeader>
              <CardContent>
                {authUser?.resume ? (
                  <Button variant="link" className="p-0 h-auto font-bold text-primary" asChild>
                    <a href={authUser.resume} target="_blank" rel="noreferrer">
                      View Current Resume <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No CV uploaded yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile