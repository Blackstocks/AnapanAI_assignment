import { ExternalLink } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { CompetitorData } from "@/lib/data"

interface CompetitorTableProps {
  competitors: CompetitorData[]
}

export function CompetitorTable({ competitors }: CompetitorTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Competitor</TableHead>
              <TableHead>Relationship Status</TableHead>
              <TableHead>Strength</TableHead>
              <TableHead>Projects</TableHead>
              <TableHead>Contract Value</TableHead>
              <TableHead className="text-right">Evidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
                <TableRow key={competitor.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                        {competitor.name.substring(0, 2)}
                      </div>
                      <span>{competitor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${competitor.hasRelationship ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <span>{competitor.hasRelationship ? "Active Relationship" : "No Evidence Found"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {competitor.hasRelationship ? (
                      <div className="w-full max-w-[100px]">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">{Math.round(strengthScore)}%</span>
                        </div>
                        <Progress value={strengthScore} className="h-2" />
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {competitor.projects.length > 0 ? (
                        competitor.projects.map((project, index) => (
                          <TooltipProvider key={index}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline">{project.type}</Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs">{project.description}</p>
                                {project.startDate && project.endDate && (
                                  <p className="text-xs mt-1">
                                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                                    {new Date(project.endDate).toLocaleDateString()}
                                  </p>
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))
                      ) : (
                        <span className="text-gray-500">No projects found</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {totalValue > 0 ? (
                      <span>${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {competitor.projects.length > 0 ? (
                      <div className="flex justify-end gap-2">
                        {competitor.projects.map((project, index) => (
                          <Button key={index} variant="ghost" size="sm" asChild className="h-8 gap-1">
                            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                              Source {index + 1}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No sources</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
