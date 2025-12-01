"use client"

import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

type HeaderProps = React.HTMLAttributes<HTMLElement> & {
  fixed?: boolean
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
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
        <Separator orientation="vertical" className="h-6" />
        {children}
      </div>
    </header>
  )
}
