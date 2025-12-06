"use client"

import { useState } from "react"
import { User, Building, Target, UserPlus, Plug } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileTab } from "@/components/settings/profile-tab"
import { CompanyInfoTab } from "@/components/settings/company-info-tab"
import { ManageSeatsTab } from "@/components/settings/manage-seats-tab"
import { IntegrationsTab } from "@/components/settings/integrations-tab"
import { IntentEmptyState } from "@/components/intent/intent-empty-state"
import { IntentSetupModal } from "@/components/intent/intent-setup-modal"
import { IntentDashboard } from "@/components/intent/intent-dashboard"

export default function SettingsPage() {
    const [isSetupModalOpen, setIsSetupModalOpen] = useState(false)
    const [isIntentSetupComplete, setIsIntentSetupComplete] = useState(false)

    return (
        <div className="flex-1 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your profile, organization, and integrations.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="h-10">
                    <TabsTrigger value="profile" className="gap-2 px-4">
                        <User className="h-4 w-4" />
                        Your Profile
                    </TabsTrigger>
                    <TabsTrigger value="company" className="gap-2 px-4">
                        <Building className="h-4 w-4" />
                        Company Info
                    </TabsTrigger>
                    <TabsTrigger value="hodhod-intent" className="gap-2 px-4">
                        <Target className="h-4 w-4" />
                        Hodhod Intent
                    </TabsTrigger>
                    <TabsTrigger value="manage-seats" className="gap-2 px-4">
                        <UserPlus className="h-4 w-4" />
                        Manage Seats
                    </TabsTrigger>
                    <TabsTrigger value="integrations" className="gap-2 px-4">
                        <Plug className="h-4 w-4" />
                        Integrations
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <ProfileTab />
                </TabsContent>

                <TabsContent value="company">
                    <CompanyInfoTab />
                </TabsContent>

                <TabsContent value="hodhod-intent" className="space-y-4">
                    {isIntentSetupComplete ? (
                        <IntentDashboard />
                    ) : (
                        <IntentEmptyState onSetup={() => setIsSetupModalOpen(true)} />
                    )}
                    <IntentSetupModal
                        open={isSetupModalOpen}
                        onOpenChange={setIsSetupModalOpen}
                        onComplete={() => setIsIntentSetupComplete(true)}
                    />
                </TabsContent>

                <TabsContent value="manage-seats">
                    <ManageSeatsTab />
                </TabsContent>

                <TabsContent value="integrations">
                    <IntegrationsTab />
                </TabsContent>
            </Tabs>
        </div>
    )
}
