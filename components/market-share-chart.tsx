"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MarketShareChartProps {
  competitors: CompetitorData[]
}

export function MarketShareChart({ competitors }: MarketShareChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Calculate market share data
  const activeCompetitors = competitors.filter((c) => c.hasRelationship)
  const projectsByCompetitor = activeCompetitors.map((c) => ({
    name: c.name,
    projectCount: c.projects.length,
    totalValue: c.projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0),
  }))

  // Sort by total value
  projectsByCompetitor.sort((a, b) => b.totalValue - a.totalValue)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // If no active competitors or all have zero value, don't create chart
    if (projectsByCompetitor.length === 0 || projectsByCompetitor.every((c) => c.totalValue === 0)) return

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: projectsByCompetitor.map((c) => c.name),
        datasets: [
          {
            label: "Estimated Contract Value",
            data: projectsByCompetitor.map((c) => c.totalValue),
            backgroundColor: [
              "rgba(53, 162, 235, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(255, 205, 86, 0.8)",
              "rgba(255, 99, 132, 0.8)",
              "rgba(54, 162, 235, 0.8)",
              "rgba(153, 102, 255, 0.8)",
              "rgba(201, 203, 207, 0.8)",
              "rgba(255, 159, 64, 0.8)",
              "rgba(142, 202, 230, 0.8)",
              "rgba(255, 99, 71, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
            labels: {
              boxWidth: 12,
              font: {
                size: 11,
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number
                return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              },
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [projectsByCompetitor])

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Market Share by Contract Value</CardTitle>
        <CardDescription>Distribution of estimated contract value among competitors</CardDescription>
      </CardHeader>
      <CardContent>
        {projectsByCompetitor.length > 0 && !projectsByCompetitor.every((c) => c.totalValue === 0) ? (
          <div className="h-[300px] w-full">
            <canvas ref={chartRef} />
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No market share data available for the selected competitors. Try selecting different competitors or
              adjusting your filters.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
