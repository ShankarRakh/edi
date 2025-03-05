"use client"

import { Upload, Users, FileText, TicketIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { title: "Uploads", icon: Upload, href: "/institute" },
    { title: "Validate", icon: Upload, href: "/institute/validate-pdf" },
    // { title: "Requests", icon: Users, href: "/institute/requests" },
    { title: "Tickets", icon: TicketIcon, href: "/institute//tickets" },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-bold p-4">Dashboard</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

