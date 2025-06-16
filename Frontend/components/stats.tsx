export function Stats() {
  const stats = [
    { id: 1, name: "Elections Created", value: "127" },
    { id: 2, name: "Total Votes Cast", value: "8,492" },
    { id: 3, name: "Active Users", value: "2,341" },
    { id: 4, name: "Success Rate", value: "99.9%" },
  ]

  return (
    <section className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Trusted by voters worldwide</h2>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Join thousands of users who trust our platform for secure, transparent voting.
            </p>
          </div>
          <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-white/5 p-8">
                <dt className="text-sm font-semibold leading-6 text-gray-300">{stat.name}</dt>
                <dd className="order-first text-3xl font-bold tracking-tight text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
