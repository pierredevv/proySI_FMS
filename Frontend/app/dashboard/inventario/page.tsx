"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  ArrowUpRight,
  ArrowDownLeft,
  Package,
  AlertTriangle,
  TrendingUp,
  Boxes,
} from "lucide-react"

interface InventoryItem {
  id: number
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  lastMovement: string
}

const inventory: InventoryItem[] = [
  {
    id: 1,
    name: "Cuadernos rayados 100 hojas",
    category: "Material escolar",
    currentStock: 12,
    minStock: 50,
    maxStock: 200,
    lastMovement: "2025-04-10",
  },
  {
    id: 2,
    name: "Lápices HB",
    category: "Material escolar",
    currentStock: 25,
    minStock: 100,
    maxStock: 500,
    lastMovement: "2025-04-08",
  },
  {
    id: 3,
    name: "Uniformes deportivos talla M",
    category: "Uniformes",
    currentStock: 3,
    minStock: 15,
    maxStock: 50,
    lastMovement: "2025-04-05",
  },
  {
    id: 4,
    name: "Tizas blancas (caja)",
    category: "Material escolar",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    lastMovement: "2025-04-12",
  },
  {
    id: 5,
    name: "Sillas escolares",
    category: "Mobiliario",
    currentStock: 150,
    minStock: 100,
    maxStock: 200,
    lastMovement: "2025-03-20",
  },
  {
    id: 6,
    name: "Mesas escolares",
    category: "Mobiliario",
    currentStock: 85,
    minStock: 50,
    maxStock: 120,
    lastMovement: "2025-03-20",
  },
  {
    id: 7,
    name: "Insignias bordadas",
    category: "Uniformes",
    currentStock: 200,
    minStock: 100,
    maxStock: 500,
    lastMovement: "2025-04-01",
  },
]

function getStockStatus(current: number, min: number, max: number) {
  const percentage = (current / max) * 100
  if (current <= min) return { status: "critical", color: "text-destructive", bg: "bg-destructive" }
  if (percentage <= 30) return { status: "low", color: "text-warning-foreground", bg: "bg-warning" }
  return { status: "normal", color: "text-success", bg: "bg-success" }
}

export default function InventarioPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock)
  const totalItems = inventory.reduce((acc, item) => acc + item.currentStock, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventario</h1>
          <p className="text-muted-foreground">
            Control de materiales y recursos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Entrada
          </Button>
          <Button variant="outline" className="gap-2">
            <ArrowDownLeft className="h-4 w-4" />
            Salida
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Material
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <Boxes className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productos</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-info/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Bajo</p>
                <p className="text-2xl font-bold text-destructive">
                  {lowStockItems.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Movimientos Hoy</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Alerta de Stock Bajo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <Badge key={item.id} variant="outline" className="border-destructive/50">
                  {item.name}: {item.currentStock} unidades
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lista de Materiales</CardTitle>
              <CardDescription>
                {filteredInventory.length} materiales registrados
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar material..."
                className="pl-9 w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Stock Actual</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Último Mov.</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(
                    item.currentStock,
                    item.minStock,
                    item.maxStock
                  )
                  const percentage = (item.currentStock / item.maxStock) * 100
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`font-mono ${stockStatus.color}`}>
                          {item.currentStock}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {" "}/ {item.maxStock}
                        </span>
                      </TableCell>
                      <TableCell className="w-32">
                        <Progress
                          value={percentage}
                          className={`h-2 ${
                            stockStatus.status === "critical"
                              ? "[&>div]:bg-destructive"
                              : stockStatus.status === "low"
                              ? "[&>div]:bg-warning"
                              : "[&>div]:bg-success"
                          }`}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(item.lastMovement).toLocaleDateString("es-BO")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Registrar entrada
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ArrowDownLeft className="h-4 w-4 mr-2" />
                              Registrar salida
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
