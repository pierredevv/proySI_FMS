"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { GraduationCap, Plus, AlertCircle, Phone, Mail, FileText } from "lucide-react"

export default function DocentesPage() {
  const [profesores, setProfesores] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formError, setFormError] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    ci: "",
    profesion: "",
    genero: "M",
    crear_cuenta: false,
    username: "",
    password: "",
    id_usuario: null
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      
      const res = await fetch("http://localhost:5000/api/profesores", { headers })
      
      if (res.ok) {
        setProfesores(await res.json())
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    if (!formData.nombre || !formData.apellido || !formData.ci) {
      setFormError("Nombre, Apellido y CI son obligatorios.")
      return
    }

    if (formData.crear_cuenta && (!formData.username || !formData.password)) {
      setFormError("Debe ingresar un usuario y contraseña para la cuenta.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/profesores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || "Error al registrar profesor")
        return
      }

      setIsCreateOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      setFormError("Error de conexión.")
    }
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      apellido: "",
      ci: "",
      profesion: "",
      genero: "M",
      crear_cuenta: false,
      username: "",
      password: "",
      id_usuario: null
    })
    setFormError("")
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Personal Docente
          </h1>
          <p className="text-muted-foreground mt-1">
            Registro y seguimiento de los profesores e instructores educativos.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Nuevo Docente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Registrar Docente</DialogTitle>
              <DialogDescription>
                Ingrese la ficha técnica del profesor. Puede crear su acceso inmediatamente.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {formError}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres *</Label>
                  <Input 
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos *</Label>
                  <Input 
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cédula de Identidad *</Label>
                  <Input 
                    value={formData.ci}
                    onChange={(e) => setFormData({...formData, ci: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Género *</Label>
                  <Select value={formData.genero} onValueChange={(v) => setFormData({...formData, genero: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Masculino</SelectItem>
                      <SelectItem value="F">Femenino</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profesión / Especialidad</Label>
                <Input 
                  value={formData.profesion}
                  onChange={(e) => setFormData({...formData, profesion: e.target.value})}
                  placeholder="Ej. Profesor de Matemáticas Secundarias"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2 pb-2 bg-secondary/30 p-3 rounded-lg border">
                <Checkbox 
                  id="crear" 
                  checked={formData.crear_cuenta}
                  onCheckedChange={(c) => setFormData({...formData, crear_cuenta: !!c})}
                />
                <Label htmlFor="crear" className="text-secondary-foreground font-semibold cursor-pointer">
                  Generar cuenta de acceso para este Docente ahora
                </Label>
              </div>

              {formData.crear_cuenta && (
                <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 border rounded-lg animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <Label>Usuario *</Label>
                    <Input 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contraseña provisional *</Label>
                    <Input 
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type="submit">Registrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nombre Completo</TableHead>
                <TableHead>CI</TableHead>
                <TableHead className="hidden md:table-cell">Especialidad</TableHead>
                <TableHead>Cuenta Vinculada</TableHead>
                <TableHead className="text-right">Contacto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Cargando docentes...
                  </TableCell>
                </TableRow>
              ) : profesores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay docentes registrados.
                  </TableCell>
                </TableRow>
              ) : (
                profesores.map((prof) => (
                  <TableRow key={prof.id_profesor}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{prof.nombre} {prof.apellido}</span>
                        <span className="text-xs text-muted-foreground hidden sm:block">ID: {prof.id_profesor}</span>
                      </div>
                    </TableCell>
                    <TableCell>{prof.ci}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-[200px]">
                      {prof.profesion || "-"}
                    </TableCell>
                    <TableCell>
                      {prof.usuario_activo !== null ? (
                         <div className="inline-flex flex-col">
                           <span className="text-sm font-semibold">{prof.username}</span>
                           <span className={`text-[10px] ${prof.usuario_activo ? 'text-green-600' : 'text-red-500'}`}>
                             {prof.usuario_activo ? 'Activa' : 'Desactivada'}
                           </span>
                         </div>
                      ) : (
                        <span className="text-muted-foreground/60 text-sm">Sin cuenta</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       <Button variant="outline" size="icon" className="h-8 w-8" title="Ver Expediente (Próximamente)">
                         <FileText className="h-4 w-4 text-blue-500" />
                       </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
