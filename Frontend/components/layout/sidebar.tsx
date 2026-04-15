"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Package,
  ClipboardList,
  Bell,
  ShieldCheck,
  FileText,
  Settings,
  ChevronDown,
  ChevronLeft,
  LogOut,
  UserCog,
  School,
  BookOpen,
  DollarSign,
  Receipt,
  Boxes,
  ArrowRightLeft,
  Megaphone,
  BarChart3,
  UserCheck,
  History,
  DoorOpen,
  CalendarCheck,
} from "lucide-react"

interface NavItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    icon: Users,
    children: [
      { title: "Gestión de Usuarios", href: "/dashboard/usuarios", icon: UserCog },
      { title: "Roles y Permisos", href: "/dashboard/usuarios/roles", icon: ShieldCheck },
      { title: "Personal Docente", href: "/dashboard/usuarios/docentes", icon: GraduationCap },
    ],
  },
  {
    title: "Estudiantes",
    icon: School,
    children: [
      { title: "Expedientes", href: "/dashboard/estudiantes", icon: Users },
      { title: "Inscripciones", href: "/dashboard/estudiantes/inscripciones", icon: ClipboardList },
      { title: "Tutores", href: "/dashboard/tutores", icon: UserCheck },
      { title: "Aulas", href: "/dashboard/aulas", icon: DoorOpen },
    ],
  },
  {
    title: "Académico",
    icon: BookOpen,
    children: [
      { title: "Calificaciones", href: "/dashboard/calificaciones", icon: ClipboardList },
      { title: "Asistencia", href: "/dashboard/asistencia", icon: CalendarCheck },
      { title: "Notas (Simple)", href: "/dashboard/notas", icon: FileText },
    ],
  },
  {
    title: "Pagos",
    icon: CreditCard,
    children: [
      { title: "Registro de Pagos", href: "/dashboard/pagos", icon: DollarSign },
      { title: "Estados de Cuenta", href: "/dashboard/pagos/estados", icon: Receipt },
      { title: "Comprobantes", href: "/dashboard/pagos/comprobantes", icon: FileText },
    ],
  },
  {
    title: "Inventario",
    icon: Package,
    children: [
      { title: "Materiales", href: "/dashboard/inventario", icon: Boxes },
      { title: "Movimientos", href: "/dashboard/inventario/movimientos", icon: ArrowRightLeft },
      { title: "Historial", href: "/dashboard/inventario/historial", icon: History },
    ],
  },
  {
    title: "Comunicación",
    icon: Bell,
    children: [
      { title: "Avisos", href: "/dashboard/comunicacion", icon: Megaphone },
      { title: "Notificaciones", href: "/dashboard/comunicacion/notificaciones", icon: Bell },
    ],
  },
  {
    title: "Entregas",
    href: "/dashboard/entregas",
    icon: ShieldCheck,
  },
  {
    title: "Reportes",
    href: "/dashboard/reportes",
    icon: BarChart3,
  },
  {
    title: "Configuración",
    href: "/dashboard/configuracion",
    icon: Settings,
  },
]

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems(prev =>
      prev.includes(title)
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const isActive = (href: string) => pathname === href
  const isParentActive = (children?: { href: string }[]) =>
    children?.some(child => pathname.startsWith(child.href))

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border px-4",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">EduGestión</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent",
              isCollapsed && "absolute -right-3 top-6 z-50 rounded-full bg-sidebar-primary text-sidebar-primary-foreground shadow-md hover:bg-sidebar-primary/90"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </div>

        {/* User Profile */}
        <div className={cn(
          "border-b border-sidebar-border p-4",
          isCollapsed && "flex justify-center py-4"
        )}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-sidebar-primary/50">
                <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium">Administrador</p>
                <p className="truncate text-xs text-sidebar-foreground/70">Director</p>
              </div>
            </div>
          ) : (
            <Avatar className="h-9 w-9 ring-2 ring-sidebar-primary/50">
              <AvatarImage src="/placeholder-user.jpg" alt="Usuario" />
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                AD
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const ItemIcon = item.icon
              if (item.children) {
                const isOpen = openItems.includes(item.title) || isParentActive(item.children)
                return (
                  <Collapsible
                    key={item.title}
                    open={!isCollapsed && isOpen}
                    onOpenChange={() => !isCollapsed && toggleItem(item.title)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                          isParentActive(item.children) && "bg-sidebar-accent text-sidebar-accent-foreground",
                          isCollapsed && "justify-center px-2"
                        )}
                      >
                        <ItemIcon className="h-5 w-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left text-sm">{item.title}</span>
                            <ChevronDown className={cn(
                              "h-4 w-4 transition-transform",
                              isOpen && "rotate-180"
                            )} />
                          </>
                        )}
                      </Button>
                    </CollapsibleTrigger>
                    {!isCollapsed && (
                      <CollapsibleContent className="space-y-1 pt-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon
                          return (
                          <Button
                            key={child.href}
                            variant="ghost"
                            asChild
                            className={cn(
                              "w-full justify-start gap-3 pl-10 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive(child.href) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                            )}
                          >
                            <Link href={child.href}>
                              <ChildIcon className="h-4 w-4 shrink-0" />
                              <span className="text-sm">{child.title}</span>
                            </Link>
                          </Button>
                          )
                        })}
                      </CollapsibleContent>
                    )}
                  </Collapsible>
                )
              }

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive(item.href!) && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Link href={item.href!}>
                    <ItemIcon className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="text-sm">{item.title}</span>}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className={cn(
          "border-t border-sidebar-border p-3",
          isCollapsed && "flex justify-center"
        )}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="text-sm">Cerrar Sesión</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
