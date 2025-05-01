"use client"

import { CalendarIcon, Grid, List, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import type { CompetitorData } from "@/lib/data"

interface DashboardHeaderProps {
  competitors: CompetitorData[]
  selectedCompetitors: string[]
  setSelectedCompetitors: (competitors: string[]) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  projectTypes: string[]
  selectedProjectTypes: string[]
  setSelectedProjectTypes: (types: string[]) => void
  dateRange: [Date | undefined, Date | undefined]
  setDateRange: (range: [Date | undefined, Date | undefined]) => void
  viewMode: "table" | "cards"
  setViewMode: (mode: "table" | "cards") => void
}

export function DashboardHeader({
  competitors,
  selectedCompetitors,
  setSelectedCompetitors,
  searchTerm,
  setSearchTerm,
  projectTypes,
  selectedProjectTypes,
  setSelectedProjectTypes,
  dateRange,
  setDateRange,
  viewMode,
  setViewMode,
}: DashboardHeaderProps) {
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

  const [from, to] = dateRange

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

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
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

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {from ? (
                  to ? (
                    <>
                      {format(from, "LLL dd, y")} - {format(to, "LLL dd, y")}
                    </>
                  ) : (
                    format(from, "LLL dd, y")
                  )
                ) : (
                  <span>Date Range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={from}
                selected={{
                  from,
                  to,
                }}
                onSelect={(range) => {
                  setDateRange([range?.from, range?.to])
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

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
