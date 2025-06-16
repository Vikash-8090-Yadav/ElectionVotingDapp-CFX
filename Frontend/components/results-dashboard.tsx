"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Vote } from "lucide-react"

const mockResults = [
  {
    id: 1,
    title: "Student Council President 2024",
    status: "active",
    totalVotes: 279,
    candidates: [
      { name: "Alice Johnson", votes: 89, percentage: 31.9 },
      { name: "Bob Smith", votes: 76, percentage: 27.2 },
      { name: "Carol Davis", votes: 69, percentage: 24.7 },
      { name: "David Wilson", votes: 45, percentage: 16.1 },
    ],
  },
  {
    id: 2,
    title: "Board of Directors Election",
    status: "ended",
    totalVotes: 1247,
    candidates: [
      { name: "Emma Thompson", votes: 423, percentage: 33.9 },
      { name: "Michael Chen", votes: 387, percentage: 31.0 },
      { name: "Sarah Williams", votes: 298, percentage: 23.9 },
      { name: "James Rodriguez", votes: 139, percentage: 11.1 },
    ],
  },
]

export function ResultsDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Elections</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Elections</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Vote className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Votes</p>
                <p className="text-2xl font-bold">8,492</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Participation</p>
                <p className="text-2xl font-bold">67%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {mockResults.map((election) => (
          <Card key={election.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{election.title}</CardTitle>
                <Badge
                  className={election.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                >
                  {election.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Total votes: {election.totalVotes.toLocaleString()}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {election.candidates.map((candidate, index) => (
                  <div key={candidate.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-orange-600"
                                  : "bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{candidate.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{candidate.votes.toLocaleString()} votes</div>
                        <div className="text-sm text-gray-600">{candidate.percentage}%</div>
                      </div>
                    </div>
                    <Progress value={candidate.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
