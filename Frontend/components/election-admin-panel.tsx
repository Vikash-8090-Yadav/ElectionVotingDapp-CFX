"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhitelistManagement } from "@/components/whitelist-management"
import { Settings, Users, BarChart3, Play, Pause } from "lucide-react"

interface ElectionAdminPanelProps {
  electionId: string
}

export function ElectionAdminPanel({ electionId }: ElectionAdminPanelProps) {
  const [electionStatus, setElectionStatus] = useState("active")

  const mockElection = {
    title: "Student Council President 2024",
    status: "active",
    totalVotes: 279,
    totalCandidates: 4,
    whitelistedAddresses: 1250,
    startDate: "2024-01-15T09:00:00Z",
    endDate: "2024-01-22T17:00:00Z",
  }

  return (
    <div className="space-y-8">
      {/* Election Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{mockElection.title}</CardTitle>
            <Badge
              className={electionStatus === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
            >
              {electionStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockElection.totalVotes}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockElection.totalCandidates}</div>
              <div className="text-sm text-gray-600">Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockElection.whitelistedAddresses}</div>
              <div className="text-sm text-gray-600">Whitelisted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round((mockElection.totalVotes / mockElection.whitelistedAddresses) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Participation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="whitelist" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="whitelist" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Whitelist
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="controls" className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="whitelist">
          <WhitelistManagement electionId={electionId} isCreator={true} />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Election Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Start Date</h3>
                  <p className="text-sm text-gray-600">{new Date(mockElection.startDate).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">End Date</h3>
                  <p className="text-sm text-gray-600">{new Date(mockElection.endDate).toLocaleString()}</p>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Election dates cannot be modified once the election has started. Contact support if you need to make
                  changes.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Voting Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Participation Rate</span>
                      <span>{Math.round((mockElection.totalVotes / mockElection.whitelistedAddresses) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(mockElection.totalVotes / mockElection.whitelistedAddresses) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold">{mockElection.totalVotes}</div>
                      <div className="text-sm text-gray-600">Votes Cast</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold">
                        {mockElection.whitelistedAddresses - mockElection.totalVotes}
                      </div>
                      <div className="text-sm text-gray-600">Pending Votes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Election Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">Election Status</h3>
                  <p className="text-sm text-gray-600">Control whether voting is currently allowed</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={electionStatus === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElectionStatus("active")}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Active
                  </Button>
                  <Button
                    variant={electionStatus === "paused" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElectionStatus("paused")}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Paused
                  </Button>
                </div>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">These actions are irreversible and will affect all voters.</p>
                <Button variant="destructive" size="sm">
                  End Election Early
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
