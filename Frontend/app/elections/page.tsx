"use client";

import { useElections } from "@/hooks/useElections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Plus, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEthers } from "@/lib/EthersProvider";

export default function ElectionsPage() {
  const { elections, loading, error } = useElections();
  const { account } = useEthers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading elections...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-600">Error: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  console.log('Current timestamp:', now, new Date(now * 1000).toLocaleString());

  const activeElections = elections.filter(election => {
    const isActive = election.active && election.startTime <= now && election.endTime > now;
    console.log('Election status check:', {
      id: election.id,
      title: election.title,
      active: election.active,
      startTime: election.startTime,
      startTimeFormatted: new Date(election.startTime * 1000).toLocaleString(),
      endTime: election.endTime,
      endTimeFormatted: new Date(election.endTime * 1000).toLocaleString(),
      now: now,
      nowFormatted: new Date(now * 1000).toLocaleString(),
      isActive,
      status: !election.active ? 'Not Active' :
              election.startTime > now ? 'Upcoming' :
              election.endTime <= now ? 'Ended' :
              'Active'
    });
    return isActive;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Active Elections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Participate in ongoing decentralized elections. Cast your vote and make your voice heard in a secure and transparent way.
          </p>
        </div>

        {elections.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Elections Found</h3>
              <p className="text-gray-600 mb-8">Be the first to create an election and start the voting process.</p>
              <Link href="/create">
                <Button size="lg" className="px-8">Create New Election</Button>
              </Link>
            </div>
          </div>
        ) : activeElections.length === 0 ? (
          <div className="space-y-8">
            <div className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Active Elections</h3>
              <p className="text-gray-600 mb-6">There are no active elections at the moment. Here are all elections:</p>
              <Link href="/create">
                <Button size="lg" className="px-8 mb-8">Create New Election</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {elections.map(election => {
                const status = !election.active ? 'Not Active' :
                             election.startTime > now ? 'Upcoming' :
                             election.endTime <= now ? 'Ended' :
                             'Active';
                
                console.log('Rendering election:', {
                  id: election.id,
                  title: election.title,
                  status,
                  startTime: new Date(election.startTime * 1000).toLocaleString(),
                  endTime: new Date(election.endTime * 1000).toLocaleString(),
                  now: new Date(now * 1000).toLocaleString()
                });

                return (
                  <Card key={election.id} className="hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{election.title}</span>
                        <Badge variant={
                          !election.active ? "destructive" :
                          election.startTime > now ? "secondary" :
                          election.endTime <= now ? "outline" :
                          "default"
                        }>
                          {status}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {election.description}
                      </p>
                      
                      <div className="space-y-3 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span>
                            {new Date(election.startTime * 1000).toLocaleDateString()} - {new Date(election.endTime * 1000).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-500" />
                          <span>{election.candidates?.length || 0} Candidates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>
                            {election.endTime > now ? 
                              `Ends in ${Math.ceil((election.endTime - now) / 3600)} hours` :
                              'Election ended'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Link href={`/elections/${election.id}`}>
                          <Button className="w-full" variant={election.active && election.startTime <= now && election.endTime > now ? "default" : "outline"}>
                            View Election
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeElections.map((election) => (
              <Card key={election.id} className="hover:shadow-lg transition-all duration-200 border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{election.title}</span>
                    <div className="flex items-center gap-2">
                      {election.creator.toLowerCase() === account?.toLowerCase() && (
                        <Badge variant="secondary">Creator</Badge>
                      )}
                      <Badge>Active</Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {election.description}
                  </p>
                  
                  <div className="space-y-3 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span>
                        {new Date(election.startTime * 1000).toLocaleDateString()} - {new Date(election.endTime * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span>{election.candidates?.length || 0} Candidates</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      <span>
                        Ends in {Math.ceil((election.endTime - now) / 3600)} hours
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link href={`/elections/${election.id}`}>
                      <Button className="w-full">Vote Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
