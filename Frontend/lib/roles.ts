/**
 * Catálogo de roles permitidos en formularios (validación "rol existe").
 * Los id_rol deben coincidir con la tabla `rol` en PostgreSQL.
 */
export const ROL_CATALOG = [
  { id_rol: 1, nombre: "Superusuario" },
  { id_rol: 2, nombre: "Director" },
  { id_rol: 3, nombre: "Docente" },
  { id_rol: 4, nombre: "Administrativo" },
  { id_rol: 5, nombre: "Ayudante" },
] as const

export type EstadoUsuario = "activo" | "inactivo"

export function rolExiste(id_rol: number): boolean {
  return ROL_CATALOG.some((r) => r.id_rol === id_rol)
}

export function etiquetaRol(id_rol: number): string {
  const r = ROL_CATALOG.find((x) => x.id_rol === id_rol)
  return r?.nombre ?? `Rol ${id_rol}`
}
