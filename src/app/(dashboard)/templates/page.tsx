"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  ArrowUpDown,
  Plus,
  FileText,
  Send,
  TrendingUp,
  Users,
  Pencil,
  Copy,
  Share2,
  Trash2,
} from "lucide-react";

type Template = {
  id: string;
  name: string;
  category: "outreach" | "follow_up" | "meeting" | "nurture";
  subject: string;
  body: string;
  sentCount: number;
  responseRate: number;
  lastModified: string;
  isShared: boolean;
  createdBy: string;
};

const templates: Template[] = [
  {
    id: "1",
    name: "Initial Connection Request",
    category: "outreach",
    subject: "Quick question about {{company}}",
    body: "Hi {{firstName}},\n\nI noticed your work at {{company}} and would love to connect...",
    sentCount: 1250,
    responseRate: 32,
    lastModified: "2024-01-15",
    isShared: true,
    createdBy: "Ali Al-Abbassi",
  },
  {
    id: "2",
    name: "Follow-up After No Response",
    category: "follow_up",
    subject: "Re: Quick question",
    body: "Hi {{firstName}},\n\nJust following up on my previous message...",
    sentCount: 890,
    responseRate: 18,
    lastModified: "2024-01-14",
    isShared: true,
    createdBy: "Ali Al-Abbassi",
  },
  {
    id: "3",
    name: "Meeting Confirmation",
    category: "meeting",
    subject: "Looking forward to our call",
    body: "Hi {{firstName}},\n\nConfirming our meeting scheduled for {{meetingTime}}...",
    sentCount: 340,
    responseRate: 85,
    lastModified: "2024-01-13",
    isShared: false,
    createdBy: "Ali Al-Abbassi",
  },
  {
    id: "4",
    name: "Value-Add Content Share",
    category: "nurture",
    subject: "Thought you might find this interesting",
    body: "Hi {{firstName}},\n\nI came across this article that reminded me of our conversation...",
    sentCount: 520,
    responseRate: 24,
    lastModified: "2024-01-12",
    isShared: true,
    createdBy: "Sarah Chen",
  },
  {
    id: "5",
    name: "Second Follow-up",
    category: "follow_up",
    subject: "One more try",
    body: "Hi {{firstName}},\n\nI understand you're busy, but I wanted to reach out one more time...",
    sentCount: 445,
    responseRate: 12,
    lastModified: "2024-01-11",
    isShared: false,
    createdBy: "Ali Al-Abbassi",
  },
  {
    id: "6",
    name: "Cold Outreach - Pain Point",
    category: "outreach",
    subject: "Solving {{painPoint}} at {{company}}",
    body: "Hi {{firstName}},\n\nI've been researching how companies like {{company}} handle...",
    sentCount: 780,
    responseRate: 28,
    lastModified: "2024-01-10",
    isShared: true,
    createdBy: "Marcus Johnson",
  },
];

const categoryColors = {
  outreach: "default",
  follow_up: "secondary",
  meeting: "outline",
  nurture: "default",
} as const;

const categoryLabels = {
  outreach: "Outreach",
  follow_up: "Follow-up",
  meeting: "Meeting",
  nurture: "Nurture",
};

const categoryStyles = {
  outreach: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  follow_up: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  meeting: "bg-green-100 text-green-800 hover:bg-green-100",
  nurture: "bg-purple-100 text-purple-800 hover:bg-purple-100",
};

export default function TemplatesPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    category: "outreach" as Template["category"],
    subject: "",
    body: "",
  });

  const filteredTemplates =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const stats = {
    total: templates.length,
    totalSent: templates.reduce((acc, t) => acc + t.sentCount, 0),
    avgResponseRate: Math.round(
      templates.reduce((acc, t) => acc + t.responseRate, 0) / templates.length
    ),
    sharedCount: templates.filter((t) => t.isShared).length,
  };

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body,
    });
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedTemplate(null);
    setFormData({
      name: "",
      category: "outreach",
      subject: "",
      body: "",
    });
    setIsSheetOpen(true);
  };

  const handleSave = () => {
    // In a real app, this would save to an API
    console.log("Saving template:", formData);
    setIsSheetOpen(false);
  };

  const columns: ColumnDef<Template>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Template Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="px-3">
          <div className="font-medium">{row.getValue("name")}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
            {row.original.subject}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const category = row.getValue("category") as keyof typeof categoryLabels;
        return (
          <Badge variant="secondary" className={categoryStyles[category]}>
            {categoryLabels[category]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "sentCount",
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
        <div className="px-3 text-center">{row.getValue("sentCount")}</div>
      ),
    },
    {
      accessorKey: "responseRate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Response Rate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rate = row.getValue("responseRate") as number;
        return (
          <div className="px-3">
            <span
              className={
                rate >= 30
                  ? "text-green-600 font-medium"
                  : rate >= 20
                    ? "text-yellow-600"
                    : "text-gray-600"
              }
            >
              {rate}%
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "isShared",
      header: "Shared",
      cell: ({ row }) => {
        const isShared = row.getValue("isShared") as boolean;
        return isShared ? (
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            Team
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">Private</span>
        );
      },
    },
    {
      accessorKey: "lastModified",
      header: "Last Modified",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const template = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(template)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                {template.isShared ? "Make Private" : "Share with Team"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
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
          <h1 className="text-2xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage your message templates
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Templates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sharedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tabs and Table */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="follow_up">Follow-up</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="nurture">Nurture</TabsTrigger>
        </TabsList>
        <TabsContent value={activeCategory} className="mt-4">
          <DataTable
            columns={columns}
            data={filteredTemplates}
            searchKey="name"
            searchPlaceholder="Search templates..."
          />
        </TabsContent>
      </Tabs>

      {/* Create/Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>
              {selectedTemplate ? "Edit Template" : "Create Template"}
            </SheetTitle>
            <SheetDescription>
              {selectedTemplate
                ? "Make changes to your template below."
                : "Create a new message template for your campaigns."}
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 py-4 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <label className="text-sm font-medium">Template Name</label>
              <Input
                placeholder="e.g., Initial Connection Request"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as Template["category"],
                  })
                }
              >
                <option value="outreach">Outreach</option>
                <option value="follow_up">Follow-up</option>
                <option value="meeting">Meeting</option>
                <option value="nurture">Nurture</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Line</label>
              <Input
                placeholder="e.g., Quick question about {{company}}"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Use {"{{variable}}"} for dynamic content
              </p>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Message Body</label>
              <textarea
                className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                placeholder="Write your message here..."
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {"{{firstName}}"}, {"{{lastName}}"}, {"{{company}}"}, {"{{title}}"}
              </p>
            </div>
          </div>
          <SheetFooter>
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {selectedTemplate ? "Save Changes" : "Create Template"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
