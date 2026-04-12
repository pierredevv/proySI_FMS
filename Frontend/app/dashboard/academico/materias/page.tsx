"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  apiCreateMateria,
  apiGetCamposSaber,
  apiGetMaterias,
  type ApiCampoSaber,
  type ApiMateria,
} from "@/lib/api"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus } from "lucide-react"

export default function MateriasCatalogoPage() {
  const [materias, setMaterias] = useState<ApiMateria[]>([])
  const [campos, setCampos] = useState<ApiCampoSaber[]>([])
  const [cargando, setCargando] = useState(true)

  const [dialogo, setDialogo] = useState(false)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [idCampo, setIdCampo] = useState<string>("")
  const [primaria, setPrimaria] = useState(false)
  const [estadoMat, setEstadoMat] = useState("activa")
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const [m, c] = await Promise.all([apiGetMaterias(), apiGetCamposSaber()])
      setMaterias(m)
      setCampos(c)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Error al cargar catálogo")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const abrirNuevo = () => {
    setNombre("")
    setDescripcion("")
    setIdCampo(campos[0] ? String(campos[0].id_campo) : "")
    setPrimaria(false)
    setEstadoMat("activa")
    setDialogo(true)
  }

  const guardar = async () => {
    const id_campo = Number(idCampo)
    if (!nombre.trim()) {
      toast.error("Indique el nombre de la materia")
      return
    }
    if (!Number.isFinite(id_campo)) {
      toast.error("Seleccione un campo del saber")
      return
    }

    setGuardando(true)
    try {
      await apiCreateMateria({
        nombre_materia: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        id_campo,
        aplica_primaria: primaria,
        estado: estadoMat,
      })
      toast.success("Materia registrada")
      setDialogo(false)
      await cargar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo crear")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Catálogo de materias
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Materias oficiales por campo del saber. Este listado se sincroniza con la base de datos
            del backend.
          </p>
        </div>
        <Button onClick={abrirNuevo} className="shrink-0" disabled={campos.length === 0 && !cargando}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva materia
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Materias registradas</CardTitle>
          <CardDescription>
            Incluye campo del saber, si aplica a primaria y el estado administrativo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Campo</TableHead>
                  <TableHead>Primaria</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                      Cargando…
                    </TableCell>
                  </TableRow>
                ) : materias.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                      No hay materias. Agregue la primera o verifique la conexión con el API.
                    </TableCell>
                  </TableRow>
                ) : (
                  materias.map((m) => (
                    <TableRow key={m.id_materia}>
                      <TableCell className="font-medium max-w-[220px]">
                        <span className="line-clamp-2">{m.nombre_materia}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{m.nombre_campo}</TableCell>
                      <TableCell>
                        <Badge variant={m.aplica_primaria ? "default" : "outline"}>
                          {m.aplica_primaria ? "Sí" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {m.estado}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogo} onOpenChange={setDialogo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva materia</DialogTitle>
            <DialogDescription>
              Complete los datos. El nombre debe ser claro para secretaría y profesores.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="mat-nom">Nombre</Label>
              <Input id="mat-nom" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-desc">Descripción (opcional)</Label>
              <Textarea
                id="mat-desc"
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Campo del saber</Label>
              <Select value={idCampo || undefined} onValueChange={setIdCampo}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  {campos.map((c) => (
                    <SelectItem key={c.id_campo} value={String(c.id_campo)}>
                      {c.nombre_campo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="mat-prim"
                checked={primaria}
                onCheckedChange={(v) => setPrimaria(v === true)}
              />
              <Label htmlFor="mat-prim" className="text-sm font-normal cursor-pointer">
                Aplica a primaria
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estadoMat} onValueChange={setEstadoMat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogo(false)} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={() => void guardar()} disabled={guardando}>
              {guardando ? "Guardando…" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
