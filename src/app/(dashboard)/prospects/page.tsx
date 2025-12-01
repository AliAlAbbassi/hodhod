"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Prospect = {
  id: string;
  name: string;
  title: string;
  company: string;
  icpScore: number;
  status: "new" | "contacted" | "replied" | "meeting_booked";
  lastContact: string;
};

const prospects: Prospect[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "VP Engineering",
    company: "Stripe",
    icpScore: 92,
    status: "meeting_booked",
    lastContact: "2024-01-15",
  },
  {
    id: "2",
    name: "Marcus Johnson",
    title: "CTO",
    company: "Vercel",
    icpScore: 88,
    status: "replied",
    lastContact: "2024-01-14",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    title: "Head of Engineering",
    company: "Linear",
    icpScore: 95,
    status: "contacted",
    lastContact: "2024-01-13",
  },
  {
    id: "4",
    name: "David Kim",
    title: "Engineering Director",
    company: "Figma",
    icpScore: 85,
    status: "new",
    lastContact: "-",
  },
  {
    id: "5",
    name: "Anna Thompson",
    title: "VP Platform",
    company: "Datadog",
    icpScore: 90,
    status: "replied",
    lastContact: "2024-01-12",
  },
];

const statusColors = {
  new: "secondary",
  contacted: "outline",
  replied: "default",
  meeting_booked: "default",
} as const;

const statusLabels = {
  new: "New",
  contacted: "Contacted",
  replied: "Replied",
  meeting_booked: "Meeting Booked",
};

const columns: ColumnDef<Prospect>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "icpScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ICP Score
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const score = row.getValue("icpScore") as number;
      return (
        <span
          className={
            score >= 90
              ? "text-green-600 font-medium"
              : score >= 80
                ? "text-yellow-600"
                : "text-gray-600"
          }
        >
          {score}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as keyof typeof statusColors;
      return (
        <Badge
          variant={statusColors[status]}
          className={
            status === "meeting_booked"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : ""
          }
        >
          {statusLabels[status]}
        </Badge>
      );
    },
  },
  {
    accessorKey: "lastContact",
    header: "Last Contact",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const prospect = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Send Message</DropdownMenuItem>
            <DropdownMenuItem>View Research</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ProspectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prospects</h1>
          <p className="text-muted-foreground">
            Manage and track your LinkedIn prospects
          </p>
        </div>
        <Button>Add Prospects</Button>
      </div>
      <DataTable
        columns={columns}
        data={prospects}
        searchKey="name"
        searchPlaceholder="Search prospects..."
      />
    </div>
  );
}
