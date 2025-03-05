"use client"

import type React from "react"

import { Home, LogOut, Users, Settings, ClipboardList } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function EvaluatorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/evaluator/dashboard",
    },
    {
      title: "Requests",
      icon: ClipboardList,
      href: "/evaluator/requests",
    },
    {
      title: "Team",
      icon: Users,
      href: "/evaluator/team",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/evaluator/settings",
    },
  ]

  const MobileNav = () => (
    <Sheet>
      <SheetTrigger asChild>
        <button className="block rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground md:hidden">
          <span className="sr-only">Toggle navigation menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold">Evaluator Portal</h2>
        </div>
        <div className="px-2 py-4">
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full ">
        <Sidebar className="hidden md:flex">
          <SidebarHeader className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Evaluator Portal</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <ThemeToggle />
              <button className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-4">
              <MobileNav />
              <SidebarTrigger className="hidden md:flex" />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Dr. John Smith</span>
            </div>
          </header>
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}

