"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
      <Header isCollapsed={isCollapsed} onMenuClick={toggleSidebar} />
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          isCollapsed ? "pl-[72px]" : "pl-64"
        )}
      >
        <div className="p-6 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
