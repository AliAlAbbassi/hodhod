"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Download,
  Filter,
  MoreVertical,
  Linkedin,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Calendar,
  Globe,
  Zap,
  Users,
  FileText,
  Link as LinkIcon,
  Settings,
  Info,
  Play,
  Pause,
} from "lucide-react";

// Mock campaign data
const campaignData = {
  id: "1",
  name: "Positive Response List (from Shubh) - Open Profiles",
  status: "in_progress" as const,
  type: "inmail" as const,
  createdAt: "04/01/2025",
  totalProspects: 381,
  reachouts: 361,
  acceptanceRate: 100,
  responseRate: 18,
  prospectPoolSize: 927,
  // Settings
  reEngagementCount: 2,
  reEngagementInterval: 3,
  outreachLanguage: "English",
  autopilot: true,
  dailyVolume: 50,
  outreachTime: "9:00 AM",
  outreachDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  // Info
  selectedProduct: "Hodhod Platform",
  writingStyle: "Professional",
  profileType: "Open Profiles",
  researchAgents: ["Company Research", "Role Analysis"],
  inputUrl: "https://linkedin.com/sales/lists/123",
};

// Mock prospects data
const prospectsData = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP Engineering",
    company: "Stripe",
    industry: "Fintech",
    status: "replied",
    score: 92,
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "CTO",
    company: "Vercel",
    industry: "Technology",
    status: "opened",
    score: 88,
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Head of Engineering",
    company: "Linear",
    industry: "SaaS",
    status: "sent",
    score: 95,
    lastActivity: "3 hours ago",
  },
  {
    id: "4",
    name: "David Kim",
    title: "Engineering Director",
    company: "Figma",
    industry: "Design",
    status: "meeting_booked",
    score: 85,
    lastActivity: "5 hours ago",
  },
  {
    id: "5",
    name: "Anna Thompson",
    title: "VP Platform",
    company: "Datadog",
    industry: "DevOps",
    status: "replied",
    score: 90,
    lastActivity: "1 hour ago",
  },
];

const statusConfig = {
  sent: { label: "Sent", className: "bg-blue-100 text-blue-700" },
  opened: { label: "Opened", className: "bg-yellow-100 text-yellow-700" },
  replied: { label: "Replied", className: "bg-green-100 text-green-700" },
  meeting_booked: { label: "Meeting Booked", className: "bg-purple-100 text-purple-700" },
};

export default function CampaignDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaign, setCampaign] = useState(campaignData);

  // Filter prospects
  const filteredProspects = prospectsData.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/campaigns">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{campaign.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                Created on {campaign.createdAt}
              </span>
              <Badge variant="outline" className="gap-1.5">
                <Linkedin className="h-3 w-3" />
                {campaign.type === "inmail" ? "InMail" : "Messaging"}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                In Progress
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Pause className="h-4 w-4 mr-2" />
            Pause Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{campaign.totalProspects}</div>
            <p className="text-sm text-muted-foreground">Total Prospects</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{campaign.reachouts}</div>
            <p className="text-sm text-muted-foreground">Reachouts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{campaign.acceptanceRate}%</div>
            <p className="text-sm text-muted-foreground">Acceptance Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{campaign.responseRate}%</div>
            <p className="text-sm text-muted-foreground">Response Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training Center</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search prospects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Status
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Sent</DropdownMenuItem>
                <DropdownMenuItem>Opened</DropdownMenuItem>
                <DropdownMenuItem>Replied</DropdownMenuItem>
                <DropdownMenuItem>Meeting Booked</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  Industry
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Technology</DropdownMenuItem>
                <DropdownMenuItem>Fintech</DropdownMenuItem>
                <DropdownMenuItem>SaaS</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="ml-auto">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export to CSV
              </Button>
            </div>
          </div>

          {/* Prospects Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prospect</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProspects.map((prospect) => (
                  <TableRow key={prospect.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{prospect.name}</div>
                        <div className="text-sm text-muted-foreground">{prospect.title}</div>
                      </div>
                    </TableCell>
                    <TableCell>{prospect.company}</TableCell>
                    <TableCell>{prospect.industry}</TableCell>
                    <TableCell>
                      <Badge className={statusConfig[prospect.status as keyof typeof statusConfig]?.className}>
                        {statusConfig[prospect.status as keyof typeof statusConfig]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={prospect.score >= 70 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                        {prospect.score}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{prospect.lastActivity}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* Training Center Tab */}
        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Center</CardTitle>
              <p className="text-sm text-muted-foreground">
                Review AI-generated sequences and provide feedback to improve messaging across all prospects.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Sample Sequence */}
                <div className="space-y-4">
                  <h3 className="font-medium">Sample Sequence - Sarah Chen</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Day 1</Badge>
                        <span className="text-sm text-muted-foreground">Connect Message</span>
                      </div>
                      <p className="text-sm">
                        Hi Sarah, I noticed your work on engineering scalability at Stripe.
                        We&apos;re helping engineering leaders automate their outreach - would love to connect!
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Day 4</Badge>
                        <span className="text-sm text-muted-foreground">Follow-up 1</span>
                      </div>
                      <p className="text-sm">
                        Hi Sarah, following up on my previous message. I&apos;d love to show you how
                        we&apos;ve helped other engineering leaders save 10+ hours per week. Open to a quick chat?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback Section */}
                <div className="space-y-4">
                  <h3 className="font-medium">Provide Feedback</h3>
                  <p className="text-sm text-muted-foreground">
                    Your feedback will be applied across ALL prospects in this campaign.
                  </p>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Button variant="outline" className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <ThumbsDown className="h-4 w-4" />
                        Needs Work
                      </Button>
                    </div>
                    <textarea
                      className="w-full min-h-[120px] rounded-md border p-3 text-sm"
                      placeholder="Add specific feedback about tone, word selection, formatting, or length..."
                    />
                    <Button>Submit Feedback</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <p className="text-sm text-muted-foreground">
                Adjust your campaign settings and outreach preferences.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input defaultValue={campaign.name} />
              </div>

              {/* Re-engagement Messages */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Re-Engagement Messages</label>
                <p className="text-sm text-muted-foreground">
                  Number of follow-up messages to send after initial outreach.
                </p>
                <div className="flex items-center gap-4">
                  <Input type="number" defaultValue={campaign.reEngagementCount} className="w-24" />
                  <span className="text-sm text-muted-foreground">messages, every</span>
                  <Input type="number" defaultValue={campaign.reEngagementInterval} className="w-24" />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>

              {/* Outreach Language */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Outreach Language</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-48 justify-between">
                      {campaign.outreachLanguage}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>Spanish</DropdownMenuItem>
                    <DropdownMenuItem>French</DropdownMenuItem>
                    <DropdownMenuItem>German</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Autopilot */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <label className="text-sm font-medium">Autopilot Mode</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send messages on your behalf without manual approval.
                  </p>
                </div>
                <Button variant={campaign.autopilot ? "default" : "outline"}>
                  {campaign.autopilot ? "On" : "Off"}
                </Button>
              </div>

              {/* Daily Volume */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Sequence Volume</label>
                <p className="text-sm text-muted-foreground">
                  Maximum number of outreach messages sent per day.
                </p>
                <Input type="number" defaultValue={campaign.dailyVolume} className="w-32" />
              </div>

              {/* Outreach Timing */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Outreach Timing</label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input type="time" defaultValue="09:00" className="w-32" />
                </div>
              </div>

              {/* Outreach Days */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Outreach Days</label>
                <div className="flex flex-wrap gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <Button
                      key={day}
                      variant={campaign.outreachDays.some(d => d.startsWith(day)) ? "default" : "outline"}
                      size="sm"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Info Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Core components of the campaign. These cannot be edited after launch.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Reachout Through</label>
                      <p className="text-sm text-muted-foreground">
                        {campaign.type === "inmail" ? "LinkedIn InMail" : "LinkedIn Message"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Selected Product</label>
                      <p className="text-sm text-muted-foreground">{campaign.selectedProduct}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Zap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Writing Style</label>
                      <p className="text-sm text-muted-foreground">{campaign.writingStyle}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Included Profiles</label>
                      <p className="text-sm text-muted-foreground">{campaign.profileType}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Research Agents</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {campaign.researchAgents.map((agent) => (
                          <Badge key={agent} variant="secondary">{agent}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <LinkIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Input URL</label>
                      <p className="text-sm text-muted-foreground break-all">{campaign.inputUrl}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Created</label>
                      <p className="text-sm text-muted-foreground">{campaign.createdAt}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <label className="text-sm font-medium">Prospect Pool</label>
                      <p className="text-sm text-muted-foreground">{campaign.prospectPoolSize} prospects uploaded</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
