"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  ArrowUpDown,
  ChevronRight,
  Flame,
  Plus,
  Snowflake,
  Sun,
  Loader2,
} from "lucide-react";

type IntentLevel = "hot" | "warm" | "cold";
type ContactStatus = "contacted" | "not_contacted";

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
  status: ContactStatus;
  industry: string;
};

const prospects: Prospect[] = [
  {
    id: "1",
    name: "Sophia Williams",
    headline: "Creatives and Design for SaaS",
    avatarUrl: "",
    company: { name: "Amazon", logoUrl: "", logoColor: "bg-black" },
    role: "Product Designer",
    tenure: "1 year",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "contacted",
    industry: "Computer",
  },
  {
    id: "2",
    name: "Samuel Green",
    headline: "Visa Inc.",
    avatarUrl: "",
    company: { name: "Netflix", logoUrl: "", logoColor: "bg-red-600" },
    role: "Software Engineer",
    tenure: "1 year",
    intentLevel: "warm",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Software e...",
  },
  {
    id: "3",
    name: "Anna Joseph",
    headline: "All things Sales and GTM",
    avatarUrl: "",
    company: { name: "Rippling", logoUrl: "", logoColor: "bg-yellow-500" },
    role: "VP Of Sales",
    tenure: "1 year",
    intentLevel: "hot",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Computer...",
  },
  {
    id: "4",
    name: "Sophia Williams",
    headline: "Finding my next big failure",
    avatarUrl: "",
    company: { name: "Vercel", logoUrl: "", logoColor: "bg-black" },
    role: "SDE II",
    tenure: "1 year",
    intentLevel: "hot",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Healthcare...",
  },
  {
    id: "5",
    name: "Bishop Bullock",
    headline: "Developer, hiker and designer",
    avatarUrl: "",
    company: { name: "Synergy", logoUrl: "", logoColor: "bg-green-500" },
    role: "SDR - I",
    tenure: "2 year 8months",
    intentLevel: "hot",
    time: "4 hours ago",
    status: "contacted",
    industry: "educational...",
  },
  {
    id: "6",
    name: "Luke Trejo",
    headline: "I help founders set up the right...",
    avatarUrl: "",
    company: { name: "Solaris", logoUrl: "", logoColor: "bg-teal-500" },
    role: "Founder",
    tenure: "3 months",
    intentLevel: "hot",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Green Ene...",
  },
  {
    id: "7",
    name: "Keshav Ketan Saini",
    headline: "Looking for my next gig",
    avatarUrl: "",
    company: { name: "Aurora", logoUrl: "", logoColor: "bg-orange-500" },
    role: "Product Manager",
    tenure: "1 month",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "contacted",
    industry: "Computer...",
  },
  {
    id: "8",
    name: "Nellie Yang",
    headline: "Visual artist and creative",
    avatarUrl: "",
    company: { name: "Openify", logoUrl: "", logoColor: "bg-blue-500" },
    role: "Creative head",
    tenure: "2 months",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Agriculture...",
  },
  {
    id: "9",
    name: "Zane Salinas",
    headline: "Talks about sales, gtm and...",
    avatarUrl: "",
    company: { name: "Apex", logoUrl: "", logoColor: "bg-emerald-600" },
    role: "VP of Sales",
    tenure: "8 months",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "contacted",
    industry: "Accounting...",
  },
  {
    id: "10",
    name: "Sadie Rios",
    headline: "LinkedIn top design voice",
    avatarUrl: "",
    company: { name: "Orandis", logoUrl: "", logoColor: "bg-pink-500" },
    role: "Product Designer",
    tenure: "1 year",
    intentLevel: "cold",
    time: "4 hours ago",
    status: "not_contacted",
    industry: "Computer...",
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

const StatusBadge = ({ status }: { status: ContactStatus }) => {
  const isContacted = status === "contacted";
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 rounded-full ${isContacted ? "bg-green-500" : "bg-orange-500"}`}
      />
      <span className="text-sm">
        {isContacted ? "Contacted" : "Not Contacted"}
      </span>
    </div>
  );
};

const columns: ColumnDef<Prospect>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
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
    cell: ({ row }) => {
      const prospect = row.original;
      const initials = prospect.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={prospect.avatarUrl} alt={prospect.name} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{prospect.name}</span>
            <span className="text-sm text-muted-foreground truncate max-w-[200px]">
              {prospect.headline}
            </span>
          </div>
        </div>
      );
    },
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
            <span className="font-medium">{prospect.role}</span>
            <span className="text-sm text-muted-foreground">
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
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.time}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate max-w-[100px] block">
        {row.original.industry}
      </span>
    ),
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Button>
    ),
  },
];

export default function ProspectsPage() {
  const totalProspects = 540;

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
          <span className="text-muted-foreground">({totalProspects})</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            No campaign created yet
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={prospects} showPagination={false} />

      {/* Loading indicator */}
      <div className="flex justify-center py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading</span>
        </div>
      </div>
    </div>
  );
}
