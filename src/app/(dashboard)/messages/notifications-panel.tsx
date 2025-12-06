"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    RefreshCw,
    ArrowRight,
    Hexagon,
    MailOpen,
} from "lucide-react";

type NotificationType =
    | "approvals_done"
    | "email_reply"
    | "campaign_responses"
    | "connect_email";

type Notification = {
    id: string;
    type: NotificationType;
    data: Record<string, unknown>;
};

// Mock notifications data
const notifications: Notification[] = [
    {
        id: "1",
        type: "approvals_done",
        data: {},
    },
    {
        id: "2",
        type: "email_reply",
        data: {
            senderName: "Patrick Goswami",
            senderAvatar: "",
            subject: "Frigate + Figma animations?",
            preview: "Hey Keshav, happy to help. Want to grab some time here to chat through your use cas...",
        },
    },
    {
        id: "3",
        type: "campaign_responses",
        data: {
            campaignName: "Valley Sales #1",
            responseCount: 22,
        },
    },
    {
        id: "4",
        type: "connect_email",
        data: {},
    },
];

function ApprovalsDoneCard({ onApproveMore }: { onApproveMore?: () => void }) {
    return (
        <Card className="p-6 text-center space-y-4">
            <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full border-2 border-muted-foreground/20 flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold text-lg">24hrs of Approvals Done!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    You've approved enough messages to keep things running for the next full day.
                    Want to stay ahead? You can always approve more to keep the queue full.
                </p>
            </div>
            <Button variant="outline" className="gap-2" onClick={onApproveMore}>
                Approve More
                <ArrowRight className="h-4 w-4" />
            </Button>
        </Card>
    );
}

function EmailReplyCard({
    senderName,
    senderAvatar,
    subject,
    preview,
}: {
    senderName: string;
    senderAvatar?: string;
    subject: string;
    preview: string;
}) {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
                <AvatarImage src={senderAvatar} />
                <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                    {getInitials(senderName)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
                <p className="text-sm">
                    <span className="font-semibold">{senderName}</span>
                    {" "}replied on your email with subject{" "}
                    <span className="font-semibold">{subject}</span>:
                </p>
                <div className="border-l-2 border-muted-foreground/30 pl-3">
                    <p className="text-sm text-muted-foreground italic">
                        "{preview}"
                    </p>
                </div>
            </div>
        </div>
    );
}

function CampaignResponsesCard({
    campaignName,
    responseCount,
    onViewResponses,
    onApproveAll,
}: {
    campaignName: string;
    responseCount: number;
    onViewResponses?: () => void;
    onApproveAll?: () => void;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg border border-muted-foreground/20 flex items-center justify-center shrink-0">
                <Hexagon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-3">
                <p className="text-sm">
                    <span className="font-semibold">{campaignName}</span> campaign has generated{" "}
                    <span className="font-semibold">{responseCount} new responses</span>, and it will require your{" "}
                    <span className="text-muted-foreground">Approval</span>
                </p>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={onViewResponses}>
                        View Responses
                    </Button>
                    <Button size="sm" variant="ghost" onClick={onApproveAll}>
                        Approve All
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ConnectEmailCard({ onConnect }: { onConnect?: () => void }) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg border border-muted-foreground/20 flex items-center justify-center shrink-0">
                <MailOpen className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-3">
                <p className="text-sm">
                    Hey 👋.. Connect your email provider to start sending emails through Hodhod.
                </p>
                <Button size="sm" onClick={onConnect}>
                    Connect
                </Button>
            </div>
        </div>
    );
}

export function NotificationsPanel() {
    return (
        <div className="space-y-4">
            {notifications.map((notification) => {
                switch (notification.type) {
                    case "approvals_done":
                        return <ApprovalsDoneCard key={notification.id} />;
                    case "email_reply":
                        return (
                            <Card key={notification.id} className="p-4">
                                <EmailReplyCard
                                    senderName={notification.data.senderName as string}
                                    senderAvatar={notification.data.senderAvatar as string}
                                    subject={notification.data.subject as string}
                                    preview={notification.data.preview as string}
                                />
                            </Card>
                        );
                    case "campaign_responses":
                        return (
                            <Card key={notification.id} className="p-4">
                                <CampaignResponsesCard
                                    campaignName={notification.data.campaignName as string}
                                    responseCount={notification.data.responseCount as number}
                                />
                            </Card>
                        );
                    case "connect_email":
                        return (
                            <Card key={notification.id} className="p-4">
                                <ConnectEmailCard />
                            </Card>
                        );
                    default:
                        return null;
                }
            })}
        </div>
    );
}

// Export individual cards for use elsewhere
export {
    ApprovalsDoneCard,
    EmailReplyCard,
    CampaignResponsesCard,
    ConnectEmailCard,
};
