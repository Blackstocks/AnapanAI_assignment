"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CompetitorComparisonProps {
  competitors: CompetitorData[]
}

export function CompetitorComparison({ competitors }: CompetitorComparisonProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Filter active competitors
  const activeCompetitors = competitors.filter((c) => c.hasRelationship)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // If no active competitors, don't create chart
    if (activeCompetitors.length === 0) return

    // Prepare data for radar chart
    const radarData = {
      labels: ["Project Count", "Contract Value", "Project Duration", "Recent Activity", "Project Diversity"],
      datasets: activeCompetitors.map((competitor, index) => {
        // Calculate metrics
        const projectCount = competitor.projects.length
        const totalValue = competitor.projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0)

        // Calculate average duration
        let avgDuration = 0
        let durationCount = 0
        competitor.projects.forEach((p) => {
          if (p.startDate && p.endDate) {
            const start = new Date(p.startDate)
            const end = new Date(p.endDate)
            avgDuration += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
            durationCount++
          }
        })
        avgDuration = durationCount > 0 ? avgDuration / durationCount : 0

        // Calculate recency score
        const now = new Date()
        let recencyScore = 0
        competitor.projects.forEach((p) => {
          if (p.startDate) {
            const start = new Date(p.startDate)
            const monthsAgo = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
            recencyScore += monthsAgo < 12 ? (12 - monthsAgo) / 12 : 0
          }
        })

        // Calculate project diversity (unique project types)
        const uniqueTypes = new Set(competitor.projects.map((p) => p.type)).size

        // Normalize values to 0-100 scale
        const normalizedProjectCount = Math.min(100, projectCount * 25)
        const normalizedValue = Math.min(100, totalValue / 50000)
        const normalizedDuration = Math.min(100, avgDuration * 5)
        const normalizedRecency = Math.min(100, recencyScore * 25)
        const normalizedDiversity = Math.min(100, uniqueTypes * 33)

        // Colors for each competitor
        const colors = [
          "rgba(53, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 205, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(201, 203, 207, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(142, 202, 230, 0.7)",
          "rgba(255, 99, 71, 0.7)",
          "rgba(54, 162, 235, 0.7)",
        ]

        return {
          label: competitor.name,
          data: [normalizedProjectCount, normalizedValue, normalizedDuration, normalizedRecency, normalizedDiversity],
          backgroundColor: colors[index % colors.length].replace("0.7", "0.2"),
          borderColor: colors[index % colors.length],
          borderWidth: 2,
          pointBackgroundColor: colors[index % colors.length],
        }
      }),
    }

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "radar",
      data: radarData,
      options: {
        responsive: true,
        scales: {
          r: {
            min: 0,
            max: 100,
            ticks: {
              display: false,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || ""
                const value = context.raw as number
                const category = radarData.labels[context.dataIndex]
                return `${label}: ${Math.round(value)}% (${category})`
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
  }, [activeCompetitors])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competitor Comparison</CardTitle>
        <CardDescription>Multi-dimensional analysis of competitor relationships</CardDescription>
      </CardHeader>
      <CardContent>
        {activeCompetitors.length > 0 ? (
          <div className="h-[500px] w-full">
            <canvas ref={chartRef} />
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No comparison data available for the selected competitors. Try selecting different competitors or
              adjusting your filters.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
