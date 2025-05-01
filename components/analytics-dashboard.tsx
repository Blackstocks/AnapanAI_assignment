"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "./dashboard-header"
import { OverviewMetrics } from "./overview-metrics"
import { CompetitorComparison } from "./competitor-comparison"
import { MarketShareChart } from "./market-share-chart"
import { ProjectTimeline } from "./project-timeline"
import { CompetitorTable } from "./competitor-table"
import { CompetitorCards } from "./competitor-cards"
import { RelationshipStrength } from "./relationship-strength"
import { competitorData, projectTypes } from "@/lib/data"

export function AnalyticsDashboard() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(
    competitorData.map((competitor) => competitor.name),
  )
  const [selectedProjectTypes, setSelectedProjectTypes] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined])
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  // Filter competitors based on selection, search term, and date range
  const filteredCompetitors = competitorData.filter(
    (competitor) =>
      selectedCompetitors.includes(competitor.name) &&
      (searchTerm === "" ||
        competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competitor.projects.some((project) => project.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (selectedProjectTypes.length === 0 ||
        competitor.projects.some((project) => selectedProjectTypes.includes(project.type))),
  )

  return (
    <div className="space-y-6">
      <DashboardHeader
        competitors={competitorData}
        selectedCompetitors={selectedCompetitors}
        setSelectedCompetitors={setSelectedCompetitors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        projectTypes={projectTypes}
        selectedProjectTypes={selectedProjectTypes}
        setSelectedProjectTypes={setSelectedProjectTypes}
        dateRange={dateRange}
        setDateRange={setDateRange}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <OverviewMetrics competitors={filteredCompetitors} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MarketShareChart competitors={filteredCompetitors} />
        <RelationshipStrength competitors={filteredCompetitors} />
      </div>

      <Tabs defaultValue="comparison" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="comparison" className="mt-6">
          <CompetitorComparison competitors={filteredCompetitors} />
        </TabsContent>
        <TabsContent value="timeline" className="mt-6">
          <ProjectTimeline competitors={filteredCompetitors} />
        </TabsContent>
        <TabsContent value="details" className="mt-6">
          {viewMode === "table" ? (
            <CompetitorTable competitors={filteredCompetitors} />
          ) : (
            <CompetitorCards competitors={filteredCompetitors} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
