"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Copy, ExternalLink, Shield } from "lucide-react"

export function WhitelistTutorial() {
  const sampleAddresses = [
    "0x1234567890abcdef1234567890abcdef12345678",
    "0x8765432109fedcba8765432109fedcba87654321",
    "0xabcdef1234567890abcdef1234567890abcdef12",
  ]

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  const copyAllAddresses = () => {
    navigator.clipboard.writeText(sampleAddresses.join("\n"))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Understanding Whitelisting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">✅ What Whitelisting Does</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Restricts voting to approved addresses only</li>
                <li>• Prevents unauthorized participation</li>
                <li>• Ensures election integrity</li>
                <li>• Allows controlled voter registration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2">❌ Without Whitelisting</h3>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Anyone with a wallet can vote</li>
                <li>• No voter verification</li>
                <li>• Potential for spam voting</li>
                <li>• Less controlled elections</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step-by-Step Whitelisting Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Collect Voter Information</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Gather Ethereum wallet addresses from eligible voters through:
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Registration forms</li>
                  <li>• Email collection</li>
                  <li>• Direct communication</li>
                  <li>• Existing member databases</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Validate Addresses</h3>
                <p className="text-sm text-gray-600 mb-3">Ensure all addresses are valid Ethereum format:</p>
                <div className="bg-white p-3 rounded border font-mono text-sm">0x + 40 hexadecimal characters</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Add to Whitelist</h3>
                <p className="text-sm text-gray-600 mb-3">Use the admin panel to add addresses:</p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Single Address</Badge>
                  <Badge variant="secondary">Bulk Upload</Badge>
                  <Badge variant="secondary">CSV Import</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-green-800">Voters Can Now Participate</h3>
                <p className="text-sm text-green-700">
                  Whitelisted addresses will see eligibility confirmation and can cast votes
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Addresses for Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">Use these sample addresses to test the whitelist functionality:</p>
              <Button variant="outline" size="sm" onClick={copyAllAddresses}>
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>
            </div>

            {sampleAddresses.map((address, index) => (
              <div key={address} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Sample {index + 1}</Badge>
                  <span className="font-mono text-sm">{address}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyAddress(address)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
