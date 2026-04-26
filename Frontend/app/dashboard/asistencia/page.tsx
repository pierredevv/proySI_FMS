"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Save,
  FileText,
  Users,
  Check,
  X,
  Clock,
  AlertTriangle,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  UserX,
  Download,
} from "lucide-react"
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isWeekend } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

type AttendanceStatus = "presente" | "ausente" | "tardanza" | "justificado" | null

interface Student {
  id: number
  name: string
  ci: string
  attendance: AttendanceStatus
  observation?: string
}

interface DailyAttendance {
  date: Date
  students: Student[]
}

// Datos de ejemplo
const initialStudents: Student[] = [
  { id: 1, name: "María García López", ci: "12345678", attendance: "presente" },
  { id: 2, name: "Juan Pérez Mamani", ci: "23456789", attendance: "presente" },
  { id: 3, name: "Sofía Rodríguez Quispe", ci: "34567890", attendance: "tardanza", observation: "Llegó 10 minutos tarde" },
  { id: 4, name: "Carlos Mendoza Flores", ci: "45678901", attendance: "ausente" },
  { id: 5, name: "Ana Martínez Choque", ci: "56789012", attendance: "presente" },
  { id: 6, name: "Diego López Condori", ci: "67890123", attendance: "justificado", observation: "Cita médica" },
  { id: 7, name: "Valentina Quispe Mamani", ci: "78901234", attendance: null },
  { id: 8, name: "Mateo Flores Apaza", ci: "89012345", attendance: null },
  { id: 9, name: "Isabella Choque Huanca", ci: "90123456", attendance: null },
  { id: 10, name: "Sebastián Condori Ticona", ci: "01234567", attendance: null },
]

const statusConfig: Record<
  Exclude<AttendanceStatus, null>,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  presente: {
    label: "Presente",
    color: "text-success",
    bg: "bg-success/10 hover:bg-success/20 border-success",
    icon: Check,
  },
  ausente: {
    label: "Ausente",
    color: "text-destructive",
    bg: "bg-destructive/10 hover:bg-destructive/20 border-destructive",
    icon: X,
  },
  tardanza: {
    label: "Tardanza",
    color: "text-amber-500",
    bg: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500",
    icon: Clock,
  },
  justificado: {
    label: "Justificado",
    color: "text-info",
    bg: "bg-info/10 hover:bg-info/20 border-info",
    icon: AlertTriangle,
  },
}

export default function AsistenciaPage() {
  const [students, setStudents] = useState(initialStudents)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedGrade, setSelectedGrade] = useState("3A")
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [observationDialog, setObservationDialog] = useState<{
    open: boolean
    studentId: number | null
    observation: string
    status: AttendanceStatus
  }>({
    open: false,
    studentId: null,
    observation: "",
    status: null,
  })

  // Estadísticas
  const stats = {
    total: students.length,
    presentes: students.filter((s) => s.attendance === "presente").length,
    ausentes: students.filter((s) => s.attendance === "ausente").length,
    tardanzas: students.filter((s) => s.attendance === "tardanza").length,
    justificados: students.filter((s) => s.attendance === "justificado").length,
    pendientes: students.filter((s) => s.attendance === null).length,
  }

  const handleAttendanceChange = (studentId: number, status: AttendanceStatus) => {
    // Si es tardanza, ausente o justificado, abrir diálogo para observación
    if (status === "tardanza" || status === "ausente" || status === "justificado") {
      const student = students.find((s) => s.id === studentId)
      setObservationDialog({
        open: true,
        studentId,
        observation: student?.observation || "",
        status,
      })
    } else {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === studentId ? { ...s, attendance: status, observation: undefined } : s
        )
      )
    }
  }

  const handleSaveObservation = () => {
    if (observationDialog.studentId === null) return
    
    setStudents((prev) =>
      prev.map((s) =>
        s.id === observationDialog.studentId
          ? {
              ...s,
              attendance: observationDialog.status,
              observation: observationDialog.observation || undefined,
            }
          : s
      )
    )
    setObservationDialog({ open: false, studentId: null, observation: "", status: null })
  }

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((s) =>
        s.attendance === null ? { ...s, attendance: "presente" } : s
      )
    )
  }

  const goToPreviousDay = () => {
    let newDate = subDays(selectedDate, 1)
    // Saltar fines de semana
    while (isWeekend(newDate)) {
      newDate = subDays(newDate, 1)
    }
    setSelectedDate(newDate)
  }

  const goToNextDay = () => {
    let newDate = addDays(selectedDate, 1)
    // Saltar fines de semana
    while (isWeekend(newDate)) {
      newDate = addDays(newDate, 1)
    }
    setSelectedDate(newDate)
  }

  // Días de la semana para la vista semanal
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 })
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd }).filter(
    (day) => !isWeekend(day)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Control de Asistencia</h1>
          <p className="text-muted-foreground">
            Registre la asistencia diaria de los estudiantes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      {/* Filters and Date Picker */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Course Selector */}
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium mb-2 block">Curso</label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PK-A">Pre-Kinder A</SelectItem>
                  <SelectItem value="PK-B">Pre-Kinder B</SelectItem>
                  <SelectItem value="K-A">Kinder A</SelectItem>
                  <SelectItem value="K-B">Kinder B</SelectItem>
                  <SelectItem value="1A">1ro Primaria A</SelectItem>
                  <SelectItem value="2A">2do Primaria A</SelectItem>
                  <SelectItem value="3A">3ro Primaria A</SelectItem>
                  <SelectItem value="4A">4to Primaria A</SelectItem>
                  <SelectItem value="5A">5to Primaria A</SelectItem>
                  <SelectItem value="6A">6to Primaria A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Navigation */}
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium mb-2 block">Fecha</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                        locale: es,
                      })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        if (date) setSelectedDate(date)
                        setIsCalendarOpen(false)
                      }}
                      disabled={(date) => isWeekend(date) || date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextDay}
                  disabled={isSameDay(selectedDate, new Date()) || selectedDate > new Date()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 self-end">
              <Button variant="outline" onClick={markAllPresent} className="gap-2">
                <UserCheck className="h-4 w-4" />
                Todos Presentes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Week Overview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Vista Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {weekDays.map((day) => (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                disabled={day > new Date()}
                className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  isSameDay(day, selectedDate)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted",
                  day > new Date() && "opacity-50 cursor-not-allowed"
                )}
              >
                <p className="text-xs font-medium">
                  {format(day, "EEE", { locale: es })}
                </p>
                <p className="text-lg font-bold">{format(day, "d")}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Presentes</p>
                <p className="text-2xl font-bold text-success">{stats.presentes}</p>
              </div>
              <Check className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ausentes</p>
                <p className="text-2xl font-bold text-destructive">{stats.ausentes}</p>
              </div>
              <X className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tardanzas</p>
                <p className="text-2xl font-bold text-amber-500">{stats.tardanzas}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-info">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Justificados</p>
                <p className="text-2xl font-bold text-info">{stats.justificados}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-info/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-muted-foreground">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-bold text-muted-foreground">{stats.pendientes}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observation Dialog */}
      <Dialog
        open={observationDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            setObservationDialog({
              open: false,
              studentId: null,
              observation: "",
              status: null,
            })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Registrar{" "}
              {observationDialog.status && statusConfig[observationDialog.status]?.label}
            </DialogTitle>
            <DialogDescription>
              Agregue una observación opcional para este registro de asistencia.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="observation">Observación (opcional)</Label>
              <Textarea
                id="observation"
                placeholder="Ej: Llegó 10 minutos tarde, Cita médica, etc."
                value={observationDialog.observation}
                onChange={(e) =>
                  setObservationDialog((prev) => ({
                    ...prev,
                    observation: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setObservationDialog({
                  open: false,
                  studentId: null,
                  observation: "",
                  status: null,
                })
              }
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveObservation}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>3ro Primaria A</CardTitle>
              <CardDescription>
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </CardDescription>
            </div>
            <Badge
              variant={stats.pendientes === 0 ? "default" : "secondary"}
              className="gap-1"
            >
              {stats.pendientes === 0 ? (
                <>
                  <Check className="h-3 w-3" />
                  Completo
                </>
              ) : (
                `${stats.pendientes} pendientes`
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:hidden">
            {students.map((student, index) => (
              <div key={student.id} className="rounded-lg border p-4 space-y-2">
                <p className="font-medium">{index + 1}. {student.name}</p>
                <p className="text-sm text-muted-foreground">CI: {student.ci}</p>
                <div className="flex gap-1">
                  {(Object.entries(statusConfig) as [Exclude<AttendanceStatus, null>, (typeof statusConfig)[keyof typeof statusConfig]][]).map(([status, config]) => {
                    const Icon = config.icon
                    const isActive = student.attendance === status
                    return (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        className={cn("h-8 w-8 p-0 border-2", isActive && config.bg)}
                        onClick={() => handleAttendanceChange(student.id, status)}
                        title={config.label}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? config.color : "text-muted-foreground")} />
                      </Button>
                    )
                  })}
                </div>
                <p className="text-sm text-muted-foreground">{student.observation || "-"}</p>
              </div>
            ))}
          </div>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead>Observación</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {student.ci}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-1">
                        {(
                          Object.entries(statusConfig) as [
                            Exclude<AttendanceStatus, null>,
                            (typeof statusConfig)[keyof typeof statusConfig]
                          ][]
                        ).map(([status, config]) => {
                          const Icon = config.icon
                          const isActive = student.attendance === status
                          return (
                            <Button
                              key={status}
                              variant="outline"
                              size="sm"
                              className={cn(
                                "h-8 w-8 p-0 border-2",
                                isActive && config.bg
                              )}
                              onClick={() => handleAttendanceChange(student.id, status)}
                              title={config.label}
                            >
                              <Icon
                                className={cn(
                                  "h-4 w-4",
                                  isActive ? config.color : "text-muted-foreground"
                                )}
                              />
                            </Button>
                          )
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {student.observation || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6 text-sm">
            <span className="font-medium text-muted-foreground">Leyenda:</span>
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon
              return (
                <div key={status} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded border-2",
                      config.bg
                    )}
                  >
                    <Icon className={cn("h-3 w-3", config.color)} />
                  </div>
                  <span>{config.label}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
