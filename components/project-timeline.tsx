"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"
import Chart from "chart.js/auto"
import "chartjs-adapter-date-fns"
import { enUS } from "date-fns/locale"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectTimelineProps {
  competitors: CompetitorData[]
}

export function ProjectTimeline({ competitors }: ProjectTimelineProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Collect all projects with dates
  const projectsWithDates = competitors
    .flatMap((competitor) =>
      competitor.projects
        .filter((project) => project.startDate && project.endDate)
        .map((project) => ({
          competitor: competitor.name,
          project: project.type,
          description: project.description,
          start: new Date(project.startDate),
          end: new Date(project.endDate),
        })),
    )
    .sort((a, b) => a.start.getTime() - b.start.getTime())

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // If no projects with dates, don't create chart
    if (projectsWithDates.length === 0) return

    // Group projects by competitor
    const competitorProjects = {}
    projectsWithDates.forEach((project) => {
      if (!competitorProjects[project.competitor]) {
        competitorProjects[project.competitor] = []
      }
      competitorProjects[project.competitor].push(project)
    })

    // Create datasets for each competitor
    const datasets = []
    const colors = [
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
    ]

    let colorIndex = 0
    for (const competitor in competitorProjects) {
      const color = colors[colorIndex % colors.length]
      colorIndex++

      competitorProjects[competitor].forEach((project, index) => {
        datasets.push({
          label: competitor,
          data: [
            {
              x: [project.start, project.end],
              y: competitor + (index > 0 ? ` (${index + 1})` : ""),
              project: project.project,
              description: project.description,
            },
          ],
          backgroundColor: color,
          borderColor: color.replace("0.8", "1"),
          borderWidth: 1,
        })
      })
    }

    // Create chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        datasets,
      },
      options: {
        indexAxis: "y",
        responsive: true,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month",
              displayFormats: {
                month: "MMM yyyy",
              },
              tooltipFormat: "PP",
            },
            adapters: {
              date: {
                locale: enUS,
              },
            },
            title: {
              display: true,
              text: "Timeline",
            },
          },
          y: {
            title: {
              display: true,
              text: "Competitor",
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              title: (context) => {
                const dataPoint = context[0]
                if (!dataPoint) return ""
                const dataset = dataPoint.dataset
                const dataIndex = dataPoint.dataIndex
                if (!dataset.data || !dataset.data[dataIndex]) return ""
                const data = dataset.data[dataIndex] as any
                return data.project || ""
              },
              label: (context) => {
                const data = context.raw as any
                if (!data || !data.x) return []
                const start = new Date(data.x[0])
                const end = new Date(data.x[1])
                return [
                  `Competitor: ${context.dataset.label || ""}`,
                  `Start: ${start.toLocaleDateString()}`,
                  `End: ${end.toLocaleDateString()}`,
                  `Duration: ${Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))} months`,
                ]
              },
              afterLabel: (context) => {
                const data = context.raw as any
                return data?.description || ""
              },
            },
          },
          legend: {
            display: false,
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [projectsWithDates])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Historical timeline of competitor engagements with Virgin Media</CardDescription>
      </CardHeader>
      <CardContent>
        {projectsWithDates.length > 0 ? (
          <div className="h-[500px] w-full">
            <canvas ref={chartRef} />
          </div>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No timeline data available for the selected competitors. Try selecting different competitors or adjusting
              your filters.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
