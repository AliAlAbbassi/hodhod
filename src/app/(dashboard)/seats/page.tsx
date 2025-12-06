"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MoreHorizontal,
  UserPlus,
  Users,
  Shield,
  UserX,
  ChevronDown,
  Mail,
  Crown,
  User,
} from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "owner" | "admin" | "member";
  status: "active" | "pending" | "deactivated";
  joinedAt: string;
};

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Ali Al Abbassi",
    email: "ali@hodhod.ai",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@hodhod.ai",
    role: "admin",
    status: "active",
    joinedAt: "2024-01-10",
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "marcus@hodhod.ai",
    role: "member",
    status: "active",
    joinedAt: "2024-01-15",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@hodhod.ai",
    role: "member",
    status: "pending",
    joinedAt: "2024-01-20",
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@hodhod.ai",
    role: "member",
    status: "deactivated",
    joinedAt: "2024-01-05",
  },
];

const roleConfig = {
  owner: {
    label: "Owner",
    variant: "default" as const,
    icon: Crown,
    description: "Full access to all features and billing",
  },
  admin: {
    label: "Admin",
    variant: "secondary" as const,
    icon: Shield,
    description: "Can manage team members and settings",
  },
  member: {
    label: "Member",
    variant: "outline" as const,
    icon: User,
    description: "Can access workspace features",
  },
};

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  deactivated: {
    label: "Deactivated",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function SeatsPage() {
  const [members, setMembers] = useState<TeamMember[]>(teamMembers);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const activeSeats = members.filter((m) => m.status === "active").length;
  const pendingInvites = members.filter((m) => m.status === "pending").length;
  const totalSeats = 10; // Plan limit

  const handleRoleChange = (memberId: string, newRole: "admin" | "member") => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleDeactivate = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, status: "deactivated" as const } : m
      )
    );
  };

  const handleReactivate = (memberId: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, status: "active" as const } : m
      )
    );
  };

  const handleRemove = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleInvite = () => {
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: String(members.length + 1),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteRole("member");
    setIsInviteOpen(false);
  };

  const handleResendInvite = (memberId: string) => {
    // In a real app, this would trigger an API call
    console.log("Resending invite to member:", memberId);
  };

  const columns: ColumnDef<TeamMember>[] = [
    {
      accessorKey: "name",
      header: "Member",
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              {member.avatar && (
                <AvatarImage src={member.avatar} alt={member.name} />
              )}
              <AvatarFallback className="text-xs">
                {getInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{member.name}</span>
              <span className="text-xs text-muted-foreground">
                {member.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const member = row.original;
        const config = roleConfig[member.role];
        const RoleIcon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <RoleIcon className="size-3" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusConfig;
        const config = statusConfig[status];
        return <Badge className={config.className}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: "joinedAt",
      header: "Joined",
      cell: ({ row }) => {
        const date = new Date(row.getValue("joinedAt"));
        return (
          <span className="text-muted-foreground">
            {date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const member = row.original;
        const isOwner = member.role === "owner";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isOwner && (
                <>
                  <DropdownMenuItem
                    onClick={() =>
                      handleRoleChange(
                        member.id,
                        member.role === "admin" ? "member" : "admin"
                      )
                    }
                  >
                    <Shield className="mr-2 size-4" />
                    {member.role === "admin"
                      ? "Change to Member"
                      : "Make Admin"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {member.status === "pending" && (
                <DropdownMenuItem
                  onClick={() => handleResendInvite(member.id)}
                >
                  <Mail className="mr-2 size-4" />
                  Resend Invite
                </DropdownMenuItem>
              )}
              {!isOwner && member.status === "active" && (
                <DropdownMenuItem
                  onClick={() => handleDeactivate(member.id)}
                  className="text-yellow-600"
                >
                  <UserX className="mr-2 size-4" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {!isOwner && member.status === "deactivated" && (
                <DropdownMenuItem onClick={() => handleReactivate(member.id)}>
                  <User className="mr-2 size-4" />
                  Reactivate
                </DropdownMenuItem>
              )}
              {!isOwner && (
                <DropdownMenuItem
                  onClick={() => handleRemove(member.id)}
                  className="text-red-600"
                >
                  <UserX className="mr-2 size-4" />
                  Remove from Team
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Seats</h1>
          <p className="text-muted-foreground">
            Manage your team members and their permissions
          </p>
        </div>
        <Sheet open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <SheetTrigger asChild>
            <Button>
              <UserPlus className="mr-2 size-4" />
              Invite Member
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Invite Team Member</SheetTitle>
              <SheetDescription>
                Send an invitation to add a new member to your team.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      <span className="flex items-center gap-2">
                        {inviteRole === "admin" ? (
                          <Shield className="size-4" />
                        ) : (
                          <User className="size-4" />
                        )}
                        {roleConfig[inviteRole].label}
                      </span>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setInviteRole("admin")}>
                      <Shield className="mr-2 size-4" />
                      <div>
                        <div className="font-medium">Admin</div>
                        <div className="text-xs text-muted-foreground">
                          {roleConfig.admin.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInviteRole("member")}>
                      <User className="mr-2 size-4" />
                      <div>
                        <div className="font-medium">Member</div>
                        <div className="text-xs text-muted-foreground">
                          {roleConfig.member.description}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <SheetFooter className="mt-6">
              <Button
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={!inviteEmail}>
                <Mail className="mr-2 size-4" />
                Send Invite
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Seat Usage Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Seats</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSeats}</div>
            <div className="mt-2">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${(activeSeats / totalSeats) * 100}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {activeSeats} of {totalSeats} seats used
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Invites
            </CardTitle>
            <Mail className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInvites}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {pendingInvites === 1
                ? "1 invitation awaiting response"
                : `${pendingInvites} invitations awaiting response`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Available Seats
            </CardTitle>
            <UserPlus className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalSeats - activeSeats - pendingInvites}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Seats available for new members
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            View and manage all team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={members}
            searchKey="name"
            searchPlaceholder="Search members..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
