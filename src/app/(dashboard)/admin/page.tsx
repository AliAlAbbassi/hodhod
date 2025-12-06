"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  Activity,
  TrendingUp,
  Shield,
  MoreHorizontal,
  ArrowUpDown,
  Settings,
  UserPlus,
  UserMinus,
  Edit,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Organization metrics data
const orgMetrics = {
  totalUsers: 24,
  activeUsers: 18,
  totalCampaigns: 12,
  totalMessages: 15420,
  successRate: 68,
  meetingsBooked: 342,
};

// Usage analytics data
const usageData = [
  { month: "Jan", messages: 1200, connections: 450, meetings: 28 },
  { month: "Feb", messages: 1450, connections: 520, meetings: 35 },
  { month: "Mar", messages: 1680, connections: 610, meetings: 42 },
  { month: "Apr", messages: 1890, connections: 580, meetings: 38 },
  { month: "May", messages: 2100, connections: 720, meetings: 52 },
  { month: "Jun", messages: 2340, connections: 850, meetings: 61 },
];

const dailyUsageData = [
  { day: "Mon", activeUsers: 18 },
  { day: "Tue", activeUsers: 22 },
  { day: "Wed", activeUsers: 20 },
  { day: "Thu", activeUsers: 24 },
  { day: "Fri", activeUsers: 19 },
  { day: "Sat", activeUsers: 8 },
  { day: "Sun", activeUsers: 5 },
];

const userDistribution = [
  { name: "Admin", value: 3, color: "#5869E9" },
  { name: "Manager", value: 6, color: "#10DD9B" },
  { name: "Member", value: 15, color: "#F59E0B" },
];

// User management data
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member";
  status: "active" | "inactive" | "pending";
  lastActive: string;
  messagesThisMonth: number;
};

const users: User[] = [
  {
    id: "1",
    name: "Ali Al-Abbassi",
    email: "ali@hodhod.io",
    role: "admin",
    status: "active",
    lastActive: "2 min ago",
    messagesThisMonth: 856,
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@hodhod.io",
    role: "manager",
    status: "active",
    lastActive: "1 hour ago",
    messagesThisMonth: 642,
  },
  {
    id: "3",
    name: "Marcus Johnson",
    email: "marcus@hodhod.io",
    role: "member",
    status: "active",
    lastActive: "3 hours ago",
    messagesThisMonth: 428,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@hodhod.io",
    role: "member",
    status: "inactive",
    lastActive: "5 days ago",
    messagesThisMonth: 0,
  },
  {
    id: "5",
    name: "David Kim",
    email: "david@hodhod.io",
    role: "manager",
    status: "active",
    lastActive: "30 min ago",
    messagesThisMonth: 521,
  },
  {
    id: "6",
    name: "Anna Thompson",
    email: "anna@hodhod.io",
    role: "member",
    status: "pending",
    lastActive: "-",
    messagesThisMonth: 0,
  },
];

const roleColors = {
  admin: "default",
  manager: "secondary",
  member: "outline",
} as const;


const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3 px-3">
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">
            {row.getValue<string>("name").split(" ").map(n => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{row.getValue("name")}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as keyof typeof roleColors;
      return (
        <Badge variant={roleColors[role]} className="capitalize">
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as User["status"];
      return (
        <div className="flex items-center gap-2">
          {status === "active" && (
            <CheckCircle className="size-3 text-green-600" />
          )}
          {status === "inactive" && (
            <XCircle className="size-3 text-gray-400" />
          )}
          {status === "pending" && (
            <AlertCircle className="size-3 text-yellow-600" />
          )}
          <span className="capitalize">{status}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "lastActive",
    header: "Last Active",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.getValue("lastActive")}
      </span>
    ),
  },
  {
    accessorKey: "messagesThisMonth",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Messages
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-3">{row.getValue<number>("messagesThisMonth").toLocaleString()}</div>
    ),
  },
  {
    id: "actions",
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" /> Edit User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="mr-2 size-4" /> Send Email
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <UserMinus className="mr-2 size-4" /> Remove User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Activity log data
type ActivityLog = {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "user" | "campaign" | "settings" | "integration";
};

const activityLogs: ActivityLog[] = [
  {
    id: "1",
    user: "Ali Al-Abbassi",
    action: "created",
    target: "New Campaign: Q4 Outreach",
    timestamp: "5 min ago",
    type: "campaign",
  },
  {
    id: "2",
    user: "Sarah Chen",
    action: "invited",
    target: "david@hodhod.io",
    timestamp: "1 hour ago",
    type: "user",
  },
  {
    id: "3",
    user: "Marcus Johnson",
    action: "connected",
    target: "LinkedIn integration",
    timestamp: "2 hours ago",
    type: "integration",
  },
  {
    id: "4",
    user: "Ali Al-Abbassi",
    action: "updated",
    target: "Organization settings",
    timestamp: "3 hours ago",
    type: "settings",
  },
  {
    id: "5",
    user: "Emily Rodriguez",
    action: "exported",
    target: "Prospects list (124 contacts)",
    timestamp: "5 hours ago",
    type: "campaign",
  },
  {
    id: "6",
    user: "David Kim",
    action: "paused",
    target: "Campaign: Tech Leaders 2024",
    timestamp: "Yesterday",
    type: "campaign",
  },
  {
    id: "7",
    user: "Ali Al-Abbassi",
    action: "removed",
    target: "john.doe@example.com",
    timestamp: "2 days ago",
    type: "user",
  },
];

const activityIcons = {
  user: Users,
  campaign: Mail,
  settings: Settings,
  integration: Activity,
};

// Organization settings
const orgSettings = [
  {
    title: "Organization Name",
    description: "The name displayed across the platform",
    value: "HODHOD",
  },
  {
    title: "Default Daily Message Limit",
    description: "Maximum messages per user per day",
    value: "25 messages",
  },
  {
    title: "Default InMail Limit",
    description: "Maximum InMails per user per day",
    value: "40 InMails",
  },
  {
    title: "Require Approval",
    description: "New messages require admin approval",
    value: "Enabled",
  },
  {
    title: "Data Retention",
    description: "How long to keep prospect data",
    value: "12 months",
  },
  {
    title: "Timezone",
    description: "Default timezone for scheduling",
    value: "UTC-8 (Pacific Time)",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Admin View</h1>
            <p className="text-muted-foreground">
              Manage your organization settings and users
            </p>
          </div>
        </div>
        <Button>
          <UserPlus className="mr-2 size-4" />
          Invite User
        </Button>
      </div>

      {/* Org Metrics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">{orgMetrics.totalUsers}</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-green-600">{orgMetrics.activeUsers} active</span>
              <span>/</span>
              <span>{orgMetrics.totalUsers - orgMetrics.activeUsers} inactive</span>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">{orgMetrics.totalCampaigns}</div>
            <Badge variant="secondary" className="w-fit">
              <TrendingUp className="mr-1 size-3" />
              +3 this month
            </Badge>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Mail className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">
              {orgMetrics.totalMessages.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              {orgMetrics.successRate}% response rate
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings Booked</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">{orgMetrics.meetingsBooked}</div>
            <Badge variant="secondary" className="w-fit">
              <TrendingUp className="mr-1 size-3" />
              +12% from last month
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">
            <Users className="mr-2 size-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Clock className="mr-2 size-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="mr-2 size-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 size-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage team members and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={users}
                searchKey="name"
                searchPlaceholder="Search users..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Log Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>
                    Track all actions across your organization
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Export Log
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLogs.map((log) => {
                    const Icon = activityIcons[log.type];
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarFallback className="text-xs">
                                {log.user.split(" ").map(n => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="size-4 text-muted-foreground" />
                            <span className="capitalize">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {log.target}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.timestamp}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Usage Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Over Time</CardTitle>
                <CardDescription>
                  Messages, connections, and meetings by month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e5e5"
                      />
                      <XAxis
                        dataKey="month"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="messages"
                        name="Messages"
                        stroke="#5869E9"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="connections"
                        name="Connections"
                        stroke="#10DD9B"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "#5869E9" }}
                    />
                    <span className="text-muted-foreground">Messages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="size-2 rounded-full"
                      style={{ backgroundColor: "#10DD9B" }}
                    />
                    <span className="text-muted-foreground">Connections</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Active Users */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Active Users</CardTitle>
                <CardDescription>
                  User activity by day of week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyUsageData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e5e5e5"
                      />
                      <XAxis
                        dataKey="day"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Bar
                        dataKey="activeUsers"
                        name="Active Users"
                        fill="#5869E9"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>
                  Breakdown by role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {userDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                  {userDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <div
                        className="size-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">
                        {item.name} ({item.value})
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  Users with most activity this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((u) => u.status === "active")
                    .sort((a, b) => b.messagesThisMonth - a.messagesThisMonth)
                    .slice(0, 5)
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                            {index + 1}
                          </span>
                          <Avatar className="size-8">
                            <AvatarFallback className="text-xs">
                              {user.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {user.role}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {user.messagesThisMonth.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">messages</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>
                    Configure your organization preferences
                  </CardDescription>
                </div>
                <Button>Save Changes</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {orgSettings.map((setting) => (
                  <div
                    key={setting.title}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{setting.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{setting.value}</Badge>
                      <Button variant="ghost" size="icon">
                        <Edit className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
