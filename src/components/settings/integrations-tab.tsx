"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

interface Integration {
    id: string
    name: string
    description: string
    icon: string
    connected: boolean
    category: "crm" | "calendar" | "communication" | "other"
}

const INTEGRATIONS: Integration[] = [
    {
        id: "salesforce",
        name: "Salesforce",
        description: "Sync leads and contacts with Salesforce CRM",
        icon: "☁️",
        connected: false,
        category: "crm"
    },
    {
        id: "hubspot",
        name: "HubSpot",
        description: "Connect your HubSpot CRM for seamless lead management",
        icon: "🔶",
        connected: true,
        category: "crm"
    },
    {
        id: "google-calendar",
        name: "Google Calendar",
        description: "Sync your meetings and availability",
        icon: "📅",
        connected: true,
        category: "calendar"
    },
    {
        id: "outlook",
        name: "Outlook Calendar",
        description: "Connect your Outlook calendar",
        icon: "📧",
        connected: false,
        category: "calendar"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Get notifications and updates in Slack",
        icon: "💬",
        connected: false,
        category: "communication"
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        description: "Connect your LinkedIn account for outreach",
        icon: "💼",
        connected: true,
        category: "other"
    },
]

export function IntegrationsTab() {
    const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS)

    const toggleIntegration = (id: string) => {
        setIntegrations(integrations.map((integration) =>
            integration.id === id
                ? { ...integration, connected: !integration.connected }
                : integration
        ))
    }

    const categories = [
        { key: "crm" as const, label: "CRM" },
        { key: "calendar" as const, label: "Calendar" },
        { key: "communication" as const, label: "Communication" },
        { key: "other" as const, label: "Other" },
    ]

    return (
        <div className="space-y-8 max-w-3xl">
            {categories.map((category) => {
                const categoryIntegrations = integrations.filter(i => i.category === category.key)
                if (categoryIntegrations.length === 0) return null

                return (
                    <div key={category.key} className="space-y-4">
                        <h3 className="text-lg font-semibold">{category.label}</h3>
                        <div className="grid gap-4">
                            {categoryIntegrations.map((integration) => (
                                <Card key={integration.id}>
                                    <CardContent className="flex items-center justify-between p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="text-2xl">{integration.icon}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{integration.name}</span>
                                                    {integration.connected && (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                                            Connected
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{integration.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {integration.connected ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleIntegration(integration.id)}
                                                >
                                                    Disconnect
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => toggleIntegration(integration.id)}
                                                    className="gap-1"
                                                >
                                                    Connect <ExternalLink className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
