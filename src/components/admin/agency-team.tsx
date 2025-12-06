"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2 } from "lucide-react"

interface TeamMember {
    id: string
    name: string
    email: string
    role: "owner" | "admin" | "manager"
    status: "active" | "pending"
}

const MOCK_TEAM: TeamMember[] = [
    { id: "1", name: "Agency Owner", email: "owner@agency.com", role: "owner", status: "active" },
    { id: "2", name: "Alex Admin", email: "alex@agency.com", role: "admin", status: "active" },
    { id: "3", name: "Sarah Manager", email: "sarah@agency.com", role: "manager", status: "pending" },
]

export function AgencyTeam() {
    const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM)
    const [inviteEmail, setInviteEmail] = useState("")

    const handleInvite = () => {
        if (inviteEmail) {
            const newMember: TeamMember = {
                id: String(Date.now()),
                name: "New Member",
                email: inviteEmail,
                role: "manager",
                status: "pending",
            }
            setMembers([...members, newMember])
            setInviteEmail("")
        }
    }

    const handleRemove = (id: string) => {
        setMembers(members.filter((m) => m.id !== id))
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Invite Agency Member</CardTitle>
                    <CardDescription>Add new administrators or managers to your agency account.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3 max-w-xl">
                        <Input
                            placeholder="colleague@agency.com"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={handleInvite} className="gap-2">
                            <UserPlus className="h-4 w-4" />
                            Invite
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Agency Team ({members.length})</CardTitle>
                    <CardDescription>Manage access to your agency dashboard.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                        <span className="text-sm font-medium">
                                            {member.name.split(" ").map(n => n[0]).join("")}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{member.name}</span>
                                            {member.role === "owner" && <Badge>Owner</Badge>}
                                            {member.role === "admin" && <Badge variant="secondary">Admin</Badge>}
                                            {member.status === "pending" && <Badge variant="outline">Pending</Badge>}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{member.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.role !== "owner" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemove(member.id)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
