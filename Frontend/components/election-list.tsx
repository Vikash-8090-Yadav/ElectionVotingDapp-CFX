"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Vote, Clock } from "lucide-react"
import Link from "next/link"

const mockElections = [
  {
    id: 1,
    title: "Student Council President 2024",
    description: "Annual election for student council president position",
    status: "active",
    startDate: "2024-01-15",
    endDate: "2024-01-22",
    totalVotes: 234,
    candidates: 4,
    creator: "0x1234...5678",
  },
  {
    id: 2,
    title: "Community Budget Allocation",
    description: "Vote on how to allocate the community development budget",
    status: "upcoming",
    startDate: "2024-01-25",
    endDate: "2024-02-01",
    totalVotes: 0,
    candidates: 3,
    creator: "0x8765...4321",
  },
  {
    id: 3,
    title: "Board of Directors Election",
    description: "Annual election for board of directors positions",
    status: "ended",
    startDate: "2024-01-01",
    endDate: "2024-01-08",
    totalVotes: 1247,
    candidates: 6,
    creator: "0x9876...1234",
  },
]

export function ElectionList() {
  const [elections] = useState(mockElections)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ended":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Vote className="h-4 w-4" />
      case "upcoming":
        return <Clock className="h-4 w-4" />
      case "ended":
        return <Calendar className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {elections.map((election) => (
        <Card key={election.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{election.title}</CardTitle>
                <p className="text-gray-600 mt-2">{election.description}</p>
              </div>
              <Badge className={getStatusColor(election.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(election.status)}
                  {election.status}
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Start: {new Date(election.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>End: {new Date(election.endDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{election.candidates} candidates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Vote className="h-4 w-4" />
                <span>{election.totalVotes} votes</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/elections/${election.id}`}>
                <Button variant="default">{election.status === "active" ? "Vote Now" : "View Details"}</Button>
              </Link>
              <Link href={`/elections/${election.id}/results`}>
                <Button variant="outline">View Results</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
