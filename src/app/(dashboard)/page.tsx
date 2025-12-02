"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  MessageSquare,
  Calendar,
  Users,
  Mail,
  ChevronRight,
  Check,
  Download,
  MoreVertical,
  BarChart3,
  Monitor,
  RefreshCw,
} from "lucide-react";

const analyticsData = [
  { time: "0:00", connections: 50, inmails: 30 },
  { time: "2:00", connections: 65, inmails: 45 },
  { time: "4:00", connections: 250, inmails: 13 },
  { time: "6:00", connections: 80, inmails: 55 },
  { time: "8:00", connections: 120, inmails: 70 },
  { time: "10:00", connections: 180, inmails: 90 },
  { time: "12:00", connections: 220, inmails: 85 },
  { time: "14:00", connections: 260, inmails: 95 },
  { time: "16:00", connections: 280, inmails: 100 },
  { time: "18:00", connections: 270, inmails: 90 },
  { time: "20:00", connections: 250, inmails: 85 },
  { time: "22:00", connections: 230, inmails: 75 },
  { time: "24:00", connections: 200, inmails: 60 },
];

const stats = [
  { label: "Total Messages Sent", value: "3,424" },
  { label: "Connections Accepted", value: "2,424" },
  { label: "InMails Accepted", value: "2,424" },
  { label: "Message Replies", value: "565" },
  { label: "FollowUps", value: "2,000" },
  { label: "Interested Replies", value: "2,000" },
  { label: "Meetings Booked", value: "1,324" },
];

const visitors = [
  {
    name: "John Smith",
    company: "Acme Inc",
    role: "CTO",
    intent: "High",
    time: "2m ago",
    avatar: "JS",
  },
  {
    name: "Sarah Chen",
    company: "Stripe",
    role: "VP Engineering",
    intent: "Medium",
    time: "5m ago",
    avatar: "SC",
  },
  {
    name: "Mike Johnson",
    company: "Vercel",
    role: "Head of Eng",
    intent: "High",
    time: "12m ago",
    avatar: "MJ",
  },
  {
    name: "Emily Davis",
    company: "Linear",
    role: "Engineering Lead",
    intent: "High",
    time: "18m ago",
    avatar: "ED",
  },
  {
    name: "Alex Wong",
    company: "Figma",
    role: "Staff Engineer",
    intent: "Medium",
    time: "25m ago",
    avatar: "AW",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            <AvatarImage src="/profile.jpeg" alt="Profile" />
            <AvatarFallback>AA</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Ali</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Check className="size-3" />
            LinkedIn Connected
          </Badge>
          <Badge variant="outline" className="gap-1">
            <MessageSquare className="size-3" />
            25/day
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Mail className="size-3" />
            40/day
          </Badge>
          <Button variant="ghost" size="icon">
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Approvals Required
            </CardTitle>
            <MessageSquare className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">5</div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                <RefreshCw className="mr-1 size-3" />
                12x
              </Badge>
              <Button size="sm" className="whitespace-nowrap">
                Approve Now <ChevronRight className="ml-1 size-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Messages Scheduled
            </CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="text-2xl font-bold">20</div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Badge variant="secondary">
                <RefreshCw className="mr-1 size-3" />
                20x
              </Badge>
              <Button size="sm" variant="outline" className="whitespace-nowrap">
                All Scheduled <ChevronRight className="ml-1 size-3" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connects Sent</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">22</div>
              <Badge variant="outline" className="text-xs">
                Today
              </Badge>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: "88%", backgroundColor: "#10DD9B" }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>22 sent</span>
                <span>25 limit</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">InMails Sent</CardTitle>
            <Mail className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24</div>
              <Badge variant="outline" className="text-xs">
                Today
              </Badge>
            </div>
            <div className="mt-3">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full transition-all"
                  style={{ width: "60%", backgroundColor: "#5869E9" }}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>24 sent</span>
                <span>40 limit</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4" />
            <CardTitle>Analytics</CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "#10DD9B" }}
                />
                <span className="text-muted-foreground">
                  Connection Requests
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{ backgroundColor: "#5869E9" }}
                />
                <span className="text-muted-foreground">InMails</span>
              </div>
            </div>
            <Badge variant="outline">Today</Badge>
            <Button variant="ghost" size="icon">
              <Download className="size-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Row */}
          <div className="grid grid-cols-7 gap-4 border-b pb-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="flex h-8 items-end text-xs text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e5e5e5"
                />
                <XAxis
                  dataKey="time"
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
                  dataKey="connections"
                  name="Connection Requests"
                  stroke="#10DD9B"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="inmails"
                  name="InMails"
                  stroke="#5869E9"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Website Visitors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Monitor className="size-4" />
            <CardTitle>Website Visitors</CardTitle>
          </div>
          <Button variant="link" className="px-0">
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prospect Name</TableHead>
                <TableHead>Company with Role</TableHead>
                <TableHead>Intent Level</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visitors.map((visitor) => (
                <TableRow key={visitor.name} className="cursor-pointer">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {visitor.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{visitor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{visitor.company}</span>
                      <span className="text-xs text-muted-foreground">
                        {visitor.role}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        visitor.intent === "High" ? "default" : "secondary"
                      }
                    >
                      {visitor.intent}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {visitor.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
