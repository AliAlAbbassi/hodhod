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
  ChevronRight,
  Search,
  Download,
  Filter,
  MoreVertical,
  Linkedin,
  MessageSquare,
  MessageCircle,
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
  AlertCircle,
  X,
  Loader2,
  Check,
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
  isTraining: false,
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
  const [isProspectDetailsOpen, setIsProspectDetailsOpen] = useState(false);

  // Training Center state
  const [trainingStep, setTrainingStep] = useState<"intro" | "training" | "messaging" | "launch">("intro");
  const [showTrainingAlert, setShowTrainingAlert] = useState(true);
  const [isFetchingProspects, setIsFetchingProspects] = useState(true);

  // Filter prospects
  const filteredProspects = prospectsData.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Campaign Summary Card */}
      <Card>
        <CardContent className="p-6">
          {/* Header Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">{campaign.name}</h1>
              {/* Status Badge - Click to change for demo */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {campaign.status === "not_launched" ? (
                    <Badge variant="outline" className="gap-1.5 border-yellow-300 bg-yellow-50 text-yellow-700 cursor-pointer">
                      <AlertCircle className="h-3 w-3" />
                      Campaign is not Launched
                    </Badge>
                  ) : campaign.status === "in_progress" ? (
                    <Badge variant="outline" className="gap-1.5 border-green-300 bg-green-50 text-green-700 cursor-pointer">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      In Progress
                    </Badge>
                  ) : campaign.status === "paused" ? (
                    <Badge variant="outline" className="gap-1.5 border-orange-300 bg-orange-50 text-orange-700 cursor-pointer">
                      <Pause className="h-3 w-3" />
                      Paused
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1.5 cursor-pointer">
                      {campaign.status}
                    </Badge>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setCampaign({ ...campaign, status: "not_launched" as const })}>
                    Not Launched
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCampaign({ ...campaign, status: "in_progress" as const })}>
                    In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCampaign({ ...campaign, status: "paused" as const })}>
                    Paused
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                <DropdownMenuItem>Pause Campaign</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete Campaign</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Meta Row */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
            <span>Created on {campaign.createdAt}</span>
            <span className="text-border">|</span>
            <Badge variant="outline" className="gap-1.5">
              <Linkedin className="h-3 w-3" />
              {campaign.type === "inmail" ? "InMail" : "Messaging"}
            </Badge>
            <Badge
              variant="outline"
              className={`gap-1.5 cursor-pointer ${campaign.isTraining ? "" : "opacity-50"}`}
              onClick={() => setCampaign({ ...campaign, isTraining: !campaign.isTraining })}
            >
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              Training
            </Badge>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 py-6 border-y">
            <div className="text-center">
              <div className="text-2xl font-semibold">{campaign.totalProspects}</div>
              <p className="text-sm text-muted-foreground">Total Prospects</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{campaign.reachouts}</div>
              <p className="text-sm text-muted-foreground">Reachouts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{campaign.acceptanceRate}%</div>
              <p className="text-sm text-muted-foreground">Acceptance Rate</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold">{campaign.responseRate}%</div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
            </div>
          </div>

          {/* Prospect Fetch Details */}
          <button
            className="flex items-center gap-2 mt-4 text-sm font-medium hover:text-foreground"
            onClick={() => setIsProspectDetailsOpen(!isProspectDetailsOpen)}
          >
            {isProspectDetailsOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Prospect Fetch Details
          </button>

          {isProspectDetailsOpen && (
            <div className="mt-4 pl-6 space-y-2 text-sm text-muted-foreground">
              <p>Prospect pool size: {campaign.prospectPoolSize}</p>
              <p>Source: LinkedIn Sales Navigator</p>
            </div>
          )}
        </CardContent>
      </Card>

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
        <TabsContent value="training" className="min-h-[600px]">
          {/* Progress Steps - Top Right */}
          <div className="flex items-center justify-end gap-4 text-sm mb-4">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">•</span>
              <span className={trainingStep === "intro" || trainingStep === "training" ? "text-foreground" : "text-muted-foreground"}>
                Training
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="gap-1">
                <Linkedin className="h-3 w-3" />
                Messaging
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Approve Messaging and Launch Campaign</span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="flex gap-6 h-[550px]">
            {/* LEFT SIDEBAR - Prospects List */}
            <div className="w-64 shrink-0 flex flex-col">
              <h3 className="text-sm font-medium mb-3">Select a Prospect to train</h3>
              {isFetchingProspects ? (
                <button
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setIsFetchingProspects(false)}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching Prospects
                </button>
              ) : (
                <div className="space-y-1 flex-1 overflow-auto">
                  {prospectsData.slice(0, 5).map((prospect) => (
                    <button
                      key={prospect.id}
                      className="w-full text-left p-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-3"
                      onClick={() => setTrainingStep("training")}
                    >
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prospect.name}`}
                          alt={prospect.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{prospect.name}</div>
                        <div className="text-xs text-muted-foreground">{prospect.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE - Messages & Feedback */}
            <div className="flex-1 flex flex-col border-l pl-6">
              {/* Alert Banner */}
              {showTrainingAlert && (
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50/50 px-4 py-3 mb-4">
                  <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-sm flex-1">
                    The prospect you are currently viewing is an example used for training this campaign. Any training you apply here in the training center will be applied to all prospects in the campaign.
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 -mt-1"
                    onClick={() => setShowTrainingAlert(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1 overflow-auto">
                {/* Center Modal - Intro */}
                {trainingStep === "intro" && (
                  <div className="flex items-center justify-center h-full">
                    <Card className="shadow-lg max-w-md w-full">
                      <CardContent className="pt-8 pb-6 px-8 text-center">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
                          <MessageCircle className="h-8 w-8" />
                        </div>
                        <h2 className="text-xl font-semibold mb-4">Review and Train Your Messaging</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Take a moment to review a selection of prospects uploaded to your campaign. On this screen you can provide feedback and fine-tune Valley&apos;s messaging style. Your insights will help ensure messages are written in your desired tone.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                          Once you are happy with the campaign&apos;s messaging style, you can launch your campaign and start sending outbound messages to your prospects.
                        </p>
                        <Button className="w-full" onClick={() => setTrainingStep("training")}>
                          Continue
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Training Step */}
                {trainingStep === "training" && (
                  <div className="grid gap-8 lg:grid-cols-2">
                    {/* Sample Sequence */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Sample Sequence - Sarah Chen</h3>
                      <div className="space-y-3">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Day 1</Badge>
                            <span className="text-sm text-muted-foreground">Connect Message</span>
                          </div>
                          <p className="text-sm">
                            Hi Sarah, I noticed your work on engineering scalability at Stripe. We&apos;re helping engineering leaders automate their outreach - would love to connect!
                          </p>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Day 4</Badge>
                            <span className="text-sm text-muted-foreground">Follow-up 1</span>
                          </div>
                          <p className="text-sm">
                            Hi Sarah, following up on my previous message. I&apos;d love to show you how we&apos;ve helped other engineering leaders save 10+ hours per week. Open to a quick chat?
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Provide Feedback</h3>
                      <p className="text-sm text-muted-foreground">
                        Your feedback will be applied across ALL prospects in this campaign.
                      </p>
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
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Feedback Input - Only in right side */}
              <div className="mt-auto pt-4 space-y-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  Regeneration takes approximately 40 seconds so please combine all feedback into one prompt
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Provide feedback here"
                    className="flex-1"
                  />
                  <Button size="icon" variant="secondary" className="shrink-0">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
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
