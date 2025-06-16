"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, User, Vote, Clock, Shield, AlertTriangle, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const mockCandidates = [
  {
    id: 1,
    name: "Alice Johnson",
    description: "Experienced leader with 5 years in student government",
    votes: 89,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    name: "Bob Smith",
    description: "Fresh perspective on campus issues and innovation",
    votes: 76,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    name: "Carol Davis",
    description: "Advocate for sustainability and student welfare",
    votes: 69,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 4,
    name: "David Wilson",
    description: "Technology enthusiast focused on digital transformation",
    votes: 45,
    image: "/placeholder.svg?height=100&width=100",
  },
]

interface VotingInterfaceProps {
  electionId: string
}

interface EligibilityStatus {
  isWhitelisted: boolean
  hasVoted: boolean
  isElectionActive: boolean
  isConnected: boolean
  timeRemaining: number
}

export function VotingInterface({ electionId }: VotingInterfaceProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [eligibility, setEligibility] = useState<EligibilityStatus>({
    isWhitelisted: false,
    hasVoted: false,
    isElectionActive: true,
    isConnected: true,
    timeRemaining: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  })
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(true)

  // Mock wallet address - in real app this would come from wallet connection
  const mockWalletAddress = "0x1234567890abcdef1234567890abcdef12345678"

  // Mock whitelist - in real app this would be fetched from smart contract
  const mockWhitelist = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0x8765432109fedcba8765432109fedcba87654321",
    "0xabcdef1234567890abcdef1234567890abcdef12",
  ]

  useEffect(() => {
    // Simulate checking eligibility on component mount
    checkEligibility()
  }, [electionId])

  const checkEligibility = async () => {
    setIsCheckingEligibility(true)

    // Simulate API calls to check eligibility
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Check if wallet is connected (mock)
    const isConnected = !!mockWalletAddress

    // Check if user is whitelisted
    const isWhitelisted = mockWhitelist.includes(mockWalletAddress.toLowerCase())

    // Check if user has already voted (mock)
    const hasVoted = Math.random() > 0.7 // 30% chance user has already voted

    // Check if election is still active
    const now = new Date().getTime()
    const endTime = now + 7 * 24 * 60 * 60 * 1000 // 7 days from now
    const isElectionActive = now < endTime

    setEligibility({
      isWhitelisted,
      hasVoted,
      isElectionActive,
      isConnected,
      timeRemaining: endTime - now,
    })

    setHasVoted(hasVoted)
    setIsCheckingEligibility(false)
  }

  const handleVote = () => {
    if (selectedCandidate && canVote()) {
      setShowConfirmDialog(true)
    }
  }

  const confirmVote = async () => {
    setIsVoting(true)
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setHasVoted(true)
    setEligibility((prev) => ({ ...prev, hasVoted: true }))
    setShowConfirmDialog(false)
    setIsVoting(false)
  }

  const canVote = () => {
    return eligibility.isConnected && eligibility.isWhitelisted && !eligibility.hasVoted && eligibility.isElectionActive
  }

  const getTimeRemaining = () => {
    const days = Math.floor(eligibility.timeRemaining / (1000 * 60 * 60 * 24))
    const hours = Math.floor((eligibility.timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return `${days}d ${hours}h remaining`
  }

  const selectedCandidateData = mockCandidates.find((c) => c.id === selectedCandidate)

  if (isCheckingEligibility) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Checking voting eligibility...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Student Council President 2024</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <Vote className="mr-1 h-4 w-4" />
              Active
            </Badge>
          </div>
          <p className="text-gray-600">Choose your preferred candidate for student council president</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {getTimeRemaining()}
          </div>
        </CardHeader>
      </Card>

      {/* Eligibility Status Card */}
      <Card className={`border-2 ${canVote() ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Voting Eligibility Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {eligibility.isConnected ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <span className={eligibility.isConnected ? "text-green-700" : "text-red-700"}>Wallet Connected</span>
            </div>

            <div className="flex items-center gap-2">
              {eligibility.isWhitelisted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <span className={eligibility.isWhitelisted ? "text-green-700" : "text-red-700"}>Whitelisted Voter</span>
            </div>

            <div className="flex items-center gap-2">
              {!eligibility.hasVoted ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <span className={!eligibility.hasVoted ? "text-green-700" : "text-red-700"}>
                {eligibility.hasVoted ? "Already Voted" : "Haven't Voted"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {eligibility.isElectionActive ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <X className="h-4 w-4 text-red-600" />
              )}
              <span className={eligibility.isElectionActive ? "text-green-700" : "text-red-700"}>Election Active</span>
            </div>
          </div>

          {!canVote() && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {!eligibility.isConnected && "Please connect your wallet to participate in voting."}
                {eligibility.isConnected &&
                  !eligibility.isWhitelisted &&
                  "Your wallet address is not whitelisted for this election. Only pre-approved addresses can vote."}
                {eligibility.isConnected &&
                  eligibility.isWhitelisted &&
                  eligibility.hasVoted &&
                  "You have already cast your vote in this election. Each address can only vote once."}
                {eligibility.isConnected &&
                  eligibility.isWhitelisted &&
                  !eligibility.hasVoted &&
                  !eligibility.isElectionActive &&
                  "This election has ended. Voting is no longer available."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {hasVoted ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-center">
              <div>
                <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                <h3 className="mt-4 text-lg font-semibold text-green-900">Vote Submitted Successfully!</h3>
                <p className="mt-2 text-green-700">
                  Your vote has been recorded on the blockchain and cannot be changed.
                </p>
                <div className="mt-4 p-3 bg-white rounded-lg border">
                  <p className="text-sm text-gray-600">Transaction Hash:</p>
                  <p className="font-mono text-xs text-gray-800">0xabcd1234...ef567890</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {mockCandidates.map((candidate) => (
              <Card
                key={candidate.id}
                className={`transition-all ${
                  canVote()
                    ? `cursor-pointer hover:shadow-md ${
                        selectedCandidate === candidate.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                      }`
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => canVote() && setSelectedCandidate(candidate.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={candidate.image || "/placeholder.svg"} alt={candidate.name} />
                      <AvatarFallback>
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{candidate.name}</h3>
                      <p className="text-gray-600 mt-1">{candidate.description}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <Badge variant="secondary">{candidate.votes} votes</Badge>
                      </div>
                    </div>
                    {selectedCandidate === candidate.id && canVote() && (
                      <CheckCircle className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="pt-6">
              <Button onClick={handleVote} disabled={!selectedCandidate || !canVote()} className="w-full" size="lg">
                <Vote className="mr-2 h-4 w-4" />
                {canVote() ? "Cast Your Vote" : "Voting Not Available"}
              </Button>
              <p className="text-sm text-gray-500 text-center mt-2">
                {canVote()
                  ? "Your vote will be recorded on the blockchain and cannot be changed"
                  : "Check eligibility requirements above to participate in voting"}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              You are about to vote for <strong>{selectedCandidateData?.name}</strong>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Important Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Once submitted, your vote will be permanently recorded on the blockchain and cannot be changed or
                    withdrawn.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isVoting}>
              Cancel
            </Button>
            <Button onClick={confirmVote} disabled={isVoting}>
              {isVoting ? "Submitting..." : "Confirm Vote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
