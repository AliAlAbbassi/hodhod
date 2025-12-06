"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const INDUSTRIES = [
    { value: "technology", label: "Technology" },
    { value: "finance", label: "Finance" },
    { value: "healthcare", label: "Healthcare" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufacturing" },
    { value: "education", label: "Education" },
    { value: "consulting", label: "Consulting" },
    { value: "other", label: "Other" },
]

const COMPANY_SIZES = [
    { value: "1-10", label: "1-10 employees" },
    { value: "11-50", label: "11-50 employees" },
    { value: "51-200", label: "51-200 employees" },
    { value: "201-500", label: "201-500 employees" },
    { value: "501-1000", label: "501-1000 employees" },
    { value: "1000+", label: "1000+ employees" },
]

export function CompanyInfoTab() {
    const [companyName, setCompanyName] = useState("Hodhod Inc")
    const [website, setWebsite] = useState("https://hodhod.ai")
    const [industry, setIndustry] = useState("technology")
    const [companySize, setCompanySize] = useState("11-50")
    const [description, setDescription] = useState("")

    return (
        <div className="space-y-8 max-w-2xl">
            {/* Company Name */}
            <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-muted/50"
                />
            </div>

            {/* Website */}
            <div className="space-y-2">
                <Label htmlFor="website">Company Website</Label>
                <Input
                    id="website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-muted/50"
                />
            </div>

            {/* Industry */}
            <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                >
                    {INDUSTRIES.map((ind) => (
                        <option key={ind.value} value={ind.value}>
                            {ind.label}
                        </option>
                    ))}
                </Select>
            </div>

            {/* Company Size */}
            <div className="space-y-2">
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                    id="companySize"
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                >
                    {COMPANY_SIZES.map((size) => (
                        <option key={size.value} value={size.value}>
                            {size.label}
                        </option>
                    ))}
                </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us about your company..."
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button>Save Changes</Button>
            </div>
        </div>
    )
}
