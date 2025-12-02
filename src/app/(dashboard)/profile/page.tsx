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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Linkedin,
  Bell,
  Mail,
  MessageSquare,
  Calendar,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
} from "lucide-react";

const timezones = [
  { value: "EST", label: "Eastern Standard Time (EST)" },
  { value: "CST", label: "Central Standard Time (CST)" },
  { value: "MST", label: "Mountain Standard Time (MST)" },
  { value: "PST", label: "Pacific Standard Time (PST)" },
  { value: "GMT", label: "Greenwich Mean Time (GMT)" },
  { value: "CET", label: "Central European Time (CET)" },
  { value: "IST", label: "India Standard Time (IST)" },
  { value: "JST", label: "Japan Standard Time (JST)" },
];

const workspaces = [
  { value: "workspace-1", label: "Ali's Workspace" },
  { value: "workspace-2", label: "Marketing Team" },
  { value: "workspace-3", label: "Sales Team" },
];

export default function ProfilePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Ali Al Abbassi",
    email: "ali@hodhod.com",
    password: "••••••••",
    timezone: "EST",
    selectedWorkspace: "workspace-1",
    bookingLink: "https://calendly.com/ali-hodhod/30min",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    messageAlerts: true,
    weeklyDigest: false,
    campaignUpdates: true,
  });

  const [linkedInConnected, setLinkedInConnected] = useState(true);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Profile Photo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            Update your profile picture. This will be visible to your team members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage src="/profile.jpeg" alt="Profile" />
              <AvatarFallback className="text-2xl">AA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 size-4" />
                  Change Photo
                </Button>
                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="mr-2 size-4" />
                  Remove
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, at least 200x200px. SVG, PNG, or JPG.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and account settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) =>
                  setProfileData({ ...profileData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={profileData.password}
                  onChange={(e) =>
                    setProfileData({ ...profileData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Your Timezone</Label>
              <Select
                value={profileData.timezone}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, timezone: value })
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Link Section */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Link</CardTitle>
          <CardDescription>
            Set your booking link for each workspace. This will be shared with prospects.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/3">
              <Label htmlFor="workspace" className="sr-only">
                Workspace
              </Label>
              <Select
                value={profileData.selectedWorkspace}
                onValueChange={(value) =>
                  setProfileData({ ...profileData, selectedWorkspace: value })
                }
              >
                <SelectTrigger id="workspace">
                  <SelectValue placeholder="Select workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((ws) => (
                    <SelectItem key={ws.value} value={ws.value}>
                      {ws.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="bookingLink" className="sr-only">
                Booking Link
              </Label>
              <Input
                id="bookingLink"
                type="url"
                value={profileData.bookingLink}
                onChange={(e) =>
                  setProfileData({ ...profileData, bookingLink: e.target.value })
                }
                placeholder="https://calendly.com/your-name/30min"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn Connection Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Linkedin className="size-5" />
            LinkedIn Connection
          </CardTitle>
          <CardDescription>
            Connect your LinkedIn account to enable outreach features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {linkedInConnected ? (
                <>
                  <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <Check className="size-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Your account is linked and active
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn Not Connected</p>
                    <p className="text-sm text-muted-foreground">
                      Connect to enable outreach features
                    </p>
                  </div>
                </>
              )}
            </div>
            <Button
              variant={linkedInConnected ? "outline" : "default"}
              onClick={() => setLinkedInConnected(!linkedInConnected)}
            >
              {linkedInConnected ? "Disconnect" : "Connect LinkedIn"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="size-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how and when you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive important updates via email
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Message Alerts</p>
                <p className="text-sm text-muted-foreground">
                  Get notified when you receive new messages
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.messageAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, messageAlerts: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">
                  Receive a summary of your activity every week
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.weeklyDigest}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weeklyDigest: checked })
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="size-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Campaign Updates</p>
                <p className="text-sm text-muted-foreground">
                  Get notified about campaign performance
                </p>
              </div>
            </div>
            <Switch
              checked={notifications.campaignUpdates}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, campaignUpdates: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
}
