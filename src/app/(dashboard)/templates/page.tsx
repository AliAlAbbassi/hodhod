"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Info,
  ChevronDown,
  MessageSquare,
  Linkedin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Template = {
  id: string;
  name: string;
  type: "message" | "inmail";
  preview: string;
  subject?: string;
  body: string;
  followup?: string;
  visibleTo: "all" | "me";
};

const initialTemplates: Template[] = [
  {
    id: "website-visitor",
    name: "Website Visitor",
    type: "message",
    preview: "hi {P_FIRST_NAME}, saw that yo...",
    body: "hi {P_FIRST_NAME}, saw that you visited our website. wanted to see if you had any questions?",
    visibleTo: "all",
  },
  {
    id: "test-1",
    name: "Test 1",
    type: "message",
    preview: "hi {P_FIRST_NAME}, we sf;kjs;...",
    body: "hi {P_FIRST_NAME}, we sf;kjs;df g;ksdjf g;ksdjf g",
    visibleTo: "me",
  },
  {
    id: "valleystudios-messaging",
    name: "ValleyStudios Messaging",
    type: "message",
    preview: "Hi {P_FIRST_NAME}, We build an...",
    body: "Hi {P_FIRST_NAME},\n\nWe build and run your entire outbound for you, guaranteeing a minimum of 15 booked calls. We've built outbound engines for Miro, Front, Deel, Rippling, and Oracle + we're backed by the early investors in AirBnb, Uber, and Robinhood.\n\nIf that's relevant, I'd love to connect.",
    visibleTo: "all",
  },
  {
    id: "valleystudios-inmail",
    name: "ValleyStudios InMail",
    type: "inmail",
    preview: "Guaranteed Meetings Or We Wo...",
    subject: "Guaranteed Meetings Or We Work For Free",
    body: "Hi {P_FIRST_NAME},\n\nWe build and run your entire outbound for you, guaranteeing a minimum of 15 booked calls. We've built outbound engines for Miro, Front, Deel, Rippling, and Oracle + we're backed by the early investors in AirBnb, Uber, and Robinhood.\n\nIf that's relevant, I'd love to connect.",
    visibleTo: "all",
  },
];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);

  // Form State
  const [templateName, setTemplateName] = useState("");
  const [templateType, setTemplateType] = useState<"message" | "inmail">("message");
  const [templateVisibleTo, setTemplateVisibleTo] = useState<"all" | "me">("all");
  const [inMailSubject, setInMailSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [connectMessage, setConnectMessage] = useState(""); // For "message" type if separate? The screenshots just show "Connect Message" or "InMail Body"
  const [followupMessage, setFollowupMessage] = useState("");

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setTemplateType("message");
    setTemplateVisibleTo("all");
    setInMailSubject("");
    setMessageBody("");
    setConnectMessage("");
    setFollowupMessage("");
    setIsCreateModalOpen(true);
  };

  const handleEdit = (template: Template) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setTemplateType(template.type);
    setTemplateVisibleTo(template.visibleTo);
    setInMailSubject(template.subject || "");
    setMessageBody(template.body); // For simplicty, mapping body to the main text area
    setConnectMessage(template.body); // In the screenshot for "Messaging", it says "Connect Message".
    setFollowupMessage(template.followup || "");
    setIsCreateModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id));
  };

  const handleSubmit = () => {
    const newTemplate: Template = {
      id: editingTemplate ? editingTemplate.id : String(Date.now()),
      name: templateName,
      type: templateType,
      preview: (templateType === "message" ? connectMessage : messageBody).substring(0, 30) + "...",
      subject: templateType === "inmail" ? inMailSubject : undefined,
      body: templateType === "message" ? connectMessage : messageBody,
      followup: templateType === "message" ? followupMessage : undefined,
      visibleTo: templateVisibleTo,
    };

    if (editingTemplate) {
      setTemplates(templates.map((t) => (t.id === editingTemplate.id ? newTemplate : t)));
    } else {
      setTemplates([...templates, newTemplate]);
    }
    setIsCreateModalOpen(false);
  };

  const insertPlaceholder = (placeholder: string, field: "inmail" | "connect" | "followup") => {
    // A simple append for now. In a real app, we'd insert at cursor position.
    if (field === "inmail") {
        setMessageBody(prev => prev + placeholder);
    } else if (field === "connect") {
        setConnectMessage(prev => prev + placeholder);
    } else if (field === "followup") {
        setFollowupMessage(prev => prev + placeholder);
    }
  };

  const insertSubjectPlaceholder = (placeholder: string) => {
      setInMailSubject(prev => prev + placeholder);
  }

  return (
    <div className="flex h-full flex-col p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold">Templates</h1>
        </div>
        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          Template
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    {template.type === "message" ? (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                            <Linkedin className="h-4 w-4" />
                        </div>
                    )}
                  <CardTitle className="text-base font-medium leading-none">
                    {template.name}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(template)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(template.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground line-clamp-3">
                {template.body}
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-xs text-muted-foreground flex justify-between items-center">
                <span>{template.type === 'message' ? 'LinkedIn Message' : 'LinkedIn InMail'}</span>
                {template.visibleTo === 'me' && <Badge variant="secondary" className="text-[10px] h-5">Private</Badge>}
            </CardFooter>
          </Card>
        ))}
        {/* Empty State Card just to match the "Untitled" one in screenshot if needed, but we have real items */}
        {filteredTemplates.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
                <p>No templates found.</p>
            </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create Template"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Type Toggle */}
            <div className="flex gap-2">
                <Button
                  variant={templateType === "inmail" ? "default" : "outline"}
                  className={templateType === "inmail" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setTemplateType("inmail")}
                >
                  InMail
                </Button>
                <Button
                  variant={templateType === "message" ? "default" : "outline"}
                  className={templateType === "message" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  onClick={() => setTemplateType("message")}
                >
                  Messaging
                </Button>
            </div>

            {/* Template Name */}
            <div className="space-y-2">
                <label className="text-sm font-medium">Template Name</label>
                <Input 
                    placeholder="Enter template name here" 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                />
            </div>

            {/* Template Visible To */}
            <div className="space-y-3">
                <label className="text-sm font-medium">Template Visible To</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTemplateVisibleTo("all")}>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${templateVisibleTo === "all" ? "border-blue-600" : "border-muted-foreground/30"}`}>
                      {templateVisibleTo === "all" && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm">All</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => setTemplateVisibleTo("me")}>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${templateVisibleTo === "me" ? "border-blue-600" : "border-muted-foreground/30"}`}>
                      {templateVisibleTo === "me" && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <span className="text-sm">Just you</span>
                  </label>
                </div>
            </div>

            {templateType === "inmail" ? (
                <>
                    {/* InMail Subject */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">InMail Subject</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent">
                                        <div className="flex items-center gap-1 border rounded px-2 py-1 bg-white">
                                            <Info className="h-3 w-3" />
                                            Add Placeholder
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => insertSubjectPlaceholder("{P_FIRST_NAME}")}>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertSubjectPlaceholder("{P_LAST_NAME}")}>{"{P_LAST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertSubjectPlaceholder("{P_COMPANY}")}>{"{P_COMPANY}"}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Input 
                            placeholder="Enter InMail subject" 
                            value={inMailSubject}
                            onChange={(e) => setInMailSubject(e.target.value)}
                        />
                    </div>

                    {/* InMail Body */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">InMail Body</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent">
                                        <div className="flex items-center gap-1 border rounded px-2 py-1 bg-white">
                                            <Info className="h-3 w-3" />
                                            Add Placeholder
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_FIRST_NAME}", "inmail")}>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_LAST_NAME}", "inmail")}>{"{P_LAST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_COMPANY}", "inmail")}>{"{P_COMPANY}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_TITLE}", "inmail")}>{"{P_TITLE}"}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Textarea
                            placeholder="Enter InMail body"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            className="min-h-[150px] resize-none"
                        />
                    </div>
                </>
            ) : (
                <>
                    {/* Connect Message */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Connect Message</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent">
                                        <div className="flex items-center gap-1 border rounded px-2 py-1 bg-white">
                                            <Info className="h-3 w-3" />
                                            Add Placeholder
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_FIRST_NAME}", "connect")}>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_LAST_NAME}", "connect")}>{"{P_LAST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_COMPANY}", "connect")}>{"{P_COMPANY}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_TITLE}", "connect")}>{"{P_TITLE}"}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Textarea
                            placeholder="Enter connect message here"
                            value={connectMessage}
                            onChange={(e) => setConnectMessage(e.target.value)}
                            className="min-h-[150px] resize-none"
                        />
                    </div>

                    {/* Follow-Up 1 */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Follow-Up 1</label>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground hover:bg-transparent">
                                        <div className="flex items-center gap-1 border rounded px-2 py-1 bg-white">
                                            <Info className="h-3 w-3" />
                                            Add Placeholder
                                            <ChevronDown className="h-3 w-3" />
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_FIRST_NAME}", "followup")}>{"{P_FIRST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_LAST_NAME}", "followup")}>{"{P_LAST_NAME}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_COMPANY}", "followup")}>{"{P_COMPANY}"}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => insertPlaceholder("{P_TITLE}", "followup")}>{"{P_TITLE}"}</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Textarea
                            placeholder="Enter follow-up 1 here"
                            value={followupMessage}
                            onChange={(e) => setFollowupMessage(e.target.value)}
                            className="min-h-[150px] resize-none"
                        />
                    </div>
                </>
            )}

          </div>

          <DialogFooter>
            <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleSubmit}>
                Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
