"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table"
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, ExternalLink, Linkedin, Settings } from "lucide-react"

interface ClientAccount {
    id: string
    name: string
    adminEmail: string
    status: "active" | "onboarding"
    linkedinConnected: boolean
    plan: "starter" | "pro" | "enterprise"
    lastActive: string
}

const MOCK_CLIENTS: ClientAccount[] = [
    { 
        id: "1", 
        name: "Acme Corp", 
        adminEmail: "jim@acme.com", 
        status: "active", 
        linkedinConnected: true,
        plan: "pro",
        lastActive: "2 mins ago"
    },
    { 
        id: "2", 
        name: "Stark Industries", 
        adminEmail: "tony@stark.com", 
        status: "onboarding", 
        linkedinConnected: false,
        plan: "enterprise",
        lastActive: "1 day ago"
    },
    { 
        id: "3", 
        name: "Wayne Enterprises", 
        adminEmail: "bruce@wayne.com", 
        status: "active", 
        linkedinConnected: true,
        plan: "enterprise",
        lastActive: "4 hours ago"
    },
]

export function ClientAccounts() {
    const [clients, setClients] = useState<ClientAccount[]>(MOCK_CLIENTS)

    const handleAddClient = () => {
        const newClient: ClientAccount = {
            id: String(Date.now()),
            name: "New Client Corp",
            adminEmail: "admin@newclient.com",
            status: "onboarding",
            linkedinConnected: false,
            plan: "starter",
            lastActive: "Just now"
        }
        setClients([...clients, newClient])
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Managed Clients</h3>
                <Button onClick={handleAddClient}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Client
                </Button>
            </div>

            <Card>
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-base">Client Accounts</CardTitle>
                    <CardDescription>Overview of all client workspaces under your agency.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Client Name</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>LinkedIn</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span>{client.name}</span>
                                            <span className="text-xs text-muted-foreground">{client.adminEmail}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {client.status === "active" ? (
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Onboarding</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {client.linkedinConnected ? (
                                                <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                                                    <Linkedin className="w-3 h-3 mr-1" />
                                                    Connected
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    Disconnected
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="capitalize text-muted-foreground">{client.plan}</TableCell>
                                    <TableCell className="text-muted-foreground">{client.lastActive}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <ExternalLink className="mr-2 h-4 w-4" />
                                                    Login as Client
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Settings className="mr-2 h-4 w-4" />
                                                    Manage Settings
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
