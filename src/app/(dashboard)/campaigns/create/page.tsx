"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  ChevronDown,
  ChevronLeft,
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
  Globe,
  Calendar,
  Users,
  Building,
  Briefcase,
  TrendingUp,
  Search,
  Check,
  Linkedin,
  CornerDownRight,
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

// Available research agents
const researchAgents = [
  { id: "company", name: "Company Research", icon: Building, description: "Analyze company size, industry, and recent news" },
  { id: "role", name: "Role Analysis", icon: Briefcase, description: "Understand prospect's role and responsibilities" },
  { id: "engagement", name: "Engagement History", icon: TrendingUp, description: "Review LinkedIn activity and engagement patterns" },
  { id: "connections", name: "Mutual Connections", icon: Users, description: "Find shared connections and networks" },
  { id: "content", name: "Content Analysis", icon: Search, description: "Analyze posts, articles, and shared content" },
];

export default function CreateCampaignPage() {
  const router = useRouter();

  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Campaign Details
  const [activeTab, setActiveTab] = useState("first-outreach");
  const [campaignName, setCampaignName] = useState("");
  const [reachoutChannel, setReachoutChannel] = useState<"message" | "inmail">("message");
  const [profileType, setProfileType] = useState("private");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [writingStyle, setWritingStyle] = useState("");
  const [outreachLanguage, setOutreachLanguage] = useState("English");

  // Scheduling & Automation
  const [dailyVolume, setDailyVolume] = useState(50);
  const [outreachTime, setOutreachTime] = useState("09:00");
  const [outreachDays, setOutreachDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [autopilot, setAutopilot] = useState(false);

  // Step 2: Research Agents
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  // LinkedIn URL Modal
  const [isLinkedInUrlModalOpen, setIsLinkedInUrlModalOpen] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState("");

  // First Outreach sequence
  const [sequenceSteps, setSequenceSteps] = useState<SequenceStep[]>([
    { id: "1", type: "connect", day: 1, channel: "message", isAiGenerated: true },
    { id: "2", type: "followup", day: 4, channel: "message", isAiGenerated: true },
    { id: "3", type: "followup", day: 7, channel: "message", isAiGenerated: true, isLast: true },
  ]);

  const [waitSteps, setWaitSteps] = useState<WaitStep[]>([
    { id: "w1", days: 3 },
    { id: "w2", days: 3 },
  ]);

  // Re-engagement sequence
  const [reEngagementSteps, setReEngagementSteps] = useState<SequenceStep[]>([
    { id: "re1", type: "followup", day: 1, channel: "message", isAiGenerated: true },
    { id: "re2", type: "followup", day: 4, channel: "message", isAiGenerated: true, isLast: true },
  ]);

  const [reEngagementWaitSteps, setReEngagementWaitSteps] = useState<WaitStep[]>([
    { id: "rew1", days: 3 },
  ]);

  // First Outreach functions
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
      if (newSteps.length > 0) {
        newSteps[newSteps.length - 1].isLast = true;
      }
      return newSteps;
    });
    if (waitSteps.length > sequenceSteps.length - 2) {
      setWaitSteps((prev) => prev.slice(0, -1));
    }
  };

  const addFollowup = () => {
    const lastStep = sequenceSteps[sequenceSteps.length - 1];
    const lastWait = waitSteps[waitSteps.length - 1];
    const newDay = lastStep ? lastStep.day + (lastWait?.days || 3) : 1;

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
    setWaitSteps((prev) => [...prev, { id: `w${Date.now()}`, days: 3 }]);
  };

  // Re-engagement functions
  const updateReEngagementWaitDays = (index: number, delta: number) => {
    setReEngagementWaitSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, days: Math.max(1, step.days + delta) } : step
      )
    );
  };

  const removeReEngagementStep = (stepId: string) => {
    setReEngagementSteps((prev) => {
      const newSteps = prev.filter((s) => s.id !== stepId);
      if (newSteps.length > 0) {
        newSteps[newSteps.length - 1].isLast = true;
      }
      return newSteps;
    });
    if (reEngagementWaitSteps.length > reEngagementSteps.length - 2) {
      setReEngagementWaitSteps((prev) => prev.slice(0, -1));
    }
  };

  const addReEngagement = () => {
    const lastStep = reEngagementSteps[reEngagementSteps.length - 1];
    const lastWait = reEngagementWaitSteps[reEngagementWaitSteps.length - 1];
    const newDay = lastStep ? lastStep.day + (lastWait?.days || 3) : 1;

    setReEngagementSteps((prev) => [
      ...prev.map((s) => ({ ...s, isLast: false })),
      {
        id: `re${Date.now()}`,
        type: "followup",
        day: newDay,
        channel: reachoutChannel,
        isAiGenerated: true,
        isLast: true,
      },
    ]);
    setReEngagementWaitSteps((prev) => [...prev, { id: `rew${Date.now()}`, days: 3 }]);
  };

  const toggleDay = (day: string) => {
    setOutreachDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleAgent = (agentId: string) => {
    setSelectedAgents((prev) => {
      if (prev.includes(agentId)) {
        return prev.filter((id) => id !== agentId);
      }
      if (prev.length >= 5) {
        return prev; // Max 5 agents
      }
      return [...prev, agentId];
    });
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Create campaign and redirect
      router.push("/campaigns");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-full min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            {currentStep > 1 ? (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            ) : (
              <Link href="/campaigns">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/campaigns" className="text-muted-foreground hover:text-foreground">
                Campaigns
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-medium">Create Campaign</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">Step {currentStep} of 2</span>
            </div>
          </div>
          <Button onClick={handleNext}>
            {currentStep === 2 ? "Create Campaign" : "Next"}
          </Button>
        </div>

        {/* Step 1: Sequence Builder */}
        {currentStep === 1 && (
          <>
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

                {/* First Outreach Sequence */}
                {activeTab === "first-outreach" && (
                  <div className="relative">
                    {sequenceSteps.map((step, index) => (
                      <div key={step.id}>
                        {index > 0 && (
                          <div className="flex flex-col items-center py-4">
                            <div className="h-8 w-px bg-border" />
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
                        <SequenceStepCard
                          step={step}
                          stepNumber={index + 1}
                          isReEngagement={false}
                          onRemove={() => removeStep(step.id)}
                          canRemove={sequenceSteps.length > 1}
                        />
                      </div>
                    ))}
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
                )}

                {/* Re-Engagements Sequence */}
                {activeTab === "re-engagements" && (
                  <div className="relative">
                    {reEngagementSteps.map((step, index) => (
                      <div key={step.id}>
                        {index > 0 && (
                          <div className="flex flex-col items-center py-4">
                            <div className="h-8 w-px bg-border" />
                            <div className="flex items-center gap-2 py-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Wait for</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateReEngagementWaitDays(index - 1, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-12 text-center">
                                {reEngagementWaitSteps[index - 1]?.days || 3} days
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => updateReEngagementWaitDays(index - 1, 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="h-8 w-px bg-border" />
                          </div>
                        )}
                        <SequenceStepCard
                          step={step}
                          stepNumber={index + 1}
                          isReEngagement={true}
                          onRemove={() => removeReEngagementStep(step.id)}
                          canRemove={reEngagementSteps.length > 1}
                        />
                      </div>
                    ))}
                    <div className="flex flex-col items-center py-4">
                      <div className="h-8 w-px bg-border" />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full border"
                        onClick={addReEngagement}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Research Agents */}
        {currentStep === 2 && (
          <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-2xl">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Select Research Agents</h2>
                <p className="text-muted-foreground">
                  Choose up to 5 research agents to run on each prospect and their company for message personalization.
                </p>
              </div>

              <div className="grid gap-4">
                {researchAgents.map((agent) => {
                  const Icon = agent.icon;
                  const isSelected = selectedAgents.includes(agent.id);
                  return (
                    <Card
                      key={agent.id}
                      className={`cursor-pointer transition-all ${
                        isSelected ? "ring-2 ring-primary" : "hover:border-primary/50"
                      }`}
                      onClick={() => toggleAgent(agent.id)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{agent.name}</h3>
                          <p className="text-sm text-muted-foreground">{agent.description}</p>
                        </div>
                        {isSelected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <p className="text-center text-sm text-muted-foreground mt-6">
                {selectedAgents.length} of 5 agents selected
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Only show on Step 1 */}
      {currentStep === 1 && (
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
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Message
                  {reachoutChannel === "message" && <Check className="h-3 w-3" />}
                </Button>
                <Button
                  variant={reachoutChannel === "inmail" ? "default" : "outline"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setReachoutChannel("inmail")}
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn InMail
                  {reachoutChannel === "inmail" && <Check className="h-3 w-3" />}
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
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsLinkedInUrlModalOpen(true)}
                >
                  <LinkIcon className="h-4 w-4" />
                  LinkedIn URL
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload XLS/CSV
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

            {/* Outreach Language */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Outreach Language</label>
              <p className="text-xs text-muted-foreground">
                Language for your outreach messages.
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {outreachLanguage}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80">
                  <DropdownMenuItem onClick={() => setOutreachLanguage("English")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOutreachLanguage("Spanish")}>
                    Spanish
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOutreachLanguage("French")}>
                    French
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOutreachLanguage("German")}>
                    German
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOutreachLanguage("Portuguese")}>
                    Portuguese
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Divider */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Scheduling & Automation</h3>

              {/* Daily Sequence Volume */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Daily Sequence Volume</label>
                <p className="text-xs text-muted-foreground">
                  Number of new prospects contacted daily.
                </p>
                <Input
                  type="number"
                  value={dailyVolume}
                  onChange={(e) => setDailyVolume(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="w-24"
                />
              </div>

              {/* Outreach Time */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Outreach Time</label>
                <p className="text-xs text-muted-foreground">
                  Time window for sending messages.
                </p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={outreachTime}
                    onChange={(e) => setOutreachTime(e.target.value)}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Outreach Days */}
              <div className="space-y-2 mb-4">
                <label className="text-sm font-medium">Outreach Days</label>
                <p className="text-xs text-muted-foreground">
                  Days of the week for prospecting.
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                    <Button
                      key={day}
                      variant={outreachDays.includes(day) ? "default" : "outline"}
                      size="sm"
                      className="w-11 px-0"
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Autopilot */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <label className="text-sm font-medium">Autopilot Mode</label>
                  <p className="text-xs text-muted-foreground">
                    Send outreach without manual approval. Replies always require approval.
                  </p>
                </div>
                <Switch
                  checked={autopilot}
                  onCheckedChange={setAutopilot}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn URL Modal */}
      <Dialog open={isLinkedInUrlModalOpen} onOpenChange={setIsLinkedInUrlModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Through LinkedIn URL</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                Hodhod accepts search URLs from LinkedIn and Sales Navigator, including saved and shared searches.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">LinkedIn URL</label>
              <Input
                placeholder="Enter LinkedIn or Sales Navigator Search URL"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                // Handle adding the URL
                setIsLinkedInUrlModalOpen(false);
                setLinkedInUrl("");
              }}
            >
              Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SequenceStepCard({
  step,
  stepNumber,
  isReEngagement,
  onRemove,
  canRemove,
}: {
  step: SequenceStep;
  stepNumber: number;
  isReEngagement: boolean;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const isConnect = step.type === "connect" && !isReEngagement;

  let title: string;
  if (isReEngagement) {
    title = `Re-engagement ${stepNumber}${step.isLast ? " (Last)" : ""}`;
  } else if (isConnect) {
    title = "Connect Sequence";
  } else {
    title = `Followup ${stepNumber - 1}${step.isLast ? " (Last)" : ""}`;
  }

  const subtitle = isReEngagement
    ? `LinkedIn ${step.channel === "message" ? "Message" : "InMail"} · AI Generated`
    : `Day ${step.day} · LinkedIn ${step.channel === "message" ? "Message" : "InMail"} · AI Generated`;

  return (
    <div className="relative rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          {isReEngagement ? (
            <CornerDownRight className="h-5 w-5 text-muted-foreground" />
          ) : isConnect ? (
            <Zap className="h-5 w-5 text-muted-foreground" />
          ) : (
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
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
