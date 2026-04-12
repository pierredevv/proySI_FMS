"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { apiGetUsers, type ApiUser } from "@/lib/api"
import { ID_ROL_PROFESOR } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { GraduationCap, UserCog } from "lucide-react"

export default function ProfesoresPage() {
  const [usuarios, setUsuarios] = useState<ApiUser[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = useCallback(async () => {
    setCargando(true)
    try {
      const lista = await apiGetUsers()
      setUsuarios(lista.filter((u) => u.id_rol === ID_ROL_PROFESOR))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "No se pudo cargar el personal")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    void cargar()
  }, [cargar])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            Profesores
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Cuentas con rol de profesor. Para altas, bajas o cambio de rol use la gestión general de
            usuarios.
          </p>
        </div>
        <Button asChild variant="outline" className="shrink-0">
          <Link href="/dashboard/usuarios">
            <UserCog className="h-4 w-4 mr-2" />
            Ir a gestión de usuarios
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Listado</CardTitle>
          <CardDescription>
            {cargando ? "Cargando…" : `${usuarios.length} profesor(es) registrados.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cargando ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-10">
                      Cargando…
                    </TableCell>
                  </TableRow>
                ) : usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-10">
                      No hay usuarios con rol de profesor. Créelos en gestión de usuarios.
                    </TableCell>
                  </TableRow>
                ) : (
                  usuarios.map((u) => (
                    <TableRow key={u.id_usuario}>
                      <TableCell className="font-medium">{u.username}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.fecha_creacion
                          ? format(new Date(u.fecha_creacion), "dd MMM yyyy HH:mm", { locale: es })
                          : "—"}
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
