import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Vote, Shield, Users, BarChart3 } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Decentralized voting on Conflux eSpace Testnet{" "}
              <a href="#" className="font-semibold text-blue-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Secure, Transparent
            <span className="text-blue-600"> Blockchain Voting</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Create and participate in decentralized elections with complete transparency, immutable records, and
            cryptographic security. Built on Conflux eSpace for fast, low-cost transactions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/elections">
              <Button size="lg" className="px-8">
                <Vote className="mr-2 h-4 w-4" />
                Start Voting
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="lg" className="px-8">
                Create Election
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 flow-root sm:mt-24">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-blue-100 p-3">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">Secure</h3>
              <p className="mt-1 text-xs text-gray-600 text-center">Blockchain-secured voting</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-green-100 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">Democratic</h3>
              <p className="mt-1 text-xs text-gray-600 text-center">One person, one vote</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-purple-100 p-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">Transparent</h3>
              <p className="mt-1 text-xs text-gray-600 text-center">Real-time results</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="rounded-lg bg-orange-100 p-3">
                <Vote className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900">Immutable</h3>
              <p className="mt-1 text-xs text-gray-600 text-center">Permanent record</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
