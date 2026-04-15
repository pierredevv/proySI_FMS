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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Download,
  Filter,
} from "lucide-react"

interface Student {
  id: number
  name: string
  ci: string
  grade: string
  level: "Pre-Kinder" | "Kinder" | "Primaria"
  gender: "M" | "F"
  tutor: string
  status: "active" | "inactive"
}

const students: Student[] = [
  {
    id: 1,
    name: "María García López",
    ci: "12345678",
    grade: "3ro A",
    level: "Primaria",
    gender: "F",
    tutor: "Ana García",
    status: "active",
  },
  {
    id: 2,
    name: "Juan Pérez Mamani",
    ci: "87654321",
    grade: "Kinder A",
    level: "Kinder",
    gender: "M",
    tutor: "Pedro Pérez",
    status: "active",
  },
  {
    id: 3,
    name: "Sofía Rodríguez Quispe",
    ci: "11223344",
    grade: "Pre-K B",
    level: "Pre-Kinder",
    gender: "F",
    tutor: "María Quispe",
    status: "active",
  },
  {
    id: 4,
    name: "Carlos Mendoza Flores",
    ci: "44332211",
    grade: "5to B",
    level: "Primaria",
    gender: "M",
    tutor: "Rosa Flores",
    status: "active",
  },
  {
    id: 5,
    name: "Ana Martínez Choque",
    ci: "55667788",
    grade: "1ro A",
    level: "Primaria",
    gender: "F",
    tutor: "Luis Martínez",
    status: "inactive",
  },
]

const levelColors = {
  "Pre-Kinder": "bg-chart-1/10 text-chart-1",
  Kinder: "bg-chart-2/10 text-chart-2",
  Primaria: "bg-chart-4/10 text-chart-4",
}

export default function EstudiantesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.ci.includes(searchTerm)
    const matchesLevel = levelFilter === "all" || student.level === levelFilter
    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Estudiantes</h1>
          <p className="text-muted-foreground">
            Gestión de expedientes digitales de estudiantes
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Estudiante
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">287</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Pre-Kinder</div>
            <div className="text-2xl font-bold text-chart-1">45</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Kinder</div>
            <div className="text-2xl font-bold text-chart-2">62</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Primaria</div>
            <div className="text-2xl font-bold text-chart-4">180</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Lista de Estudiantes</CardTitle>
              <CardDescription>
                {filteredStudents.length} estudiantes encontrados
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o CI..."
                  className="pl-9 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Pre-Kinder">Pre-Kinder</SelectItem>
                  <SelectItem value="Kinder">Kinder</SelectItem>
                  <SelectItem value="Primaria">Primaria</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Tutor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {student.name
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {student.gender === "M" ? "Masculino" : "Femenino"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {student.ci}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={levelColors[student.level]}
                      >
                        {student.level}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.grade}</TableCell>
                    <TableCell>{student.tutor}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
                        }
                        className={
                          student.status === "active"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : ""
                        }
                      >
                        {student.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
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
                            <Eye className="h-4 w-4 mr-2" />
                            Ver expediente
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
