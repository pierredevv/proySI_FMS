"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { CalendarCheck, Plus, AlertCircle, PlayCircle, Lock } from "lucide-react"
import { format } from "date-fns"
import { API_URL } from "@/lib/api"

export default function GestionesPage() {
  const [gestiones, setGestiones] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formError, setFormError] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    anio: new Date().getFullYear(),
    fecha_inicio: "",
    fecha_fin: ""
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      
      const res = await fetch(`${API_URL}/api/gestiones`, { headers })
      
      if (res.ok) {
        setGestiones(await res.json())
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
    
    if (!formData.anio || !formData.fecha_inicio || !formData.fecha_fin) {
      setFormError("Año y Fechas son obligatorios.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/gestiones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || "Error al crear gestión")
        return
      }

      setIsCreateOpen(false)
      fetchData()
    } catch (error) {
      setFormError("Error de conexión.")
    }
  }

  const handleChangeStatus = async (gestion: any, nuevoEstado: string) => {
    if (!confirm(`¿Está seguro de cambiar el estado de la gestión a: ${nuevoEstado.toUpperCase()}?`)) return
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/api/gestiones/${gestion.id_gestion}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          anio: gestion.anio,
          fecha_inicio: gestion.fecha_inicio,
          fecha_fin: gestion.fecha_fin,
          estado: nuevoEstado
        })
      })

      const data = await res.json()
      if (!res.ok) {
        alert(data.message)
      } else {
        fetchData()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getStatusBadge = (estado: string) => {
    switch(estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
      case 'activa': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 shadow-sm'
      case 'cerrada': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <CalendarCheck className="h-8 w-8 text-primary" />
            Gestión Académica
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure los años escolares y defina las fechas lectivas principales.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Aperturar Gestión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Gestión Temprana</DialogTitle>
              <DialogDescription>
                Planifique un año académico. La gestión nacerá en estado "Planificada".
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {formError}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label>Año de Gestión *</Label>
                <Input 
                  type="number"
                  min="2000"
                  max="2050"
                  value={formData.anio}
                  onChange={(e) => setFormData({...formData, anio: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha Oficial Inicial *</Label>
                  <Input 
                    type="date"
                    value={formData.fecha_inicio}
                    onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fecha Oficial de Cierre *</Label>
                  <Input 
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type="submit">Planificar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="space-y-3 p-4 md:hidden">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Cargando gestiones...</div>
            ) : gestiones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No hay gestiones planificadas.</div>
            ) : (
              gestiones.map((g) => (
                <div key={g.id_gestion} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">{g.anio}</p>
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusBadge(g.estado)}`}>
                      {g.estado}
                    </div>
                  </div>
                  <p className="text-sm"><span className="font-medium">Inicio:</span> {new Date(g.fecha_inicio).toLocaleDateString()}</p>
                  <p className="text-sm"><span className="font-medium">Fin:</span> {new Date(g.fecha_fin).toLocaleDateString()}</p>
                  <div className="pt-2">
                    {g.estado === 'planificada' && (
                      <Button variant="outline" size="sm" onClick={() => handleChangeStatus(g, 'activa')} className="w-full">Iniciar</Button>
                    )}
                    {g.estado === 'activa' && (
                      <Button variant="outline" size="sm" onClick={() => handleChangeStatus(g, 'cerrada')} className="w-full">Clausurar</Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Año (Gestión)</TableHead>
                <TableHead>Fecha Inicio</TableHead>
                <TableHead>Fecha Fin</TableHead>
                <TableHead>Estado Actual</TableHead>
                <TableHead className="text-right">Control de Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Cargando gestiones...
                  </TableCell>
                </TableRow>
              ) : gestiones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No hay gestiones planificadas.
                  </TableCell>
                </TableRow>
              ) : (
                gestiones.map((g) => (
                  <TableRow key={g.id_gestion}>
                    <TableCell className="font-bold text-lg">{g.anio}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(g.fecha_inicio).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(g.fecha_fin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${getStatusBadge(g.estado)}`}>
                        {g.estado}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                       {g.estado === 'planificada' && (
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => handleChangeStatus(g, 'activa')}
                           className="text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-900/20"
                         >
                           <PlayCircle className="h-4 w-4 mr-2" />
                           Iniciar
                         </Button>
                       )}
                       {g.estado === 'activa' && (
                         <Button 
                           variant="outline" 
                           size="sm" 
                           onClick={() => handleChangeStatus(g, 'cerrada')}
                           className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                         >
                           <Lock className="h-4 w-4 mr-2" />
                           Clausurar
                         </Button>
                       )}
                       {g.estado === 'cerrada' && (
                         <span className="text-sm text-muted-foreground italic">Histórico</span>
                       )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
