"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiGetGrados } from "@/lib/api"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"

const PALETTE = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-3)",
]

const EJEMPLO = [
  { name: "Pre-Kinder", value: 45, color: "var(--chart-1)" },
  { name: "Kinder", value: 62, color: "var(--chart-2)" },
  { name: "Primaria", value: 180, color: "var(--chart-4)" },
]

type Slice = { name: string; value: number; color: string }

export function StudentsByLevel() {
  const [data, setData] = useState<Slice[]>(EJEMPLO)
  const [titulo, setTitulo] = useState("Estudiantes por nivel")
  const [pieLabel, setPieLabel] = useState("Total (vista ejemplo)")

  useEffect(() => {
    let cancelled = false
    void apiGetGrados()
      .then((grados) => {
        if (cancelled) return
        const map = new Map<string, number>()
        for (const g of grados) {
          const nivel = g.nombre_nivel?.trim() || "Sin nivel"
          map.set(nivel, (map.get(nivel) ?? 0) + 1)
        }
        if (map.size === 0) return
        const pie: Slice[] = [...map.entries()].map(([name, value], i) => ({
          name,
          value,
          color: PALETTE[i % PALETTE.length],
        }))
        setData(pie)
        setTitulo("Grados por nivel")
        setPieLabel("Total de grados")
      })
      .catch(() => {
        if (cancelled) return
        setData(EJEMPLO)
        setTitulo("Estudiantes por nivel")
        setPieLabel("Total de estudiantes (ejemplo)")
      })
    return () => {
      cancelled = true
    }
  }, [])

  const total = useMemo(() => data.reduce((acc, item) => acc + item.value, 0), [data])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{titulo}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--border)" strokeWidth={1} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => {
                  const suffix = titulo.includes("Grados") ? "grados" : "estudiantes"
                  return [`${value} ${suffix}`, ""]
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "12px", color: "var(--muted-foreground)" }}
                formatter={(value) => {
                  const item = data.find((d) => d.name === value)
                  return `${value} (${item?.value ?? 0})`
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-center">
          <p className="text-2xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">{pieLabel}</p>
        </div>
      </CardContent>
    </Card>
  )
}
