import React from 'react'
import { Briefcase, Github, Twitter, Linkedin, Mail, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">JobFu</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Connecting the world's best talent with the most innovative companies. Your next career move starts here.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Github className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Job Seekers Column */}
          <div>
            <h3 className="font-bold mb-4">For Job Seekers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Browse Jobs</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Job Alerts</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Career Advice</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Resume Builder</li>
            </ul>
          </div>

          {/* Employers Column */}
          <div>
            <h3 className="font-bold mb-4">For Employers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Post a Job</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Browse Candidates</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Hiring Solutions</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Pricing</li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest job openings delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Email address" className="bg-muted/50 border-0" />
              <Button size="sm">Join</Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 JobFu Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer