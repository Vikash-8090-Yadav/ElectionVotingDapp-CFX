import { CheckCircle, Clock, Users, BarChart3, Shield, Zap } from "lucide-react"

const features = [
  {
    name: "Wallet Integration",
    description: "Connect your MetaMask wallet to participate in elections securely.",
    icon: Shield,
  },
  {
    name: "Election Management",
    description: "Create and manage elections with customizable settings and timeframes.",
    icon: Clock,
  },
  {
    name: "Candidate Management",
    description: "Add candidates with detailed profiles and qualifications.",
    icon: Users,
  },
  {
    name: "Secure Voting",
    description: "Cast your vote with cryptographic security and immutable records.",
    icon: CheckCircle,
  },
  {
    name: "Real-time Results",
    description: "View live voting results and comprehensive analytics.",
    icon: BarChart3,
  },
  {
    name: "Fast Transactions",
    description: "Built on Conflux eSpace for lightning-fast, low-cost transactions.",
    icon: Zap,
  },
]

export function Features() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Complete voting platform</p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our decentralized voting platform provides all the tools needed for secure, transparent, and efficient
            elections on the blockchain.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
