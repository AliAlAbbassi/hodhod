"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  ArrowUpDown,
  Plus,
  Zap,
  Send,
  MessageSquare,
  Calendar,
  Pause,
  Play,
  Trash2,
  Pencil,
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

type CampaignStatus = "active" | "paused" | "completed" | "draft";

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  sent: number;
  replies: number;
  meetings: number;
  replyRate: number;
  startDate: string;
  lastActivity: string;
};

const initialCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Q1 Enterprise Outreach",
    status: "active",
    sent: 1250,
    replies: 187,
    meetings: 42,
    replyRate: 15,
    startDate: "2024-01-01",
    lastActivity: "2024-01-15",
  },
  {
    id: "2",
    name: "Series A Founders",
    status: "active",
    sent: 890,
    replies: 134,
    meetings: 28,
    replyRate: 15,
    startDate: "2024-01-05",
    lastActivity: "2024-01-14",
  },
  {
    id: "3",
    name: "VP Engineering - Tech",
    status: "paused",
    sent: 450,
    replies: 45,
    meetings: 8,
    replyRate: 10,
    startDate: "2024-01-02",
    lastActivity: "2024-01-10",
  },
  {
    id: "4",
    name: "Holiday Follow-up",
    status: "completed",
    sent: 2100,
    replies: 315,
    meetings: 67,
    replyRate: 15,
    startDate: "2023-12-15",
    lastActivity: "2024-01-05",
  },
  {
    id: "5",
    name: "Product Hunt Launch",
    status: "draft",
    sent: 0,
    replies: 0,
    meetings: 0,
    replyRate: 0,
    startDate: "-",
    lastActivity: "-",
  },
  {
    id: "6",
    name: "CTO Roundup - Fintech",
    status: "active",
    sent: 320,
    replies: 48,
    meetings: 12,
    replyRate: 15,
    startDate: "2024-01-08",
    lastActivity: "2024-01-15",
  },
];

const statusConfig: Record<
  CampaignStatus,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; className?: string }
> = {
  active: {
    label: "Active",
    variant: "default",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  paused: {
    label: "Paused",
    variant: "secondary",
  },
  completed: {
    label: "Completed",
    variant: "outline",
  },
  draft: {
    label: "Draft",
    variant: "secondary",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-100",
  },
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState({ name: "" });

  const totalSent = campaigns.reduce((sum, c) => sum + c.sent, 0);
  const totalReplies = campaigns.reduce((sum, c) => sum + c.replies, 0);
  const totalMeetings = campaigns.reduce((sum, c) => sum + c.meetings, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

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
          c.id === editingCampaign.id ? { ...c, name: formData.name } : c
        )
      );
    } else {
      const newCampaign: Campaign = {
        id: String(Date.now()),
        name: formData.name,
        status: "draft",
        sent: 0,
        replies: 0,
        meetings: 0,
        replyRate: 0,
        startDate: "-",
        lastActivity: "-",
      };
      setCampaigns((prev) => [...prev, newCampaign]);
    }

    setFormData({ name: "" });
    setEditingCampaign(null);
    setIsSheetOpen(false);
  };

  const openEditSheet = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setFormData({ name: campaign.name });
    setIsSheetOpen(true);
  };

  const openCreateSheet = () => {
    setEditingCampaign(null);
    setFormData({ name: "" });
    setIsSheetOpen(true);
  };

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Campaign Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-3 font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as CampaignStatus;
        const config = statusConfig[status];
        return (
          <Badge variant={config.variant} className={config.className}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "sent",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sent
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-3">{row.getValue<number>("sent").toLocaleString()}</div>
      ),
    },
    {
      accessorKey: "replies",
      header: "Replies",
      cell: ({ row }) => row.getValue<number>("replies").toLocaleString(),
    },
    {
      accessorKey: "meetings",
      header: "Meetings",
      cell: ({ row }) => row.getValue<number>("meetings").toLocaleString(),
    },
    {
      accessorKey: "replyRate",
      header: "Reply Rate",
      cell: ({ row }) => `${row.getValue<number>("replyRate")}%`,
    },
    {
      accessorKey: "lastActivity",
      header: "Last Activity",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const campaign = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditSheet(campaign)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {campaign.status === "active" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(campaign.id, "paused")}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
              )}
              {(campaign.status === "paused" || campaign.status === "draft") && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(campaign.id, "active")}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {campaign.status === "draft" ? "Start" : "Resume"}
                </DropdownMenuItem>
              )}
              {campaign.status !== "completed" && (
                <DropdownMenuItem
                  onClick={() => handleStatusChange(campaign.id, "completed")}
                >
                  Mark as Completed
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDelete(campaign.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
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
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track your LinkedIn outreach campaigns
          </p>
        </div>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={openCreateSheet}>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
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
                  onChange={(e) => setFormData({ name: e.target.value })}
                />
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

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {campaigns.length} total campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Messages across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReplies.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalSent > 0 ? Math.round((totalReplies / totalSent) * 100) : 0}% overall reply rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meetings Booked</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMeetings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {totalReplies > 0 ? Math.round((totalMeetings / totalReplies) * 100) : 0}% conversion from replies
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Table */}
      <DataTable
        columns={columns}
        data={campaigns}
        searchKey="name"
        searchPlaceholder="Search campaigns..."
      />
    </div>
  );
}
