"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MoreVertical,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Pause,
  Play,
  Trash2,
  Info,
  Loader2,
  SlidersHorizontal,
  Calendar,
  ArrowUpDown,
  Linkedin,
  RefreshCw,
  MessageSquare,
  Users,
  Clock,
  Mail,
  Zap,
  Activity,
  Heart,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles, FileText } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export type CampaignStatus = "in_progress" | "paused" | "completed" | "draft" | "preparing" | "archived";
export type CampaignType = "inmail" | "messaging";
export type SortOption = "recent" | "alphabetically";

export type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  createdAt: string;
  totalProspects: number;
  reachouts: number;
  acceptanceRate: number;
  responseRate: number;
  prospectPoolSize: number;
  isFetching?: boolean;
  timeLeft?: string;
  generatingMessaging?: boolean;
};

export const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "B2B Lead Gen Agency Owners InMail",
    status: "in_progress",
    type: "inmail",
    createdAt: "07/22/2025",
    totalProspects: 87,
    reachouts: 48,
    acceptanceRate: 100,
    responseRate: 42,
    prospectPoolSize: 150,
    timeLeft: "1 day left",
    generatingMessaging: true,
  },
  {
    id: "2",
    name: "B2B Lead Gen Agency Owners",
    status: "in_progress",
    type: "messaging",
    createdAt: "07/22/2025",
    totalProspects: 250,
    reachouts: 60,
    acceptanceRate: 51,
    responseRate: 57,
    prospectPoolSize: 300,
    timeLeft: "4 days left",
    generatingMessaging: true,
  },
  {
    id: "3",
    name: "Early Stage Sales Leaders",
    status: "in_progress",
    type: "messaging",
    createdAt: "02/25/2025",
    totalProspects: 1000,
    reachouts: 152,
    acceptanceRate: 55,
    responseRate: 53,
    prospectPoolSize: 1200,
    timeLeft: "17 days left",
    generatingMessaging: true,
  },
  {
    id: "4",
    name: "Early Stage Sales leaders InMail",
    status: "in_progress",
    type: "inmail",
    createdAt: "02/25/2025",
    totalProspects: 1140,
    reachouts: 482,
    acceptanceRate: 100,
    responseRate: 23,
    prospectPoolSize: 1500,
    timeLeft: "13 days left",
    generatingMessaging: true,
  },
  {
    id: "5",
    name: "Valley Founders + Posted Recently",
    status: "in_progress",
    type: "messaging",
    createdAt: "11/11/2024",
    totalProspects: 1768,
    reachouts: 241,
    acceptanceRate: 29,
    responseRate: 42,
    prospectPoolSize: 2000,
    timeLeft: "61 days left",
    generatingMessaging: true,
  },
];

const statusConfig: Record<
  CampaignStatus,
  { label: string; dotColor?: string }
> = {
  in_progress: {
    label: "In Progress",
    dotColor: "bg-green-500",
  },
  paused: {
    label: "Paused",
    dotColor: "bg-yellow-500",
  },
  completed: {
    label: "Completed",
    dotColor: "bg-gray-500",
  },
  draft: {
    label: "Draft",
    dotColor: "bg-gray-400",
  },
};

const typeConfig: Record<CampaignType, { label: string }> = {
  inmail: {
    label: "InMail",
  },
  messaging: {
    label: "Messaging",
  },
};

const DottedBackground = () => (
  <div className="absolute inset-0 z-0 opacity-[0.4]" 
    style={{ 
      backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)", 
      backgroundSize: "16px 16px" 
    }} 
  />
);

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: "", type: "inmail" as CampaignType });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Mock Metrics
  const approvalsNeeded = 767;
  const messagesScheduled = 184;
  const connectsSent = 0;
  const connectsLimit = 25;
  const inmailsSent = 37;
  const inmailsLimit = 40;

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter((c) => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "alphabetically") {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const getCampaignsByStatus = (status: CampaignStatus) => {
    return filteredCampaigns.filter(c => c.status === status);
  };

  const preparingCampaigns = getCampaignsByStatus("preparing");
  const activeCampaigns = getCampaignsByStatus("in_progress");
  const pausedCampaigns = getCampaignsByStatus("paused");
  const completedCampaigns = getCampaignsByStatus("completed");
  const archivedCampaigns = getCampaignsByStatus("archived");

  const handleStatusChange = (id: string, newStatus: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editingCampaign) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === editingCampaign.id
            ? { ...c, name: formData.name, type: formData.type }
            : c
        )
      );
    } else {
      const newCampaign: Campaign = {
        id: String(Date.now()),
        name: formData.name,
        status: "draft",
        type: formData.type,
        createdAt: new Date().toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        }),
        totalProspects: 0,
        reachouts: 0,
        acceptanceRate: 0,
        responseRate: 0,
        prospectPoolSize: 0,
      };
      setCampaigns((prev) => [...prev, newCampaign]);
    }

    setFormData({ name: "", type: "inmail" });
    setEditingCampaign(null);
    setIsSheetOpen(false);
  };

  const openEditSheet = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({ name: campaign.name, type: campaign.type });
    setIsSheetOpen(true);
  };

  const handleSelectCampaignType = (type: "ai" | "templated") => {
    setIsCreateModalOpen(false);
    router.push(`/campaigns/create?type=${type}`);
  };


  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative w-[300px]">
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-3"
          />
        </div>
        <Button variant="outline" className="gap-2 border-dashed">
          <Heart className="h-4 w-4" />
          Type
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" className="gap-2 border-dashed">
          <SlidersHorizontal className="h-4 w-4" />
          Status
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="outline" className="gap-2 border-dashed">
          <Clock className="h-4 w-4" />
          Date
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        {/* Approvals Needed */}
        <Card className="relative overflow-hidden border-dashed">
          <DottedBackground />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-4xl font-semibold tracking-tight">{approvalsNeeded}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-tight">
                    Approvals<br />Needed
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button className="w-full justify-between bg-black text-white hover:bg-black/90 h-9 text-xs">
                Approve Now
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Scheduled */}
        <Card className="relative overflow-hidden border-dashed">
          <DottedBackground />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-4xl font-semibold tracking-tight">{messagesScheduled}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-tight">
                    Messages<br />Scheduled
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full justify-between bg-white h-9 text-xs">
                All Scheduled
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connects Sent */}
        <Card className="relative overflow-hidden border-dashed">
          <DottedBackground />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-4xl font-semibold tracking-tight">{connectsSent}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-tight">
                    Connects<br />Sent
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-white">
                <Calendar className="h-3.5 w-3.5" />
                Today
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </div>
            
            <div className="relative pt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                <span>0</span>
                <span>{connectsLimit}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                  style={{ width: `${(connectsSent / connectsLimit) * 100}%` }}
                />
              </div>
              {/* Markers */}
              <div className="absolute top-[26px] left-0 w-px h-2 bg-gray-300" />
              <div className="absolute top-[26px] right-0 w-px h-2 bg-gray-300" />
            </div>
          </CardContent>
        </Card>

        {/* InMails Sent */}
        <Card className="relative overflow-hidden border-dashed">
          <DottedBackground />
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-4xl font-semibold tracking-tight">{inmailsSent}</div>
                  <div className="text-sm text-muted-foreground mt-1 leading-tight">
                    InMails<br />Sent
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1 bg-white">
                <Calendar className="h-3.5 w-3.5" />
                Today
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </div>
            
            <div className="relative pt-2">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
                <span>0</span>
                <span>{inmailsLimit}</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-300 via-pink-300 to-purple-400 rounded-full"
                  style={{ width: `${(inmailsSent / inmailsLimit) * 100}%` }}
                />
              </div>
              {/* Markers */}
              <div className="absolute top-[26px] left-0 w-px h-2 bg-gray-300" />
              <div className="absolute top-[26px] right-0 w-px h-2 bg-gray-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Lists */}
      <div className="space-y-8">
        <CampaignSection 
          title="Preparing Campaigns" 
          count={preparingCampaigns.length} 
          campaigns={preparingCampaigns}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
        
        <CampaignSection 
          title="Active Campaigns" 
          count={activeCampaigns.length} 
          campaigns={activeCampaigns}
          defaultOpen={true}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

        <CampaignSection 
          title="Paused Campaigns" 
          count={pausedCampaigns.length} 
          campaigns={pausedCampaigns}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

        <CampaignSection 
          title="Completed Campaigns" 
          count={completedCampaigns.length} 
          campaigns={completedCampaigns}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />

        <CampaignSection 
          title="Archived" 
          count={archivedCampaigns.length} 
          campaigns={archivedCampaigns}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      </div>


      {/* Create Campaign Button */}
      <Button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 shadow-lg"
      >
        <Plus className="mr-2 h-4 w-4" />
        Campaign
      </Button>

      {/* Create Campaign Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="text-xl font-semibold">Create Campaign</DialogTitle>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => handleSelectCampaignType("ai")}
              className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
                <Sparkles className="h-6 w-6 text-pink-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Hodhod AI</span>
                  <span className="text-sm text-muted-foreground">Recommended</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Let Hodhod automatically craft hyper-personalised outreach for you.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>

            <button
              onClick={() => handleSelectCampaignType("templated")}
              className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <div className="flex-1">
                <span className="font-semibold">Templated</span>
                <p className="mt-1 text-sm text-muted-foreground">
                  Use a repeatable template to control & test exactly how you want to reach out.
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {editingCampaign ? "Edit Campaign" : "Create Campaign"}
            </SheetTitle>
            <SheetDescription>
              {editingCampaign
                ? "Update your campaign details."
                : "Set up a new outreach campaign."}
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Campaign Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Q1 Enterprise Outreach"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Type</label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.type === "inmail" ? "default" : "outline"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "inmail" }))
                  }
                  className="flex-1"
                >
                  InMail
                </Button>
                <Button
                  type="button"
                  variant={formData.type === "messaging" ? "default" : "outline"}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, type: "messaging" }))
                  }
                  className="flex-1"
                >
                  Messaging
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave}>
              {editingCampaign ? "Save Changes" : "Create Campaign"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CampaignSection({ 
  title, 
  count, 
  campaigns, 
  defaultOpen = false,
  onStatusChange,
  onDelete
}: { 
  title: string; 
  count: number; 
  campaigns: Campaign[]; 
  defaultOpen?: boolean;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-4">
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-2 group">
          <div className="flex items-center gap-2 text-lg font-medium">
            {title}
            <span className="text-muted-foreground font-normal text-sm">{count}</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "" : "-rotate-90"}`} />
        </CollapsibleTrigger>
        
        {isOpen && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="h-3 w-3" />
            <span className="text-foreground">Recent</span>
            <span>Alphabetically</span>
          </div>
        )}
      </div>
      
      <CollapsibleContent>
        <div className="grid gap-6 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onStatusChange={(status) => onStatusChange(campaign.id, status)}
              onDelete={() => onDelete(campaign.id)}
            />
          ))}
          {campaigns.length === 0 && (
            <div className="col-span-2 py-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg">
              No campaigns in this section
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function CampaignCard({
  campaign,
  onStatusChange,
  onDelete,
}: {
  campaign: Campaign;
  onStatusChange: (status: CampaignStatus) => void;
  onDelete: () => void;
}) {
  const router = useRouter();
  const typeCfg = typeConfig[campaign.type];

  const handleCardClick = () => {
    router.push(`/campaigns/${campaign.id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex items-start justify-between p-6 pb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold text-base leading-tight">{campaign.name}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-2 -mt-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {campaign.status === "in_progress" && (
                <DropdownMenuItem onClick={() => onStatusChange("paused")} className="gap-3 py-3">
                  <Pause className="h-5 w-5" />
                  Pause Campaign
                </DropdownMenuItem>
              )}
              {(campaign.status === "paused" || campaign.status === "draft") && (
                <DropdownMenuItem onClick={() => onStatusChange("in_progress")} className="gap-3 py-3">
                  <Play className="h-5 w-5" />
                  {campaign.status === "draft" ? "Start Campaign" : "Resume Campaign"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="gap-3 py-3">
                <RefreshCw className="h-5 w-5" />
                Refetch Prospects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="gap-3 py-3 text-orange-600 focus:text-orange-600">
                <Trash2 className="h-5 w-5" />
                Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Row */}
        <div className="flex items-center gap-3 px-6 pb-6 flex-wrap">
          <div className="text-xs text-muted-foreground mr-1">
            Created on {campaign.createdAt}
          </div>
          
          {campaign.status === "in_progress" ? (
             <Badge variant="secondary" className="gap-1.5 px-2 py-0.5 bg-gray-100 text-gray-600 hover:bg-gray-100 font-normal border border-gray-200">
             <Activity className="h-3 w-3" />
             Active <span className="text-gray-300">|</span> {campaign.timeLeft || "30 days left"}
           </Badge>
          ) : (
            <Badge variant="secondary" className="font-normal capitalize">
              {campaign.status.replace("_", " ")}
            </Badge>
          )}

          <Badge variant="secondary" className="gap-1.5 px-2 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-50 font-normal border-blue-100 border">
            <Linkedin className="h-3 w-3" />
            {typeCfg.label}
          </Badge>

          {campaign.generatingMessaging && (
            <Badge variant="secondary" className="gap-1.5 px-2 py-0.5 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 font-normal border-yellow-100 border">
              <Sparkles className="h-3 w-3 text-yellow-500" />
              Generating Messaging
            </Badge>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 px-6 pb-8">
          <div className="text-center border-r border-border/50 last:border-0">
            <div className="text-lg font-semibold">{campaign.totalProspects}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Total Prospects</div>
          </div>
          <div className="text-center border-r border-border/50 last:border-0">
            <div className="text-lg font-semibold">{campaign.reachouts}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Reachouts</div>
          </div>
          <div className="text-center border-r border-border/50 last:border-0">
            <div className="text-lg font-semibold">{campaign.acceptanceRate}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Acceptance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{campaign.responseRate}%</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mt-1">Response Rate</div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50/50 border-t border-dashed px-6 py-3">
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
            <ChevronRight className="h-3 w-3" />
            Prospect Enrichment Details
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
