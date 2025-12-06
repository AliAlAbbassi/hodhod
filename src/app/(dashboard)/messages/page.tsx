"use client";

import { useState, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCheckbox } from "@/components/ui/table-checkbox";
import { Input } from "@/components/ui/input";
import { MessageDetailSheet } from "./message-detail-sheet";
import { NotificationsPanel } from "./notifications-panel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Mail,
  Sparkles,
  HelpCircle,
  ThumbsDown,
  CheckCircle,
  Clock,
  Send,
  Archive,
  ChevronRight,
  ChevronDown,
  Zap,
  SlidersHorizontal,
  Calendar,
  BarChart3,
  Settings2,
  Bell,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MessageStatus =
  | "responded"
  | "followup_sent"
  | "connect_message_sent"
  | "inmail_sent"
  | "re_engagement_sent";

type Priority = "high" | "medium" | "low";

type Category =
  | "inbox"
  | "interested"
  | "maybe_interested"
  | "not_interested"
  | "approvals"
  | "scheduled"
  | "sent"
  | "archived";

type DateGroup = "today" | "yesterday" | "this_week" | "older";

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
  dateGroup: DateGroup;
  category: Category;
  campaign: string;
};

const messages: Message[] = [
  // Today
  {
    id: "1",
    sender: { name: "James Brown" },
    preview: "Interested in learning more about pricing for our team of 50",
    priority: "high",
    status: "responded",
    date: "12/12/23",
    dateGroup: "today",
    category: "interested",
    campaign: "Q1 Outreach",
  },
  {
    id: "2",
    sender: { name: "Michael Thompson" },
    preview: "Can you send over case studies from similar companies?",
    priority: "medium",
    status: "followup_sent",
    date: "12/12/23",
    dateGroup: "today",
    category: "interested",
    campaign: "Product Launch",
  },
  {
    id: "3",
    sender: { name: "Sarah Chen" },
    preview: "Not the right time for us, but keep us posted next quarter",
    priority: "high",
    status: "connect_message_sent",
    date: "12/12/23",
    dateGroup: "today",
    category: "not_interested",
    campaign: "Q1 Outreach",
  },
  {
    id: "4",
    sender: { name: "Emma Wilson" },
    preview: "This looks promising - when can we schedule a demo?",
    priority: "low",
    status: "inmail_sent",
    date: "12/12/23",
    dateGroup: "today",
    category: "interested",
    campaign: "Product Launch",
  },
  {
    id: "5",
    sender: { name: "Emma Wright" },
    preview: "Budget approved! Let's discuss implementation timeline",
    priority: "high",
    status: "re_engagement_sent",
    date: "12/12/23",
    dateGroup: "today",
    category: "interested",
    campaign: "Q1 Outreach",
  },
  // Yesterday
  {
    id: "6",
    sender: { name: "Alex Kumar" },
    preview: "Current solution works fine, but open to seeing ROI comparison",
    priority: "high",
    status: "re_engagement_sent",
    date: "12/12/23",
    dateGroup: "yesterday",
    category: "maybe_interested",
    campaign: "Product Launch",
  },
  {
    id: "7",
    sender: { name: "Lisa Martinez" },
    preview: "Thanks for the proposal. Need to run this by the board first",
    priority: "medium",
    status: "inmail_sent",
    date: "12/12/23",
    dateGroup: "yesterday",
    category: "interested",
    campaign: "Q1 Outreach",
  },
  {
    id: "8",
    sender: { name: "Roger Green" },
    preview: "Love the features! What's your best price for enterprise?",
    priority: "medium",
    status: "connect_message_sent",
    date: "12/12/23",
    dateGroup: "yesterday",
    category: "interested",
    campaign: "Product Launch",
  },
  {
    id: "9",
    sender: { name: "Tom Anderson" },
    preview: "Forwarded to our IT team - they'll reach out with questions",
    priority: "high",
    status: "followup_sent",
    date: "12/12/23",
    dateGroup: "yesterday",
    category: "interested",
    campaign: "Q1 Outreach",
  },
  {
    id: "10",
    sender: { name: "Nina Patricks" },
    preview: "Perfect timing! We're evaluating vendors this month",
    priority: "high",
    status: "responded",
    date: "12/12/23",
    dateGroup: "yesterday",
    category: "interested",
    campaign: "Product Launch",
  },
  // This week
  {
    id: "11",
    sender: { name: "Mark Stevens" },
    preview: "Impressive demo yesterday. Next step is trial with my team",
    priority: "high",
    status: "responded",
    date: "12/12/23",
    dateGroup: "this_week",
    category: "interested",
    campaign: "Q1 Outreach",
  },
];

const categories: {
  id: Category;
  label: string;
  icon: React.ElementType;
  count: number;
}[] = [
  { id: "inbox", label: "Messages", icon: Mail, count: 40 },
  { id: "interested", label: "Interested", icon: Sparkles, count: 25 },
  {
    id: "maybe_interested",
    label: "Maybe Interested",
    icon: HelpCircle,
    count: 6,
  },
  {
    id: "not_interested",
    label: "Not interested",
    icon: ThumbsDown,
    count: 11,
  },
  { id: "approvals", label: "Approvals", icon: CheckCircle, count: 44 },
  { id: "scheduled", label: "Scheduled", icon: Clock, count: 25 },
  { id: "sent", label: "Sent", icon: Send, count: 0 },
  { id: "archived", label: "Archived", icon: Archive, count: 0 },
];

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  high: {
    label: "High",
    className:
      "bg-transparent border-muted-foreground/30 text-muted-foreground",
  },
  medium: {
    label: "Medium",
    className:
      "bg-transparent border-muted-foreground/30 text-muted-foreground",
  },
  low: {
    label: "Low",
    className:
      "bg-transparent border-muted-foreground/30 text-muted-foreground",
  },
};

const statusConfig: Record<
  MessageStatus,
  { label: string; className: string; dot?: boolean }
> = {
  responded: {
    label: "Responded",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: true,
  },
  followup_sent: {
    label: "Followup Sent",
    className: "bg-transparent text-orange-500 border-transparent",
    dot: true,
  },
  connect_message_sent: {
    label: "Connect Message Sent",
    className: "bg-stone-100 text-stone-600 border-stone-200",
    dot: true,
  },
  inmail_sent: {
    label: "InMail Sent",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: true,
  },
  re_engagement_sent: {
    label: "Re-Engagement Sent",
    className: "bg-transparent text-orange-500 border-transparent",
    dot: true,
  },
};

const dateGroupLabels: Record<DateGroup, string> = {
  today: "Today",
  yesterday: "Yesterday",
  this_week: "This week",
  older: "Older",
};

export default function InboxPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("inbox");
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Filter states
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<MessageStatus | null>(
    null,
  );
  const [selectedIcpFit, setSelectedIcpFit] = useState<Priority | null>(null);
  const [selectedDateGroup, setSelectedDateGroup] = useState<DateGroup | null>(
    null,
  );

  const filteredMessages = messages.filter((m) => {
    // Category filter
    if (selectedCategory !== "inbox" && m.category !== selectedCategory)
      return false;

    // Search filter
    if (
      searchQuery &&
      !m.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Campaign filter
    if (selectedCampaign && m.campaign !== selectedCampaign) return false;

    // Status filter
    if (selectedStatus && m.status !== selectedStatus) return false;

    // ICP-Fit filter (using priority as proxy)
    if (selectedIcpFit && m.priority !== selectedIcpFit) return false;

    // Date group filter
    if (selectedDateGroup && m.dateGroup !== selectedDateGroup) return false;

    return true;
  });

  const toggleMessage = (id: string) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedMessages(newSelected);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Group messages by date
  const groupedMessages = filteredMessages.reduce(
    (acc, message) => {
      if (!acc[message.dateGroup]) {
        acc[message.dateGroup] = [];
      }
      acc[message.dateGroup].push(message);
      return acc;
    },
    {} as Record<DateGroup, Message[]>,
  );

  const dateGroupOrder: DateGroup[] = [
    "today",
    "yesterday",
    "this_week",
    "older",
  ];

  // Flatten filtered messages for navigation
  const flatFilteredMessages = useMemo(() => {
    return filteredMessages;
  }, [filteredMessages]);

  const selectedMessage = flatFilteredMessages.find(
    (m) => m.id === selectedMessageId,
  );
  const currentMessageIndex = flatFilteredMessages.findIndex(
    (m) => m.id === selectedMessageId,
  );

  const handleMessageClick = (messageId: string) => {
    setSelectedMessageId(messageId);
    setIsDetailOpen(true);
  };

  const handlePreviousMessage = () => {
    if (currentMessageIndex > 0) {
      setSelectedMessageId(flatFilteredMessages[currentMessageIndex - 1].id);
    }
  };

  const handleNextMessage = () => {
    if (currentMessageIndex < flatFilteredMessages.length - 1) {
      setSelectedMessageId(flatFilteredMessages[currentMessageIndex + 1].id);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Messages Sidebar - Hidden on mobile */}
      <div className="hidden md:flex w-56 border-r bg-background flex-col">
        <div className="p-3 border-b">
          <button className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-muted/50 rounded-md transition-colors">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Messages</span>
              <span className="text-muted-foreground text-sm">
                {categories[0].count}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5">
          {categories.slice(1).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                selectedCategory === category.id
                  ? "bg-muted font-medium"
                  : "hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-4 w-4 text-muted-foreground" />
                <span>{category.label}</span>
                {category.count > 0 && (
                  <span className="text-muted-foreground text-sm">
                    {category.count}
                  </span>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-background min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 px-2 sm:px-4 py-3 border-b">
          <div className="relative w-40 sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 shrink-0"
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Campaign</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                {selectedCampaign && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCampaign(null)}>
                All Campaigns
                {!selectedCampaign && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedCampaign("Q1 Outreach")}
              >
                Q1 Outreach
                {selectedCampaign === "Q1 Outreach" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedCampaign("Product Launch")}
              >
                Product Launch
                {selectedCampaign === "Product Launch" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Status</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                {selectedStatus && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedStatus(null)}>
                All
                {!selectedStatus && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("responded")}
              >
                Responded
                {selectedStatus === "responded" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("followup_sent")}
              >
                Followup Sent
                {selectedStatus === "followup_sent" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("connect_message_sent")}
              >
                Connect Message Sent
                {selectedStatus === "connect_message_sent" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("inmail_sent")}
              >
                InMail Sent
                {selectedStatus === "inmail_sent" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedStatus("re_engagement_sent")}
              >
                Re-Engagement Sent
                {selectedStatus === "re_engagement_sent" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 shrink-0"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden lg:inline">ICP-Fit</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                {selectedIcpFit && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedIcpFit(null)}>
                All
                {!selectedIcpFit && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedIcpFit("high")}>
                High
                {selectedIcpFit === "high" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedIcpFit("medium")}>
                Medium
                {selectedIcpFit === "medium" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedIcpFit("low")}>
                Low
                {selectedIcpFit === "low" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9 shrink-0"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden lg:inline">Date</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
                {selectedDateGroup && (
                  <span className="ml-1 h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedDateGroup(null)}>
                All time
                {!selectedDateGroup && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedDateGroup("today")}>
                Today
                {selectedDateGroup === "today" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedDateGroup("yesterday")}
              >
                Yesterday
                {selectedDateGroup === "yesterday" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSelectedDateGroup("this_week")}
              >
                This week
                {selectedDateGroup === "this_week" && (
                  <Check className="ml-auto h-4 w-4" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="ml-auto flex items-center gap-1 shrink-0">
            <Button
              variant={isNotificationsOpen ? "secondary" : "ghost"}
              size="icon"
              className="h-8 w-8 relative"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-orange-500 rounded-full" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden sm:flex"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden sm:flex"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hidden sm:flex"
            >
              <Settings2 className="h-4 w-4" />
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
          {dateGroupOrder.map((dateGroup) => {
            const messagesInGroup = groupedMessages[dateGroup];
            if (!messagesInGroup || messagesInGroup.length === 0) return null;

            return (
              <div key={dateGroup}>
                <div className="px-4 py-2 text-sm text-muted-foreground font-medium bg-background sticky top-0 z-10 border-b">
                  {dateGroupLabels[dateGroup]}
                </div>
                <table className="w-full table-fixed">
                  <tbody>
                    {messagesInGroup.map((message) => (
                      <tr
                        key={message.id}
                        className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => handleMessageClick(message.id)}
                      >
                        <td className="w-10 pl-4 py-3">
                          <TableCheckbox
                            checked={selectedMessages.has(message.id)}
                            onCheckedChange={() => toggleMessage(message.id)}
                            onClick={(e: React.MouseEvent) =>
                              e.stopPropagation()
                            }
                          />
                        </td>
                        <td className="w-10 py-3 pl-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.sender.avatar} />
                            <AvatarFallback className="text-xs bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                              {getInitials(message.sender.name)}
                            </AvatarFallback>
                          </Avatar>
                        </td>
                        <td className="py-3 pl-3 w-32 sm:w-40">
                          <span className="font-medium text-sm truncate block">
                            {message.sender.name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-muted-foreground text-sm line-clamp-1">
                            {message.preview}
                          </span>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap w-[180px] hidden xl:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-normal",
                              statusConfig[message.status].className,
                            )}
                          >
                            {statusConfig[message.status].dot && (
                              <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                            )}
                            {statusConfig[message.status].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 whitespace-nowrap w-[100px] hidden lg:table-cell">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs font-normal gap-1",
                              priorityConfig[message.priority].className,
                            )}
                          >
                            <Zap className="h-3 w-3" />
                            {priorityConfig[message.priority].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground whitespace-nowrap w-[100px] hidden md:table-cell">
                          {message.date}
                        </td>
                        <td className="py-3 pr-4 w-12">
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
                              <DropdownMenuItem>
                                View conversation
                              </DropdownMenuItem>
                              <DropdownMenuItem>Reply</DropdownMenuItem>
                              <DropdownMenuItem>Archive</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notifications Panel */}
      {isNotificationsOpen && (
        <div className="w-full md:w-96 border-l-0 md:border-l bg-muted/30 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
            <h3 className="font-semibold">Notifications</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsNotificationsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <NotificationsPanel />
          </div>
        </div>
      )}

      {/* Message Detail Sheet */}
      <MessageDetailSheet
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        messageId={selectedMessageId}
        messageName={selectedMessage?.sender.name || ""}
        messagePreview={selectedMessage?.preview || ""}
        messagePriority={selectedMessage?.priority || "medium"}
        currentIndex={currentMessageIndex}
        totalCount={flatFilteredMessages.length}
        onPrevious={handlePreviousMessage}
        onNext={handleNextMessage}
      />
    </div>
  );
}
