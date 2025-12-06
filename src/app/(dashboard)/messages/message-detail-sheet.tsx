"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import {
    X,
    ChevronUp,
    ChevronDown,
    Zap,
    Linkedin,
    Mail,
    MapPin,
    Tag,
    Building2,
    RefreshCw,
    XCircle,
    MessageSquare,
    MoreVertical,
    Sparkles,
    ChevronRight,
    Edit,
    Send,
    CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";

type MessageThread = {
    id: string;
    type: "outbound" | "inbound" | "ai_generated" | "pending_approval";
    sender: string;
    content: string;
    timestamp: string;
    isAIGenerated?: boolean;
};

export type ProspectDetail = {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar?: string;
    icpFit: Priority;
    icpScore: number;
    campaign: string;
    status: string;
    tags: string[];
    privacy: "Public Profile" | "Private Profile";
    linkedIn: string;
    email: string;
    address: string;
    addedOn: string;
    messageThread: MessageThread[];
    pendingMessage?: {
        content: string;
        createdBy: string;
    };
};

// Mock detailed prospect data
const mockProspectDetails: Record<string, ProspectDetail> = {
    "1": {
        id: "1",
        name: "James Brown",
        title: "VP of Sales",
        company: "TechCorp Inc.",
        icpFit: "high",
        icpScore: 92,
        campaign: "Q1 Enterprise Outreach",
        status: "Responded",
        tags: ["Enterprise", "Decision Maker"],
        privacy: "Public Profile",
        linkedIn: "linkedin.com/in/james-brown",
        email: "james@techcorp.com",
        address: "San Francisco, CA",
        addedOn: "Dec 1, 2023",
        messageThread: [
            {
                id: "t1",
                type: "outbound",
                sender: "You",
                content: "Hey James - noticed TechCorp just closed their Series C. Congrats! We've been helping similar companies scale their sales operations. Would love to chat about how we can help accelerate your growth.",
                timestamp: "Dec 10, 2023, 2:30 PM",
            },
            {
                id: "t2",
                type: "inbound",
                sender: "James Brown",
                content: "Interested in learning more about pricing for our team of 50. Can you send more details?",
                timestamp: "Dec 12, 2023, 10:15 AM",
            },
        ],
        pendingMessage: {
            content: "Great to hear, James! I'd be happy to share pricing details. For a team of 50, we typically recommend our Growth plan. Would you be open to a quick call this week to discuss your specific needs?",
            createdBy: "Zayd",
        },
    },
    "2": {
        id: "2",
        name: "Michael Thompson",
        title: "Director of Operations",
        company: "Innovate Labs",
        icpFit: "medium",
        icpScore: 78,
        campaign: "Product Launch",
        status: "Followup Sent",
        tags: ["Mid-Market"],
        privacy: "Public Profile",
        linkedIn: "linkedin.com/in/michael-t",
        email: "michael@innovatelabs.io",
        address: "Austin, TX",
        addedOn: "Nov 28, 2023",
        messageThread: [
            {
                id: "t1",
                type: "outbound",
                sender: "You",
                content: "Hi Michael - saw your recent post about operational efficiency. We're helping companies like Innovate Labs streamline their workflows. Thought it might be relevant!",
                timestamp: "Dec 8, 2023, 11:00 AM",
            },
            {
                id: "t2",
                type: "inbound",
                sender: "Michael Thompson",
                content: "Can you send over case studies from similar companies?",
                timestamp: "Dec 12, 2023, 3:45 PM",
            },
        ],
        pendingMessage: {
            content: "Absolutely, Michael! I've attached a few case studies from companies in similar industries. Happy to walk through any of these on a call if helpful.",
            createdBy: "Zayd",
        },
    },
};

// Generate default detail for any message
function getDefaultProspectDetail(id: string, name: string, preview: string, priority: Priority): ProspectDetail {
    return {
        id,
        name,
        title: "Professional",
        company: "Company",
        icpFit: priority,
        icpScore: priority === "high" ? 85 : priority === "medium" ? 65 : 45,
        campaign: "Campaign",
        status: "Active",
        tags: [],
        privacy: "Public Profile",
        linkedIn: `linkedin.com/in/${name.toLowerCase().replace(" ", "-")}`,
        email: `${name.toLowerCase().replace(" ", ".")}@company.com`,
        address: "United States",
        addedOn: "Dec 2023",
        messageThread: [
            {
                id: "t1",
                type: "inbound",
                sender: name,
                content: preview,
                timestamp: "Recently",
            },
        ],
    };
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
    high: { label: "High", className: "bg-emerald-50 text-emerald-600 border-emerald-200" },
    medium: { label: "Medium", className: "bg-amber-50 text-amber-600 border-amber-200" },
    low: { label: "Low", className: "bg-stone-100 text-stone-600 border-stone-200" },
};

const detailTabs = ["Messages", "Summary", "Research", "Assumptions"] as const;
type DetailTab = typeof detailTabs[number];

interface MessageDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    messageId: string | null;
    messageName: string;
    messagePreview: string;
    messagePriority: Priority;
    currentIndex: number;
    totalCount: number;
    onPrevious: () => void;
    onNext: () => void;
}

export function MessageDetailSheet({
    open,
    onOpenChange,
    messageId,
    messageName,
    messagePreview,
    messagePriority,
    currentIndex,
    totalCount,
    onPrevious,
    onNext,
}: MessageDetailSheetProps) {
    const [activeTab, setActiveTab] = useState<DetailTab>("Messages");
    const [replyText, setReplyText] = useState("");

    if (!messageId) return null;

    const prospect = mockProspectDetails[messageId] ||
        getDefaultProspectDetail(messageId, messageName, messagePreview, messagePriority);

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:max-w-4xl p-0 gap-0 flex flex-col"
            >
                {/* Header with navigation */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onPrevious}
                                disabled={currentIndex === 0}
                            >
                                <ChevronUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onNext}
                                disabled={currentIndex >= totalCount - 1}
                            >
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </div>
                        <span className="text-sm text-muted-foreground">
                            {currentIndex + 1} of {totalCount} in Inbox
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>

                {/* Main content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left panel - Prospect info */}
                    <div className="w-80 border-r bg-muted/20 p-6 overflow-y-auto">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="relative">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={prospect.avatar} />
                                    <AvatarFallback className="text-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                                        {getInitials(prospect.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                                    {prospect.icpScore}
                                </div>
                            </div>
                            <div>
                                <h2 className="font-semibold text-lg">{prospect.name}</h2>
                                <p className="text-sm text-muted-foreground">{prospect.title}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Zap className="h-4 w-4" />
                                    ICP-Fit
                                </span>
                                <Badge
                                    variant="outline"
                                    className={cn("text-xs", priorityConfig[prospect.icpFit].className)}
                                >
                                    <Zap className="h-3 w-3 mr-1" />
                                    {priorityConfig[prospect.icpFit].label}
                                </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Building2 className="h-4 w-4" />
                                    Campaign
                                </span>
                                <span className="text-sm font-medium truncate max-w-32">{prospect.campaign}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    Status
                                </span>
                                <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-600 border-emerald-200">
                                    {prospect.status}
                                </Badge>
                            </div>

                            <div className="flex items-start justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Tag className="h-4 w-4" />
                                    Tags
                                </span>
                                <div className="flex flex-wrap gap-1 justify-end max-w-32">
                                    {prospect.tags.length > 0 ? (
                                        prospect.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">—</span>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Privacy</span>
                                <span className="text-sm">{prospect.privacy}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" />
                                    LinkedIn
                                </span>
                                <a href="#" className="text-sm text-blue-600 hover:underline truncate max-w-32">
                                    {prospect.linkedIn.replace("linkedin.com/in/", "")}
                                </a>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                </span>
                                <span className="text-sm truncate max-w-32">{prospect.email}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Address
                                </span>
                                <span className="text-sm">{prospect.address}</span>
                            </div>

                            <div className="text-xs text-muted-foreground pt-2">
                                Added on: {prospect.addedOn}
                            </div>

                            <Button variant="outline" size="sm" className="w-full mt-4">
                                Report
                            </Button>
                        </div>
                    </div>

                    {/* Right panel - Messages thread */}
                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 px-4 py-3 border-b">
                            {detailTabs.map((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "secondary" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "gap-2",
                                        activeTab === tab && "bg-muted font-medium"
                                    )}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab === "Messages" && <MessageSquare className="h-4 w-4" />}
                                    {tab === "Summary" && <Sparkles className="h-4 w-4" />}
                                    {tab}
                                </Button>
                            ))}
                        </div>

                        {/* Message thread */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {activeTab === "Messages" && (
                                <>
                                    {prospect.messageThread.map((msg) => (
                                        <div key={msg.id} className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                {msg.type === "inbound" ? (
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={prospect.avatar} />
                                                        <AvatarFallback className="text-xs bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                                                            {getInitials(msg.sender)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                                                        <span className="text-xs text-primary-foreground font-medium">Y</span>
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium">
                                                    {msg.sender}
                                                    {msg.type === "inbound" ? " replied" : ""}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    · {msg.timestamp}
                                                </span>
                                            </div>
                                            <div className={cn(
                                                "rounded-lg p-4 ml-8",
                                                msg.type === "inbound"
                                                    ? "bg-muted"
                                                    : "bg-muted/50 border"
                                            )}>
                                                <p className="text-sm leading-relaxed">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pending approval message */}
                                    {prospect.pendingMessage && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Sparkles className="h-4 w-4" />
                                                <span className="text-sm">Valley message generated · just now</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarFallback className="text-xs bg-orange-500 text-white">
                                                        {prospect.pendingMessage.createdBy[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm">
                                                    <span className="font-medium">{prospect.pendingMessage.createdBy}</span>
                                                    {" "}Reply message created (pending approval)
                                                </span>
                                            </div>

                                            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-4 ml-8 bg-muted/30">
                                                <p className="text-sm leading-relaxed">{prospect.pendingMessage.content}</p>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2 ml-8">
                                                <Button size="sm" className="bg-primary">
                                                    Approve
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Edit className="h-3 w-3" />
                                                    Edit
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <RefreshCw className="h-3 w-3" />
                                                    Regenerate
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                                                    <XCircle className="h-3 w-3" />
                                                    Stop Outreach
                                                </Button>
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    <Mail className="h-3 w-3" />
                                                    Feedback
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "Summary" && (
                                <div className="text-muted-foreground text-sm">
                                    AI-generated summary will appear here...
                                </div>
                            )}

                            {activeTab === "Research" && (
                                <div className="text-muted-foreground text-sm">
                                    Research insights about this prospect will appear here...
                                </div>
                            )}

                            {activeTab === "Assumptions" && (
                                <div className="text-muted-foreground text-sm">
                                    AI assumptions about this prospect will appear here...
                                </div>
                            )}
                        </div>

                        {/* Reply input */}
                        <div className="border-t p-4">
                            <div className="flex items-center gap-2">
                                <Input
                                    placeholder="Send a message to the prospect"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="flex-1"
                                />
                                <Button size="icon" className="shrink-0">
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
