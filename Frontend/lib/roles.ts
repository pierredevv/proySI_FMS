/**
 * Catálogo de roles permitidos en formularios (validación "rol existe").
 * Los id_rol deben coincidir con la tabla `rol` en PostgreSQL.
 */
export const ID_ROL_PROFESOR = 3

export const ROL_CATALOG = [
  { id_rol: 1, nombre: "Superusuario" },
  { id_rol: 2, nombre: "Director" },
  { id_rol: 3, nombre: "Profesor" },
  { id_rol: 4, nombre: "Administrativo" },
] as const

export type EstadoUsuario = "activo" | "inactivo"

export function rolExiste(id_rol: number): boolean {
  return ROL_CATALOG.some((r) => r.id_rol === id_rol)
}

/** Texto orientativo para la pantalla de roles (no sustituye políticas en servidor). */
export const ROL_DESCRIPCIONES: Record<number, string> = {
  1: "Configuración global, usuarios y respaldo del sistema.",
  2: "Dirección académica y administrativa de la unidad educativa.",
  3: "Planificación de clases, calificaciones y seguimiento de aulas asignadas.",
  4: "Secretaría, matrículas, pagos e inventario operativo.",
}

export function etiquetaRol(id_rol: number): string {
  const r = ROL_CATALOG.find((x) => x.id_rol === id_rol)
  if (r) return r.nombre
  if (id_rol === 5) return "Rol descontinuado"
  return `Rol ${id_rol}`
}
