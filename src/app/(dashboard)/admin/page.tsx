"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgencyOverview } from "@/components/admin/agency-overview"
import { AgencyTeam } from "@/components/admin/agency-team"
import { ClientAccounts } from "@/components/admin/client-accounts"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-6">
       <div>
         <h1 className="text-3xl font-bold tracking-tight">Admin View</h1>
         <p className="text-muted-foreground">Manage your agency settings, team, and client accounts.</p>
       </div>

       <Tabs defaultValue="overview" className="space-y-4">
         <TabsList>
           <TabsTrigger value="overview">Overview</TabsTrigger>
           <TabsTrigger value="team">Team Members</TabsTrigger>
           <TabsTrigger value="clients">Client Accounts</TabsTrigger>
         </TabsList>
         <TabsContent value="overview" className="space-y-4">
           <AgencyOverview />
         </TabsContent>
         <TabsContent value="team" className="space-y-4">
           <AgencyTeam />
         </TabsContent>
         <TabsContent value="clients" className="space-y-4">
           <ClientAccounts />
         </TabsContent>
       </Tabs>
    </div>
  )
}
