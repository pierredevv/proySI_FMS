"use client"

import { useEffect } from "react"
import { migrateSessionFromLocalStorageIfNeeded } from "@/lib/session"

/**
 * Ejecuta en el cliente la migración localStorage → sessionStorage (una vez por carga)
 * para que el cierre de pestaña/ventana borre la sesión automáticamente.
 */
export function SessionStorageBridge() {
  useEffect(() => {
    migrateSessionFromLocalStorageIfNeeded()
  }, [])
  return null
}
