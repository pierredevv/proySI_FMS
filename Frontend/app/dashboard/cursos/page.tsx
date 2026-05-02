"use client"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Pencil, Trash2, Copy, Search } from "lucide-react"
import { cursosApi, type CursoDetalle, type FormularioCurso } from "@/lib/ciclo2Api"

const TURNOS = ["Mañana", "Tarde"]
const emptyForm = { id_gestion: 0, id_grado: 0, paralelo: "", turno: "", id_aula: 0, id_profesor: 0 }

export default function CursosPage() {
  const [cursos, setCursos] = useState<CursoDetalle[]>([])
  const [formulario, setFormulario] = useState<FormularioCurso | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showDialog, setShowDialog] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [cs, fm] = await Promise.all([cursosApi.getAll(), cursosApi.getFormulario()])
      setCursos(cs)
      setFormulario(fm)
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error al cargar") }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openNew = () => { setEditId(null); setForm({ ...emptyForm }); setShowDialog(true) }
  const openEdit = (c: CursoDetalle) => {
    setEditId(c.id_curso)
    setForm({ id_gestion: formulario?.gestion_activa?.id_gestion ?? 0, id_grado: 0, paralelo: c.paralelo, turno: c.turno, id_aula: 0, id_profesor: 0 })
    setShowDialog(true)
  }

  const handleSave = async () => {
    if (!form.id_gestion || !form.id_grado || !form.paralelo || !form.turno || !form.id_aula || !form.id_profesor) {
      return toast.error("Complete todos los campos obligatorios")
    }
    setSaving(true)
    try {
      editId ? await cursosApi.update(editId, form) : await cursosApi.create(form)
      toast.success(editId ? "Curso actualizado" : "Curso creado")
      setShowDialog(false); load()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error al guardar") }
    finally { setSaving(false) }
  }

  const handleDuplicate = async (id: number) => {
    try { const r = await cursosApi.duplicar(id); toast.success(r.message) }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error") }
  }
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este curso?")) return
    try { await cursosApi.delete(id); toast.success("Eliminado"); load() }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error") }
  }

  const gestActiva = formulario?.gestion_activa
  const filtered = cursos.filter(c => `${c.nombre_nivel} ${c.nombre_grado} ${c.paralelo}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cursos</h1>
          <p className="text-muted-foreground">Gestión {gestActiva?.anio ?? "—"}</p>
        </div>
        <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" />Nuevo Curso</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[["Total", cursos.length, ""], ["Turno Mañana", cursos.filter(c => c.turno === "Mañana").length, "text-blue-600"],
          ["Turno Tarde", cursos.filter(c => c.turno === "Tarde").length, "text-orange-500"]].map(([l, v, cls]) => (
          <Card key={String(l)}><CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className={`text-3xl font-bold ${cls}`}>{v}</p>
          </CardContent></Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Lista de Cursos</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." className="pl-9 w-60" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div className="py-12 text-center text-muted-foreground">Cargando...</div> : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nivel</TableHead><TableHead>Grado</TableHead><TableHead>Par.</TableHead>
                    <TableHead>Turno</TableHead><TableHead>Profesor</TableHead><TableHead>Cap.</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Sin cursos</TableCell></TableRow>
                  ) : filtered.map(c => (
                    <TableRow key={c.id_curso}>
                      <TableCell><Badge variant="secondary">{c.nombre_nivel}</Badge></TableCell>
                      <TableCell className="font-medium">{c.nombre_grado}</TableCell>
                      <TableCell>{c.paralelo}</TableCell>
                      <TableCell><Badge variant="outline" className={c.turno === "Mañana" ? "text-blue-600" : "text-orange-500"}>{c.turno}</Badge></TableCell>
                      <TableCell className="text-sm">{c.profesor_titular ?? c.profesor_nombre ?? "—"}</TableCell>
                      <TableCell className="text-sm">{c.total_estudiantes ?? 0}/{c.capacidad_estudiantes ?? c.capacidad ?? "—"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(c)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(c.id_curso)}><Copy className="h-4 w-4 mr-2" />Duplicar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(c.id_curso)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Eliminar</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Editar Curso" : "Nuevo Curso"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Gestión</Label>
              <Select value={String(form.id_gestion)} onValueChange={v => setForm(f => ({ ...f, id_gestion: +v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar gestión" /></SelectTrigger>
                <SelectContent>
                  {formulario?.gestion_activa ? (
                    <SelectItem value={String(formulario.gestion_activa.id_gestion)}>
                      {formulario.gestion_activa.anio} ✓ Activa
                    </SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Grado</Label>
                <Select value={String(form.id_grado)} onValueChange={v => setForm(f => ({ ...f, id_grado: +v }))}>
                  <SelectTrigger><SelectValue placeholder="Grado" /></SelectTrigger>
                  <SelectContent>{formulario?.grados.map(g => <SelectItem key={g.id_grado} value={String(g.id_grado)}>{g.nombre_grado}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Paralelo</Label>
                <Input placeholder="A, B..." value={form.paralelo} onChange={e => setForm(f => ({ ...f, paralelo: e.target.value.toUpperCase() }))} maxLength={3} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Turno</Label>
                <Select value={form.turno} onValueChange={v => setForm(f => ({ ...f, turno: v }))}>
                  <SelectTrigger><SelectValue placeholder="Turno" /></SelectTrigger>
                  <SelectContent>{TURNOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Aula</Label>
                <Select value={String(form.id_aula)} onValueChange={v => setForm(f => ({ ...f, id_aula: +v }))}>
                  <SelectTrigger><SelectValue placeholder="Aula" /></SelectTrigger>
                  <SelectContent>{formulario?.aulas.map(a => <SelectItem key={a.id_aula} value={String(a.id_aula)}>{a.numero_aula} ({a.capacidad_estudiantes}) {a.estado === 'ocupado' ? '🔴' : '🟢'}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label>Profesor Titular</Label>
              <Select value={String(form.id_profesor)} onValueChange={v => setForm(f => ({ ...f, id_profesor: +v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar profesor" /></SelectTrigger>
                <SelectContent>{formulario?.profesores.map(p => <SelectItem key={p.id_profesor} value={String(p.id_profesor)}>{p.nombre} {p.apellido}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
