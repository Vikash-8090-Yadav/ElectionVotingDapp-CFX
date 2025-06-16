"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Plus, Trash2, Upload, Download, Search, AlertTriangle, Copy } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface WhitelistManagementProps {
  electionId: string
  isCreator: boolean
}

export function WhitelistManagement({ electionId, isCreator }: WhitelistManagementProps) {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState([
    "0x1234567890abcdef1234567890abcdef12345678",
    "0x8765432109fedcba8765432109fedcba87654321",
    "0xabcdef1234567890abcdef1234567890abcdef12",
    "0x9876543210fedcba9876543210fedcba98765432",
  ])

  const [newAddress, setNewAddress] = useState("")
  const [bulkAddresses, setBulkAddresses] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [showBulkDialog, setShowBulkDialog] = useState(false)

  const filteredAddresses = whitelistedAddresses.filter((address) =>
    address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const addSingleAddress = async () => {
    if (!isValidAddress(newAddress)) {
      alert("Invalid Ethereum address format")
      return
    }

    if (whitelistedAddresses.includes(newAddress.toLowerCase())) {
      alert("Address already whitelisted")
      return
    }

    setIsAdding(true)
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWhitelistedAddresses([...whitelistedAddresses, newAddress.toLowerCase()])
    setNewAddress("")
    setIsAdding(false)
  }

  const addBulkAddresses = async () => {
    const addresses = bulkAddresses
      .split("\n")
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)

    const validAddresses = addresses.filter(isValidAddress)
    const invalidAddresses = addresses.filter((addr) => !isValidAddress(addr))

    if (invalidAddresses.length > 0) {
      alert(`Invalid addresses found: ${invalidAddresses.join(", ")}`)
      return
    }

    const newAddresses = validAddresses.filter((addr) => !whitelistedAddresses.includes(addr.toLowerCase()))

    if (newAddresses.length === 0) {
      alert("All addresses are already whitelisted")
      return
    }

    setIsAdding(true)
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setWhitelistedAddresses([...whitelistedAddresses, ...newAddresses.map((addr) => addr.toLowerCase())])
    setBulkAddresses("")
    setShowBulkDialog(false)
    setIsAdding(false)
  }

  const removeAddress = async (addressToRemove: string) => {
    if (!confirm("Are you sure you want to remove this address from the whitelist?")) {
      return
    }

    setIsAdding(true)
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setWhitelistedAddresses(whitelistedAddresses.filter((addr) => addr !== addressToRemove))
    setIsAdding(false)
  }

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  const exportWhitelist = () => {
    const csvContent = whitelistedAddresses.join("\n")
    const blob = new Blob([csvContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `whitelist-election-${electionId}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isCreator) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Whitelist Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Whitelist Protected</h3>
            <p className="text-gray-600 mb-4">
              This election uses a whitelist system. Only pre-approved addresses can participate.
            </p>
            <Badge variant="secondary">{whitelistedAddresses.length} addresses whitelisted</Badge>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Whitelist Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Only whitelisted addresses can vote in this election. Changes to the whitelist require blockchain
              transactions.
            </AlertDescription>
          </Alert>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">How to Whitelist Addresses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Get Voter Addresses</h4>
                  <p className="text-sm text-blue-700">Collect Ethereum wallet addresses from eligible voters</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Add to Whitelist</h4>
                  <p className="text-sm text-blue-700">Use the form below to add addresses individually or in bulk</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Confirm Transaction</h4>
                  <p className="text-sm text-blue-700">Each addition requires a blockchain transaction and gas fees</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">Voters Can Now Vote</h4>
                  <p className="text-sm text-blue-700">
                    Whitelisted addresses will be able to participate in the election
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Whitelisted Addresses</h3>
              <p className="text-sm text-gray-600">{whitelistedAddresses.length} addresses total</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportWhitelist}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Add
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Bulk Add Addresses</DialogTitle>
                    <DialogDescription>Enter multiple addresses, one per line</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bulk-addresses">Addresses</Label>
                      <Textarea
                        id="bulk-addresses"
                        value={bulkAddresses}
                        onChange={(e) => setBulkAddresses(e.target.value)}
                        placeholder="0x1234567890abcdef1234567890abcdef12345678&#10;0x8765432109fedcba8765432109fedcba87654321"
                        rows={8}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addBulkAddresses} disabled={isAdding || !bulkAddresses.trim()}>
                      {isAdding ? "Adding..." : "Add Addresses"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Add Single Address */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="new-address">Add Address</Label>
              <Input
                id="new-address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="0x1234567890abcdef1234567890abcdef12345678"
              />
            </div>
            <Button onClick={addSingleAddress} disabled={isAdding || !newAddress.trim()} className="mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search addresses..."
              className="pl-10"
            />
          </div>

          {/* Address List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredAddresses.map((address, index) => (
              <div key={address} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{index + 1}</Badge>
                  <span className="font-mono text-sm">{address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyAddress(address)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => removeAddress(address)} disabled={isAdding}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAddresses.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">No addresses found matching "{searchTerm}"</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
