"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { month: "Ene", pagados: 85, pendientes: 15 },
  { month: "Feb", pagados: 78, pendientes: 22 },
  { month: "Mar", pagados: 92, pendientes: 8 },
  { month: "Abr", pagados: 88, pendientes: 12 },
  { month: "May", pagados: 0, pendientes: 0 },
  { month: "Jun", pagados: 0, pendientes: 0 },
]

export function PaymentChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Estado de Pagos por Mes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" strokeOpacity={0.9} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--chart-axis)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "var(--foreground)",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "12px",
                  paddingTop: "10px",
                  color: "var(--muted-foreground)",
                }}
              />
              <Bar
                dataKey="pagados"
                name="Pagados"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="pendientes"
                name="Pendientes"
                fill="var(--chart-3)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
