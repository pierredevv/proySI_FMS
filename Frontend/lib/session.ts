/** Claves de sesión en el navegador (token JWT del backend /api/auth/login). */
export const AUTH_TOKEN_KEY = "auth_token"
export const USER_NAME_KEY = "userName"
export const USER_ROLE_KEY = "userRole"

export function clearClientSession() {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(USER_NAME_KEY)
  localStorage.removeItem(USER_ROLE_KEY)
}
