"use client"

import * as React from "react"
import { ChevronsUpDown,  } from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
export function HeaderSideBar({image, username, letter} : any) {
  // const { isMobile } = useSidebar()
  // const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* <DropdownMenu> */}
          {/* <DropdownMenuTrigger asChild> */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* <activeTeam.logo className="size-4" /> */}
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image as string} alt={username} />
                  <AvatarFallback className="rounded-lg"> {letter} </AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  Liquids Legion
                </span>
                {/* <span className="truncate text-xs">{activeTeam.plan}</span> */}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          {/* </DropdownMenuTrigger> */}
        {/* </DropdownMenu> */}
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
