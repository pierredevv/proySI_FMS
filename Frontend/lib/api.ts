/**
 * Cliente HTTP hacia el backend Express (/api/auth, /api/users).
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
