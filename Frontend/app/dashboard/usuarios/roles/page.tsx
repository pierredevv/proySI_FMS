"use client"

import { ROL_CATALOG, ROL_DESCRIPCIONES } from "@/lib/roles"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck } from "lucide-react"

export default function RolesYPermisosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-7 w-7 text-primary" />
          Roles y permisos
        </h1>
        <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
          Resumen de los roles reconocidos por la aplicación al crear o editar usuarios. Los permisos
          efectivos dependen también de la configuración del servidor.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ROL_CATALOG.map((r) => (
          <Card key={r.id_rol} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{r.nombre}</CardTitle>
                <Badge variant="outline">ID {r.id_rol}</Badge>
              </div>
              <CardDescription>{ROL_DESCRIPCIONES[r.id_rol] ?? "Sin descripción."}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Asigne este rol desde{" "}
              <span className="font-medium text-foreground">Gestión de usuarios</span> al dar de alta
              o modificar cuentas.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
