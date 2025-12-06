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

export type CampaignStatus = "in_progress" | "paused" | "completed" | "draft";
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
};

export const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Positive Response List (from Shubh) - Open Profiles",
    status: "in_progress",
    type: "inmail",
    createdAt: "04/01/2025",
    totalProspects: 381,
    reachouts: 361,
    acceptanceRate: 100,
    responseRate: 18,
    prospectPoolSize: 927,
  },
  {
    id: "2",
    name: "Positive Response List (from Shubh) - Closed Profiles",
    status: "in_progress",
    type: "messaging",
    createdAt: "04/01/2025",
    totalProspects: 510,
    reachouts: 243,
    acceptanceRate: 53,
    responseRate: 55,
    prospectPoolSize: 927,
  },
  {
    id: "3",
    name: "Engaged List (closed Profiles) - Part 1/3",
    status: "in_progress",
    type: "messaging",
    createdAt: "04/29/2025",
    totalProspects: 628,
    reachouts: 42,
    acceptanceRate: 40,
    responseRate: 53,
    prospectPoolSize: 850,
  },
  {
    id: "4",
    name: "Clay Recent Post ICP Test",
    status: "in_progress",
    type: "inmail",
    createdAt: "04/29/2025",
    totalProspects: 98,
    reachouts: 0,
    acceptanceRate: 0,
    responseRate: 0,
    prospectPoolSize: 200,
    isFetching: true,
  },
  {
    id: "5",
    name: "Mercor ICP Test",
    status: "in_progress",
    type: "messaging",
    createdAt: "04/29/2025",
    totalProspects: 409,
    reachouts: 0,
    acceptanceRate: 0,
    responseRate: 0,
    prospectPoolSize: 500,
  },
  {
    id: "6",
    name: "Post Engager Campaign",
    status: "in_progress",
    type: "inmail",
    createdAt: "04/14/2025",
    totalProspects: 385,
    reachouts: 309,
    acceptanceRate: 100,
    responseRate: 12,
    prospectPoolSize: 600,
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

  // LinkedIn limits (mock data)
  const connectsSent = 20;
  const connectsLimit = 25;
  const inmailsSent = 32;
  const inmailsLimit = 40;

  const activeCampaigns = campaigns.filter((c) => c.status === "in_progress");

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
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Status
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setStatusFilter("all")}>
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("in_progress")}>
              In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("paused")}>
              Paused
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("completed")}>
              Completed
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("draft")}>
              Draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          Date
          <ChevronDown className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                Today
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>All time</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* LinkedIn Progress Bars */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connects Sent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            LinkedIn Connects Sent ({connectsSent})
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="relative h-4 w-full">
            <div className="absolute inset-0 rounded-full bg-gray-200" />
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{
                width: `${(connectsSent / (connectsLimit + 10)) * 100}%`,
                background: "linear-gradient(90deg, #10DD9B 0%, #0EA5E9 100%)",
              }}
            />
            {/* Limit marker */}
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `calc(${(connectsLimit / (connectsLimit + 10)) * 100}% - 1px)` }}
            >
              <span className="text-xs text-muted-foreground mb-1">{connectsLimit}</span>
              <div className="h-4 border-l border-dashed border-gray-400" />
            </div>
          </div>
        </div>

        {/* InMails Sent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            LinkedIn InMails Sent ({inmailsSent})
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="relative h-4 w-full">
            <div className="absolute inset-0 rounded-full bg-gray-200" />
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all"
              style={{
                width: `${(inmailsSent / (inmailsLimit + 10)) * 100}%`,
                background: "linear-gradient(90deg, #10DD9B 0%, #0EA5E9 100%)",
              }}
            />
            {/* Limit marker */}
            <div
              className="absolute top-0 flex flex-col items-center"
              style={{ left: `calc(${(inmailsLimit / (inmailsLimit + 10)) * 100}% - 1px)` }}
            >
              <span className="text-xs text-muted-foreground mb-1">{inmailsLimit}</span>
              <div className="h-4 border-l border-dashed border-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Active Campaigns{" "}
          <span className="text-muted-foreground font-normal">{activeCampaigns.length}</span>
        </h2>
        <div className="flex items-center gap-2 text-sm">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <button
            onClick={() => setSortBy("recent")}
            className={sortBy === "recent" ? "font-medium" : "text-muted-foreground hover:text-foreground"}
          >
            Recent
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={() => setSortBy("alphabetically")}
            className={sortBy === "alphabetically" ? "font-medium" : "text-muted-foreground hover:text-foreground"}
          >
            Alphabetically
          </button>
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCampaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign}
            onStatusChange={(status) => handleStatusChange(campaign.id, status)}
            onDelete={() => handleDelete(campaign.id)}
          />
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          No campaigns found
        </div>
      )}

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
  const [isExpanded, setIsExpanded] = useState(false);
  const statusCfg = statusConfig[campaign.status];
  const typeCfg = typeConfig[campaign.type];

  const handleCardClick = () => {
    router.push(`/campaigns/${campaign.id}`);
  };

  // Calculate progress percentages for the prospect bar
  const processedPercent = (campaign.totalProspects / campaign.prospectPoolSize) * 100;
  const remainingPercent = 100 - processedPercent;

  return (
    <Card className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={handleCardClick}>
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex items-start justify-between p-4 pb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-semibold leading-tight">{campaign.name}</h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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

        {/* Date and Badges */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <span className="text-sm text-muted-foreground">
            Created on {campaign.createdAt}
          </span>
          <Badge variant="outline" className="gap-1.5 font-normal">
            <Linkedin className="h-3 w-3" />
            {typeCfg.label}
          </Badge>
          <Badge variant="outline" className="gap-1.5 font-normal">
            <span className={`h-2 w-2 rounded-full ${statusCfg.dotColor}`} />
            {statusCfg.label}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 border-t px-4 py-4">
          <div className="text-center">
            <div className="text-xl font-bold">{campaign.totalProspects}</div>
            <div className="text-xs text-muted-foreground">Total Prospects</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{campaign.reachouts}</div>
            <div className="text-xs text-muted-foreground">Reachouts</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{campaign.acceptanceRate}%</div>
            <div className="text-xs text-muted-foreground">Acceptance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{campaign.responseRate}%</div>
            <div className="text-xs text-muted-foreground">Response Rate</div>
          </div>
        </div>

        {/* Prospect Progress Bar */}
        {campaign.prospectPoolSize > 0 && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full overflow-hidden bg-gray-100 flex">
                <div
                  className="h-full bg-[#0EA5E9]"
                  style={{ width: `${processedPercent * 0.85}%` }}
                />
                <div
                  className="h-full bg-[#F97316]"
                  style={{ width: `${Math.min(remainingPercent, 15)}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {campaign.prospectPoolSize} prospects
              </span>
            </div>
          </div>
        )}

        {/* Prospect Fetch Details - Expandable or Loading */}
        {campaign.isFetching ? (
          <div className="flex items-center gap-2 border-t px-4 py-3 text-sm text-muted-foreground">
            <ChevronRight className="h-4 w-4" />
            <span>Prospect Fetch Details</span>
            <Loader2 className="ml-auto h-4 w-4 animate-spin" />
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center gap-2 border-t px-4 py-3 text-sm text-muted-foreground hover:bg-muted/50 transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
            <span>Prospect Fetch Details</span>
          </button>
        )}

        {isExpanded && !campaign.isFetching && (
          <div className="border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            <div className="space-y-1">
              <p>Pool size: {campaign.prospectPoolSize} prospects</p>
              <p>Processed: {campaign.totalProspects} prospects</p>
              <p>Remaining: {campaign.prospectPoolSize - campaign.totalProspects} prospects</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
