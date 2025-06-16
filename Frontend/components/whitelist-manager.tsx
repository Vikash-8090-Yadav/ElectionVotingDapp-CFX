"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Plus, Trash2, AlertCircle } from "lucide-react"
import { useEthers } from "@/lib/EthersProvider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WhitelistManagerProps {
  electionId: string
}

export function WhitelistManager({ electionId }: WhitelistManagerProps) {
  const { contract, account } = useEthers()
  const [addresses, setAddresses] = useState<string[]>([])
  const [newAddress, setNewAddress] = useState("")
  const [bulkAddresses, setBulkAddresses] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const validateAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const addAddress = () => {
    if (!newAddress) return
    if (!validateAddress(newAddress)) {
      setError("Invalid Ethereum address format")
      return
    }
    if (addresses.includes(newAddress.toLowerCase())) {
      setError("Address already in whitelist")
      return
    }
    setAddresses([...addresses, newAddress.toLowerCase()])
    setNewAddress("")
    setError(null)
  }

  const removeAddress = (addressToRemove: string) => {
    setAddresses(addresses.filter(addr => addr !== addressToRemove))
  }

  const addBulkAddresses = () => {
    const newAddresses = bulkAddresses
      .split(/[\n,]/)
      .map(addr => addr.trim())
      .filter(addr => addr && validateAddress(addr))
      .map(addr => addr.toLowerCase())
      .filter(addr => !addresses.includes(addr))

    setAddresses([...addresses, ...newAddresses])
    setBulkAddresses("")
    setError(null)
  }

  const updateWhitelist = async () => {
    if (!contract || !account) {
      setError("Please connect your wallet first")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      setSuccess(null)

      // Call the smart contract to update whitelist
      const tx = await contract.addToWhitelist(electionId, addresses)
      await tx.wait()

      setSuccess("Whitelist updated successfully")
      setAddresses([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update whitelist")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Manage Whitelist
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="font-medium">Add Single Address</h3>
          <div className="flex gap-2">
            <Input
              placeholder="0x..."
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              className="font-mono"
            />
            <Button onClick={addAddress} disabled={isLoading}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">Add Multiple Addresses</h3>
          <Textarea
            placeholder="Enter addresses (one per line or comma-separated)"
            value={bulkAddresses}
            onChange={(e) => setBulkAddresses(e.target.value)}
            className="font-mono h-24"
          />
          <Button onClick={addBulkAddresses} disabled={isLoading} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add All
          </Button>
        </div>

        {addresses.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium">Pending Addresses ({addresses.length})</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {addresses.map((address) => (
                <div key={address} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="font-mono text-sm">{address}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAddress(address)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              onClick={updateWhitelist}
              disabled={isLoading}
              className="w-full mt-4"
            >
              {isLoading ? "Updating..." : "Update Whitelist"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 