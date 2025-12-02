"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  X,
  ChevronDown,
  Zap,
  Link as LinkIcon,
  Upload,
  FileText,
  Plus,
  Minus,
  Trash2,
  MessageSquare,
  Mail,
  Clock,
  Info,
} from "lucide-react";

type SequenceStep = {
  id: string;
  type: "connect" | "followup";
  day: number;
  channel: "message" | "inmail";
  isAiGenerated: boolean;
  isLast?: boolean;
};

type WaitStep = {
  id: string;
  days: number;
};

export default function CreateCampaignPage() {
  const [activeTab, setActiveTab] = useState("first-outreach");
  const [campaignName, setCampaignName] = useState("");
  const [reachoutChannel, setReachoutChannel] = useState<"message" | "inmail">("message");
  const [profileType, setProfileType] = useState("private");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [writingStyle, setWritingStyle] = useState("");

  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>([
    { id: "1", type: "connect", day: 1, channel: "message", isAiGenerated: true },
    { id: "2", type: "followup", day: 4, channel: "message", isAiGenerated: true },
    { id: "3", type: "followup", day: 7, channel: "message", isAiGenerated: true, isLast: true },
  ]);

  const [waitSteps, setWaitSteps] = useState<WaitStep[]>([
    { id: "w1", days: 3 },
    { id: "w2", days: 3 },
  ]);

  const updateWaitDays = (index: number, delta: number) => {
    setWaitSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, days: Math.max(1, step.days + delta) } : step
      )
    );
  };

  const removeStep = (stepId: string) => {
    setSequenceSteps((prev) => {
      const newSteps = prev.filter((s) => s.id !== stepId);
      // Mark the last one as isLast
      if (newSteps.length > 0) {
        newSteps[newSteps.length - 1].isLast = true;
      }
      return newSteps;
    });
    // Also remove corresponding wait step
    if (waitSteps.length > sequenceSteps.length - 2) {
      setWaitSteps((prev) => prev.slice(0, -1));
    }
  };

  const addFollowup = () => {
    const lastStep = sequenceSteps[sequenceSteps.length - 1];
    const lastWait = waitSteps[waitSteps.length - 1];
    const newDay = lastStep ? lastStep.day + (lastWait?.days || 3) : 1;

    // Remove isLast from previous last step
    setSequenceSteps((prev) => [
      ...prev.map((s) => ({ ...s, isLast: false })),
      {
        id: String(Date.now()),
        type: "followup",
        day: newDay,
        channel: reachoutChannel,
        isAiGenerated: true,
        isLast: true,
      },
    ]);

    // Add new wait step
    setWaitSteps((prev) => [...prev, { id: `w${Date.now()}`, days: 3 }]);
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/campaigns">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link href="/campaigns" className="text-muted-foreground hover:text-foreground">
                Campaigns
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">Create Campaign</span>
            </div>
          </div>
          <Button>Next</Button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent p-0 h-auto">
              <TabsTrigger
                value="first-outreach"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2"
              >
                First Outreach
              </TabsTrigger>
              <TabsTrigger
                value="re-engagements"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent px-4 py-2"
              >
                Re-Engagements
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Sequence Builder */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-xl">
            {/* Sequence Starts */}
            <div className="flex justify-center mb-8">
              <Button variant="outline" className="gap-2">
                <Zap className="h-4 w-4" />
                Sequence Starts
              </Button>
            </div>

            {/* Vertical line connector */}
            <div className="relative">
              {sequenceSteps.map((step, index) => (
                <div key={step.id}>
                  {/* Connector line */}
                  {index > 0 && (
                    <div className="flex flex-col items-center py-4">
                      <div className="h-8 w-px bg-border" />
                      {/* Wait control */}
                      <div className="flex items-center gap-2 py-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Wait for</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateWaitDays(index - 1, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm font-medium w-12 text-center">
                          {waitSteps[index - 1]?.days || 3} days
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => updateWaitDays(index - 1, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="h-8 w-px bg-border" />
                    </div>
                  )}

                  {/* Step Card */}
                  <SequenceStepCard
                    step={step}
                    onRemove={() => removeStep(step.id)}
                    canRemove={sequenceSteps.length > 1}
                  />
                </div>
              ))}

              {/* Add button */}
              <div className="flex flex-col items-center py-4">
                <div className="h-8 w-px bg-border" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full border"
                  onClick={addFollowup}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-96 border-l bg-background overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Setup Campaign Details</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  AI Generated
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>AI Generated</DropdownMenuItem>
                <DropdownMenuItem>Manual</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Campaign Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Campaign Name</label>
            <Input
              placeholder="e.g Hiring Outreach, Sales Outreach, etc."
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>

          {/* Reachout Through */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reachout Through</label>
            <div className="flex gap-2">
              <Button
                variant={reachoutChannel === "message" ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setReachoutChannel("message")}
              >
                <MessageSquare className="h-4 w-4" />
                LinkedIn Message
              </Button>
              <Button
                variant={reachoutChannel === "inmail" ? "default" : "outline"}
                size="sm"
                className="gap-2"
                onClick={() => setReachoutChannel("inmail")}
              >
                <Mail className="h-4 w-4" />
                LinkedIn InMail
              </Button>
            </div>
          </div>

          {/* Upload Prospects */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Prospects</label>
            <p className="text-xs text-muted-foreground">
              We recommend a list of 500-1000 prospects for best results.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <LinkIcon className="h-4 w-4" />
                LinkedIn URL
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Upload className="h-4 w-4" />
                Upload XLS/CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <FileText className="h-4 w-4" />
                LinkedIn Post URL(s)
              </Button>
            </div>
          </div>

          {/* Profiles to be included */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Profiles to be included</label>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              We default to private profiles for message campaigns to save the public profiles on this list for an InMail campaign.
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  Private Profiles (Consumes InMail credits)
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuItem onClick={() => setProfileType("private")}>
                  Private Profiles (Consumes InMail credits)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProfileType("public")}>
                  Public Profiles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setProfileType("all")}>
                  All Profiles
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Select Product */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Product</label>
            <p className="text-xs text-muted-foreground">
              Value proposition your company is presenting.
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selectedProduct || "Select a Product"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuItem onClick={() => setSelectedProduct("Product A")}>
                  Product A
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedProduct("Product B")}>
                  Product B
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Select Writing Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Writing Style</label>
            <p className="text-xs text-muted-foreground">
              Writing style for your outreach.
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {writingStyle || "Select a Writing Style"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80">
                <DropdownMenuItem onClick={() => setWritingStyle("Professional")}>
                  Professional
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWritingStyle("Casual")}>
                  Casual
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setWritingStyle("Friendly")}>
                  Friendly
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}

function SequenceStepCard({
  step,
  onRemove,
  canRemove,
}: {
  step: SequenceStep;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const isConnect = step.type === "connect";
  const title = isConnect
    ? "Connect Sequence"
    : `Followup ${step.isLast ? "(Last)" : ""}`;

  return (
    <div className="relative rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {isConnect ? (
            <Zap className="h-5 w-5 text-muted-foreground" />
          ) : (
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">
            Day {step.day} · LinkedIn {step.channel === "message" ? "Message" : "InMail"} · AI Generated
          </p>
        </div>
        {canRemove && step.isLast && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
