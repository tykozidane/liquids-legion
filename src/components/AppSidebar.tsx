"use client"

import * as React from "react"
import {
  CircleDollarSignIcon,
  ShoppingCartIcon,
  Frame,
  Map,
  PieChart,
  ChartArea ,
  Boxes
} from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { HeaderSideBar } from "./TeamSwitcher"
import { NavMain } from "./NavMain"
// import { NavProjects } from "./NavProject"
import { NavUser } from "./NavUser"
import { useSession } from "next-auth/react"

// This is sample data.
const data = {
  
  navMain: [
    {
      title: "Dashboard",
      url: "http://localhost:3000/dashboard",
      icon: ChartArea ,
      isActive: true,
    },
    {
      title: "Product",
      url: "http://localhost:3000/dashboard/products",
      icon: Boxes,
      // items: [
      //   {
      //     title: "Liquid",
      //     url: "#",
      //   },
      //   {
      //     title: "Device",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Transaction",
      url: "http://localhost:3000/dashboard/transaction",
      icon: ShoppingCartIcon,
      // items: [
      //   {
      //     title: "Success",
      //     url: "#",
      //   },
      //   {
      //     title: "On Going",
      //     url: "#",
      //   },
      //   {
      //     title: "Canceled",
      //     url: "#",
      //   },
      // ],
    },
    {
      title: "Finance",
      url: "http://localhost:3000/dashboard/finance",
      icon: CircleDollarSignIcon,
      // items: [
      //   {
      //     title: "General",
      //     url: "#",
      //   },
      //   {
      //     title: "Debit",
      //     url: "#",
      //   },
      //   {
      //     title: "Kredit",
      //     url: "#",
      //   },
      // ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export default function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data:session} = useSession()
  // console.log("dataUser",session?.user)
  const username = session?.user?.username || ""
  const pecahNama = username.split(" ")
  let letter = ""
  // console.log("data", pecahNama)
  if (pecahNama.length > 0) {
  pecahNama.map((item : string) => {letter += item.charAt(0)})
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <HeaderSideBar image={"/images/logo.jpeg"} letter={letter} username={username}  />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser image={session?.user?.image} username={username} letter={letter} email={session?.user?.email}  />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
