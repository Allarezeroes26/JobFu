import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

const PostJob = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalData = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      jobType: formData.jobType,
      salary: { min: Number(formData.minSalary), max: Number(formData.maxSalary) },
      category: [{ categoryName: formData.categoryName }],
      requirements: formData.requirements
    }
    console.log("Submitting to MongoDB:", finalData)
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
          <CardDescription>Fill out the details below to find your next hire.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
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
                className="min-h-[120px]"
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
                  placeholder="Design, Tech..." 
                  value={formData.categoryName}
                  onChange={(e) => setFormData({...formData, categoryName: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Min Salary</Label>
                <Input 
                  type="number" 
                  placeholder="50000" 
                  value={formData.minSalary}
                  onChange={(e) => setFormData({...formData, minSalary: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label>Max Salary</Label>
                <Input 
                  type="number" 
                  placeholder="80000" 
                  value={formData.maxSalary}
                  onChange={(e) => setFormData({...formData, maxSalary: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Add a requirement (e.g. 3+ years React)" 
                  value={reqInput}
                  onChange={(e) => setReqInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                />
                <Button type="button" onClick={addRequirement} variant="outline" size="icon">
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

            <Button type="submit" className="w-full text-lg h-12">Post Job Opportunity</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PostJob