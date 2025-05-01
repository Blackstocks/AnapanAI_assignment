"use client"

import { Calendar, DollarSign, FileText, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"

interface OverviewMetricsProps {
  competitors: CompetitorData[]
}

export function OverviewMetrics({ competitors }: OverviewMetricsProps) {
  // Calculate metrics
  const activeRelationships = competitors.filter((c) => c.hasRelationship).length
  const totalProjects = competitors.reduce((acc, curr) => acc + curr.projects.length, 0)
  const avgContractValue =
    competitors.reduce(
      (acc, curr) => acc + curr.projects.reduce((sum, project) => sum + (project.estimatedValue || 0), 0),
      0,
    ) / (totalProjects || 1)

  const avgProjectDuration =
    competitors.reduce(
      (acc, curr) =>
        acc +
        curr.projects.reduce((sum, project) => {
          if (project.startDate && project.endDate) {
            const start = new Date(project.startDate)
            const end = new Date(project.endDate)
            return sum + Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
          }
          return sum
        }, 0),
      0,
    ) / (totalProjects || 1)

  const totalContractValue = competitors.reduce(
    (acc, curr) => acc + curr.projects.reduce((sum, project) => sum + (project.estimatedValue || 0), 0),
    0,
  )

  const marketSharePercentage = Math.round((activeRelationships / competitors.length) * 100)

  const recentActivity = competitors.reduce((acc, curr) => {
    const latestProject = curr.projects.reduce(
      (latest, project) => {
        if (!latest.startDate) return project
        if (!project.startDate) return latest
        return new Date(project.startDate) > new Date(latest.startDate) ? project : latest
      },
      { startDate: "" } as any,
    )

    if (
      latestProject.startDate &&
      new Date(latestProject.startDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    ) {
      return acc + 1
    }
    return acc
  }, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Relationships</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {activeRelationships} / {competitors.length}
          </div>
          <p className="text-xs text-muted-foreground">{marketSharePercentage}% market share</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">{recentActivity} in last 90 days</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Contract Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${avgContractValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
          <p className="text-xs text-muted-foreground">
            ${totalContractValue.toLocaleString("en-US", { maximumFractionDigits: 0 })} total value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Project Duration</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(avgProjectDuration)} months</div>
          <p className="text-xs text-muted-foreground">{Math.round(avgProjectDuration * 30)} days average</p>
        </CardContent>
      </Card>
    </div>
  )
}
