"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { User, Info, AlertCircle } from "lucide-react"

const TIMEZONES = [
    { value: "EST", label: "Eastern Standard Time (EST)" },
    { value: "CST", label: "Central Standard Time (CST)" },
    { value: "MST", label: "Mountain Standard Time (MST)" },
    { value: "PST", label: "Pacific Standard Time (PST)" },
    { value: "GMT", label: "Greenwich Mean Time (GMT)" },
    { value: "CET", label: "Central European Time (CET)" },
    { value: "IST", label: "India Standard Time (IST)" },
    { value: "JST", label: "Japan Standard Time (JST)" },
    { value: "AEST", label: "Australian Eastern Standard Time (AEST)" },
]

const MEETING_PROVIDERS = [
    { value: "hodhod", label: "Hodhod", icon: "⚡" },
    { value: "calendly", label: "Calendly", icon: "📅" },
    { value: "hubspot", label: "HubSpot", icon: "🔶" },
    { value: "google", label: "Google Meet", icon: "📹" },
    { value: "zoom", label: "Zoom", icon: "💻" },
]

export function ProfileTab() {
    const [fullName, setFullName] = useState("Catherine McCollian")
    const [email, setEmail] = useState("catherine@hodhod.ai")
    const [meetingProvider, setMeetingProvider] = useState("hodhod")
    const [meetingLink, setMeetingLink] = useState("https://app.usemotion.com/meet/hodhod/meeting")
    const [timezone, setTimezone] = useState("EST")

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Full Name */}
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-muted/50"
                />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="flex gap-3">
                    <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/50 flex-1"
                        disabled
                    />
                    <Button variant="outline">Change</Button>
                </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex gap-3">
                    <Input
                        id="password"
                        type="password"
                        value="••••••"
                        className="bg-muted/50 flex-1"
                        disabled
                    />
                    <Button variant="outline">Change</Button>
                </div>
            </div>

            {/* Meeting Link */}
            <div className="space-y-2">
                <div className="flex items-center gap-1">
                    <Label>Include Your Meeting Link *</Label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex gap-3 items-center">
                    <Select
                        value={meetingProvider}
                        onChange={(e) => setMeetingProvider(e.target.value)}
                        className="w-32"
                    >
                        {MEETING_PROVIDERS.map((provider) => (
                            <option key={provider.value} value={provider.value}>
                                {provider.icon} {provider.label}
                            </option>
                        ))}
                    </Select>
                    <Input
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://calendly.com/your-link"
                        className="flex-1"
                    />
                </div>
                <div className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <span>One or more workspaces do not have a meeting link.</span>
                </div>
            </div>

            {/* Timezone */}
            <div className="space-y-2">
                <div className="flex items-center gap-1">
                    <Label>Your Timezone</Label>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                >
                    {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                            {tz.label}
                        </option>
                    ))}
                </Select>
            </div>
        </div>
    )
}
