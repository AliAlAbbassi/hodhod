"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function AgencyOverview() {
  const steps = [
    {
      title: "Step 1: Agency Account Setup",
      description: "Establish your agency's primary foundation.",
      items: [
        { label: "Register your agency's Hodhod account", done: true },
        { label: "Set up your agency profile", done: true },
        { label: "Configure admin user permissions for your team", done: true },
        { label: "Add team members who will be managing client accounts", done: false },
      ],
    },
    {
      title: "Step 2: Client Account Setup",
      description: "For each client you manage, follow these steps.",
      items: [
        { label: "Register a new Hodhod account under the client's name", done: false },
        { label: "Invite account managers/admins to join the client's workspace", done: false },
        { label: "Set appropriate admin permissions for team members", done: false },
        { label: "Collect client's LinkedIn login information", done: false },
      ],
    },
    {
      title: "Chrome Profiles Configuration",
      description: "Essential for managing multiple LinkedIn connections safely.",
      items: [
        { label: "Create a new Chrome Profile for the client", done: false },
        { label: "Name the profile after your client", done: false },
        { label: "Sign into the client's LinkedIn account", done: false },
        { label: "Install Hodhod Chrome extension and connect", done: false },
      ],
    },
    {
      title: "Client Seat Actions",
      description: "Actions required from the client's personal seat.",
      items: [
        { label: "Complete Hodhod Studio Setup (Product, Company, Style)", done: false },
        { label: "Create Campaigns & Upload Prospect Lists", done: false },
        { label: "Configure Do Not Contact Lists", done: false },
        { label: "Setup HodhodIntent (Tracking, Rules)", done: false },
      ],
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {steps.map((step, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>{step.title}</CardTitle>
            <CardDescription>{step.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {step.items.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  {item.done ? (
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                  )}
                  <span className={item.done ? "text-foreground" : "text-muted-foreground"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
