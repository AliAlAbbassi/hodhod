"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Linkedin,
  Building2,
  Calendar,
  Webhook,
  Check,
  X,
  ExternalLink,
  Settings,
  Plus,
  Copy,
  Trash2,
} from "lucide-react";

type IntegrationStatus = "connected" | "disconnected" | "pending";

type Integration = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: IntegrationStatus;
  category: "linkedin" | "crm" | "calendar" | "webhook";
  connectedAt?: string;
  details?: string;
};

type WebhookConfig = {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
};

const initialIntegrations: Integration[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect your LinkedIn account to send connection requests and messages",
    icon: <Linkedin className="size-6" />,
    status: "connected",
    category: "linkedin",
    connectedAt: "2024-01-10",
    details: "ali@example.com",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync prospects and activities with your Salesforce CRM",
    icon: <Building2 className="size-6" />,
    status: "disconnected",
    category: "crm",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Sync contacts and deals with your HubSpot CRM",
    icon: <Building2 className="size-6" />,
    status: "disconnected",
    category: "crm",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Sync meeting bookings with Google Calendar",
    icon: <Calendar className="size-6" />,
    status: "connected",
    category: "calendar",
    connectedAt: "2024-01-12",
    details: "Primary calendar",
  },
  {
    id: "outlook-calendar",
    name: "Outlook Calendar",
    description: "Sync meeting bookings with Outlook Calendar",
    icon: <Calendar className="size-6" />,
    status: "disconnected",
    category: "calendar",
  },
];

const initialWebhooks: WebhookConfig[] = [
  {
    id: "1",
    name: "New Reply Notification",
    url: "https://api.example.com/webhooks/replies",
    events: ["reply.received"],
    active: true,
  },
];

const statusColors: Record<IntegrationStatus, "default" | "secondary" | "outline"> = {
  connected: "default",
  disconnected: "secondary",
  pending: "outline",
};

const statusLabels: Record<IntegrationStatus, string> = {
  connected: "Connected",
  disconnected: "Not Connected",
  pending: "Pending",
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(initialWebhooks);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [newWebhookName, setNewWebhookName] = useState("");

  const handleToggleConnection = (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: integration.status === "connected" ? "disconnected" : "connected",
              connectedAt: integration.status === "disconnected" ? new Date().toISOString().split("T")[0] : undefined,
            }
          : integration
      )
    );
  };

  const handleAddWebhook = () => {
    if (!newWebhookUrl || !newWebhookName) return;
    const newWebhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhookName,
      url: newWebhookUrl,
      events: ["all"],
      active: true,
    };
    setWebhooks((prev) => [...prev, newWebhook]);
    setNewWebhookUrl("");
    setNewWebhookName("");
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const linkedinIntegration = integrations.find((i) => i.category === "linkedin");
  const crmIntegrations = integrations.filter((i) => i.category === "crm");
  const calendarIntegrations = integrations.filter((i) => i.category === "calendar");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your favorite tools to automate your workflow
          </p>
        </div>
      </div>

      {/* LinkedIn Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">LinkedIn</h2>
        {linkedinIntegration && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  {linkedinIntegration.icon}
                </div>
                <div>
                  <CardTitle className="text-base">{linkedinIntegration.name}</CardTitle>
                  <CardDescription>{linkedinIntegration.description}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge
                  variant={statusColors[linkedinIntegration.status]}
                  className={
                    linkedinIntegration.status === "connected"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {linkedinIntegration.status === "connected" && (
                    <Check className="mr-1 size-3" />
                  )}
                  {statusLabels[linkedinIntegration.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {linkedinIntegration.status === "connected" ? (
                    <>
                      Connected as <span className="font-medium text-foreground">{linkedinIntegration.details}</span>
                      {" · "}Since {linkedinIntegration.connectedAt}
                    </>
                  ) : (
                    "Connect your LinkedIn account to start automating outreach"
                  )}
                </div>
                <div className="flex gap-2">
                  {linkedinIntegration.status === "connected" && (
                    <Button variant="outline" size="sm">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Button>
                  )}
                  <Button
                    variant={linkedinIntegration.status === "connected" ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleConnection(linkedinIntegration.id)}
                  >
                    {linkedinIntegration.status === "connected" ? (
                      <>
                        <X className="mr-2 size-4" />
                        Disconnect
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 size-4" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CRM Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">CRM Integrations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {crmIntegrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                  </div>
                </div>
                <Badge
                  variant={statusColors[integration.status]}
                  className={
                    integration.status === "connected"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {integration.status === "connected" && <Check className="mr-1 size-3" />}
                  {statusLabels[integration.status]}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {integration.description}
                </p>
                {integration.status === "connected" && integration.connectedAt && (
                  <p className="mb-4 text-xs text-muted-foreground">
                    Connected since {integration.connectedAt}
                  </p>
                )}
                <Button
                  variant={integration.status === "connected" ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleConnection(integration.id)}
                >
                  {integration.status === "connected" ? (
                    <>
                      <X className="mr-2 size-4" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 size-4" />
                      Connect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Calendar Integrations */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Calendar Integrations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {calendarIntegrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{integration.name}</CardTitle>
                  </div>
                </div>
                <Badge
                  variant={statusColors[integration.status]}
                  className={
                    integration.status === "connected"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : ""
                  }
                >
                  {integration.status === "connected" && <Check className="mr-1 size-3" />}
                  {statusLabels[integration.status]}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-muted-foreground">
                  {integration.description}
                </p>
                {integration.status === "connected" && (
                  <p className="mb-4 text-xs text-muted-foreground">
                    {integration.details} · Since {integration.connectedAt}
                  </p>
                )}
                <Button
                  variant={integration.status === "connected" ? "outline" : "default"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleToggleConnection(integration.id)}
                >
                  {integration.status === "connected" ? (
                    <>
                      <X className="mr-2 size-4" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <ExternalLink className="mr-2 size-4" />
                      Connect
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Webhooks Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Webhooks</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Webhook className="size-5" />
              Webhook Configuration
            </CardTitle>
            <CardDescription>
              Configure webhooks to receive real-time notifications about events
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add new webhook */}
            <div className="flex gap-2">
              <Input
                placeholder="Webhook name"
                value={newWebhookName}
                onChange={(e) => setNewWebhookName(e.target.value)}
                className="max-w-[200px]"
              />
              <Input
                placeholder="https://your-endpoint.com/webhook"
                value={newWebhookUrl}
                onChange={(e) => setNewWebhookUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddWebhook} disabled={!newWebhookUrl || !newWebhookName}>
                <Plus className="mr-2 size-4" />
                Add Webhook
              </Button>
            </div>

            {/* Existing webhooks */}
            {webhooks.length > 0 && (
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`size-2 rounded-full ${
                          webhook.active ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{webhook.name}</p>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(webhook.url)}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleWebhook(webhook.id)}
                      >
                        {webhook.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {webhooks.length === 0 && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No webhooks configured. Add one above to get started.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
