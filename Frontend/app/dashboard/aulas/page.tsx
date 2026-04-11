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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  DoorOpen,
  Armchair,
  GraduationCap,
  AlertTriangle,
} from "lucide-react"

interface Classroom {
  id: number
  number: string
  description: string
  level: "pre-kinder" | "kinder" | "primaria"
  grade: string
  capacity: number
  currentStudents: number
  desks: number
  chairs: number
  teacher?: string
  status: "activa" | "inactiva" | "mantenimiento"
}

const classrooms: Classroom[] = [
  {
    id: 1,
    number: "A-101",
    description: "Aula de Pre-Kinder A con área de juegos",
    level: "pre-kinder",
    grade: "Pre-Kinder A",
    capacity: 20,
    currentStudents: 18,
    desks: 10,
    chairs: 22,
    teacher: "Prof. María López",
    status: "activa",
  },
  {
    id: 2,
    number: "A-102",
    description: "Aula de Pre-Kinder B con área de descanso",
    level: "pre-kinder",
    grade: "Pre-Kinder B",
    capacity: 20,
    currentStudents: 15,
    desks: 10,
    chairs: 22,
    teacher: "Prof. Ana García",
    status: "activa",
  },
  {
    id: 3,
    number: "B-101",
    description: "Aula de Kinder A",
    level: "kinder",
    grade: "Kinder A",
    capacity: 25,
    currentStudents: 22,
    desks: 12,
    chairs: 26,
    teacher: "Prof. Carmen Quispe",
    status: "activa",
  },
  {
    id: 4,
    number: "B-102",
    description: "Aula de Kinder B",
    level: "kinder",
    grade: "Kinder B",
    capacity: 25,
    currentStudents: 20,
    desks: 12,
    chairs: 26,
    teacher: "Prof. Rosa Mamani",
    status: "activa",
  },
  {
    id: 5,
    number: "C-101",
    description: "Aula 1ro Primaria A",
    level: "primaria",
    grade: "1ro Primaria A",
    capacity: 30,
    currentStudents: 28,
    desks: 15,
    chairs: 32,
    teacher: "Prof. Juan Pérez",
    status: "activa",
  },
  {
    id: 6,
    number: "C-102",
    description: "Aula 2do Primaria A",
    level: "primaria",
    grade: "2do Primaria A",
    capacity: 30,
    currentStudents: 25,
    desks: 15,
    chairs: 32,
    teacher: "Prof. Pedro Flores",
    status: "activa",
  },
  {
    id: 7,
    number: "C-103",
    description: "Aula 3ro Primaria A",
    level: "primaria",
    grade: "3ro Primaria A",
    capacity: 30,
    currentStudents: 27,
    desks: 15,
    chairs: 30,
    teacher: "Prof. Laura Condori",
    status: "activa",
  },
  {
    id: 8,
    number: "C-104",
    description: "Aula 4to Primaria A - Requiere mantenimiento de sillas",
    level: "primaria",
    grade: "4to Primaria A",
    capacity: 30,
    currentStudents: 24,
    desks: 15,
    chairs: 28,
    teacher: "Prof. Diego Martínez",
    status: "mantenimiento",
  },
  {
    id: 9,
    number: "C-105",
    description: "Aula 5to Primaria A",
    level: "primaria",
    grade: "5to Primaria A",
    capacity: 30,
    currentStudents: 26,
    desks: 15,
    chairs: 32,
    teacher: "Prof. Sofía Rodríguez",
    status: "activa",
  },
  {
    id: 10,
    number: "C-106",
    description: "Aula 6to Primaria A",
    level: "primaria",
    grade: "6to Primaria A",
    capacity: 30,
    currentStudents: 29,
    desks: 15,
    chairs: 32,
    teacher: "Prof. Carlos Mendoza",
    status: "activa",
  },
]

const levelConfig = {
  "pre-kinder": { label: "Pre-Kinder", color: "bg-pink-100 text-pink-700 border-pink-300" },
  kinder: { label: "Kinder", color: "bg-purple-100 text-purple-700 border-purple-300" },
  primaria: { label: "Primaria", color: "bg-blue-100 text-blue-700 border-blue-300" },
}

const statusConfig = {
  activa: { label: "Activa", color: "bg-success/10 text-success border-success/30" },
  inactiva: { label: "Inactiva", color: "bg-muted text-muted-foreground" },
  mantenimiento: { label: "Mantenimiento", color: "bg-amber-100 text-amber-700 border-amber-300" },
}

export default function AulasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLevel, setFilterLevel] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClassroom, setNewClassroom] = useState({
    number: "",
    description: "",
    level: "",
    grade: "",
    capacity: "",
    desks: "",
    chairs: "",
  })

  const filteredClassrooms = classrooms.filter((classroom) => {
    const matchesSearch =
      classroom.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.teacher?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = filterLevel === "all" || classroom.level === filterLevel
    const matchesStatus = filterStatus === "all" || classroom.status === filterStatus
    return matchesSearch && matchesLevel && matchesStatus
  })

  const stats = {
    totalClassrooms: classrooms.length,
    activeClassrooms: classrooms.filter((c) => c.status === "activa").length,
    totalStudents: classrooms.reduce((acc, c) => acc + c.currentStudents, 0),
    totalCapacity: classrooms.reduce((acc, c) => acc + c.capacity, 0),
    totalDesks: classrooms.reduce((acc, c) => acc + c.desks, 0),
    totalChairs: classrooms.reduce((acc, c) => acc + c.chairs, 0),
    maintenanceNeeded: classrooms.filter((c) => c.status === "mantenimiento").length,
  }

  const occupancyRate = Math.round((stats.totalStudents / stats.totalCapacity) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Aulas
          </h1>
          <p className="text-muted-foreground">
            Administre las aulas y sus recursos físicos
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Aula
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nueva Aula</DialogTitle>
              <DialogDescription>
                Complete la información del aula y sus recursos.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número de Aula</Label>
                  <Input
                    id="number"
                    placeholder="Ej: A-101"
                    value={newClassroom.number}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, number: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Nivel</Label>
                  <Select
                    value={newClassroom.level}
                    onValueChange={(value) =>
                      setNewClassroom({ ...newClassroom, level: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre-kinder">Pre-Kinder</SelectItem>
                      <SelectItem value="kinder">Kinder</SelectItem>
                      <SelectItem value="primaria">Primaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grado/Curso</Label>
                  <Input
                    id="grade"
                    placeholder="Ej: 3ro Primaria A"
                    value={newClassroom.grade}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, grade: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad Máxima</Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="Número de estudiantes"
                    value={newClassroom.capacity}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, capacity: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="desks">Número de Mesas</Label>
                  <Input
                    id="desks"
                    type="number"
                    placeholder="Cantidad de mesas"
                    value={newClassroom.desks}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, desks: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chairs">Número de Sillas</Label>
                  <Input
                    id="chairs"
                    type="number"
                    placeholder="Cantidad de sillas"
                    value={newClassroom.chairs}
                    onChange={(e) =>
                      setNewClassroom({ ...newClassroom, chairs: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción adicional del aula..."
                  value={newClassroom.description}
                  onChange={(e) =>
                    setNewClassroom({ ...newClassroom, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>
                Registrar Aula
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Aulas</p>
                <p className="text-2xl font-bold">{stats.totalClassrooms}</p>
              </div>
              <DoorOpen className="h-8 w-8 text-primary/50" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {stats.activeClassrooms} activas
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Estudiantes</p>
                <p className="text-2xl font-bold">{stats.totalStudents}</p>
              </div>
              <Users className="h-8 w-8 text-primary/50" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <Progress value={occupancyRate} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground">{occupancyRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mobiliario</p>
                <p className="text-2xl font-bold">{stats.totalDesks + stats.totalChairs}</p>
              </div>
              <Armchair className="h-8 w-8 text-primary/50" />
            </div>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              <span>{stats.totalDesks} mesas</span>
              <span>•</span>
              <span>{stats.totalChairs} sillas</span>
            </div>
          </CardContent>
        </Card>
        <Card className={stats.maintenanceNeeded > 0 ? "border-amber-300" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mantenimiento</p>
                <p className={`text-2xl font-bold ${stats.maintenanceNeeded > 0 ? "text-amber-500" : "text-success"}`}>
                  {stats.maintenanceNeeded}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${stats.maintenanceNeeded > 0 ? "text-amber-500/50" : "text-success/50"}`} />
            </div>
            <div className="mt-2">
              <Badge variant={stats.maintenanceNeeded > 0 ? "outline" : "secondary"} className="text-xs">
                {stats.maintenanceNeeded > 0 ? "Requiere atención" : "Todo en orden"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por número, grado o profesor..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-[150px]">
              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pre-kinder">Pre-Kinder</SelectItem>
                  <SelectItem value="kinder">Kinder</SelectItem>
                  <SelectItem value="primaria">Primaria</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[150px]">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classrooms Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Lista de Aulas</CardTitle>
          <CardDescription>
            {filteredClassrooms.length} aulas encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aula</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Docente</TableHead>
                  <TableHead className="text-center">Ocupación</TableHead>
                  <TableHead className="text-center">Mobiliario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClassrooms.map((classroom) => {
                  const occupancy = Math.round(
                    (classroom.currentStudents / classroom.capacity) * 100
                  )
                  return (
                    <TableRow key={classroom.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{classroom.number}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {classroom.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={levelConfig[classroom.level].color}>
                          {levelConfig[classroom.level].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{classroom.grade}</TableCell>
                      <TableCell>
                        {classroom.teacher ? (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{classroom.teacher}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin asignar</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {classroom.currentStudents}/{classroom.capacity}
                            </span>
                          </div>
                          <Progress
                            value={occupancy}
                            className="h-1.5 w-16"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-3 text-sm text-muted-foreground">
                          <span title="Mesas">{classroom.desks} M</span>
                          <span title="Sillas">{classroom.chairs} S</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={statusConfig[classroom.status].color}>
                          {statusConfig[classroom.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="mr-2 h-4 w-4" />
                              Ver Estudiantes
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
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
