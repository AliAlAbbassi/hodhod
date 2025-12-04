"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  FileSpreadsheet,
  MoreVertical,
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

// Research agent categories
const agentCategories = [
  { id: "all", name: "All" },
  { id: "prospect", name: "Prospect Insights" },
  { id: "company", name: "Company Insights" },
  { id: "industry", name: "Industry & Market" },
  { id: "media", name: "Media & Public Perception" },
  { id: "economic", name: "Economic & Regulatory Context" },
];

// Available research agents grouped by category
const researchAgents = [
  // Prospect Insights
  { id: "prospect-research", name: "Prospect Research", category: "prospect", description: "Enriches prospect data with verified business information, contact details, and professional insights to create comprehensive and actionable prospect profiles" },
  { id: "prospect-deep-dive", name: "Prospect Deep Dive", category: "prospect", description: "Delivers an in-depth analysis of prospect-specific data, offering a detailed profile to refine engagement strategies" },
  // Company Insights
  { id: "company-deep-dive", name: "Company Deep Dive", category: "company", description: "A comprehensive report on a company's overall standing, including history, business model, and key operational insights" },
  { id: "hiring-trends", name: "Hiring Trends", category: "company", description: "Shows trends in hiring within the company or sector, indicating growth or focus areas, which can be used to align outreach with their needs" },
  { id: "corporate-culture", name: "Corporate Culture", category: "company", description: "Provides insights into the internal culture of a company, including values, work environment, and employee satisfaction" },
  // Industry & Market
  { id: "industry-analysis", name: "Industry Analysis", category: "industry", description: "Analyzes the broader industry landscape, identifying key trends, challenges, and opportunities" },
  { id: "market-position", name: "Market Position", category: "industry", description: "Evaluates the company's position within its market, including competitive advantages and market share" },
  // Media & Public Perception
  { id: "news-sentiment", name: "News & Sentiment", category: "media", description: "Tracks recent news coverage and public sentiment around the company or prospect" },
  { id: "social-presence", name: "Social Presence", category: "media", description: "Analyzes the company's social media presence and engagement patterns" },
  // Economic & Regulatory
  { id: "financial-health", name: "Financial Health", category: "economic", description: "Provides insights into the company's financial standing and recent performance indicators" },
  { id: "regulatory-landscape", name: "Regulatory Landscape", category: "economic", description: "Identifies relevant regulations and compliance requirements affecting the company" },
];

const templates = [
  {
    id: "website-visitor",
    name: "Website Visitor",
    type: "message",
    preview: "hi {P_FIRST_NAME}, saw that yo...",
    subject: "",
    body: "hi {P_FIRST_NAME}, saw that you visited our website. wanted to see if you had any questions?",
  },
  {
    id: "test-1",
    name: "Test 1",
    type: "message",
    preview: "hi {P_FIRST_NAME}, we sf;kjs;...",
    subject: "",
    body: "hi {P_FIRST_NAME}, we sf;kjs;df g;ksdjf g;ksdjf g",
  },
  {
    id: "valleystudios-messaging",
    name: "ValleyStudios Messaging",
    type: "message",
    preview: "Hi {P_FIRST_NAME}, We build an...",
    subject: "",
    body: "Hi {P_FIRST_NAME},\n\nWe build and run your entire outbound for you, guaranteeing a minimum of 15 booked calls. We've built outbound engines for Miro, Front, Deel, Rippling, and Oracle + we're backed by the early investors in AirBnb, Uber, and Robinhood.\n\nIf that's relevant, I'd love to connect.",
  },
  {
    id: "valleystudios-inmail",
    name: "ValleyStudios InMail",
    type: "inmail",
    preview: "Guaranteed Meetings Or We Wo...",
    subject: "Guaranteed Meetings Or We Work For Free",
    body: "Hi {P_FIRST_NAME},\n\nWe build and run your entire outbound for you, guaranteeing a minimum of 15 booked calls. We've built outbound engines for Miro, Front, Deel, Rippling, and Oracle + we're backed by the early investors in AirBnb, Uber, and Robinhood.\n\nIf that's relevant, I'd love to connect.",
  },
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignType = searchParams.get("type") || "ai"; // "ai" or "templated"
  const isTemplated = campaignType === "templated";

  // Wizard step state - templated campaigns skip step 2
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = isTemplated ? 1 : 2;

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
  const [outreachStartTime, setOutreachStartTime] = useState("09:00");
  const [outreachEndTime, setOutreachEndTime] = useState("17:00");
  const [outreachDays, setOutreachDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [autopilot, setAutopilot] = useState(false);

  // Step 2: Research Agents (AI campaigns only)
  const [selectedAgents, setSelectedAgents] = useState<string[]>(["prospect-research"]);
  const [agentCategoryFilter, setAgentCategoryFilter] = useState("all");

  // Templated campaigns: template selection
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [templateData, setTemplateData] = useState({
    name: "",
    subject: "",
    body: "",
    connectMessage: "",
    followups: [""] as string[],
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTemplateData({
        name: template.name,
        subject: template.subject,
        body: template.body,
        connectMessage: template.type === "message" ? template.body : "",
        followups: [""],
      });
      setReachoutChannel(template.type as "message" | "inmail");
    }
  };

  // LinkedIn URL Modal
  const [isLinkedInUrlModalOpen, setIsLinkedInUrlModalOpen] = useState(false);
  const [linkedInUrl, setLinkedInUrl] = useState("");

  // Confirm Resource Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    }
    // Reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show confirmation modal
      setIsConfirmModalOpen(true);
    }
  };

  const handleConfirmCreate = () => {
    setIsConfirmModalOpen(false);
    // Create campaign and redirect
    router.push("/campaigns");
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
              <span className="text-muted-foreground">Step {currentStep} of {totalSteps}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? (isTemplated ? "Next" : "Create") : "Next"}
            </Button>
          </div>
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
                          isTemplated={isTemplated}
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
                          isTemplated={isTemplated}
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
            <div className="mx-auto max-w-4xl">
              {/* Max selection notice */}
              <p className="text-sm text-muted-foreground mb-4">
                Max 5 can be selected
              </p>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                {agentCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={agentCategoryFilter === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAgentCategoryFilter(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Agents grouped by category */}
              {agentCategories
                .filter((cat) => cat.id !== "all")
                .filter((cat) => agentCategoryFilter === "all" || agentCategoryFilter === cat.id)
                .map((category) => {
                  const categoryAgents = researchAgents.filter((a) => a.category === category.id);
                  if (categoryAgents.length === 0) return null;

                  return (
                    <div key={category.id} className="mb-8">
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">
                        {category.name}
                      </h3>
                      <div className="space-y-3">
                        {categoryAgents.map((agent) => {
                          const isSelected = selectedAgents.includes(agent.id);
                          return (
                            <div
                              key={agent.id}
                              className={`flex items-start gap-4 p-4 rounded-lg border bg-card ${
                                isSelected ? "border-green-500/50" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 flex-1">
                                {isSelected && (
                                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white shrink-0">
                                    <Check className="h-3 w-3" />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="font-medium">{agent.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {agent.description}
                                  </p>
                                </div>
                              </div>
                              {isSelected ? (
                                <span
                                  className="text-green-500 text-sm font-medium cursor-pointer hover:text-green-600"
                                  onClick={() => toggleAgent(agent.id)}
                                >
                                  Selected
                                </span>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleAgent(agent.id)}
                                  disabled={selectedAgents.length >= 5}
                                >
                                  Research
                                </Button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
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
                    {isTemplated ? "Templated" : "AI Generated"}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => router.push("/campaigns/create?type=ai")}>
                    AI Generated
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/campaigns/create?type=templated")}>
                    Templated
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Campaign Name - Templated only */}
            {isTemplated && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Campaign Name</label>
                <Input
                  placeholder="e.g Hiring Outreach, Sales Outreach, etc."
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
            )}

            {/* Select Template - Templated only */}
            {isTemplated && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Template</label>
                <Button
                  variant="outline"
                  className="w-full justify-center gap-2"
                  onClick={() => setIsTemplateModalOpen(true)}
                >
                  {selectedTemplate ? (
                    <FileText className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {selectedTemplate ? templateData.name : "Select Template"}
                </Button>
              </div>
            )}

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
                <label>
                  <input
                    type="file"
                    accept=".xls,.xlsx,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    multiple
                  />
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Upload XLS/CSV
                    </span>
                  </Button>
                </label>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                    >
                      <FileSpreadsheet className="h-5 w-5 text-red-500 shrink-0" />
                      <span className="text-sm truncate flex-1">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeFile(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/* Select Product */}
            <div className="space-y-2 mt-6">
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

            {/* Autopilot */}
            <div className="flex items-center justify-between py-2 mt-4">
              <div className="flex-1 pr-4">
                <label className="text-sm font-medium">Autopilot</label>
                <p className="text-xs text-muted-foreground">
                  Allows us to auto send messages without awaiting your approval.
                </p>
              </div>
              <Switch
                checked={autopilot}
                onCheckedChange={setAutopilot}
              />
            </div>

            {/* Daily Sequence Volume */}
            <div className="space-y-4 pt-2 mt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Daily Sequence Volume</label>
                <p className="text-xs text-muted-foreground">
                  The number of sequences Hodhod should send each day.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <div className="flex h-8 w-12 items-center justify-center rounded border bg-card text-sm font-medium shadow-sm">
                      {dailyVolume}
                    </div>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={100}
                    value={dailyVolume}
                    onChange={(e) => setDailyVolume(Number(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sequence Timing */}
            <div className="space-y-2 pt-2 mt-4">
              <label className="text-sm font-medium">Sequence Timing</label>
              <p className="text-xs text-muted-foreground">
                Tell us the best times for sending sequences.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 flex-1">
                  <Input
                    type="time"
                    value={outreachStartTime}
                    onChange={(e) => setOutreachStartTime(e.target.value)}
                    className="h-auto border-0 p-0 focus-visible:ring-0"
                    style={{ colorScheme: "light" }}
                  />
                </div>
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 flex-1">
                  <Input
                    type="time"
                    value={outreachEndTime}
                    onChange={(e) => setOutreachEndTime(e.target.value)}
                    className="h-auto border-0 p-0 focus-visible:ring-0"
                    style={{ colorScheme: "light" }}
                  />
                </div>
              </div>
            </div>

            {/* Outreach Days */}
            <div className="space-y-2 mt-4 mb-6">
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

            {/* AI Generated only fields */}
            {!isTemplated && (
              <>
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
              </>
            )}
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
            <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
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

      {/* Confirm Resource Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Resource</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            A file is being used to upload your prospects. Please confirm as this action cannot be reversed.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmCreate}>
              Proceed
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Select Template Modal - Full Screen Sheet */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-background">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsTemplateModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              <span className="font-medium">Select Template</span>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsTemplateModalOpen(false)}>
                Continue
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-[calc(100vh-65px)]">
            {/* Left Panel - Template List */}
            <div className="w-96 border-r p-6 overflow-auto">
              <Button variant="outline" className="w-full gap-2 mb-4">
                <Plus className="h-4 w-4" />
                Add Template
              </Button>

              <Input
                placeholder="Search Templates"
                className="mb-4"
              />

              <div className="space-y-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className={`flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted/50 ${
                      selectedTemplate === template.id ? "bg-muted" : ""
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <div className={`mt-1 h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                      selectedTemplate === template.id ? "border-primary" : "border-muted-foreground/30"
                    }`}>
                      {selectedTemplate === template.id && (
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{template.name}</div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {template.preview}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Template Details */}
            <div className="flex-1 p-6 overflow-auto">
              {/* Template Type Tabs */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={reachoutChannel === "inmail" ? "default" : "outline"}
                  className={reachoutChannel === "inmail" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setReachoutChannel("inmail")}
                >
                  InMail
                </Button>
                <Button
                  variant={reachoutChannel === "message" ? "default" : "outline"}
                  onClick={() => setReachoutChannel("message")}
                >
                  Messaging
                </Button>
              </div>

              {/* Template Name */}
              <div className="space-y-2 mb-6">
                <label className="text-sm font-medium">Template Name</label>
                <Input
                  placeholder="Enter template name here"
                  value={templateData.name}
                  onChange={(e) =>
                    setTemplateData((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              {/* Template Visible To */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium">Template Visible To</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="h-5 w-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                    </div>
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                    <span className="text-sm">Just you</span>
                  </label>
                </div>
              </div>

              {/* Message Content */}
              {reachoutChannel === "message" ? (
                <>
                  {/* Connect Message */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Connect Message</label>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <span className="text-muted-foreground">=</span>
                              Add Placeholder
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_LAST_NAME}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_COMPANY}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_TITLE}"}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <textarea
                      className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter connect message"
                      value={templateData.connectMessage}
                      onChange={(e) =>
                        setTemplateData((prev) => ({ ...prev, connectMessage: e.target.value }))
                      }
                    />
                  </div>

                  {/* Follow-ups */}
                  {templateData.followups?.map((followup, index) => (
                    <div key={index} className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Follow-up {index + 1}</label>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <span className="text-muted-foreground">=</span>
                                Add Placeholder
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_LAST_NAME}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_COMPANY}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_TITLE}"}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <textarea
                        className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder={`Enter follow-up message ${index + 1}`}
                        value={followup}
                        onChange={(e) => {
                          const newFollowups = [...templateData.followups];
                          newFollowups[index] = e.target.value;
                          setTemplateData((prev) => ({ ...prev, followups: newFollowups }));
                        }}
                      />
                    </div>
                  ))}

                  {/* Add Follow-up Button */}
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() =>
                      setTemplateData((prev) => ({
                        ...prev,
                        followups: [...prev.followups, ""],
                      }))
                    }
                  >
                    <Plus className="h-4 w-4" />
                    Add Follow-up
                  </Button>
                </>
              ) : (
                <>
                  {/* InMail Subject */}
                  {reachoutChannel === "inmail" && (
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">InMail Subject</label>
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2">
                                <span className="text-muted-foreground">=</span>
                                Add Placeholder
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_LAST_NAME}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_COMPANY}"}</DropdownMenuItem>
                              <DropdownMenuItem>{"{P_TITLE}"}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <Input
                        placeholder="Enter InMail subject"
                        value={templateData.subject}
                        onChange={(e) =>
                          setTemplateData((prev) => ({ ...prev, subject: e.target.value }))
                        }
                      />
                    </div>
                  )}

                  {/* InMail Body */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">InMail Body</label>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-muted-foreground" />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <span className="text-muted-foreground">=</span>
                              Add Placeholder
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_LAST_NAME}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_COMPANY}"}</DropdownMenuItem>
                            <DropdownMenuItem>{"{P_TITLE}"}</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <textarea
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter InMail body"
                      value={templateData.body}
                      onChange={(e) =>
                        setTemplateData((prev) => ({ ...prev, body: e.target.value }))
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SequenceStepCard({
  step,
  stepNumber,
  isReEngagement,
  onRemove,
  canRemove,
  isTemplated = false,
}: {
  step: SequenceStep;
  stepNumber: number;
  isReEngagement: boolean;
  onRemove: () => void;
  canRemove: boolean;
  isTemplated?: boolean;
}) {
  const isConnect = step.type === "connect" && !isReEngagement;
  const messageType = isTemplated ? "Template" : "AI Generated";

  let title: string;
  if (isReEngagement) {
    title = `Re-engagement ${stepNumber}${step.isLast ? " (Last)" : ""}`;
  } else if (isConnect) {
    title = "Connect Sequence";
  } else {
    title = `Followup ${stepNumber - 1}${step.isLast ? " (Last)" : ""}`;
  }

  const subtitle = isReEngagement
    ? `LinkedIn ${step.channel === "message" ? "Message" : "InMail"} · ${messageType}`
    : `Day ${step.day} · LinkedIn ${step.channel === "message" ? "Message" : "InMail"} · ${messageType}`;

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
