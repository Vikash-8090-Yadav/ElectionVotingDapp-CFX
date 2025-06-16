"use client"

import Link from "next/link"
import { useEthers } from "@/lib/EthersProvider"

export function Navigation() {
  const { account, connectWallet } = useEthers();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">VotingDApp</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <Link
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              href="/create"
            >
              Create Election
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            {account ? (
              <span className="text-sm text-muted-foreground">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
