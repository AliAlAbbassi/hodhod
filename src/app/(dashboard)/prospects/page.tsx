"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCheckbox } from "@/components/ui/table-checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
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
  ArrowLeft,
  ArrowUpDown,
  ChevronDown,
  Download,
  Flame,
  Linkedin,
  Lock,
  Plus,
  Snowflake,
  Sun,
  TrendingUp,
  Users,
  Activity,
  Loader2,
  MoreHorizontal,
  Tag,
  Check,
  Calendar,
  Link,
  Ban,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Campaign, initialCampaigns } from "../campaigns/page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type IntentLevel = "hot" | "warm" | "cold";
type ProspectStatus = "prospect_created" | "contacted" | "replied";
type ProfilePrivacy = "open" | "closed";
type InterestStatus = "interested" | "might_be_interested" | "not_interested" | null;

type ProspectTags = {
  humanHandover: boolean;
  stopOutreach: boolean;
  meetingScheduled: boolean;
  schedulingLinkSent: boolean;
};

type Prospect = {
  id: string;
  name: string;
  headline: string;
  avatarUrl?: string;
  company: {
    name: string;
    logoUrl?: string;
    logoColor?: string;
  };
  role: string;
  tenure: string;
  intentLevel: IntentLevel;
  time: string;
  status: ProspectStatus;
  profilePrivacy: ProfilePrivacy;
  score: number;
  scoreDetails: {
    icpFit: number;
    icpReason: string;
    problemIntensity: number;
    problemReason: string;
    relevance: number;
    relevanceReason: string;
  };
  interestStatus: InterestStatus;
  tags: ProspectTags;
};

// Analytics data for the chart
const analyticsData = [
  { date: "Jul 16", uniqueVisitors: 18, linkedinResolved: 12 },
  { date: "Jul 17", uniqueVisitors: 22, linkedinResolved: 15 },
  { date: "Jul 18", uniqueVisitors: 19, linkedinResolved: 18 },
  { date: "Jul 19", uniqueVisitors: 24, linkedinResolved: 14 },
  { date: "Jul 20", uniqueVisitors: 16, linkedinResolved: 20 },
  { date: "Jul 21", uniqueVisitors: 21, linkedinResolved: 17 },
  { date: "Jul 22", uniqueVisitors: 14, linkedinResolved: 22 },
  { date: "Jul 23", uniqueVisitors: 18, linkedinResolved: 15 },
];

// Overview stats
const overviewStats = [
  { label: "Total Visitors", value: "226", icon: TrendingUp },
  { label: "Unique Visitors", value: "162", icon: Users },
  { label: "LinkedIn Resolved", value: "52", icon: Linkedin },
  { label: "Resolution Rate", value: "32.1%", icon: Activity },
];

const initialProspects: Prospect[] = [
  {
    id: "1",
    name: "Les W Robertson",
    headline: "Attorney/Mediator/Arbitrat...",
    avatarUrl: "",
    company: {
      name: "Robertson ADR & ...",
      logoUrl: "",
      logoColor: "bg-purple-600",
    },
    role: "Arbitrator, Mediator and Ins...",
    tenure: "6 mo...",
    intentLevel: "cold",
    time: "2 hours ago",
    status: "prospect_created",
    profilePrivacy: "closed",
    score: 78,
    scoreDetails: {
      icpFit: 85,
      icpReason:
        "Leads a successful AR/VR studio, aligning well with HodhodStudios' focus on technology and innovation. His experience with high-profile clients indicates a strong fit with the target market.",
      problemIntensity: 70,
      problemReason:
        "While company may face challenges related to resource constraints and the need for efficient outreach, the specific problems HodhodStudios addresses may not be as acute.",
      relevance: 90,
      relevanceReason:
        "High relevance due to direct involvement in legal tech adoption and decision making power.",
    },
    interestStatus: null,
    tags: {
      humanHandover: false,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
  {
    id: "2",
    name: "Jim Busha",
    headline: "Mechanical Electrical Engineering...",
    avatarUrl: "",
    company: {
      name: "Mechanical Electri...",
      logoUrl: "",
      logoColor: "bg-blue-700",
    },
    role: "Mechanical Engineer",
    tenure: "17 yea...",
    intentLevel: "cold",
    time: "2 hours ago",
    status: "prospect_created",
    profilePrivacy: "closed",
    score: 65,
    scoreDetails: {
      icpFit: 60,
      icpReason: "Industry alignment is moderate.",
      problemIntensity: 65,
      problemReason: "Standard operational challenges.",
      relevance: 70,
      relevanceReason: "Potential user of engineering tools.",
    },
    interestStatus: null,
    tags: {
      humanHandover: false,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
  {
    id: "3",
    name: "Anil Karmel",
    headline: "Strategic Advisor",
    avatarUrl: "",
    company: { name: "Advisory Co", logoUrl: "", logoColor: "bg-orange-500" },
    role: "Strategic Advisor",
    tenure: "3 years",
    intentLevel: "cold",
    time: "21 hours ago",
    status: "prospect_created",
    profilePrivacy: "open",
    score: 92,
    scoreDetails: {
      icpFit: 95,
      icpReason: "Perfect match for strategic partnership.",
      problemIntensity: 90,
      problemReason: "Actively seeking new solutions.",
      relevance: 95,
      relevanceReason: "Direct decision maker.",
    },
    interestStatus: "interested",
    tags: {
      humanHandover: false,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
  {
    id: "4",
    name: "Sophia Williams",
    headline: "Creatives and Design for SaaS",
    avatarUrl: "",
    company: { name: "Amazon", logoUrl: "", logoColor: "bg-black" },
    role: "Product Designer",
    tenure: "1 year",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "contacted",
    profilePrivacy: "closed",
    score: 88,
    scoreDetails: {
      icpFit: 90,
      icpReason: "Strong fit in SaaS design space.",
      problemIntensity: 85,
      problemReason: "High demand for design tools.",
      relevance: 88,
      relevanceReason: "Key influencer in design stack.",
    },
    interestStatus: null,
    tags: {
      humanHandover: false,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
  {
    id: "5",
    name: "Samuel Green",
    headline: "Visa Inc.",
    avatarUrl: "",
    company: { name: "Netflix", logoUrl: "", logoColor: "bg-red-600" },
    role: "Software Engineer",
    tenure: "1 year",
    intentLevel: "warm",
    time: "4 hours ago",
    status: "prospect_created",
    profilePrivacy: "open",
    score: 75,
    scoreDetails: {
      icpFit: 80,
      icpReason: "Good technical fit.",
      problemIntensity: 70,
      problemReason: "Scaling challenges present.",
      relevance: 75,
      relevanceReason: "Technical evaluator.",
    },
    interestStatus: null,
    tags: {
      humanHandover: false,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
  {
    id: "6",
    name: "Anna Joseph",
    headline: "All things Sales and GTM",
    avatarUrl: "",
    company: { name: "Rippling", logoUrl: "", logoColor: "bg-yellow-500" },
    role: "VP Of Sales",
    tenure: "1 year",
    intentLevel: "hot",
    time: "4 hours ago",
    status: "prospect_created",
    profilePrivacy: "closed",
    score: 95,
    scoreDetails: {
      icpFit: 98,
      icpReason: "Ideal GTM leader profile.",
      problemIntensity: 95,
      problemReason: "Aggressive growth targets.",
      relevance: 95,
      relevanceReason: "Budget holder.",
    },
    interestStatus: "interested",
    tags: {
      humanHandover: true,
      stopOutreach: false,
      meetingScheduled: false,
      schedulingLinkSent: false,
    },
  },
];

const IntentBadge = ({ level }: { level: IntentLevel }) => {
  const config = {
    hot: {
      icon: Flame,
      label: "Hot",
      className: "bg-red-50 text-red-600 border-red-200",
    },
    warm: {
      icon: Sun,
      label: "Warm",
      className: "bg-yellow-50 text-yellow-600 border-yellow-200",
    },
    cold: {
      icon: Snowflake,
      label: "Cold",
      className: "bg-blue-50 text-blue-600 border-blue-200",
    },
  };

  const { icon: Icon, label, className } = config[level];

  return (
    <Badge variant="outline" className={className}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const StatusBadge = ({ status }: { status: ProspectStatus }) => {
  const config = {
    prospect_created: {
      label: "Prospect Created",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    contacted: {
      label: "Contacted",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    replied: {
      label: "Replied",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
  };

  const { label, className } = config[status];

  return (
    <Badge variant="outline" className={className}>
      {label}
    </Badge>
  );
};

const ProspectNameCell = ({
  prospect,
  onClick,
}: {
  prospect: Prospect;
  onClick: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const initials = prospect.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <>
      <div className="flex items-center gap-3 group">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={prospect.avatarUrl} alt={prospect.name} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute -bottom-1 -right-1 bg-[#22c55e] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full cursor-pointer ring-2 ring-white hover:bg-[#16a34a] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
          >
            {prospect.score}
          </div>
        </div>
        <div
          className="flex flex-col cursor-pointer"
          onClick={onClick}
        >
          <span className="font-medium group-hover:text-primary transition-colors">
            {prospect.name}
          </span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {prospect.headline}
          </span>
        </div>
      </div>

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
          <div className="flex items-center gap-4 p-6 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e] text-lg font-bold text-white">
              {prospect.score}
            </div>
            <ModalTitle className="text-xl font-bold">
              Prospect Score Details
            </ModalTitle>
          </div>

          <div className="space-y-6 p-6 pt-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">ICP</h3>
                <span className="text-sm font-medium">
                  Score: {prospect.scoreDetails.icpFit}
                </span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {prospect.scoreDetails.icpReason}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Problem Intensity</h3>
                <span className="text-sm font-medium">
                  Score: {prospect.scoreDetails.problemIntensity}
                </span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {prospect.scoreDetails.problemReason}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Relevance</h3>
                <span className="text-sm font-medium">
                  Score: {prospect.scoreDetails.relevance}
                </span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                {prospect.scoreDetails.relevanceReason}
              </p>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default function ProspectsPage() {
  const [prospects, setProspects] = useState<Prospect[]>(initialProspects);
  const [open, setOpen] = useState(false);
  const [newProspectUrl, setNewProspectUrl] = useState("");
  const [salesNavUrl, setSalesNavUrl] = useState("");
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const updateProspect = (id: string, updates: Partial<Prospect>) => {
    setProspects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedProspect?.id === id) {
      setSelectedProspect((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const updateTag = (id: string, tag: keyof ProspectTags, value: boolean) => {
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, tags: { ...p.tags, [tag]: value } } : p
      )
    );
    if (selectedProspect?.id === id) {
      setSelectedProspect((prev) =>
        prev
          ? { ...prev, tags: { ...prev.tags, [tag]: value } }
          : null
      );
    }
  };

  const columns: ColumnDef<Prospect>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <TableCheckbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <TableCheckbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Prospect name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <ProspectNameCell
          prospect={row.original}
          onClick={() => setSelectedProspect(row.original)}
        />
      ),
    },
    {
      id: "company",
      header: "Company with role",
      cell: ({ row }) => {
        const prospect = row.original;
        const companyInitial = prospect.company.name[0];

        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold ${prospect.company.logoColor || "bg-gray-500"}`}
            >
              {companyInitial}
            </div>
            <div className="flex flex-col">
              <span className="font-medium truncate max-w-[180px]">
                {prospect.role}
              </span>
              <span className="text-sm text-muted-foreground truncate max-w-[180px]">
                {prospect.company.name} · {prospect.tenure}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "intentLevel",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Intent Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <IntentBadge level={row.original.intentLevel} />,
    },
    {
      accessorKey: "time",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0 hover:bg-transparent"
        >
          Time
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.time}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.original.status} />
          {row.original.tags.humanHandover && (
            <Badge
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200"
            >
              Human Handover
            </Badge>
          )}
        </div>
      ),
    },
    {
      accessorKey: "profilePrivacy",
      header: "Profile Privacy",
      cell: ({ row }) => {
        const privacy = row.original.profilePrivacy;
        return (
          <div className="flex items-center gap-1.5">
            {privacy === "closed" && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="text-muted-foreground capitalize">{privacy}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const prospect = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(prospect.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSelectedProspect(prospect)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleAddProspect = () => {
    if (!newProspectUrl.trim()) return;

    // Simulate adding a prospect
    const newProspect: Prospect = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Prospect",
      headline: "Imported from LinkedIn",
      avatarUrl: "",
      company: { name: "Pending...", logoUrl: "", logoColor: "bg-gray-500" },
      role: "Unknown Role",
      tenure: "0 years",
      intentLevel: "cold",
      time: "Just now",
      status: "prospect_created",
      profilePrivacy: "open",
      score: 50,
      scoreDetails: {
        icpFit: 50,
        icpReason: "Pending analysis...",
        problemIntensity: 50,
        problemReason: "Pending analysis...",
        relevance: 50,
        relevanceReason: "Pending analysis...",
      },
      interestStatus: null,
      tags: {
        humanHandover: false,
        stopOutreach: false,
        meetingScheduled: false,
        schedulingLinkSent: false,
      },
    };

    setProspects([newProspect, ...prospects]);
    setNewProspectUrl("");
    setOpen(false);
  };

  const selectedProspectIds = Object.keys(rowSelection).filter(
    (key) => rowSelection[key]
  );
  const selectedProspects = prospects.filter((_, index) => rowSelection[index]);

  const openProfileCount = selectedProspects.filter(
    (p) => p.profilePrivacy === "open"
  ).length;
  const closedProfileCount = selectedProspects.filter(
    (p) => p.profilePrivacy === "closed"
  ).length;

  const showPrivacyWarning =
    selectedCampaign &&
    ((selectedCampaign.type === "messaging" && openProfileCount > 0) ||
      (selectedCampaign.type === "inmail" && closedProfileCount > 0));

  const handleAddToCampaign = () => {
    // Logic to add prospects to campaign would go here
    setRowSelection({});
    setIsCampaignModalOpen(false);
    setSelectedCampaign(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-muted-foreground">Prospects</span>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">All Website Visitors</span>
          <span className="text-muted-foreground">/</span>
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs bg-orange-200 text-orange-700">
                A
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">Ali</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            No campaign created yet
          </div>
          {selectedProspectIds.length > 0 && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setIsCampaignModalOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add to Campaign ({selectedProspectIds.length})
            </Button>
          )}
          <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add To Campaign
              </Button>
            </ModalTrigger>
            <ModalContent className="sm:max-w-[600px]">
              <ModalHeader>
                <ModalTitle>Add Prospect</ModalTitle>
              </ModalHeader>
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="file">File Upload</TabsTrigger>
                  <TabsTrigger value="single">Single Prospect</TabsTrigger>
                  <TabsTrigger value="multiple">Multiple Prospects</TabsTrigger>
                </TabsList>
                <TabsContent value="file" className="space-y-4 py-4">
                  <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
                    <div className="text-center space-y-1">
                      <p className="text-sm font-medium">
                        Click to browse or drag file here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CSV files only (max 5MB)
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => setOpen(false)}>
                    Upload CSV
                  </Button>
                </TabsContent>
                <TabsContent value="single" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Add Single Prospect
                    </label>
                    <Input
                      placeholder="https://www.linkedin.com/in/john-doe or https://www.linkedin..."
                      value={newProspectUrl}
                      onChange={(e) => setNewProspectUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      LinkedIn or Sales Navigator URL for prospect
                    </p>
                  </div>
                  <Button className="w-full" onClick={handleAddProspect}>
                    Add
                  </Button>
                </TabsContent>
                <TabsContent value="multiple" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Sales Navigator Search URL
                    </label>
                    <Input
                      placeholder="https://www.linkedin.com/sales/search/..."
                      value={salesNavUrl}
                      onChange={(e) => setSalesNavUrl(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Paste a Sales Navigator search URL to import multiple
                      prospects
                    </p>
                  </div>
                  <Button className="w-full" onClick={() => setOpen(false)}>
                    Import Search
                  </Button>
                </TabsContent>
              </Tabs>
            </ModalContent>
          </Modal>
        </div>
      </div>

      {/* Overview and Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Overview Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <CardTitle className="text-base">Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {overviewStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {stat.value}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Analytics Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <CardTitle className="text-base">Analytics</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                Last 7 days
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Unique Visitors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span className="text-muted-foreground">LinkedIn Resolved</span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e5e5"
                  />
                  <XAxis
                    dataKey="date"
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
                    label={{
                      value: "Visitors",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="uniqueVisitors"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="linkedinResolved"
                    stroke="#fb923c"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={prospects}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      <Sheet
        open={!!selectedProspect}
        onOpenChange={(open) => !open && setSelectedProspect(null)}
      >
        <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
          {selectedProspect && (
            <div className="space-y-8">
              <SheetHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={selectedProspect.avatarUrl}
                      alt={selectedProspect.name}
                    />
                    <AvatarFallback className="text-lg">
                      {selectedProspect.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <SheetTitle className="text-2xl">
                      {selectedProspect.name}
                    </SheetTitle>
                    <SheetDescription className="text-base">
                      {selectedProspect.role} at{" "}
                      {selectedProspect.company.name}
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-8">
                {/* Tagging Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Tagged as
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 gap-2 ml-2"
                        >
                          {selectedProspect.interestStatus
                            ? selectedProspect.interestStatus
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                            : "Not Tagged Yet"}
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[240px]">
                        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                          Interest Level
                        </DropdownMenuLabel>
                        <DropdownMenuRadioGroup
                          value={selectedProspect.interestStatus || ""}
                          onValueChange={(value) =>
                            updateProspect(selectedProspect.id, {
                              interestStatus: value as InterestStatus,
                            })
                          }
                        >
                          <DropdownMenuRadioItem value="interested">
                            Interested
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="might_be_interested">
                            Might be interested
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="not_interested">
                            Not interested
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem
                          checked={selectedProspect.tags.humanHandover}
                          onCheckedChange={(checked) =>
                            updateTag(
                              selectedProspect.id,
                              "humanHandover",
                              checked
                            )
                          }
                        >
                          <User className="mr-2 h-4 w-4" />
                          Human Handover
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedProspect.tags.stopOutreach}
                          onCheckedChange={(checked) =>
                            updateTag(
                              selectedProspect.id,
                              "stopOutreach",
                              checked
                            )
                          }
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Stop Outreach
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedProspect.tags.meetingScheduled}
                          onCheckedChange={(checked) =>
                            updateTag(
                              selectedProspect.id,
                              "meetingScheduled",
                              checked
                            )
                          }
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Meeting Scheduled
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuCheckboxItem
                          checked={selectedProspect.tags.schedulingLinkSent}
                          onCheckedChange={(checked) =>
                            updateTag(
                              selectedProspect.id,
                              "schedulingLinkSent",
                              checked
                            )
                          }
                        >
                          <Link className="mr-2 h-4 w-4" />
                          Scheduling Link Sent
                        </DropdownMenuCheckboxItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-8">
                    {selectedProspect.tags.humanHandover && (
                      <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200"
                      >
                        Human Handover
                      </Badge>
                    )}
                    {selectedProspect.tags.stopOutreach && (
                      <Badge variant="destructive">Stop Outreach</Badge>
                    )}
                    {selectedProspect.tags.meetingScheduled && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                      >
                        Meeting Scheduled
                      </Badge>
                    )}
                    {selectedProspect.tags.schedulingLinkSent && (
                      <Badge variant="outline">Link Sent</Badge>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">
                      Location
                    </span>
                    <p className="font-medium">San Francisco, CA</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">
                      Industry
                    </span>
                    <p className="font-medium">Software Development</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">
                      Employees
                    </span>
                    <p className="font-medium">1,000 - 5,000</p>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">
                      Revenue
                    </span>
                    <p className="font-medium">$100M - $500M</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Experienced leader with a demonstrated history of working in
                    the computer software industry. Skilled in Sales, Go-to-market
                    Strategy, and Strategic Partnerships.
                  </p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Modal open={isCampaignModalOpen} onOpenChange={setIsCampaignModalOpen}>
        <ModalContent className="sm:max-w-[500px]">
          <ModalHeader>
            <ModalTitle>Add to Campaign</ModalTitle>
          </ModalHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Campaign</label>
              <div className="grid gap-2">
                {initialCampaigns
                  .filter((c) => c.status === "in_progress")
                  .map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedCampaign?.id === campaign.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/50"
                        }`}
                      onClick={() => setSelectedCampaign(campaign)}
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{campaign.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{campaign.type}</span>
                          <span>•</span>
                          <span>{campaign.totalProspects} prospects</span>
                        </div>
                      </div>
                      {selectedCampaign?.id === campaign.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
              </div>
            </div>

            {showPrivacyWarning && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Compatibility Warning</AlertTitle>
                <AlertDescription>
                  {selectedCampaign?.type === "messaging"
                    ? `You are adding ${openProfileCount} "Open" profile(s) to a Messaging campaign. These should typically go to InMail campaigns.`
                    : `You are adding ${closedProfileCount} "Closed" profile(s) to an InMail campaign. These should typically go to Messaging campaigns.`}
                </AlertDescription>
              </Alert>
            )}

            <Button
              className="w-full"
              disabled={!selectedCampaign}
              onClick={handleAddToCampaign}
            >
              Add {selectedProspectIds.length} Prospect{selectedProspectIds.length !== 1 && "s"}
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
