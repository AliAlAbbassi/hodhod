"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Inbox,
  Sparkles,
  HelpCircle,
  ThumbsDown,
  CheckCircle,
  Clock,
  Send,
  Archive,
  ChevronRight,
  X,
  Filter,
  Zap,
  List,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MessageStatus =
  | "response_sent"
  | "response_ready"
  | "meeting_scheduled"
  | "pending";

type Priority = "high" | "medium" | "low" | "unknown";

type Category =
  | "inbox"
  | "interested"
  | "maybe_interested"
  | "not_interested"
  | "approvals"
  | "scheduled"
  | "sent"
  | "archived";

type Message = {
  id: string;
  sender: {
    name: string;
    avatar?: string;
  };
  preview: string;
  priority: Priority;
  status: MessageStatus;
  date: string;
  isRead: boolean;
  category: Category;
};

const messages: Message[] = [
  {
    id: "1",
    sender: { name: "Dr Suri Moonsamy", avatar: "" },
    preview: "Perfect timing - here's a quick one-pager...",
    priority: "low",
    status: "response_sent",
    date: "08/05/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "2",
    sender: { name: "Brian Alcorn", avatar: "" },
    preview: "Thanks, Brian - appreciate the interest!...",
    priority: "low",
    status: "response_sent",
    date: "08/04/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "3",
    sender: { name: "Kevin Jaspal", avatar: "" },
    preview: "Glad we finally connected! Here's a quick...",
    priority: "high",
    status: "response_sent",
    date: "08/04/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "4",
    sender: { name: "Rob Yates", avatar: "" },
    preview: "Hi Zayd Syed, Thanks for reaching out. I'd...",
    priority: "low",
    status: "response_ready",
    date: "08/04/25",
    isRead: false,
    category: "interested",
  },
  {
    id: "5",
    sender: { name: "Richard Blacker", avatar: "" },
    preview: "Perfect timing - here's a quick one-page...",
    priority: "medium",
    status: "response_sent",
    date: "08/04/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "6",
    sender: { name: "Cherron Castillo", avatar: "" },
    preview: "I'm not interested in moving forward at...",
    priority: "low",
    status: "response_ready",
    date: "08/04/25",
    isRead: false,
    category: "not_interested",
  },
  {
    id: "7",
    sender: { name: "Nikola Beaka", avatar: "" },
    preview: "Hi Zayd. I looked at it and it's not th...",
    priority: "medium",
    status: "response_ready",
    date: "08/02/25",
    isRead: false,
    category: "maybe_interested",
  },
  {
    id: "8",
    sender: { name: "Tymo Bosch", avatar: "" },
    preview: "Hey Tymo, Just circling back to see if y...",
    priority: "medium",
    status: "response_sent",
    date: "08/02/25",
    isRead: true,
    category: "maybe_interested",
  },
  {
    id: "9",
    sender: { name: "Jillian Bichanich", avatar: "" },
    preview: "Hope the launch went well. If exploring...",
    priority: "low",
    status: "response_sent",
    date: "08/01/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "10",
    sender: { name: "DEBASHIS...", avatar: "" },
    preview: "Let's chat tomorrow or on Sunday...",
    priority: "high",
    status: "response_ready",
    date: "08/01/25",
    isRead: false,
    category: "interested",
  },
  {
    id: "11",
    sender: { name: "Francisco Alvarez", avatar: "" },
    preview: "Hope all is well. If you're still explori...",
    priority: "medium",
    status: "meeting_scheduled",
    date: "08/01/25",
    isRead: true,
    category: "interested",
  },
  {
    id: "12",
    sender: { name: "Lisa Skinner", avatar: "" },
    preview: "Following up to see if there's interest in...",
    priority: "medium",
    status: "response_sent",
    date: "08/01/25",
    isRead: true,
    category: "maybe_interested",
  },
  {
    id: "13",
    sender: { name: "Luke Daily", avatar: "" },
    preview: "If I feed Valley a list of companies...",
    priority: "unknown",
    status: "response_ready",
    date: "08/01/25",
    isRead: false,
    category: "interested",
  },
];

const categories: {
  id: Category;
  label: string;
  icon: React.ElementType;
  count: number;
}[] = [
  { id: "inbox", label: "Inbox", icon: Inbox, count: 206 },
  { id: "interested", label: "Interested", icon: Sparkles, count: 79 },
  { id: "maybe_interested", label: "Maybe Interested", icon: HelpCircle, count: 39 },
  { id: "not_interested", label: "Not Interested", icon: ThumbsDown, count: 91 },
  { id: "approvals", label: "Approvals", icon: CheckCircle, count: 0 },
  { id: "scheduled", label: "Scheduled", icon: Clock, count: 13 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "archived", label: "Archived", icon: Archive, count: 0 },
];

const priorityConfig = {
  high: { label: "High", className: "bg-transparent border-muted-foreground/30 text-muted-foreground" },
  medium: { label: "Medium", className: "bg-transparent border-muted-foreground/30 text-muted-foreground" },
  low: { label: "Low", className: "bg-transparent border-muted-foreground/30 text-muted-foreground" },
  unknown: { label: "Unknown", className: "bg-transparent border-muted-foreground/30 text-muted-foreground" },
};

const statusConfig: Record<
  MessageStatus,
  { label: string; className: string; dot?: boolean }
> = {
  response_sent: {
    label: "Response Sent",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  response_ready: {
    label: "Response Ready",
    className: "bg-orange-50 text-orange-600 border-orange-200",
    dot: true,
  },
  meeting_scheduled: {
    label: "Meeting Scheduled",
    className: "bg-orange-50 text-orange-600 border-orange-200",
    dot: true,
  },
  pending: {
    label: "Pending",
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
};

export default function InboxPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("inbox");
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>("active");

  const filteredMessages =
    selectedCategory === "inbox"
      ? messages
      : messages.filter((m) => m.category === selectedCategory);

  const toggleMessage = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  const toggleAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(filteredMessages.map((m) => m.id)));
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Inbox Sidebar */}
      <div className="w-64 border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Inbox</span>
              <span className="text-muted-foreground">{categories[0].count}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {categories.slice(1).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === category.id
                  ? "bg-muted font-medium"
                  : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                <span>{category.label}</span>
              </div>
              {category.count > 0 && (
                <span className="text-muted-foreground text-xs">
                  {category.count}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center gap-3 p-4 border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Zap className="h-4 w-4" />
                Campaign
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All Campaigns</DropdownMenuItem>
              <DropdownMenuItem>Q1 Outreach</DropdownMenuItem>
              <DropdownMenuItem>Product Launch</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("response_ready")}>
                Response Ready
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("response_sent")}>
                Response Sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("meeting_scheduled")}>
                Meeting Scheduled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {statusFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter(null)}
              className="gap-1"
            >
              Reset
              <X className="h-3 w-3" />
            </Button>
          )}
          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <List className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Archive selected</DropdownMenuItem>
              <DropdownMenuItem>Export messages</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <tbody>
              {filteredMessages
                .filter(
                  (m) =>
                    (!statusFilter || m.status === statusFilter) &&
                    (!searchQuery ||
                      m.sender.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      m.preview.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .map((message) => (
                  <tr
                    key={message.id}
                    className={cn(
                      "border-b hover:bg-muted/50 transition-colors cursor-pointer",
                      !message.isRead && "bg-muted/30"
                    )}
                  >
                    <td className="w-12 pl-4 py-3">
                      <Checkbox
                        checked={selectedMessages.has(message.id)}
                        onCheckedChange={() => toggleMessage(message.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                    <td className="w-12 py-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={message.sender.avatar} />
                          <AvatarFallback className="text-xs bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                            {getInitials(message.sender.name)}
                          </AvatarFallback>
                        </Avatar>
                        {!message.isRead && (
                          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-orange-500 border-2 border-background" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 pl-3">
                      <div className="flex items-center gap-2">
                        {!message.isRead && (
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        )}
                        <span
                          className={cn(
                            "font-medium",
                            !message.isRead && "font-semibold"
                          )}
                        >
                          {message.sender.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 flex-1">
                      <span className="text-muted-foreground text-sm truncate block max-w-md">
                        {message.preview}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-normal gap-1",
                          priorityConfig[message.priority].className
                        )}
                      >
                        <Zap className="h-3 w-3" />
                        {priorityConfig[message.priority].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs font-normal",
                          statusConfig[message.status].className
                        )}
                      >
                        {statusConfig[message.status].dot && (
                          <span className="h-1.5 w-1.5 rounded-full bg-current mr-1" />
                        )}
                        {statusConfig[message.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap">
                      {message.date}
                    </td>
                    <td className="py-3 pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View conversation</DropdownMenuItem>
                          <DropdownMenuItem>Reply</DropdownMenuItem>
                          <DropdownMenuItem>Mark as read</DropdownMenuItem>
                          <DropdownMenuItem>Archive</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
