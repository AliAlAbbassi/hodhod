"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

const pageTitles: Record<string, string> = {
  "/": "",
  "/approvals": "Approvals",
  "/inbox": "Inbox",
  "/prospects": "Prospects",
  "/campaigns": "Campaigns",
  "/studio": "Studio",
  "/admin": "Admin View",
  "/templates": "Templates",
  "/profile": "Your Profile",
  "/company": "Company Info",
  "/intent": "Hodhod Intent",
  "/seats": "Manage Seats",
  "/integrations": "Integrations",
}

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const pathname = usePathname()
  const title = pageTitles[pathname] || ""

  return (
    <header
      className={cn(
        "z-50 h-16",
        fixed && "sticky top-0",
        className
      )}
      {...props}
    >
      <div className="flex h-full items-center gap-4 p-4">
        <SidebarTrigger variant="outline" />
        {title && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <span className="font-medium">{title}</span>
          </>
        )}
        {children}
      </div>
    </header>
  )
}
