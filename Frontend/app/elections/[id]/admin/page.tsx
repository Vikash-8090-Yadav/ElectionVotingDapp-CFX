import { ElectionAdminPanel } from "@/components/election-admin-panel"

export default function ElectionAdminPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Election Administration</h1>
          <p className="mt-2 text-gray-600">Manage all aspects of your election</p>
        </div>

        <ElectionAdminPanel electionId={params.id} />
      </div>
    </div>
  )
}
