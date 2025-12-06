"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Zap,
  Command,
  CheckCircle,
  Sparkles,
  Shield,
  FileText,
  Target,
} from "lucide-react"
import { NavGroup } from "@/components/layout/nav-group"
import { TeamSwitcher } from "@/components/layout/team-switcher"

const sidebarData = {
  teams: [
    {
      name: "HODHOD",
      logo: Command,
      plan: "Pro",
    },
  ],
  navGroups: [
    {
      title: "Workspace",
      items: [
        { title: "Dashboard", url: "/", icon: LayoutDashboard },
        { title: "Messages", url: "/messages", icon: MessageSquare },
        { title: "Prospects", url: "/prospects", icon: Users },
        { title: "Campaigns", url: "/campaigns", icon: Zap },
        { title: "Studio", url: "/studio", icon: Sparkles },
      ],
    },
    {
      title: "Organization",
      items: [
        { title: "Admin View", url: "/admin", icon: Shield },
        { title: "Templates", url: "/templates", icon: FileText },
        { title: "Settings", url: "/settings", icon: Target },
      ],
    },
  ],
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter />
      <SidebarRail />
    </Sidebar>
  )
}
