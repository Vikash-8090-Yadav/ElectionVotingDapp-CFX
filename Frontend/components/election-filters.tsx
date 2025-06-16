"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function ElectionFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search Elections
          </Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input id="search" placeholder="Search by title..." className="pl-10" />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Status</Label>
          <RadioGroup defaultValue="all" className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All Elections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="active" id="active" />
              <Label htmlFor="active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upcoming" id="upcoming" />
              <Label htmlFor="upcoming">Upcoming</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="ended" id="ended" />
              <Label htmlFor="ended">Ended</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label className="text-sm font-medium">Created By</Label>
          <RadioGroup defaultValue="all" className="mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all-creators" />
              <Label htmlFor="all-creators">All Creators</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="me" id="my-elections" />
              <Label htmlFor="my-elections">My Elections</Label>
            </div>
          </RadioGroup>
        </div>

        <Button className="w-full">Apply Filters</Button>
      </CardContent>
    </Card>
  )
}
