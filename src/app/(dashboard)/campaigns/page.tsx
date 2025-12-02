"use client";

import { useState } from "react";
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
  Pencil,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  SheetTrigger,
} from "@/components/ui/sheet";

type CampaignStatus = "in_progress" | "paused" | "completed" | "draft";
type CampaignType = "inmail" | "messaging";
type SortOption = "recent" | "alphabetically";

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  createdAt: string;
  totalProspects: number;
  reachouts: number;
  acceptanceRate: number;
  responseRate: number;
};

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Valley TEST TEST",
    status: "in_progress",
    type: "inmail",
    createdAt: "04/30/2025",
    totalProspects: 19,
    reachouts: 0,
    acceptanceRate: 0,
    responseRate: 0,
  },
  {
    id: "2",
    name: "Engaged List By Shubh 4/28 (open Profiles) - Part 1/3",
    status: "in_progress",
    type: "inmail",
    createdAt: "04/29/2025",
    totalProspects: 556,
    reachouts: 15,
    acceptanceRate: 100,
    responseRate: 13,
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
  },
];

const statusConfig: Record<
  CampaignStatus,
  { label: string; className: string }
> = {
  in_progress: {
    label: "In Progress",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  paused: {
    label: "Paused",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  completed: {
    label: "Completed",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

const typeConfig: Record<CampaignType, { label: string; className: string }> = {
  inmail: {
    label: "InMail",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  messaging: {
    label: "Messaging",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: "", type: "inmail" as CampaignType });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // LinkedIn limits (mock data)
  const connectsSent = 12;
  const connectsLimit = 25;
  const inmailsSent = 31;
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
      // Sort by date (recent first)
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

  const openCreateSheet = () => {
    setEditingCampaign(null);
    setFormData({ name: "", type: "inmail" });
    setIsSheetOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
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
          Date
          <ChevronDown className="h-4 w-4" />
        </Button>
        <div className="ml-auto">
          <Button variant="outline" className="gap-2">
            Today
            <ChevronDown className="h-4 w-4" />
          </Button>
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
          <div className="relative h-3 w-full rounded-full bg-gray-200">
            <div
              className="absolute left-0 h-full rounded-full transition-all"
              style={{
                width: `${(connectsSent / connectsLimit) * 100}%`,
                backgroundColor: "#10DD9B",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 text-xs font-medium"
              style={{ left: `${(connectsLimit / connectsLimit) * 100 - 2}%` }}
            >
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">{connectsLimit}</span>
                <div className="h-4 w-px bg-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* InMails Sent */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            LinkedIn InMails Sent ({inmailsSent})
            <Info className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="relative h-3 w-full rounded-full bg-gray-200">
            <div
              className="absolute left-0 h-full rounded-full transition-all"
              style={{
                width: `${(inmailsSent / inmailsLimit) * 100}%`,
                backgroundColor: "#10DD9B",
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 text-xs font-medium"
              style={{ left: `${(inmailsLimit / inmailsLimit) * 100 - 2}%` }}
            >
              <div className="flex flex-col items-center">
                <span className="text-muted-foreground">{inmailsLimit}</span>
                <div className="h-4 w-px bg-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Active Campaigns{" "}
          <span className="text-muted-foreground">{activeCampaigns.length}</span>
        </h2>
        <div className="flex items-center gap-1 text-sm">
          <button
            onClick={() => setSortBy("recent")}
            className={`px-2 py-1 ${
              sortBy === "recent"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Recent
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={() => setSortBy("alphabetically")}
            className={`px-2 py-1 ${
              sortBy === "alphabetically"
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
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
            onEdit={() => openEditSheet(campaign)}
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

      {/* Create Campaign Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            onClick={openCreateSheet}
            className="fixed bottom-6 right-6 shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Campaign
          </Button>
        </SheetTrigger>
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
  onEdit,
  onStatusChange,
  onDelete,
}: {
  campaign: Campaign;
  onEdit: () => void;
  onStatusChange: (status: CampaignStatus) => void;
  onDelete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusCfg = statusConfig[campaign.status];
  const typeCfg = typeConfig[campaign.type];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex items-start justify-between p-4 pb-3">
          <div className="space-y-1">
            <h3 className="font-semibold leading-tight">{campaign.name}</h3>
            <p className="text-sm text-muted-foreground">
              Created on {campaign.createdAt}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {campaign.status === "in_progress" && (
                <DropdownMenuItem onClick={() => onStatusChange("paused")}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
              )}
              {(campaign.status === "paused" || campaign.status === "draft") && (
                <DropdownMenuItem onClick={() => onStatusChange("in_progress")}>
                  <Play className="mr-2 h-4 w-4" />
                  {campaign.status === "draft" ? "Start" : "Resume"}
                </DropdownMenuItem>
              )}
              {campaign.status !== "completed" && (
                <DropdownMenuItem onClick={() => onStatusChange("completed")}>
                  Mark as Completed
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Badges */}
        <div className="flex gap-2 px-4 pb-4">
          <Badge variant="outline" className={typeCfg.className}>
            {typeCfg.label}
          </Badge>
          <Badge variant="outline" className={statusCfg.className}>
            {statusCfg.label}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 border-t bg-muted/30 px-4 py-4">
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

        {/* Expandable Details */}
        {campaign.totalProspects > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center gap-1 border-t px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Prospect Fetch Details
          </button>
        )}
        {isExpanded && (
          <div className="border-t bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            <p>Prospect details and fetch history will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
