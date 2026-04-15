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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  QrCode,
  Download,
  Upload,
  Banknote,
  CreditCard,
  Smartphone,
  Printer,
} from "lucide-react"

interface Payment {
  id: number
  student: string
  studentId: number
  concept: string
  amount: number
  date: string
  status: "paid" | "pending" | "overdue"
  method: "cash" | "transfer" | "qr"
  level: "pre-kinder" | "kinder" | "primaria"
}

const payments: Payment[] = [
  {
    id: 1,
    student: "María García López",
    studentId: 1,
    concept: "Mensualidad Abril",
    amount: 350,
    date: "2025-04-10",
    status: "paid",
    method: "qr",
    level: "primaria",
  },
  {
    id: 2,
    student: "Juan Pérez Mamani",
    studentId: 2,
    concept: "Mensualidad Abril",
    amount: 400,
    date: "2025-04-05",
    status: "paid",
    method: "cash",
    level: "kinder",
  },
  {
    id: 3,
    student: "Sofía Rodríguez Quispe",
    studentId: 3,
    concept: "Mensualidad Abril",
    amount: 450,
    date: "",
    status: "pending",
    method: "transfer",
    level: "pre-kinder",
  },
  {
    id: 4,
    student: "Carlos Mendoza Flores",
    studentId: 4,
    concept: "Mensualidad Marzo",
    amount: 350,
    date: "",
    status: "overdue",
    method: "cash",
    level: "primaria",
  },
  {
    id: 5,
    student: "Ana Martínez Choque",
    studentId: 5,
    concept: "Mensualidad Abril",
    amount: 350,
    date: "2025-04-12",
    status: "paid",
    method: "transfer",
    level: "primaria",
  },
  {
    id: 6,
    student: "Diego López Condori",
    studentId: 6,
    concept: "Mensualidad Abril",
    amount: 400,
    date: "",
    status: "pending",
    method: "qr",
    level: "kinder",
  },
  {
    id: 7,
    student: "Valentina Quispe",
    studentId: 7,
    concept: "Inscripción 2025",
    amount: 500,
    date: "2025-02-15",
    status: "paid",
    method: "transfer",
    level: "pre-kinder",
  },
]

const statusConfig = {
  paid: {
    label: "Pagado",
    icon: CheckCircle2,
    color: "bg-success/10 text-success border-success/30",
  },
  pending: {
    label: "Pendiente",
    icon: Clock,
    color: "bg-amber-100 text-amber-700 border-amber-300",
  },
  overdue: {
    label: "Vencido",
    icon: AlertCircle,
    color: "bg-destructive/10 text-destructive border-destructive/30",
  },
}

const methodConfig = {
  cash: { label: "Efectivo", icon: Banknote },
  transfer: { label: "Transferencia", icon: CreditCard },
  qr: { label: "Código QR", icon: Smartphone },
}

const levelPrices = {
  "pre-kinder": 450,
  kinder: 400,
  primaria: 350,
}

export default function PagosPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [concept, setConcept] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [observation, setObservation] = useState("")

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.student
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "paid" && payment.status === "paid") ||
      (activeTab === "pending" &&
        (payment.status === "pending" || payment.status === "overdue"))
    return matchesSearch && matchesTab
  })

  const totalCollected = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0)
  const totalPending = payments
    .filter((p) => p.status !== "paid")
    .reduce((acc, p) => acc + p.amount, 0)
  const paidCount = payments.filter((p) => p.status === "paid").length
  const pendingCount = payments.filter((p) => p.status === "pending").length
  const overdueCount = payments.filter((p) => p.status === "overdue").length

  const handleRegisterPayment = () => {
    console.log("Registering payment:", {
      selectedStudent,
      paymentMethod,
      concept,
      amount,
      observation,
    })
    setIsRegisterDialogOpen(false)
    // Reset form
    setSelectedStudent("")
    setPaymentMethod("")
    setConcept("")
    setAmount("")
    setObservation("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Control de Pagos
          </h1>
          <p className="text-muted-foreground">
            Gestión de pagos, mensualidades y comprobantes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <QrCode className="h-4 w-4" />
                Generar QR
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Código QR de Pago</DialogTitle>
                <DialogDescription>
                  Escanee este código con su aplicación bancaria para realizar el pago.
                </DialogDescription>
              </DialogHeader>
              <div className="py-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    <QrCode className="h-32 w-32 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Cuenta de la Institución</p>
                    <p className="text-sm text-muted-foreground">Banco Unión - 1234567890</p>
                    <p className="text-lg font-bold mt-2">Bs. 350.00</p>
                  </div>
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Descargar QR
                </Button>
                <Button variant="outline" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Pago</DialogTitle>
                <DialogDescription>
                  Complete la información del pago realizado.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Estudiante</Label>
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estudiante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">María García López - 3ro Primaria A</SelectItem>
                        <SelectItem value="2">Juan Pérez Mamani - Kinder B</SelectItem>
                        <SelectItem value="3">Sofía Rodríguez Quispe - Pre-Kinder A</SelectItem>
                        <SelectItem value="4">Carlos Mendoza Flores - 4to Primaria A</SelectItem>
                        <SelectItem value="5">Ana Martínez Choque - 5to Primaria A</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Concepto de Pago</Label>
                    <Select value={concept} onValueChange={setConcept}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar concepto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensualidad_abril">Mensualidad Abril 2025</SelectItem>
                        <SelectItem value="mensualidad_mayo">Mensualidad Mayo 2025</SelectItem>
                        <SelectItem value="inscripcion">Inscripción 2025</SelectItem>
                        <SelectItem value="uniforme">Uniforme Escolar</SelectItem>
                        <SelectItem value="material">Material Escolar</SelectItem>
                        <SelectItem value="evento">Evento Especial</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Monto (Bs.)</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Montos sugeridos: Pre-Kinder Bs.450, Kinder Bs.400, Primaria Bs.350
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Método de Pago</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">
                          <div className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            Efectivo
                          </div>
                        </SelectItem>
                        <SelectItem value="transfer">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Transferencia Bancaria
                          </div>
                        </SelectItem>
                        <SelectItem value="qr">
                          <div className="flex items-center gap-2">
                            <Smartphone className="h-4 w-4" />
                            Código QR
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {paymentMethod === "transfer" && (
                  <div className="space-y-2">
                    <Label>Comprobante de Transferencia</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 cursor-pointer transition-colors">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Arrastre el comprobante aquí o haga clic para seleccionar
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG o PDF (máx. 5MB)
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Observaciones (Opcional)</Label>
                  <Textarea
                    placeholder="Notas adicionales sobre el pago..."
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRegisterDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleRegisterPayment}>Registrar Pago</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Recaudado</p>
                <p className="text-2xl font-bold">
                  Bs. {totalCollected.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {paidCount} pagos realizados
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-success/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendiente</p>
                <p className="text-2xl font-bold">
                  Bs. {totalPending.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {pendingCount} por cobrar
                </p>
              </div>
              <Clock className="h-8 w-8 text-amber-500/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Al día</p>
                <p className="text-2xl font-bold">
                  {Math.round((paidCount / payments.length) * 100)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  del total de estudiantes
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary/50" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Morosos</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  requieren seguimiento
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-destructive/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Registro de Pagos</CardTitle>
                <CardDescription>Gestión 2025 - Abril</CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar estudiante..."
                    className="pl-9 w-full sm:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" title="Exportar">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">
                  Todos ({payments.length})
                </TabsTrigger>
                <TabsTrigger value="paid">
                  Pagados ({paidCount})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pendientes ({pendingCount + overdueCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Concepto</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => {
                  const config = statusConfig[payment.status]
                  const Icon = config.icon
                  const MethodIcon = methodConfig[payment.method].icon
                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {payment.student.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{payment.student}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {payment.level.replace("-", " ")}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{payment.concept}</TableCell>
                      <TableCell className="font-mono font-medium">
                        Bs. {payment.amount}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{methodConfig[payment.method].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.date
                          ? new Date(payment.date).toLocaleDateString("es-BO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${config.color}`}>
                          <Icon className="h-3 w-3" />
                          {config.label}
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
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalle
                            </DropdownMenuItem>
                            {payment.status === "paid" && (
                              <DropdownMenuItem>
                                <FileText className="h-4 w-4 mr-2" />
                                Generar recibo PDF
                              </DropdownMenuItem>
                            )}
                            {payment.status !== "paid" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Marcar como pagado
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <QrCode className="h-4 w-4 mr-2" />
                                  Generar QR de pago
                                </DropdownMenuItem>
                              </>
                            )}
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
