/** Claves de sesión en el navegador (token JWT del backend /api/auth/login). */
export const AUTH_TOKEN_KEY = "auth_token"
export const USER_NAME_KEY = "userName"
export const USER_ROLE_KEY = "userRole"

const SESSION_KEYS = [AUTH_TOKEN_KEY, USER_NAME_KEY, USER_ROLE_KEY] as const

/**
 * La sesión vive en `sessionStorage`: al cerrar la pestaña o la ventana del navegador,
 * el almacenamiento de esa sesión se elimina y el usuario queda desconectado.
 * (Recargar la página en la misma pestaña mantiene la sesión.)
 */
export function persistClientSession(payload: {
  token: string
  username: string
  role: number | string
}) {
  if (typeof window === "undefined") return
  sessionStorage.setItem(AUTH_TOKEN_KEY, payload.token)
  sessionStorage.setItem(USER_NAME_KEY, payload.username)
  sessionStorage.setItem(USER_ROLE_KEY, String(payload.role))
  for (const k of SESSION_KEYS) {
    localStorage.removeItem(k)
  }
}

export function clearClientSession() {
  if (typeof window === "undefined") return
  for (const k of SESSION_KEYS) {
    sessionStorage.removeItem(k)
    localStorage.removeItem(k)
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function getUserName(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(USER_NAME_KEY)
}

export function getUserRole(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(USER_ROLE_KEY)
}

/**
 * Migra una sesión antigua guardada solo en `localStorage` a `sessionStorage`
 * y borra las claves en `localStorage`, para alinear el comportamiento con
 * "cerrar ventana = cerrar sesión" sin obligar a todos a volver a iniciar sesión
 * en el mismo instante del despliegue.
 */
export function migrateSessionFromLocalStorageIfNeeded() {
  if (typeof window === "undefined") return
  if (sessionStorage.getItem(AUTH_TOKEN_KEY)) return
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (!token) return
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
  sessionStorage.setItem(USER_NAME_KEY, localStorage.getItem(USER_NAME_KEY) ?? "")
  sessionStorage.setItem(USER_ROLE_KEY, localStorage.getItem(USER_ROLE_KEY) ?? "")
  for (const k of SESSION_KEYS) {
    localStorage.removeItem(k)
  }
}
