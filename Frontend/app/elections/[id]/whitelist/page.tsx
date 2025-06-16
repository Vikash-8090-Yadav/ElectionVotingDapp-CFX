import { WhitelistManagement } from "@/components/whitelist-management"

export default function WhitelistPage({ params }: { params: { id: string } }) {
  // In a real app, you would check if the current user is the election creator
  const isCreator = true

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Whitelist Management</h1>
          <p className="mt-2 text-gray-600">Manage voter eligibility for this election</p>
        </div>

        <WhitelistManagement electionId={params.id} isCreator={isCreator} />
      </div>
    </div>
  )
}
