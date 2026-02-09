import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, AlertCircle, Lock, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { jobStore } from '../stores/jobStores'
import { employeeStore } from '@/stores/employerStores'

const PostJob = () => {
  const { jobPost } = jobStore()
  const { checkEmployer, checkingEmployer, employeeData } = employeeStore()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "full-time",
    minSalary: "",
    maxSalary: "",
    categoryName: "",
    requirements: []
  })

  const [reqInput, setReqInput] = useState("")

  const addRequirement = () => {
    if (reqInput.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, reqInput] })
      setReqInput("")
    }
  }

  const removeRequirement = (index) => {
    const updated = formData.requirements.filter((_, i) => i !== index)
    setFormData({ ...formData, requirements: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const finalData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      jobType: formData.jobType,
      salary: { min: Number(formData.minSalary), max: Number(formData.maxSalary) },
      category: formData.jobType,
      requirements: formData.requirements
    }

    await jobPost(finalData)
  }

  useEffect(() => {
    checkEmployer()
  }, [checkEmployer])

  if (checkingEmployer) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-2" />
        <p>Verifying credentials...</p>
      </div>
    )
  }

  if (!employeeData) {
    return (
      <div className="py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You must have an Employer account to post jobs.
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex flex-col items-center justify-center p-8 border border-dashed rounded-lg opacity-60">
           <Lock className="h-10 w-10 mb-2 text-muted-foreground" />
           <p className="text-sm font-medium">Please upgrade your account</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="max-h-[80vh] px-1">
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Job Title</Label>
          <Input 
            id="title" 
            placeholder="e.g. Senior React Developer" 
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required 
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            placeholder="Describe the role and responsibilities..." 
            className="min-h-[100px]"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Job Type</Label>
            <Select onValueChange={(val) => setFormData({...formData, jobType: val})}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              placeholder="e.g. Remote or NYC" 
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Input 
              placeholder="Tech..." 
              value={formData.categoryName}
              onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>Min Salary</Label>
            <Input 
              type="number" 
              placeholder="50k" 
              value={formData.minSalary}
              onChange={(e) => setFormData({...formData, minSalary: e.target.value})}
            />
          </div>
          <div className="grid gap-2">
            <Label>Max Salary</Label>
            <Input 
              type="number" 
              placeholder="80k" 
              value={formData.maxSalary}
              onChange={(e) => setFormData({...formData, maxSalary: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Requirements</Label>
          <div className="flex gap-2">
            <Input 
              placeholder="e.g. 3+ years React" 
              value={reqInput}
              onChange={(e) => setReqInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
            />
            <Button type="button" onClick={addRequirement} variant="outline" size="icon" className="shrink-0">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.requirements.map((req, index) => (
              <Badge key={index} variant="secondary" className="pl-3 pr-1 py-1 gap-1">
                {req}
                <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeRequirement(index)} />
              </Badge>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full h-11">Create Job Listing</Button>
      </form>
    </ScrollArea>
  )
}

export default PostJob