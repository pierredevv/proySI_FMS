"use client"
import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, MoreHorizontal, Search, Pencil, Link2Off, Link2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { tutoresApi, estudiantesApi, type Tutor, type Estudiante } from "@/lib/ciclo2Api"

const PARENTESCOS = ["Madre", "Padre", "Abuelo/a", "Tío/a", "Apoderado", "Otro"]
const GENEROS = ["Masculino", "Femenino"]
const emptyTutor = { nombre: "", apellido: "", ci: "", genero: "", telefono: "", correo_electronico: "", direccion: "" }

export default function TutoresPage() {
  const [tutores, setTutores] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQ, setSearchQ] = useState("")
  const [showTutorDialog, setShowTutorDialog] = useState(false)
  const [showVincDialog, setShowVincDialog] = useState(false)
  const [editTutor, setEditTutor] = useState<Tutor | null>(null)
  const [form, setForm] = useState({ ...emptyTutor })
  const [vincForm, setVincForm] = useState({ id_estudiante: 0, id_tutor: 0, parentesco: "", autorizado_recoger: true, contacto_emergencia: false })
  const [studentSearch, setStudentSearch] = useState("")
  const [foundStudents, setFoundStudents] = useState<Estudiante[]>([])
  const [saving, setSaving] = useState(false)

  const search = useCallback(async () => {
    if (searchQ.length < 2) { setTutores([]); return }
    setLoading(true)
    try { setTutores(await tutoresApi.search(searchQ)) }
    catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error") }
    finally { setLoading(false) }
  }, [searchQ])

  useEffect(() => { const t = setTimeout(search, 300); return () => clearTimeout(t) }, [search])

  const searchStudents = async (q: string) => {
    setStudentSearch(q)
    if (q.length < 2) { setFoundStudents([]); return }
    const r = await estudiantesApi.getAll({ search: q })
    setFoundStudents(r)
  }

  const openNewTutor = () => { setEditTutor(null); setForm({ ...emptyTutor }); setShowTutorDialog(true) }
  const openEditTutor = (t: Tutor) => {
    setEditTutor(t)
    setForm({ nombre: t.nombre, apellido: t.apellido, ci: t.ci, genero: t.genero, telefono: t.telefono ?? "", correo_electronico: t.correo_electronico ?? "", direccion: t.direccion ?? "" })
    setShowTutorDialog(true)
  }

  const handleSaveTutor = async () => {
    if (!form.nombre || !form.apellido || !form.ci || !form.genero) return toast.error("Nombre, apellido, CI y género son obligatorios")
    setSaving(true)
    try {
      if (editTutor) {
        await tutoresApi.update(editTutor.id_tutor, form)
        toast.success("Tutor actualizado")
      } else {
        await tutoresApi.create(form)
        toast.success("Tutor registrado")
      }
      setShowTutorDialog(false); search()
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error") }
    finally { setSaving(false) }
  }

  const openVincular = (t: Tutor) => { setVincForm(f => ({ ...f, id_tutor: t.id_tutor, parentesco: "", id_estudiante: 0 })); setFoundStudents([]); setStudentSearch(""); setShowVincDialog(true) }
  const handleVincular = async () => {
    if (!vincForm.id_tutor || !vincForm.id_estudiante || !vincForm.parentesco) return toast.error("Complete todos los campos")
    setSaving(true)
    try {
      await tutoresApi.vincular(vincForm)
      toast.success("Tutor vinculado al estudiante")
      setShowVincDialog(false)
    } catch (e: unknown) { toast.error(e instanceof Error ? e.message : "Error") }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutores</h1>
          <p className="text-muted-foreground">Búsqueda en tiempo real — ingrese al menos 2 caracteres</p>
        </div>
        <Button onClick={openNewTutor} className="gap-2"><Plus className="h-4 w-4" />Nuevo Tutor</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por CI, nombre o teléfono..." className="pl-9" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <div className="py-8 text-center text-muted-foreground">Buscando...</div> : (
            tutores.length === 0 && searchQ.length >= 2 ? (
              <div className="py-8 text-center text-muted-foreground">No se encontraron tutores</div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tutor</TableHead><TableHead>CI</TableHead><TableHead>Teléfono</TableHead>
                      <TableHead>Correo</TableHead><TableHead className="w-12" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tutores.length === 0 ? (
                      <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Ingrese un término de búsqueda</TableCell></TableRow>
                    ) : tutores.map(t => (
                      <TableRow key={t.id_tutor}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">{t.nombre[0]}{t.apellido[0]}</AvatarFallback></Avatar>
                            <div>
                              <p className="font-medium">{t.nombre} {t.apellido}</p>
                              <p className="text-xs text-muted-foreground">{t.genero}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{t.ci}</TableCell>
                        <TableCell>{t.telefono ?? "—"}</TableCell>
                        <TableCell className="text-sm">{t.correo_electronico ?? "—"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditTutor(t)}><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openVincular(t)}><Link2 className="h-4 w-4 mr-2" />Vincular a estudiante</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Dialog tutor */}
      <Dialog open={showTutorDialog} onOpenChange={setShowTutorDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editTutor ? "Editar Tutor" : "Nuevo Tutor"}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Nombre *</Label><Input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Apellido *</Label><Input value={form.apellido} onChange={e => setForm(f => ({ ...f, apellido: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>CI *</Label><Input value={form.ci} onChange={e => setForm(f => ({ ...f, ci: e.target.value }))} /></div>
              <div className="space-y-1">
                <Label>Género *</Label>
                <Select value={form.genero} onValueChange={v => setForm(f => ({ ...f, genero: v }))}>
                  <SelectTrigger><SelectValue placeholder="Género" /></SelectTrigger>
                  <SelectContent>{GENEROS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Teléfono</Label><Input value={form.telefono} onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} /></div>
              <div className="space-y-1"><Label>Correo</Label><Input type="email" value={form.correo_electronico} onChange={e => setForm(f => ({ ...f, correo_electronico: e.target.value }))} /></div>
            </div>
            <div className="space-y-1"><Label>Dirección</Label><Input value={form.direccion} onChange={e => setForm(f => ({ ...f, direccion: e.target.value }))} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTutorDialog(false)}>Cancelar</Button>
            <Button onClick={handleSaveTutor} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog vincular */}
      <Dialog open={showVincDialog} onOpenChange={setShowVincDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Vincular Tutor a Estudiante</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Buscar estudiante</Label>
              <Input placeholder="Nombre o CI..." value={studentSearch} onChange={e => searchStudents(e.target.value)} />
            </div>
            {foundStudents.length > 0 && (
              <Select value={String(vincForm.id_estudiante)} onValueChange={v => setVincForm(f => ({ ...f, id_estudiante: +v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar estudiante" /></SelectTrigger>
                <SelectContent>{foundStudents.map(e => <SelectItem key={e.id_estudiante} value={String(e.id_estudiante)}>{e.nombre} {e.apellido} — {e.ci ?? "sin CI"}</SelectItem>)}</SelectContent>
              </Select>
            )}
            <div className="space-y-1">
              <Label>Parentesco</Label>
              <Select value={vincForm.parentesco} onValueChange={v => setVincForm(f => ({ ...f, parentesco: v }))}>
                <SelectTrigger><SelectValue placeholder="Parentesco" /></SelectTrigger>
                <SelectContent>{PARENTESCOS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox id="autorizado" checked={vincForm.autorizado_recoger} onCheckedChange={v => setVincForm(f => ({ ...f, autorizado_recoger: !!v }))} />
                <Label htmlFor="autorizado">Autorizado para recoger</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="emergencia" checked={vincForm.contacto_emergencia} onCheckedChange={v => setVincForm(f => ({ ...f, contacto_emergencia: !!v }))} />
                <Label htmlFor="emergencia">Contacto de emergencia</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVincDialog(false)}>Cancelar</Button>
            <Button onClick={handleVincular} disabled={saving}>{saving ? "Vinculando..." : "Vincular"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
