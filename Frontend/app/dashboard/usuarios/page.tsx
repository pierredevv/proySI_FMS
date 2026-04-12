"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import {
  apiCreateUser,
  apiDeleteUser,
  apiGetUsers,
  apiUpdateUser,
  type ApiUser,
} from "@/lib/api"
import { ROL_CATALOG, etiquetaRol, rolExiste, type EstadoUsuario } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pencil, Plus, Search, Trash2, Users } from "lucide-react"

type FiltroRol = "todos" | string
type FiltroEstado = "todos" | EstadoUsuario

function normalizarUsuario(u: string) {
  return u.trim().toLowerCase()
}

export default function GestionUsuariosPage() {
  const [usuarios, setUsuarios] = useState<ApiUser[]>([])
  /** Estado (activo/inactivo): solo en cliente; el backend no expone este campo en el CRUD actual. */
  const [estadoMap, setEstadoMap] = useState<Record<number, EstadoUsuario>>({})

  const [cargando, setCargando] = useState(true)
  const [filtroRol, setFiltroRol] = useState<FiltroRol>("todos")
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>("todos")
  const [busqueda, setBusqueda] = useState("")

  const [dialogoNuevo, setDialogoNuevo] = useState(false)
  const [formUsuario, setFormUsuario] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formRol, setFormRol] = useState<string>("")
  const [formEstado, setFormEstado] = useState<EstadoUsuario>("activo")
  const [guardando, setGuardando] = useState(false)

  const [editarId, setEditarId] = useState<number | null>(null)
  const [editUsuario, setEditUsuario] = useState("")
  const [editRol, setEditRol] = useState<string>("")
  const [editEstado, setEditEstado] = useState<EstadoUsuario>("activo")
  const [guardandoEdicion, setGuardandoEdicion] = useState(false)

  const [borrarId, setBorrarId] = useState<number | null>(null)
  const [borrando, setBorrando] = useState(false)

  const cargarLista = useCallback(async () => {
    setCargando(true)
    try {
      const lista = await apiGetUsers()
      setUsuarios(lista)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cargar la lista")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarLista()
  }, [cargarLista])

  const filas = useMemo(() => {
    return usuarios.map((u) => {
      const estado: EstadoUsuario = estadoMap[u.id_usuario] ?? "activo"
      return { ...u, estado }
    })
  }, [usuarios, estadoMap])

  const filtrados = useMemo(() => {
    const q = normalizarUsuario(busqueda)
    return filas.filter((row) => {
      if (filtroRol !== "todos" && String(row.id_rol) !== filtroRol) return false
      if (filtroEstado !== "todos" && row.estado !== filtroEstado) return false
      if (q && !normalizarUsuario(row.username).includes(q)) return false
      return true
    })
  }, [filas, filtroRol, filtroEstado, busqueda])

  const abrirNuevo = () => {
    setFormUsuario("")
    setFormPassword("")
    setFormRol("")
    setFormEstado("activo")
    setDialogoNuevo(true)
  }

  const guardarNuevo = async () => {
    const username = formUsuario.trim()
    const password = formPassword
    const id_rol = Number(formRol)

    if (!username || !password) {
      toast.error("Complete usuario y contraseña")
      return
    }
    if (!Number.isFinite(id_rol) || !rolExiste(id_rol)) {
      toast.error("Seleccione un rol válido")
      return
    }

    const duplicado = usuarios.some(
      (u) => normalizarUsuario(u.username) === normalizarUsuario(username)
    )
    if (duplicado) {
      toast.error("El nombre de usuario ya está en uso")
      return
    }

    setGuardando(true)
    try {
      const res = await apiCreateUser({ username, password, id_rol })
      const nuevoId = res.user?.id_usuario
      if (nuevoId != null) {
        setEstadoMap((prev) => ({ ...prev, [nuevoId]: formEstado }))
      }
      toast.success("Usuario creado correctamente")
      setDialogoNuevo(false)
      await cargarLista()
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Error al crear"
      if (/unique|duplicate|ya existe|violates unique/i.test(msg)) {
        toast.error("El nombre de usuario ya está en uso")
      } else {
        toast.error(msg)
      }
    } finally {
      setGuardando(false)
    }
  }

  const abrirEditar = (u: ApiUser) => {
    setEditarId(u.id_usuario)
    setEditUsuario(u.username)
    setEditRol(String(u.id_rol))
    setEditEstado(estadoMap[u.id_usuario] ?? "activo")
  }

  const guardarEdicion = async () => {
    if (editarId == null) return
    const username = editUsuario.trim()
    const id_rol = Number(editRol)
    if (!username) {
      toast.error("El usuario no puede estar vacío")
      return
    }
    if (!Number.isFinite(id_rol) || !rolExiste(id_rol)) {
      toast.error("Seleccione un rol válido")
      return
    }

    setGuardandoEdicion(true)
    try {
      await apiUpdateUser(editarId, { username, id_rol })
      setEstadoMap((prev) => ({ ...prev, [editarId]: editEstado }))
      toast.success("Usuario actualizado")
      setEditarId(null)
      await cargarLista()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al actualizar")
    } finally {
      setGuardandoEdicion(false)
    }
  }

  const confirmarBorrar = async () => {
    if (borrarId == null) return
    setBorrando(true)
    try {
      await apiDeleteUser(borrarId)
      setEstadoMap((prev) => {
        const next = { ...prev }
        delete next[borrarId]
        return next
      })
      toast.success("Usuario eliminado")
      setBorrarId(null)
      await cargarLista()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al eliminar")
    } finally {
      setBorrando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Gestión de usuarios
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Administre cuentas de acceso: creación segura de contraseñas (hash en servidor), asignación
            de rol y baja de usuarios. El estado activo/inactivo es una referencia visual en esta
            pantalla hasta que el API incorpore ese campo.
          </p>
        </div>
        <Button onClick={abrirNuevo} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Usuarios</CardTitle>
          <CardDescription>
            Busque por nombre de usuario y combine filtros. Las acciones piden confirmación al
            eliminar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="space-y-1.5 flex-1 min-w-[200px] max-w-md">
              <Label htmlFor="busq-usuarios">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="busq-usuarios"
                  placeholder="Nombre de usuario…"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-9"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="space-y-1.5 min-w-[180px]">
              <Label>Rol</Label>
              <Select value={filtroRol} onValueChange={(v) => setFiltroRol(v as FiltroRol)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los roles</SelectItem>
                  {ROL_CATALOG.map((r) => (
                    <SelectItem key={r.id_rol} value={String(r.id_rol)}>
                      {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 min-w-[180px]">
              <Label>Estado</Label>
              <Select value={filtroEstado} onValueChange={(v) => setFiltroEstado(v as FiltroEstado)}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Registro</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargando ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-20 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filtrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      No hay usuarios con los filtros seleccionados.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtrados.map((row) => (
                    <TableRow key={row.id_usuario}>
                      <TableCell className="font-medium">{row.username}</TableCell>
                      <TableCell>{etiquetaRol(row.id_rol)}</TableCell>
                      <TableCell>
                        <Badge variant={row.estado === "activo" ? "default" : "secondary"}>
                          {row.estado === "activo" ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {row.fecha_creacion
                          ? format(new Date(row.fecha_creacion), "dd MMM yyyy HH:mm", { locale: es })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => abrirEditar(row)}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => setBorrarId(row.id_usuario)}
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogoNuevo} onOpenChange={setDialogoNuevo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo usuario</DialogTitle>
            <DialogDescription>
              Elija un nombre de usuario único y una contraseña robusta. El rol define el alcance en
              el sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nu-user">Usuario</Label>
              <Input
                id="nu-user"
                autoComplete="username"
                value={formUsuario}
                onChange={(e) => setFormUsuario(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nu-pass">Contraseña</Label>
              <Input
                id="nu-pass"
                type="password"
                autoComplete="new-password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={formRol || undefined} onValueChange={setFormRol}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROL_CATALOG.map((r) => (
                    <SelectItem key={r.id_rol} value={String(r.id_rol)}>
                      {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={formEstado}
                onValueChange={(v) => setFormEstado(v as EstadoUsuario)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogoNuevo(false)} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={guardarNuevo} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editarId != null} onOpenChange={(o) => !o && setEditarId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar usuario</DialogTitle>
            <DialogDescription>
              Modifique el nombre de inicio de sesión o el rol. El indicador de estado es local a
              esta vista.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="ed-user">Usuario</Label>
              <Input
                id="ed-user"
                value={editUsuario}
                onChange={(e) => setEditUsuario(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Select value={editRol || undefined} onValueChange={setEditRol}>
                <SelectTrigger>
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  {ROL_CATALOG.map((r) => (
                    <SelectItem key={r.id_rol} value={String(r.id_rol)}>
                      {r.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={editEstado}
                onValueChange={(v) => setEditEstado(v as EstadoUsuario)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditarId(null)} disabled={guardandoEdicion}>
              Cancelar
            </Button>
            <Button onClick={guardarEdicion} disabled={guardandoEdicion}>
              {guardandoEdicion ? "Guardando…" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={borrarId != null} onOpenChange={(o) => !o && setBorrarId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Se eliminará la cuenta de forma permanente en el servidor. Esta acción no se puede
              deshacer desde la aplicación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={borrando}>Cancelar</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={borrando}
              onClick={() => void confirmarBorrar()}
            >
              {borrando ? "Eliminando…" : "Eliminar"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
