import { ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CompetitorData } from "@/lib/data"

interface CompetitorCardProps {
  competitor: CompetitorData
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <Card>
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
          <div className={`w-3 h-3 rounded-full ${competitor.hasRelationship ? "bg-green-500" : "bg-gray-300"}`}></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  <p className="text-gray-700">{project.description}</p>
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
}
