import { ResultsDashboard } from "@/components/results-dashboard"

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
          <p className="mt-2 text-gray-600">View comprehensive results and analytics for all elections</p>
        </div>

        <ResultsDashboard />
      </div>
    </div>
  )
}
