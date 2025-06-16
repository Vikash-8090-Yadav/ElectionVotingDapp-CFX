"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Vote, Clock, User, Shield, CheckCircle } from "lucide-react"
import { WhitelistManager } from "./whitelist-manager"
import { useEthers } from "@/lib/EthersProvider"

interface ElectionDetailsProps {
  electionId: string
}

interface Election {
  id: number
  title: string
  description: string
  startTime: number
  endTime: number
  enableWhitelist: boolean
  totalVotes: number
  creator: string
  isActive: boolean
}

export function ElectionDetails({ electionId }: ElectionDetailsProps) {
  const { contract, account, connect } = useEthers()
  const [election, setElection] = useState<Election | null>(null)
  const [isUserWhitelisted, setIsUserWhitelisted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchElectionData = async () => {
      if (!contract) {
        console.log('Contract not initialized, attempting to connect...')
        await connect()
        return
      }

      if (!account) {
        console.log('No account connected')
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        console.log('Fetching election data for ID:', electionId)
        // Fetch election details
        const electionData = await contract.getElection(electionId)
        console.log('Election data:', electionData)
        
        const election: Election = {
          id: electionData[0].toNumber(),
          title: electionData[1],
          description: electionData[2],
          startTime: electionData[3].toNumber(),
          endTime: electionData[4].toNumber(),
          enableWhitelist: electionData[5],
          totalVotes: electionData[6].toNumber(),
          creator: electionData[7],
          isActive: electionData[8]
        }
        console.log('Processed election data:', election)
        setElection(election)

        // Check if user is whitelisted
        if (election.enableWhitelist) {
          console.log('Checking whitelist status for account:', account)
          const whitelisted = await contract.checkWhitelisted(electionId, account)
          console.log('Whitelist status:', whitelisted)
          setIsUserWhitelisted(whitelisted)
        } else {
          setIsUserWhitelisted(true)
        }
      } catch (err) {
        console.error('Error fetching election data:', err)
        setError(err instanceof Error ? err.message : "Failed to fetch election data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchElectionData()
  }, [contract, account, electionId, connect])

  // Debug logs for rendering conditions
  console.log('Render state:', {
    election,
    account,
    isWhitelistEnabled: election?.enableWhitelist,
    isCreator: election?.creator.toLowerCase() === account?.toLowerCase()
  })

  if (isLoading) {
    return <div>Loading election details...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!election) {
    return <div>Election not found</div>
  }

  const timeRemaining = election.endTime * 1000 - Date.now()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  const isCreator = account && election.creator.toLowerCase() === account.toLowerCase()

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Election Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">Status</h3>
            <Badge className="mt-1 bg-green-100 text-green-800">
              {election.isActive ? `Active - ${daysRemaining} days remaining` : "Ended"}
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">Description</h3>
            <p className="mt-1 text-sm text-gray-600">{election.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Start Date
              </h3>
              <p className="text-sm text-gray-600">{new Date(election.startTime * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                <Clock className="h-4 w-4" />
                End Date
              </h3>
              <p className="text-sm text-gray-600">{new Date(election.endTime * 1000).toLocaleDateString()}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 flex items-center gap-1">
              <User className="h-4 w-4" />
              Creator
            </h3>
            <p className="text-sm text-gray-600 font-mono">
              {election.creator.slice(0, 10)}...{election.creator.slice(-8)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Whitelist Status Card - Only show if whitelist is enabled */}
      {election.enableWhitelist && (
        <Card className={`border-2 ${isUserWhitelisted ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Whitelist Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              {isUserWhitelisted ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-red-600"></div>
              )}
              <span className={`font-medium ${isUserWhitelisted ? "text-green-700" : "text-red-700"}`}>
                {isUserWhitelisted ? "You are whitelisted" : "You are not whitelisted"}
              </span>
            </div>

            <div className="text-sm text-gray-600">
              <p>
                Your address:{" "}
                <span className="font-mono">
                  {account?.slice(0, 10)}...{account?.slice(-8)}
                </span>
              </p>
            </div>

            {!isUserWhitelisted && (
              <div className="p-3 bg-red-100 rounded-lg">
                <p className="text-sm text-red-800">
                  Only whitelisted addresses can participate in this election. Contact the election administrator if you
                  believe this is an error.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Whitelist Manager - Only show if user is creator and whitelist is enabled */}
      {election.enableWhitelist && isCreator && (
        <div className="mt-4">
          <WhitelistManager electionId={electionId} />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Voting Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{election.totalVotes}</div>
              <div className="text-sm text-gray-600">Total Votes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voting Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>One vote per address</span>
          </div>
          {election.enableWhitelist && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Whitelist verification required</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Votes are immutable once cast</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Results visible in real-time</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
