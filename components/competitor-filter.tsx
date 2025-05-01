"use client"

import { Grid, List, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { CompetitorData } from "@/lib/data"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface CompetitorFilterProps {
  competitors: CompetitorData[]
  selectedCompetitors: string[]
  setSelectedCompetitors: (competitors: string[]) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  viewMode: "table" | "cards"
  setViewMode: (mode: "table" | "cards") => void
  projectTypes: string[]
  selectedProjectTypes: string[]
  setSelectedProjectTypes: (types: string[]) => void
}

export function CompetitorFilter({
  competitors,
  selectedCompetitors,
  setSelectedCompetitors,
  searchTerm,
  setSearchTerm,
  viewMode,
  setViewMode,
  projectTypes,
  selectedProjectTypes,
  setSelectedProjectTypes,
}: CompetitorFilterProps) {
  const toggleCompetitor = (competitor: string) => {
    if (selectedCompetitors.includes(competitor)) {
      setSelectedCompetitors(selectedCompetitors.filter((c) => c !== competitor))
    } else {
      setSelectedCompetitors([...selectedCompetitors, competitor])
    }
  }

  const toggleProjectType = (type: string) => {
    if (selectedProjectTypes.includes(type)) {
      setSelectedProjectTypes(selectedProjectTypes.filter((t) => t !== type))
    } else {
      setSelectedProjectTypes([...selectedProjectTypes, type])
    }
  }

  const selectAllCompetitors = () => {
    setSelectedCompetitors(competitors.map((c) => c.name))
  }

  const clearAllCompetitors = () => {
    setSelectedCompetitors([])
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search competitors or projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-2 top-2.5">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Competitors ({selectedCompetitors.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Select Competitors</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="flex justify-between px-2 py-1.5">
                <Button variant="ghost" size="sm" onClick={selectAllCompetitors} className="h-auto py-1 px-2 text-xs">
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAllCompetitors} className="h-auto py-1 px-2 text-xs">
                  Clear All
                </Button>
              </div>
              <DropdownMenuSeparator />
              {competitors.map((competitor) => (
                <DropdownMenuCheckboxItem
                  key={competitor.name}
                  checked={selectedCompetitors.includes(competitor.name)}
                  onCheckedChange={() => toggleCompetitor(competitor.name)}
                >
                  {competitor.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Project Types ({selectedProjectTypes.length})</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Project Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {projectTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={selectedProjectTypes.includes(type)}
                  onCheckedChange={() => toggleProjectType(type)}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("cards")}
              className="rounded-l-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {selectedProjectTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedProjectTypes.map((type) => (
            <Badge key={type} variant="secondary" className="gap-1">
              {type}
              <button onClick={() => toggleProjectType(type)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedProjectTypes.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedProjectTypes([])} className="h-6 px-2 text-xs">
              Clear filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
