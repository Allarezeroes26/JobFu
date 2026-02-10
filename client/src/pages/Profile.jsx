import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeeStore } from '@/stores/employerStores' 
import { userAuth } from '../stores/userStores'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger, DialogClose, DialogFooter, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { 
  MapPin, Briefcase, Pencil, ExternalLink, Loader2, 
  Plus, Trash, FolderGit2, Mail, GraduationCap, Globe, AlertTriangle, Building2 
} from 'lucide-react'

const Profile = () => {
  const { authUser, isChecking, update, deleteAccount, isDeleting } = userAuth()
  const { employeeData, createEmployer, creatingEmployer, checkEmployer } = employeeStore()
  const navigate = useNavigate()
  
  const fileInputRef = useRef()
  const resumeInputRef = useRef()

  const [previewPic, setPreviewPic] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [experience, setExperience] = useState([])
  const [projects, setProjects] = useState([])
  const [skillsString, setSkillsString] = useState("")

  useEffect(() => {
    if (authUser) {
      setExperience(authUser.experience || [])
      setProjects(authUser.projects || [])
      setSkillsString(authUser.skills?.join(", ") || "")
      if(authUser.role === 'employer') checkEmployer()
    }
  }, [authUser, checkEmployer])

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPreviewPic(reader.result)
    reader.readAsDataURL(file)
  }

  // Experience Handlers
  const addExperience = () => setExperience([...experience, { company: '', role: '', duration: '', desc: '' }])
  const removeExp = (index) => setExperience(experience.filter((_, i) => i !== index))
  const updateExp = (index, field, value) => {
    const updated = [...experience]; updated[index][field] = value; setExperience(updated)
  }

  // Project Handlers
  const addProject = () => setProjects([...projects, { name: '', link: '', desc: '' }])
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index))
  const updateProject = (index, field, value) => {
    const updated = [...projects]; updated[index][field] = value; setProjects(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpdating(true)
    const formData = new FormData(e.currentTarget)
    formData.append("skills", skillsString)
    formData.append("experience", JSON.stringify(experience))    
    formData.append("projects", JSON.stringify(projects))
    
    if (fileInputRef.current?.files[0]) formData.append("profilePic", fileInputRef.current.files[0])
    if (resumeInputRef.current?.files[0]) formData.append("resume", resumeInputRef.current.files[0])

    try { await update(formData) } finally { setIsUpdating(false) }
  }

  const handleDeleteAccount = async () => {
    await deleteAccount(authUser._id)
    navigate('/login')
  }

  const handleCreateEmployer = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    await createEmployer(data)
  }

  if (isChecking || !authUser) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>

  const initials = `${authUser?.firstName?.[0] || ""}${authUser?.lastName?.[0] || ""}`.toUpperCase()

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: User Info & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="text-center overflow-hidden border-none shadow-xl rounded-[2rem]">
            <div className="h-28 bg-gradient-to-r from-primary/20 to-primary/5 w-full" />
            <CardContent className="pt-0 -mt-14 px-6 pb-8">
              <Avatar className="h-28 w-28 mx-auto border-[6px] border-background shadow-lg">
                <AvatarImage src={previewPic || authUser?.profilePic} className="object-cover" />
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">{initials}</AvatarFallback>
              </Avatar>
              
              <div className="mt-4 space-y-1">
                <h2 className="text-2xl font-black text-slate-800">{authUser?.firstName} {authUser?.lastName}</h2>
                <Badge className="bg-primary/10 text-primary border-none">{authUser?.role}</Badge>
              </div>
              
              <div className="mt-8 space-y-4 text-sm text-left border-t pt-6">
                <div className="flex items-center gap-3 text-slate-600 font-medium"><Mail className="h-4 w-4 text-primary" /> {authUser.email}</div>
                <div className="flex items-center gap-3 text-slate-600 font-medium"><MapPin className="h-4 w-4 text-primary" /> {authUser?.address || "Location not set"}</div>
                <div className="flex items-center gap-3 text-slate-600 font-medium"><GraduationCap className="h-4 w-4 text-primary" /> {authUser?.education || "Education not set"}</div>
              </div>

              <div className="mt-8 space-y-3">
                {/* EDIT PROFILE DIALOG */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full rounded-xl py-6 border-slate-200 gap-2 font-bold">
                      <Pencil className="h-4 w-4" /> Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-3xl">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader className="p-6 pb-0">
                        <DialogTitle className="text-2xl font-bold">Edit Professional Profile</DialogTitle>
                        <DialogDescription>Update your personal details, experience, and portfolio.</DialogDescription>
                      </DialogHeader>
                      <div className="p-6 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2"><Label>First Name</Label><Input name="firstName" defaultValue={authUser.firstName}/></div>
                          <div className="space-y-2"><Label>Last Name</Label><Input name="lastName" defaultValue={authUser.lastName}/></div>
                          <div className="space-y-2 md:col-span-2"><Label>Email</Label><Input name="email" defaultValue={authUser.email}/></div>
                          <div className="space-y-2 md:col-span-2"><Label>Address</Label><Input name="address" defaultValue={authUser.address}/></div>
                          <div className="space-y-2 md:col-span-2"><Label>Education</Label><Input name="education" defaultValue={authUser.education}/></div>
                          <div className="space-y-2 md:col-span-2"><Label>Bio</Label><Textarea name="description" defaultValue={authUser.description}/></div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Skills (Separated by commas)</Label>
                            <Input placeholder="React, Node.js..." value={skillsString} onChange={(e) => setSkillsString(e.target.value)} />
                          </div>
                        </div>

                        {/* Experience in Edit Dialog */}
                        <div className="space-y-4 border-t pt-6">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2"><Briefcase className="h-4 w-4"/> Experience</h3>
                            <Button type="button" variant="outline" size="sm" onClick={addExperience}><Plus className="h-4 w-4"/></Button>
                          </div>
                          {experience.map((exp, i) => (
                            <div key={i} className="p-4 bg-slate-50 rounded-lg border relative grid grid-cols-2 gap-3">
                              <Button type="button" variant="ghost" size="icon" className="absolute -top-2 -right-2 bg-white shadow-sm text-red-500 rounded-full h-8 w-8" onClick={() => removeExp(i)}><Trash className="h-4 w-4"/></Button>
                              <Input placeholder="Company" value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} />
                              <Input placeholder="Role" value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)} />
                              <Input placeholder="Duration" className="col-span-2" value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} />
                              <Textarea placeholder="Desc..." className="col-span-2" value={exp.desc} onChange={e => updateExp(i, 'desc', e.target.value)} />
                            </div>
                          ))}
                        </div>
                        {/* File Uploads */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
                           <div className="space-y-2"><Label>Profile Picture</Label><Input type="file" ref={fileInputRef} onChange={handleProfilePicChange} accept="image/*" /></div>
                           <div className="space-y-2"><Label>Resume (PDF)</Label><Input type="file" ref={resumeInputRef} accept=".pdf" /></div>
                        </div>
                      </div>
                      <DialogFooter className="p-6 bg-slate-50">
                        <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={isUpdating}>{isUpdating ? <Loader2 className="animate-spin" /> : "Save Changes"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                {/* EMPLOYER SPECIAL ACTION */}
                {authUser.role === 'employer' && !employeeData && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full rounded-xl py-6 gap-2 font-bold shadow-lg shadow-primary/20">
                        <Building2 className="h-4 w-4" /> Setup Company Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="rounded-3xl">
                      <form onSubmit={handleCreateEmployer} className="space-y-4">
                        <DialogHeader>
                          <DialogTitle>Create Employer Profile</DialogTitle>
                          <DialogDescription>Add your company details to start posting jobs.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div className="space-y-1"><Label>Company Name</Label><Input name="companyName" required /></div>
                          <div className="space-y-1"><Label>Website</Label><Input name="website" placeholder="https://..." /></div>
                          <div className="space-y-1"><Label>Description</Label><Textarea name="description" required /></div>
                        </div>
                        <DialogFooter><Button type="submit" disabled={creatingEmployer}>{creatingEmployer ? <Loader2 className="animate-spin" /> : "Create Profile"}</Button></DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>

          {/* SKILLS CARD */}
          <Card className="border-none shadow-md rounded-[2rem] p-2">
            <CardHeader><CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">Skills</CardTitle></CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {authUser.skills?.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">{skill}</Badge>
              ))}
            </CardContent>
          </Card>

          {/* DANGER ZONE */}
          <Card className="border border-red-100 bg-red-50/30 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-bold text-red-600 flex items-center gap-2">Danger Zone</CardTitle></CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 justify-start gap-2 h-12 font-bold">
                    <Trash className="h-4 w-4" /> Delete Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account?</DialogTitle>
                    <DialogDescription>This is permanent. All your data will be removed.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild><Button variant="ghost">Cancel</Button></DialogClose>
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>Delete Forever</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Professional Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader><CardTitle className="text-xl font-bold">Experience</CardTitle></CardHeader>
            <CardContent className="space-y-8">
              {authUser.experience?.map((exp, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-100 last:border-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white" />
                  <h4 className="font-bold text-lg">{exp.role}</h4>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <span>{exp.company}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-muted-foreground text-sm">{exp.duration}</span>
                  </div>
                  <p className="text-sm mt-3 text-slate-600 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
              {(!authUser.experience || authUser.experience.length === 0) && <p className="text-muted-foreground italic text-center py-4">No experience added.</p>}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl">
            <CardHeader><CardTitle className="text-xl font-bold">Projects</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authUser.projects?.map((proj, i) => (
                <div key={i} className="p-5 rounded-2xl border border-slate-100 hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold group-hover:text-primary">{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-primary"><ExternalLink className="h-4 w-4" /></a>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-3">{proj.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {authUser.resume && (
            <Card className="border-none shadow-sm bg-primary/5 rounded-3xl">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-xl shadow-sm"><Globe className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p className="font-bold">Resume attached</p>
                    <p className="text-xs text-muted-foreground">Updated version available</p>
                  </div>
                </div>
                <Button variant="secondary" className="bg-white hover:bg-slate-50 shadow-sm" asChild>
                  <a href={authUser.resume} target="_blank" rel="noreferrer">View PDF</a>
                </Button>
              </CardContent>
            </Card>
          )}
          {authUser.role === 'seeker' && (<div className="pt-6">
            <Button 
              onClick={() => navigate('/employer-form')}
              className="group relative w-full overflow-hidden rounded-[2rem] py-10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20"
            >
              <div className="absolute inset-0 bg-slate-900 transition-colors group-hover:bg-slate-800" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              <div className="relative z-10 flex w-full flex-col items-center justify-between gap-4 px-8 sm:flex-row">
                <div className="flex items-center gap-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-black tracking-tight text-white">Hire Talent</h3>
                    <p className="text-sm font-medium text-slate-400">Transform your account into an Employer profile</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white px-6 py-2 font-bold text-slate-900 transition-all group-hover:bg-primary group-hover:text-white">
                  Get Started
                  <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Button>
            
            {/* Optional sub-text */}
            <p className="mt-4 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
              Exclusive features for recruiters and company owners
            </p>
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default Profile