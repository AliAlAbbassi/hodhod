"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  ChevronDown,
  Search,
  Download,
  Filter,
  MoreVertical,
  Linkedin,
  MessageSquare,
  MessageCircle,
  Clock,
  Calendar,
  Globe,
  Zap,
  Users,
  FileText,
  Link as LinkIcon,
  Info,
  Play,
  Pause,
  RefreshCw,
  Sparkles,
  ArrowRight,
  CornerDownRight,
  Briefcase,
  Building,
  User,
  Trash2,
  Settings,
  X,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DailyVolumeSlider } from "@/components/campaign-settings/daily-volume-slider";
import { SequenceTiming } from "@/components/campaign-settings/sequence-timing";
import { Checkbox } from "@/components/ui/checkbox";

// Mock campaign data
const campaignData = {
  id: "1",
  name: "Positive Response List (from Shubh) - Open Profiles",
  status: "in_progress" as "in_progress" | "paused" | "not_launched",
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
  outreachStartTime: "09:00",
  outreachEndTime: "17:00",
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
    icpFit: "HIGH",
    role: "VP Engineering",
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
    icpFit: "HIGH",
    role: "CTO",
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
    icpFit: "MEDIUM",
    role: "Head of Engineering",
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
    icpFit: "LOW",
    role: "Engineering Director",
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
    icpFit: "HIGH",
    role: "VP Platform",
  },
];

const statusConfig = {
  sent: { label: "Sent", className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80" },
  opened: { label: "Opened", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80" },
  replied: { label: "Replied", className: "bg-green-100 text-green-700 hover:bg-green-100/80" },
  meeting_booked: {
    label: "Meeting Booked",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  },
};

const icpFitConfig: Record<string, string> = {
  HIGH: "bg-green-100 text-green-700 border-green-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-red-100 text-red-700 border-red-200",
};

export default function CampaignDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [campaign, setCampaign] = useState(campaignData);
  const [isProspectDetailsOpen, setIsProspectDetailsOpen] = useState(false);

  // Training Center state
  const [trainingStep, setTrainingStep] = useState<
    "intro" | "training" | "messaging" | "launch"
  >("intro");
  const [showTrainingAlert, setShowTrainingAlert] = useState(true);
  const [isFetchingProspects, setIsFetchingProspects] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<
    (typeof prospectsData)[0] | null
  >(null);
  const [showLaunchSuccessModal, setShowLaunchSuccessModal] = useState(false);
  const [prospectSearch, setProspectSearch] = useState("");

  const trainingProspects = prospectsData.filter(
    (p) =>
      p.name.toLowerCase().includes(prospectSearch.toLowerCase()) ||
      p.company.toLowerCase().includes(prospectSearch.toLowerCase())
  );

  const filteredProspects = prospectsData.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const [selectedProspectIds, setSelectedProspectIds] = useState<Set<string>>(new Set());

  const toggleAllProspects = () => {
    if (selectedProspectIds.size === filteredProspects.length) {
      setSelectedProspectIds(new Set());
    } else {
      setSelectedProspectIds(new Set(filteredProspects.map(p => p.id)));
    }
  };

  const toggleProspect = (id: string) => {
    const newSelected = new Set(selectedProspectIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProspectIds(newSelected);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">{campaign.name}</h1>
          {campaign.status === "in_progress" ? (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-green-100 text-green-700 hover:bg-green-100">
              <span className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
              In Progress
            </Badge>
          ) : campaign.status === "paused" ? (
             <Badge variant="secondary" className="gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-100">
               <Pause className="h-3 w-3" />
               Paused
             </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              {campaign.status}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refetch Prospects
          </Button>
          {campaign.status === "in_progress" ? (
             <Button variant="outline" className="gap-2" onClick={() => setCampaign({...campaign, status: 'paused'})}>
                <Pause className="h-4 w-4" />
                Pause
             </Button>
          ) : (
             <Button variant="outline" className="gap-2" onClick={() => setCampaign({...campaign, status: 'in_progress'})}>
                <Play className="h-4 w-4" />
                Resume
             </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <div className="shrink-0 mb-6 border-b">
           <TabsList className="w-full justify-start h-auto p-0 bg-transparent rounded-none">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="training" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Training Center
              </TabsTrigger>
               <TabsTrigger 
                value="settings" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Settings
              </TabsTrigger>
               <TabsTrigger 
                value="info" 
                className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
              >
                Info
              </TabsTrigger>
           </TabsList>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">
             {/* Overview Tab Content */}
             <TabsContent value="overview" className="h-full overflow-auto space-y-4 p-1">
                 {/* Filters Bar */}
                 <div className="flex items-center justify-between">
                    {selectedProspectIds.size > 0 ? (
                       <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-200">
                          <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedProspectIds(new Set())}>
                             <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                                {selectedProspectIds.size}
                             </span>
                             Reset
                             <X className="h-4 w-4" />
                          </Button>
                          <div className="h-4 w-px bg-border mx-2" />
                          <Button variant="outline" size="sm" className="gap-2">
                             Export
                          </Button>
                          <Button variant="destructive" size="sm" className="gap-2">
                             Delete Prospects
                          </Button>
                       </div>
                    ) : (
                       <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
                             <Filter className="h-3.5 w-3.5" />
                             Status
                             <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
                             <Building className="h-3.5 w-3.5" />
                             Company
                             <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
                             <User className="h-3.5 w-3.5" />
                             Role
                             <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
                             <Briefcase className="h-3.5 w-3.5" />
                             Industry
                             <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                          <Button variant="outline" size="sm" className="gap-2 rounded-full border-dashed">
                             <Sparkles className="h-3.5 w-3.5" />
                             ICP
                             <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                          </Button>
                       </div>
                    )}

                    <div className="flex items-center gap-2">
                        {/* Search is hidden in the design provided but useful to keep or move */}
                        <div className="relative w-64">
                             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                             <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9"
                             />
                        </div>
                       <Button variant="outline" size="sm">Export</Button>
                    </div>
                 </div>

                 {/* Prospects Table */}
                  <div className="rounded-md border bg-card">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[40px] px-4">
                            <Checkbox 
                              checked={selectedProspectIds.size === filteredProspects.length && filteredProspects.length > 0}
                              onCheckedChange={toggleAllProspects}
                            />
                          </TableHead>
                          <TableHead className="w-[300px]">Prospect Name</TableHead>
                          <TableHead className="w-[250px]">Company with Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>ICP Fit</TableHead>
                          <TableHead>Industry</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProspects.map((prospect) => (
                          <TableRow
                            key={prospect.id}
                            className="cursor-pointer hover:bg-muted/30"
                            data-state={selectedProspectIds.has(prospect.id) ? "selected" : undefined}
                          >
                            <TableCell className="px-4">
                              <Checkbox 
                                checked={selectedProspectIds.has(prospect.id)}
                                onCheckedChange={() => toggleProspect(prospect.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prospect.name}`} />
                                    <AvatarFallback>{prospect.name[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-sm">{prospect.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{prospect.role}</span>
                                    <span className="text-xs text-muted-foreground">{prospect.company}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={`font-normal border ${
                                  statusConfig[prospect.status as keyof typeof statusConfig]?.className
                                }`}
                              >
                                {statusConfig[prospect.status as keyof typeof statusConfig]?.label}
                              </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    variant="outline"
                                    className={`font-semibold border px-3 py-0.5 ${icpFitConfig[prospect.icpFit || "LOW"]}`}
                                >
                                    {prospect.icpFit}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                              {prospect.industry}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
             </TabsContent>

             {/* Training Center Tab - NEW */}
             <TabsContent value="training" className="h-full flex gap-6 data-[state=active]:flex pt-1">
                {/* Sidebar */}
                <Card className="w-80 shrink-0 flex flex-col h-full overflow-hidden border-r border-border/50 shadow-none rounded-none border-y-0 border-l-0">
                    <div className="p-4 border-b">
                         <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input 
                                placeholder="Search prospects..." 
                                className="pl-9 bg-muted/50 border-none" 
                                value={prospectSearch}
                                onChange={(e) => setProspectSearch(e.target.value)}
                            />
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {trainingProspects.map(prospect => (
                            <button
                                key={prospect.id}
                                onClick={() => setSelectedProspect(prospect)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                    selectedProspect?.id === prospect.id 
                                    ? "bg-muted" 
                                    : "hover:bg-muted/50"
                                }`}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prospect.name}`} />
                                    <AvatarFallback>{prospect.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="font-medium truncate">{prospect.name}</div>
                                    <div className="text-xs text-muted-foreground truncate">{prospect.title}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden rounded-lg border bg-background relative">
                   {/* Scrollable Area */}
                   <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                       {/* Alert Banner */}
                       <div className="flex gap-4 p-4 rounded-lg bg-blue-50/50 border border-blue-100 text-blue-900">
                          <Info className="h-5 w-5 shrink-0 text-blue-600" />
                          <div className="space-y-1">
                             <p className="font-medium text-sm">Training Mode</p>
                             <p className="text-sm text-blue-700/80">
                                The prospect you are currently viewing is an example used for training this campaign. 
                                Any training you apply here will be applied to all prospects.
                             </p>
                          </div>
                       </div>

                       {/* Prospect Header */}
                       {selectedProspect ? (
                           <>
                           <div className="flex items-center gap-4">
                               <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProspect.name}`} />
                                    <AvatarFallback>{selectedProspect.name[0]}</AvatarFallback>
                               </Avatar>
                               <div>
                                   <h2 className="text-xl font-semibold">{selectedProspect.name}</h2>
                                   <p className="text-muted-foreground">{selectedProspect.title} @ {selectedProspect.company}</p>
                               </div>
                           </div>

                           {/* Message Card */}
                           <Card className="border-dashed shadow-sm">
                               <CardHeader className="pb-3 border-b border-dashed bg-muted/20">
                                   <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                           <Linkedin className="h-4 w-4" />
                                           Connect Message
                                       </div>
                                   </div>
                               </CardHeader>
                               <CardContent className="pt-4 text-sm leading-relaxed space-y-4">
                                   <p>Hey {selectedProspect?.name.split(' ')[0]},</p>
                                   <p>Saw you&apos;re &quot;building for fun&quot; now - that&apos;s awesome. Reminds me of my own tinkering days.</p>
                                   <p>Ever think about connecting with others doing similar projects?</p>
                               </CardContent>
                           </Card>

                           {/* Follow-up Placeholder */}
                           <div className="opacity-60 pointer-events-none">
                                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Follow-up 1 (2 days later)
                                </div>
                                <Card className="border-dashed shadow-sm bg-muted/10">
                                     <CardContent className="p-4 h-12" />
                                </Card>
                           </div>
                           </>
                       ) : (
                           <div className="flex items-center justify-center h-full text-muted-foreground">
                               Select a prospect to view training details
                           </div>
                       )}
                   </div>

                   {/* Sticky Footer */}
                   <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-6">
                        <div className="max-w-3xl mx-auto space-y-3">
                            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                                <Sparkles className="h-3 w-3" />
                                Regeneration takes approx 40 seconds...
                            </div>
                            <div className="relative flex items-center gap-2">
                                <Input 
                                    placeholder="Provide feedback here to refine the message..." 
                                    className="h-14 pl-6 pr-16 rounded-full shadow-sm border-muted-foreground/20 text-base"
                                />
                                <Button 
                                    size="icon" 
                                    className="absolute right-2 h-10 w-10 rounded-full bg-black hover:bg-black/90 text-white"
                                >
                                    <Sparkles className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                   </div>
                </div>
             </TabsContent>

             {/* Settings Tab */}
             <TabsContent value="settings" className="h-full overflow-hidden p-1">
                <div className="flex h-full gap-8">
                  {/* Left Column - Form */}
                  <div className="w-[500px] shrink-0 overflow-y-auto pb-20">
                    <Card className="border-none shadow-none bg-transparent">
                       <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                             <Settings className="h-4 w-4" />
                             <h2 className="font-medium text-lg">Basic Information</h2>
                          </div>
                          <Button size="sm" variant="outline">Save</Button>
                       </div>

                       <div className="space-y-8">
                          {/* Campaign Name */}
                          <div className="space-y-3">
                             <label className="text-sm font-medium">Campaign Name</label>
                             <Input defaultValue={campaign.name} className="bg-background" />
                          </div>

                          {/* Outreach Language */}
                          <div className="space-y-3">
                             <div className="space-y-1">
                                <label className="text-sm font-medium">Outreach Language</label>
                                <p className="text-sm text-muted-foreground">Language you&apos;d like to use for sending sequences</p>
                             </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="outline" className="w-full justify-between bg-background font-normal">
                                      {campaign.outreachLanguage}
                                      <ChevronDown className="h-4 w-4 opacity-50" />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[450px]">
                                   <DropdownMenuItem>English</DropdownMenuItem>
                                   <DropdownMenuItem>Spanish</DropdownMenuItem>
                                   <DropdownMenuItem>French</DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </div>

                          <div className="h-px bg-border/50" />

                          {/* Autopilot */}
                          <div className="flex items-center justify-between">
                             <div className="space-y-1">
                                <label className="text-sm font-medium">Autopilot</label>
                                <p className="text-sm text-muted-foreground">Allows us to auto send messages without awaiting your approval</p>
                             </div>
                             <Switch checked={campaign.autopilot} />
                          </div>

                          <div className="h-px bg-border/50" />

                          {/* Daily Volume */}
                          <DailyVolumeSlider
                            volume={campaign.dailyVolume}
                            onChange={(volume) => setCampaign({ ...campaign, dailyVolume: volume })}
                          />

                          {/* Sequence Timing */}
                          <SequenceTiming
                            startTime={campaign.outreachStartTime}
                            endTime={campaign.outreachEndTime}
                            days={campaign.outreachDays}
                            onStartTimeChange={(time) => setCampaign({ ...campaign, outreachStartTime: time })}
                            onEndTimeChange={(time) => setCampaign({ ...campaign, outreachEndTime: time })}
                            onDaysChange={(days) => setCampaign({ ...campaign, outreachDays: days })}
                          />
                       </div>
                    </Card>
                  </div>

                  {/* Right Column - Sequence Visualizer */}
                  <div className="flex-1 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] rounded-lg border bg-slate-50/30 overflow-hidden relative">
                     <div className="absolute inset-0 overflow-y-auto">
                        <div className="min-h-full flex flex-col items-center py-20 px-8">
                           {/* Start Badge */}
                           <div className="relative z-10 mb-8">
                              <Badge variant="outline" className="bg-white/80 backdrop-blur py-1.5 px-4 text-sm font-medium shadow-sm gap-2">
                                 <Zap className="h-3.5 w-3.5 fill-yellow-400 text-yellow-600 border-none" />
                                 Sequence Starts
                              </Badge>
                           </div>

                           {/* Timeline */}
                           <div className="relative flex flex-col items-center w-full max-w-lg space-y-8">
                              {/* Connector Line */}
                              <div className="absolute left-1/2 top-0 bottom-8 -translate-x-1/2 w-px border-l-2 border-dashed border-muted-foreground/20 -z-10" />

                              {/* Step 1 */}
                              <div className="w-full relative group">
                                 <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-2 h-2 rounded-full bg-muted-foreground/20" />
                                 <Card className="shadow-sm hover:shadow-md transition-shadow border-muted/60">
                                    <div className="p-4 flex items-start gap-4">
                                       <div className="h-10 w-10 rounded-full border bg-muted/20 flex items-center justify-center shrink-0">
                                          <Sparkles className="h-5 w-5 text-muted-foreground" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium text-sm">Connect Sequence</h4>
                                          <p className="text-xs text-muted-foreground mt-0.5">Day 1 - LinkedIn Message</p>
                                       </div>
                                    </div>
                                 </Card>
                                 <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-2 h-2 rounded-full bg-muted-foreground/20" />
                              </div>

                              {/* Step 2 */}
                              <div className="w-full relative group">
                                 <Card className="shadow-sm hover:shadow-md transition-shadow border-muted/60">
                                    <div className="p-4 flex items-start gap-4">
                                       <div className="h-10 w-10 rounded-full border bg-muted/20 flex items-center justify-center shrink-0">
                                          <Zap className="h-5 w-5 text-muted-foreground" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium text-sm">Followup 1</h4>
                                          <p className="text-xs text-muted-foreground mt-0.5">Day 4 - LinkedIn Message</p>
                                       </div>
                                    </div>
                                 </Card>
                                 <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-2 h-2 rounded-full bg-muted-foreground/20" />
                              </div>

                              {/* Step 3 */}
                              <div className="w-full relative group">
                                 <Card className="shadow-sm hover:shadow-md transition-shadow border-muted/60">
                                    <div className="p-4 flex items-start gap-4">
                                       <div className="h-10 w-10 rounded-full border bg-muted/20 flex items-center justify-center shrink-0">
                                          <CornerDownRight className="h-5 w-5 text-muted-foreground" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium text-sm">Followup 2</h4>
                                          <p className="text-xs text-muted-foreground mt-0.5">Day 7 - LinkedIn Message</p>
                                       </div>
                                    </div>
                                 </Card>
                                 <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-2 h-2 rounded-full bg-muted-foreground/20" />
                              </div>

                              {/* Step 4 */}
                              <div className="w-full relative group">
                                 <Card className="shadow-sm hover:shadow-md transition-shadow border-muted/60">
                                    <div className="p-4 flex items-start gap-4">
                                       <div className="h-10 w-10 rounded-full border bg-muted/20 flex items-center justify-center shrink-0">
                                          <CornerDownRight className="h-5 w-5 text-muted-foreground" />
                                       </div>
                                       <div>
                                          <h4 className="font-medium text-sm">Followup 3</h4>
                                          <p className="text-xs text-muted-foreground mt-0.5">Day 10 - LinkedIn Message</p>
                                       </div>
                                    </div>
                                 </Card>
                              </div>

                           </div>
                        </div>
                     </div>
                  </div>
                </div>
             </TabsContent>

             {/* Info Tab - Reuse Content */}
             <TabsContent value="info" className="space-y-4 overflow-auto h-full p-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Campaign Information</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Core components of the campaign. These cannot be edited after
                        launch.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <MessageSquare className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Reachout Through
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.type === "inmail"
                                  ? "LinkedIn InMail"
                                  : "LinkedIn Message"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Selected Product
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.selectedProduct}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Zap className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Writing Style
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.writingStyle}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Included Profiles
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.profileType}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Research Agents
                              </label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {campaign.researchAgents.map((agent) => (
                                  <Badge key={agent} variant="secondary">
                                    {agent}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <LinkIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">Input URL</label>
                              <p className="text-sm text-muted-foreground break-all">
                                {campaign.inputUrl}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">Created</label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.createdAt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <label className="text-sm font-medium">
                                Prospect Pool
                              </label>
                              <p className="text-sm text-muted-foreground">
                                {campaign.prospectPoolSize} prospects uploaded
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
             </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
