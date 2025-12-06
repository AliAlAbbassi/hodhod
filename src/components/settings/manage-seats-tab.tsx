"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Trash2, Mail } from "lucide-react"

interface Seat {
    id: string
    name: string
    email: string
    role: "admin" | "member"
    status: "active" | "pending"
}

const MOCK_SEATS: Seat[] = [
    { id: "1", name: "Catherine McCollian", email: "catherine@hodhod.ai", role: "admin", status: "active" },
    { id: "2", name: "John Smith", email: "john@hodhod.ai", role: "member", status: "active" },
    { id: "3", name: "Pending User", email: "pending@hodhod.ai", role: "member", status: "pending" },
]

export function ManageSeatsTab() {
    const [seats, setSeats] = useState<Seat[]>(MOCK_SEATS)
    const [inviteEmail, setInviteEmail] = useState("")

    const handleInvite = () => {
        if (inviteEmail) {
            const newSeat: Seat = {
                id: String(Date.now()),
                name: "Pending User",
                email: inviteEmail,
                role: "member",
                status: "pending",
            }
            setSeats([...seats, newSeat])
            setInviteEmail("")
        }
    }

    const handleRemove = (id: string) => {
        setSeats(seats.filter((seat) => seat.id !== id))
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Invite New User */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Invite Team Member</CardTitle>
                    <CardDescription>Add new members to your organization</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="email@example.com"
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

            {/* Seats List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Team Members ({seats.length})</CardTitle>
                    <CardDescription>Manage your team's access</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="divide-y">
                        {seats.map((seat) => (
                            <div key={seat.id} className="flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        <span className="text-sm font-medium">
                                            {seat.name.split(" ").map(n => n[0]).join("")}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{seat.name}</span>
                                            {seat.status === "pending" && (
                                                <Badge variant="secondary">Pending</Badge>
                                            )}
                                            {seat.role === "admin" && (
                                                <Badge variant="outline">Admin</Badge>
                                            )}
                                        </div>
                                        <span className="text-sm text-muted-foreground">{seat.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {seat.status === "pending" && (
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            <Mail className="h-4 w-4" />
                                            Resend
                                        </Button>
                                    )}
                                    {seat.role !== "admin" && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemove(seat.id)}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
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
