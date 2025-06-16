"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react"

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0.00")
  const [isConnecting, setIsConnecting] = useState(false)

  // Mock wallet connection
  const connectWallet = async () => {
    setIsConnecting(true)
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsConnected(true)
    setAddress("0x1234567890abcdef1234567890abcdef12345678")
    setBalance("2.45")
    setIsConnecting(false)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
    setBalance("0.00")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} disabled={isConnecting}>
        <Wallet className="mr-2 h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="font-mono">{formatAddress(address)}</span>
            <Badge variant="secondary">{balance} CFX</Badge>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={copyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuItem onClick={disconnectWallet}>
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
