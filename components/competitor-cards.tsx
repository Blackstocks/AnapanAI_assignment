import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { CompetitorData } from "@/lib/data"

interface CompetitorCardsProps {
  competitors: CompetitorData[]
}

export function CompetitorCards({ competitors }: CompetitorCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitors.map((competitor) => {
        // Calculate relationship strength (0-100)
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

        // Calculate relationship strength
        const strengthScore = Math.min(
          100,
          projectCount * 15 + totalValue / 100000 + avgDuration * 2 + recencyScore * 10,
        )

        return (
          <Card key={competitor.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                    {competitor.name.substring(0, 2)}
                  </div>
                  <div>
                    <CardTitle>{competitor.name}</CardTitle>
                    <CardDescription>
                      {competitor.hasRelationship ? "Active Relationship" : "No Evidence Found"}
                    </CardDescription>
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${competitor.hasRelationship ? "bg-green-500" : "bg-gray-300"}`}
                ></div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {competitor.hasRelationship && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Relationship Strength</span>
                    <span className="text-sm font-medium">{Math.round(strengthScore)}%</span>
                  </div>
                  <Progress value={strengthScore} className="h-2" />
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Project Types</h4>
                <div className="flex flex-wrap gap-2">
                  {competitor.projects.length > 0 ? (
                    competitor.projects.map((project, index) => (
                      <Badge key={index} variant="outline">
                        {project.type}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">No projects found</span>
                  )}
                </div>
              </div>

              {competitor.projects.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Project Details</h4>
                  <div className="space-y-3">
                    {competitor.projects.map((project, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{project.type}</span>
                          {project.estimatedValue && (
                            <span className="text-gray-500">
                              ${project.estimatedValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">{project.description}</p>
                        {project.startDate && project.endDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(project.startDate).toLocaleDateString()} -{" "}
                            {new Date(project.endDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            {competitor.projects.length > 0 && (
              <CardFooter className="flex justify-between border-t pt-4">
                <span className="text-sm text-gray-500">Evidence:</span>
                <div className="flex gap-2">
                  {competitor.projects.map((project, index) => (
                    <Button key={index} variant="outline" size="sm" asChild className="h-8 gap-1">
                      <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Source {index + 1}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardFooter>
            )}
          </Card>
        )
      })}
    </div>
  )
}
