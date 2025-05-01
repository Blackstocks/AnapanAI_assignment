"use client"

import { useState } from "react"
import { CompetitorFilter } from "./competitor-filter"
import { CompetitorTable } from "./competitor-table"
import { CompetitorCard } from "./competitor-card"
import { competitorData } from "@/lib/data"

export function CompetitorDashboard() {
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(
    competitorData.map((competitor) => competitor.name),
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [projectTypeFilter, setProjectTypeFilter] = useState<string[]>([])

  // Filter competitors based on selection and search term
  const filteredCompetitors = competitorData.filter(
    (competitor) =>
      selectedCompetitors.includes(competitor.name) &&
      (searchTerm === "" ||
        competitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        competitor.projects.some((project) => project.description.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (projectTypeFilter.length === 0 ||
        competitor.projects.some((project) => projectTypeFilter.includes(project.type))),
  )

  // Get all unique project types for filtering
  const allProjectTypes = Array.from(
    new Set(competitorData.flatMap((competitor) => competitor.projects.map((project) => project.type))),
  )

  return (
    <div className="space-y-6">
      <CompetitorFilter
        competitors={competitorData}
        selectedCompetitors={selectedCompetitors}
        setSelectedCompetitors={setSelectedCompetitors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        viewMode={viewMode}
        setViewMode={setViewMode}
        projectTypes={allProjectTypes}
        selectedProjectTypes={projectTypeFilter}
        setSelectedProjectTypes={setProjectTypeFilter}
      />

      {viewMode === "table" ? (
        <CompetitorTable competitors={filteredCompetitors} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompetitors.map((competitor) => (
            <CompetitorCard key={competitor.name} competitor={competitor} />
          ))}
        </div>
      )}
    </div>
  )
}
