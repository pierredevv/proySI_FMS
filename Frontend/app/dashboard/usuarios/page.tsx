"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { UserCog, Plus, MoreHorizontal, Edit, UserX, AlertCircle } from "lucide-react"
import { format } from "date-fns"

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [formError, setFormError] = useState("")

  // Form states
  const [formData, setFormData] = useState({
    id: 0,
    username: "",
    password: "",
    id_rol: "",
    estado: true
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      
      const resUsers = await fetch("http://localhost:5000/api/users", { headers })
      const resRoles = await fetch("http://localhost:5000/api/roles", { headers })
      
      if (resUsers.ok && resRoles.ok) {
        setUsuarios(await resUsers.json())
        setRoles(await resRoles.json())
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
    
    if (!formData.username || !formData.password || !formData.id_rol) {
      setFormError("Todos los campos marcados con * son obligatorios.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          id_rol: parseInt(formData.id_rol)
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || "Error al crear usuario")
        return
      }

      setIsCreateOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      setFormError("Error de conexión.")
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")
    
    if (!formData.username || !formData.id_rol) {
      setFormError("Username y Rol son obligatorios.")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          username: formData.username,
          id_rol: parseInt(formData.id_rol),
          estado: formData.estado
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setFormError(data.message || "Error al actualizar")
        return
      }

      setIsEditOpen(false)
      fetchData()
    } catch (error) {
      setFormError("Error de conexión.")
    }
  }

  const handleDeactivate = async (id: number) => {
    if (!confirm("¿Está seguro de desactivar este usuario?")) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(data.message)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({ id: 0, username: "", password: "", id_rol: "", estado: true })
    setFormError("")
  }

  const openEditModal = (user: any) => {
    setFormData({
      id: user.id_usuario,
      username: user.username,
      password: "", // Not editable here
      id_rol: user.id_rol.toString(),
      estado: user.estado
    })
    setFormError("")
    setIsEditOpen(true)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight inline-flex items-center gap-2">
            <UserCog className="h-8 w-8 text-primary" />
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-1">
            Administre los accesos al sistema, asigne roles y active/desactive cuentas.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={(open) => {
          setIsCreateOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="shrink-0 gap-2">
              <Plus className="h-4 w-4" /> Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Usuario</DialogTitle>
              <DialogDescription>
                Cree unas credenciales seguras para acceder al sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {formError}
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="username">Nombre de Usuario *</Label>
                <Input 
                  id="username" 
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="ej. perez_j"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input 
                  id="password" type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rol">Asignar Rol *</Label>
                <Select value={formData.id_rol} onValueChange={(v) => setFormData({...formData, id_rol: v})}>
                  <SelectTrigger id="rol">
                    <SelectValue placeholder="Seleccione un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.filter(r => r.estado).map(rol => (
                      <SelectItem key={rol.id_rol} value={rol.id_rol.toString()}>{rol.nombre_rol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>Modifique los datos de la cuenta o el rol asignado.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 pt-4">
              {formError && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {formError}
                </div>
              )}
            <div className="grid gap-2">
              <Label>Nombre de Usuario</Label>
              <Input 
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Rol del Sistema</Label>
              <Select value={formData.id_rol} onValueChange={(v) => setFormData({...formData, id_rol: v})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(rol => (
                    <SelectItem key={rol.id_rol} value={rol.id_rol.toString()}>{rol.nombre_rol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg mt-2">
              <div className="space-y-0.5">
                <Label>Activo en el Sistema</Label>
                <p className="text-xs text-muted-foreground">Desactivar impedirá que inicie sesión.</p>
              </div>
              <Switch checked={formData.estado} onCheckedChange={(c) => setFormData({...formData, estado: c})} />
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
              <Button type="submit">Actualizar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Usuario</TableHead>
                <TableHead>Rol Asignado</TableHead>
                <TableHead>Creación</TableHead>
                <TableHead>Último Acceso</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Cargando usuarios...
                  </TableCell>
                </TableRow>
              ) : usuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No hay usuarios registrados.
                  </TableCell>
                </TableRow>
              ) : (
                usuarios.map((usr) => (
                  <TableRow key={usr.id_usuario}>
                    <TableCell className="font-medium">{usr.username}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center px-2 py-1 rounded bg-secondary text-secondary-foreground text-xs font-semibold">
                        {usr.nombre_rol}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {usr.fecha_creacion ? format(new Date(usr.fecha_creacion), 'dd/MM/yyyy') : '-'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {usr.ultimo_acceso ? format(new Date(usr.ultimo_acceso), 'dd/MM HH:mm') : 'Nunca'}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${usr.estado ? 'border-green-200 text-green-700 bg-green-50 dark:bg-green-900/20' : 'border-red-200 text-red-700 bg-red-50 dark:bg-red-900/20'}`}>
                        {usr.estado ? 'Activo' : 'Inactivo'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {usr.id_rol !== 1 && ( // Impedir editar y eliminar a SuperUsuario para evitar fallas catastróficas
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(usr)}>
                              <Edit className="mr-2 h-4 w-4 text-blue-500" />
                              Editar Cuenta
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeactivate(usr.id_usuario)} className="text-destructive">
                              <UserX className="mr-2 h-4 w-4" />
                              Desactivar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
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
