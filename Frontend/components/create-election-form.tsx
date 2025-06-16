"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Calendar, Users, Shield, Trash2 } from "lucide-react"
import { useEthers } from "@/lib/EthersProvider"
import { toast } from "sonner"
import { ethers } from "ethers"
import abi from "@/abi.json"

export function CreateElectionForm() {
  const router = useRouter();
  const { contract, account } = useEthers();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    enableWhitelist: false,
  })

  const [candidates, setCandidates] = useState<Array<{ name: string; description: string }>>([
    { name: "", description: "" },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [currentStep, setCurrentStep] = useState<'idle' | 'creating' | 'adding-candidates'>('idle');

  const addCandidate = () => {
    setCandidates([...candidates, { name: "", description: "" }])
  }

  const removeCandidate = (index: number) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((_, i) => i !== index))
    }
  }

  const updateCandidate = (index: number, field: "name" | "description", value: string) => {
    const updated = candidates.map((candidate, i) => (i === index ? { ...candidate, [field]: value } : candidate))
    setCandidates(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !account) {
      toast.error("Please connect your wallet first")
      return
    }

    try {
      setIsCreating(true)
      setCurrentStep('creating')

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(formData.startDate).getTime() / 1000)
      const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000)

      // Create election
      const tx = await contract.createElection(
        formData.title,
        formData.description,
        startTimestamp,
        endTimestamp,
        formData.enableWhitelist
      )

      toast.info("Creating election... Please confirm in MetaMask")
      const receipt = await tx.wait()

      // Get election ID from event
      const events = receipt.events || []
      const electionCreatedEvent = events.find((event: { event: string; args?: { electionId: number } }) => event.event === 'ElectionCreated')
      if (!electionCreatedEvent?.args?.electionId) {
        throw new Error('Failed to get election ID from transaction')
      }
      const electionId = electionCreatedEvent.args.electionId

      // Transaction 2: Add Candidates
      toast.info("Transaction 2/2: Adding candidates... Please confirm in MetaMask")
      setCurrentStep('adding-candidates')
      
      for (const candidate of candidates) {
        console.log("Adding candidate:", candidate);
        try {
          const candidateTx = await contract.addCandidate(
            electionId,
            candidate.name,
            candidate.description
          );
          console.log("Candidate transaction:", candidateTx);
          await candidateTx.wait();
          console.log("Candidate added successfully");
        } catch (error: any) {
          console.error("Error adding candidate:", error);
          throw new Error(`Failed to add candidate: ${error.message}`);
        }
      }

      toast.success("Election created successfully!");
      router.push(`/elections/${electionId}`);
    } catch (error: any) {
      console.error("Error creating election:", error);
      toast.error(error.message || "Failed to create election");
    } finally {
      setIsCreating(false);
      setCurrentStep('idle');
    }
  }

  const getButtonText = () => {
    switch (currentStep) {
      case 'creating':
        return "Creating Election...";
      case 'adding-candidates':
        return "Adding Candidates...";
      default:
        return "Create Election";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Election Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Election Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Student Council President 2024"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the purpose and context of this election..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="startDate">Start Date & Time *</Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date & Time *</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="whitelist"
              checked={formData.enableWhitelist}
              onCheckedChange={(checked) => setFormData({ ...formData, enableWhitelist: checked })}
            />
            <Label htmlFor="whitelist">Enable voter whitelist</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Candidates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {candidates.map((candidate, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Candidate {index + 1}</h3>
                {candidates.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCandidate(index)}
                    disabled={isCreating}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div>
                <Label htmlFor={`candidate-${index}-name`}>Name *</Label>
                <Input
                  id={`candidate-${index}-name`}
                  value={candidate.name}
                  onChange={(e) => updateCandidate(index, "name", e.target.value)}
                  placeholder="Candidate name"
                  required
                />
              </div>

              <div>
                <Label htmlFor={`candidate-${index}-description`}>Description *</Label>
                <Textarea
                  id={`candidate-${index}-description`}
                  value={candidate.description}
                  onChange={(e) => updateCandidate(index, "description", e.target.value)}
                  placeholder="Brief description of the candidate"
                  rows={2}
                  required
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addCandidate}
            disabled={isCreating}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={
          isCreating ||
          !formData.title ||
          !formData.description ||
          !formData.startDate ||
          !formData.endDate ||
          candidates.some(c => !c.name || !c.description)
        }
      >
        {getButtonText()}
      </Button>
    </form>
  )
}
