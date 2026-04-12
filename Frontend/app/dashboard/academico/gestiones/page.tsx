"use client"

import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import {
  apiCreateGestion,
  apiGetGestiones,
  apiUpdateGestion,
  type ApiGestionAcademica,
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
import { CalendarRange, Pencil, Plus } from "lucide-react"

const ESTADOS = ["planificada", "activa", "cerrada"] as const

export default function GestionesAcademicasPage() {
  const [lista, setLista] = useState<ApiGestionAcademica[]>([])
  const [cargando, setCargando] = useState(true)

  const [dialogo, setDialogo] = useState<"nuevo" | "editar" | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [anio, setAnio] = useState("")
  const [inicio, setInicio] = useState("")
  const [fin, setFin] = useState("")
  const [estado, setEstado] = useState<string>("planificada")
  const [guardando, setGuardando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const rows = await apiGetGestiones()
      setLista(rows)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudieron cargar las gestiones")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  const abrirNuevo = () => {
    setEditId(null)
    setAnio(String(new Date().getFullYear()))
    setInicio("")
    setFin("")
    setEstado("planificada")
    setDialogo("nuevo")
  }

  const abrirEditar = (g: ApiGestionAcademica) => {
    setEditId(g.id_gestion)
    setAnio(String(g.anio))
    setInicio(g.fecha_inicio?.slice(0, 10) ?? "")
    setFin(g.fecha_fin?.slice(0, 10) ?? "")
    setEstado(g.estado || "planificada")
    setDialogo("editar")
  }

  const guardar = async () => {
    const anioNum = Number(anio)
    if (!Number.isFinite(anioNum) || anioNum < 2000 || anioNum > 2100) {
      toast.error("Indique un año válido")
      return
    }
    if (!inicio || !fin) {
      toast.error("Complete las fechas de inicio y fin")
      return
    }

    setGuardando(true)
    try {
      if (dialogo === "nuevo") {
        await apiCreateGestion({
          anio: anioNum,
          fecha_inicio: inicio,
          fecha_fin: fin,
          estado,
        })
        toast.success("Gestión creada")
      } else if (dialogo === "editar" && editId != null) {
        await apiUpdateGestion(editId, {
          anio: anioNum,
          fecha_inicio: inicio,
          fecha_fin: fin,
          estado,
        })
        toast.success("Gestión actualizada")
      }
      setDialogo(null)
      await cargar()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo guardar")
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarRange className="h-7 w-7 text-primary" />
            Gestión académica
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Años lectivos y vigencias. Los datos provienen del servidor y alimentan el calendario
            escolar y reportes académicos.
          </p>
        </div>
        <Button onClick={abrirNuevo} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Nueva gestión
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Años lectivos</CardTitle>
          <CardDescription>
            Ordenados por año descendente. Use estados para reflejar planificación, curso en curso o
            cierre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Año</TableHead>
                  <TableHead>Inicio</TableHead>
                  <TableHead>Fin</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      Cargando…
                    </TableCell>
                  </TableRow>
                ) : lista.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                      No hay gestiones registradas. Cree la primera con el botón superior.
                    </TableCell>
                  </TableRow>
                ) : (
                  lista.map((g) => (
                    <TableRow key={g.id_gestion}>
                      <TableCell className="font-medium">{g.anio}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {g.fecha_inicio
                          ? format(new Date(g.fecha_inicio), "dd MMM yyyy", { locale: es })
                          : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {g.fecha_fin
                          ? format(new Date(g.fecha_fin), "dd MMM yyyy", { locale: es })
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {g.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar gestión"
                          onClick={() => abrirEditar(g)}
                        >
                          <Pencil className="h-4 w-4" />
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

      <Dialog open={dialogo != null} onOpenChange={(o) => !o && setDialogo(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogo === "nuevo" ? "Nueva gestión" : "Editar gestión"}</DialogTitle>
            <DialogDescription>
              Defina el año y el rango de fechas del período académico.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="g-anio">Año lectivo</Label>
              <Input
                id="g-anio"
                type="number"
                min={2000}
                max={2100}
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="g-ini">Inicio</Label>
                <Input id="g-ini" type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="g-fin">Fin</Label>
                <Input id="g-fin" type="date" value={fin} onChange={(e) => setFin(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogo(null)} disabled={guardando}>
              Cancelar
            </Button>
            <Button onClick={() => void guardar()} disabled={guardando}>
              {guardando ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
