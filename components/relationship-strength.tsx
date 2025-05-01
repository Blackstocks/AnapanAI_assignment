"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RelationshipStrengthProps {
  competitors: CompetitorData[]
}

export function RelationshipStrength({ competitors }: RelationshipStrengthProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Filter active competitors
  const activeCompetitors = competitors.filter((c) => c.hasRelationship)

  // Calculate relationship strength metrics
  const relationshipData = activeCompetitors.map((c) => {
    // Calculate a relationship strength score based on:
    // - Number of projects
    // - Total contract value
    // - Average project duration
    // - Recency of engagement

    const projectCount = c.projects.length
    const totalValue = c.projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0)

    // Calculate average duration
    let avgDuration = 0
    let durationCount = 0
    c.projects.forEach((p) => {
      if (p.startDate && p.endDate) {
        const start = new Date(p.startDate)
        const end = new Date(p.endDate)
        avgDuration += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
        durationCount++
      }
    })
    avgDuration = durationCount > 0 ? avgDuration / durationCount : 0

    // Calculate recency score (higher for more recent projects)
    const now = new Date()
    let recencyScore = 0
    c.projects.forEach((p) => {
      if (p.startDate) {
        const start = new Date(p.startDate)
        const monthsAgo = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)
        // More recent projects get higher scores
        recencyScore += monthsAgo < 12 ? (12 - monthsAgo) / 12 : 0
      }
    })

    // Calculate relationship strength (normalized to 0-100)
    const strengthScore = Math.min(100, projectCount * 15 + totalValue / 100000 + avgDuration * 2 + recencyScore * 10)

    return {
      name: c.name,
      strength: Math.round(strengthScore),
      projectCount,
      totalValue,
    }
  })

  // Sort by strength
  relationshipData.sort((a, b) => b.strength - a.strength)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // If no active competitors, don't create chart
    if (relationshipData.length === 0) return

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: relationshipData.map((c) => c.name),
        datasets: [
          {
            label: "Relationship Strength",
            data: relationshipData.map((c) => c.strength),
            backgroundColor: "rgba(75, 192, 192, 0.8)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
            max: 100,
            title: {
              display: true,
              text: "Strength Score (0-100)",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              afterLabel: (context) => {
                const index = context.dataIndex
                if (index < 0 || index >= relationshipData.length) return []
                const data = relationshipData[index]
                return [
                  `Projects: ${data.projectCount}`,
                  `Total Value: $${data.totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
                ]
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
  }, [relationshipData])

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Relationship Strength Analysis</CardTitle>
        <CardDescription>Comparative strength of competitor relationships with Virgin Media</CardDescription>
      </CardHeader>
      <CardContent>
        {relationshipData.length > 0 ? (
          <div className="h-[300px] w-full">
            <canvas ref={chartRef} />
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No relationship data available for the selected competitors. Try selecting different competitors or
              adjusting your filters.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
