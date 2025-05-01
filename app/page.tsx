import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Competitor Intelligence</h1>
              <p className="text-gray-600 mt-1">Comprehensive analysis of competitor relationships with Virgin Media</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Last updated: May 2, 2025</span>
            </div>
          </div>
        </header>
        <AnalyticsDashboard />
      </div>
    </main>
  )
}
