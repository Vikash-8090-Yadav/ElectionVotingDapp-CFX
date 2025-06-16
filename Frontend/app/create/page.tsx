import { CreateElectionForm } from "@/components/create-election-form"

export default function CreateElectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
          <p className="mt-2 text-gray-600">Set up a new decentralized election with custom settings</p>
        </div>

        <CreateElectionForm />
      </div>
    </div>
  )
}
