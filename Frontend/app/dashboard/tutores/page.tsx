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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  Phone,
  Mail,
  UserPlus,
  Link2,
  UserCheck,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Student {
  id: number
  name: string
  grade: string
}

interface Tutor {
  id: number
  name: string
  lastName: string
  ci: string
  relationship: string
  gender: "M" | "F"
  phone: string
  email: string
  students: Student[]
  isAuthorizedPickup: boolean
}

const tutors: Tutor[] = [
  {
    id: 1,
    name: "Ana",
    lastName: "García López",
    ci: "4567890",
    relationship: "Madre",
    gender: "F",
    phone: "72345678",
    email: "ana.garcia@email.com",
    students: [
      { id: 1, name: "María García López", grade: "3ro Primaria A" },
      { id: 2, name: "Pedro García López", grade: "Kinder B" },
    ],
    isAuthorizedPickup: true,
  },
  {
    id: 2,
    name: "Juan Carlos",
    lastName: "Pérez Mamani",
    ci: "5678901",
    relationship: "Padre",
    gender: "M",
    phone: "73456789",
    email: "jc.perez@email.com",
    students: [{ id: 3, name: "Juan Pérez Mamani Jr.", grade: "2do Primaria A" }],
    isAuthorizedPickup: true,
  },
  {
    id: 3,
    name: "María",
    lastName: "Rodríguez Quispe",
    ci: "6789012",
    relationship: "Madre",
    gender: "F",
    phone: "74567890",
    email: "m.rodriguez@email.com",
    students: [
      { id: 4, name: "Sofía Rodríguez Quispe", grade: "Pre-Kinder A" },
    ],
    isAuthorizedPickup: true,
  },
  {
    id: 4,
    name: "Roberto",
    lastName: "Mendoza Flores",
    ci: "7890123",
    relationship: "Padre",
    gender: "M",
    phone: "75678901",
    email: "r.mendoza@email.com",
    students: [
      { id: 5, name: "Carlos Mendoza Flores", grade: "4to Primaria A" },
      { id: 6, name: "Lucia Mendoza Flores", grade: "1ro Primaria A" },
    ],
    isAuthorizedPickup: true,
  },
  {
    id: 5,
    name: "Elena",
    lastName: "Martínez Choque",
    ci: "8901234",
    relationship: "Abuela",
    gender: "F",
    phone: "76789012",
    email: "e.martinez@email.com",
    students: [{ id: 7, name: "Ana Martínez Choque", grade: "5to Primaria A" }],
    isAuthorizedPickup: true,
  },
  {
    id: 6,
    name: "Diego",
    lastName: "López Condori",
    ci: "9012345",
    relationship: "Tío",
    gender: "M",
    phone: "77890123",
    email: "d.lopez@email.com",
    students: [{ id: 8, name: "Diego López Jr.", grade: "Kinder A" }],
    isAuthorizedPickup: false,
  },
]

const relationships = [
  "Padre",
  "Madre",
  "Abuelo",
  "Abuela",
  "Tío",
  "Tía",
  "Hermano/a Mayor",
  "Tutor Legal",
  "Otro",
]

export default function TutoresPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRelationship, setFilterRelationship] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [newTutor, setNewTutor] = useState({
    name: "",
    lastName: "",
    ci: "",
    relationship: "",
    gender: "",
    phone: "",
    email: "",
  })

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSearch =
      `${tutor.name} ${tutor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.ci.includes(searchTerm) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.phone.includes(searchTerm)
    const matchesRelationship =
      filterRelationship === "all" || tutor.relationship === filterRelationship
    return matchesSearch && matchesRelationship
  })

  const stats = {
    total: tutors.length,
    authorized: tutors.filter((t) => t.isAuthorizedPickup).length,
    totalStudents: tutors.reduce((acc, t) => acc + t.students.length, 0),
  }

  const handleCreateTutor = () => {
    // Aquí iría la lógica para crear el tutor
    console.log("Creating tutor:", newTutor)
    setIsCreateDialogOpen(false)
    setNewTutor({
      name: "",
      lastName: "",
      ci: "",
      relationship: "",
      gender: "",
      phone: "",
      email: "",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Tutores
          </h1>
          <p className="text-muted-foreground">
            Administre los tutores y su vinculación con los estudiantes
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nuevo Tutor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Tutor</DialogTitle>
              <DialogDescription>
                Complete la información del tutor o padre de familia.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    placeholder="Nombre"
                    value={newTutor.name}
                    onChange={(e) =>
                      setNewTutor({ ...newTutor, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    placeholder="Apellidos"
                    value={newTutor.lastName}
                    onChange={(e) =>
                      setNewTutor({ ...newTutor, lastName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ci">Carnet de Identidad</Label>
                  <Input
                    id="ci"
                    placeholder="Número de CI"
                    value={newTutor.ci}
                    onChange={(e) =>
                      setNewTutor({ ...newTutor, ci: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Género</Label>
                  <Select
                    value={newTutor.gender}
                    onValueChange={(value) =>
                      setNewTutor({ ...newTutor, gender: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relationship">Parentesco</Label>
                  <Select
                    value={newTutor.relationship}
                    onValueChange={(value) =>
                      setNewTutor({ ...newTutor, relationship: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar parentesco" />
                    </SelectTrigger>
                    <SelectContent>
                      {relationships.map((rel) => (
                        <SelectItem key={rel} value={rel}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    placeholder="Número de teléfono"
                    value={newTutor.phone}
                    onChange={(e) =>
                      setNewTutor({ ...newTutor, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={newTutor.email}
                  onChange={(e) =>
                    setNewTutor({ ...newTutor, email: e.target.value })
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
              <Button onClick={handleCreateTutor}>Registrar Tutor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tutores</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Autorizados para Recoger
                </p>
                <p className="text-2xl font-bold text-success">{stats.authorized}</p>
              </div>
              <UserCheck className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Estudiantes Vinculados
                </p>
                <p className="text-2xl font-bold text-primary">{stats.totalStudents}</p>
              </div>
              <Link2 className="h-8 w-8 text-primary/50" />
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
                  placeholder="Buscar por nombre, CI, teléfono o email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-[180px]">
              <Select
                value={filterRelationship}
                onValueChange={setFilterRelationship}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Parentesco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {relationships.map((rel) => (
                    <SelectItem key={rel} value={rel}>
                      {rel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Lista de Tutores</CardTitle>
          <CardDescription>
            {filteredTutors.length} tutores encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tutor</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>Parentesco</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estudiantes</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTutors.map((tutor) => (
                  <TableRow key={tutor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {tutor.name[0]}
                            {tutor.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {tutor.name} {tutor.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {tutor.gender === "M" ? "Masculino" : "Femenino"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tutor.ci}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{tutor.relationship}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {tutor.phone}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {tutor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {tutor.students.map((student) => (
                          <div key={student.id} className="text-sm">
                            <span className="font-medium">{student.name}</span>
                            <span className="text-muted-foreground ml-1">
                              ({student.grade})
                            </span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {tutor.isAuthorizedPickup ? (
                        <Badge className="bg-success/10 text-success border-success/30">
                          Autorizado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">No Autorizado</Badge>
                      )}
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
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTutor(tutor)
                              setIsLinkDialogOpen(true)
                            }}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Vincular Estudiante
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Link Student Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vincular Estudiante</DialogTitle>
            <DialogDescription>
              Vincule un estudiante al tutor{" "}
              <strong>
                {selectedTutor?.name} {selectedTutor?.lastName}
              </strong>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Buscar Estudiante</Label>
              <Input placeholder="Nombre o CI del estudiante..." />
            </div>
            <div className="space-y-2">
              <Label>Estudiantes Disponibles</Label>
              <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto">
                {["Diego Martínez López - Pre-Kinder B", "Valentina Choque - Kinder A", "Mateo Flores - 1ro Primaria A"].map((student, i) => (
                  <div
                    key={i}
                    className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {student.split(" ")[0][0]}
                        {student.split(" ")[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{student}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Cancelar
            </Button>
            <Button>Vincular</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
