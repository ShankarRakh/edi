import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <div className="flex h-screen">
            <AppSidebar />
            <main className="w-[84vw] flex-1 p-6">{children}</main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
