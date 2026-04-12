/**
 * Cliente HTTP hacia el backend Express (/api/auth, /api/users, /api/gestiones, …).
 *
 * - Si existe NEXT_PUBLIC_API_URL → se llama directo a ese host (CORS debe permitirlo en Express).
 * - Si no → se usa la misma URL que el front (p. ej. /api/...) y Next reenvía al backend (ver next.config.mjs `rewrites`).
 */
function getRequestBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (raw) return raw.replace(/\/$/, "")
  return ""
}

function apiUrl(path: string): string {
  const base = getRequestBase()
  const p = path.startsWith("/") ? path : `/${path}`
  if (base) return `${base}${p}`
  return p
}

export type ApiUser = {
  id_usuario: number
  username: string
  id_rol: number
  fecha_creacion?: string
}

async function parseJson(res: Response) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as Record<string, unknown>
  } catch {
    return {
      message:
        text.length > 200
          ? `${res.status} ${res.statusText}`.trim() || "Respuesta no válida del servidor"
          : text,
    }
  }
}

export async function apiLogin(username: string, password: string) {
  const res = await fetch(apiUrl("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    const hint =
      res.status === 500 && !process.env.NEXT_PUBLIC_API_URL
        ? " Comprueba que el Express esté arriba y que BACKEND_INTERNAL_URL en .env.local apunte a su puerto."
        : ""
    throw new Error(String(data.message ?? `Error al iniciar sesión (${res.status})`) + hint)
  }
  return data as { message: string; token: string; role: number }
}

export async function apiLogout() {
  await fetch(apiUrl("/api/auth/logout"), { method: "POST" }).catch(() => {})
}

export async function apiGetUsers(): Promise<ApiUser[]> {
  const res = await fetch(apiUrl("/api/users"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener usuarios"))
  }
  return data as unknown as ApiUser[]
}

export async function apiCreateUser(body: {
  username: string
  password: string
  id_rol: number
}) {
  const res = await fetch(apiUrl("/api/users"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? data.error ?? "Error al crear usuario"))
  }
  return data as { message: string; user: ApiUser }
}

export async function apiUpdateUser(
  id: number,
  body: { username: string; id_rol: number }
) {
  const res = await fetch(apiUrl(`/api/users/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al actualizar usuario"))
  }
  return data as ApiUser
}

export async function apiDeleteUser(id: number) {
  const res = await fetch(apiUrl(`/api/users/${id}`), { method: "DELETE" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al eliminar usuario"))
  }
  return data as { message: string }
}

/** Base usada para las peticiones (vacío = mismo origen + proxy en Next). */
export const API_BASE = getRequestBase()

/* ——— Gestión académica ——— */

export type ApiGestionAcademica = {
  id_gestion: number
  anio: number
  fecha_inicio: string
  fecha_fin: string
  estado: string
}

export async function apiGetGestiones(): Promise<ApiGestionAcademica[]> {
  const res = await fetch(apiUrl("/api/gestiones"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener gestiones"))
  }
  return data as unknown as ApiGestionAcademica[]
}

export async function apiCreateGestion(body: {
  anio: number
  fecha_inicio: string
  fecha_fin: string
  estado?: string
}) {
  const res = await fetch(apiUrl("/api/gestiones"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? data.error ?? "Error al crear gestión"))
  }
  return data as { message: string; gestion: ApiGestionAcademica }
}

export async function apiUpdateGestion(
  id: number,
  body: { anio: number; fecha_inicio: string; fecha_fin: string; estado: string }
) {
  const res = await fetch(apiUrl(`/api/gestiones/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al actualizar gestión"))
  }
  return data as { message: string; gestion: ApiGestionAcademica }
}

/* ——— Estructura (aulas, niveles, grados) ——— */

export type ApiAula = {
  id_aula?: number
  numero_aula: string
  descripcion?: string | null
  cantidad_mesas?: number | null
  cantidad_sillas?: number | null
  capacidad_estudiantes?: number | null
}

export type ApiNivel = {
  id_nivel: number
  nombre_nivel: string
}

export type ApiGrado = {
  id_grado: number
  nombre_grado: string
  nombre_nivel: string
  id_nivel: number
}

export async function apiGetAulas(): Promise<ApiAula[]> {
  const res = await fetch(apiUrl("/api/estructura/aulas"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener aulas"))
  }
  return data as unknown as ApiAula[]
}

export async function apiCreateAula(body: {
  numero_aula: string
  descripcion?: string | null
  cantidad_mesas?: number
  cantidad_sillas?: number
  capacidad_estudiantes?: number
}) {
  const res = await fetch(apiUrl("/api/estructura/aulas"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al crear aula"))
  }
  return data as ApiAula
}

export async function apiGetNiveles(): Promise<ApiNivel[]> {
  const res = await fetch(apiUrl("/api/estructura/niveles"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener niveles"))
  }
  return data as unknown as ApiNivel[]
}

export async function apiGetGrados(): Promise<ApiGrado[]> {
  const res = await fetch(apiUrl("/api/estructura/grados"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener grados"))
  }
  return data as unknown as ApiGrado[]
}

/* ——— Materias ——— */

export type ApiCampoSaber = {
  id_campo: number
  nombre_campo: string
  orden_visualizacion?: number
}

export type ApiMateria = {
  id_materia: number
  nombre_materia: string
  descripcion?: string | null
  nombre_campo: string
  aplica_primaria: boolean
  estado: string
}

export async function apiGetCamposSaber(): Promise<ApiCampoSaber[]> {
  const res = await fetch(apiUrl("/api/materias/campos"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener campos del saber"))
  }
  return data as unknown as ApiCampoSaber[]
}

export async function apiGetMaterias(): Promise<ApiMateria[]> {
  const res = await fetch(apiUrl("/api/materias"), { cache: "no-store" })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al obtener materias"))
  }
  return data as unknown as ApiMateria[]
}

export async function apiCreateMateria(body: {
  nombre_materia: string
  descripcion?: string
  id_campo: number
  aplica_primaria: boolean
  estado: string
}) {
  const res = await fetch(apiUrl("/api/materias"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  const data = await parseJson(res)
  if (!res.ok) {
    throw new Error(String(data.message ?? "Error al crear materia"))
  }
  return data as ApiMateria
}
