"use client";

import { useEffect, useState } from "react";
import { useEthers } from "@/lib/EthersProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, AlertCircle, CheckCircle2, XCircle, Shield, Info, UserPlus, Trash2, BarChart } from "lucide-react";
import { toast } from "sonner";
import { use } from "react";
import { Contract, BigNumber } from "ethers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Candidate {
  id: number;
  name: string;
  info: string;
  voteCount: number;
}

interface Election {
  id: number;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  active: boolean;
  candidateCount: number;
  creator: string;
  enableWhitelist: boolean;
  candidates: Candidate[];
}

// Define the contract interface
interface VotingContract extends Contract {
  getElection: (electionId: number) => Promise<[BigNumber, string, string, BigNumber, BigNumber, boolean, BigNumber, string]>;
  getElectionResults: (electionId: number) => Promise<[BigNumber[], string[], BigNumber[]]>;
  checkVoted: (electionId: number, voter: string) => Promise<boolean>;
  checkWhitelisted: (electionId: number, voter: string) => Promise<boolean>;
  castVote: (electionId: number, candidateId: number) => Promise<any>;
  addToWhitelist: (electionId: number, voters: string[]) => Promise<any>;
  whitelistEnabled: (electionId: number) => Promise<boolean>;
  getCandidate: (electionId: number, candidateId: number) => Promise<[BigNumber, string, string, BigNumber]>;
}

// Helper function to convert BigNumber to number
const toNumber = (value: BigNumber | number): number => {
  if (typeof value === 'number') return value;
  return value.toNumber();
};

// Helper function to safely convert string to number
const safeParseInt = (value: string): number => {
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    throw new Error('Invalid number format');
  }
  return parsed;
};

// Create a wrapper component that handles the params
function ElectionPageContent({ id }: { id: string }) {
  const { contract, account, connect, isConnecting } = useEthers();
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isWhitelisted, setIsWhitelisted] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);
  const [newWhitelistAddress, setNewWhitelistAddress] = useState('');
  const [isAddingToWhitelist, setIsAddingToWhitelist] = useState(false);
  const [isLoadingWhitelist, setIsLoadingWhitelist] = useState(false);
  const [results, setResults] = useState<{ id: number; name: string; votes: number }[]>([]);
  const [selectedCandidateInfo, setSelectedCandidateInfo] = useState<{ name: string; info: string } | null>(null);

  // Add effect to handle initial connection
  useEffect(() => {
    if (!account && !isConnecting) {
      connect();
    }
  }, [account, connect, isConnecting]);

  useEffect(() => {
    const fetchData = async () => {
      if (!contract || !id || !account) return;

      try {
        setLoading(true);
        const votingContract = contract as unknown as VotingContract;
        
        // Fetch election details
        const electionData = await votingContract.getElection(Number(id));
        const [electionId, title, description, startTime, endTime, active, candidateCount, creator] = electionData;
        
        // Fetch candidates with their info
        const candidatesData: Candidate[] = [];
        for (let i = 1; i <= Number(candidateCount); i++) {
          const [candidateId, name, info, votes] = await votingContract.getCandidate(Number(id), i);
          console.log('Candidate data:', { id: candidateId.toString(), name, info, votes: votes.toString() }); // Debug log
          candidatesData.push({
            id: Number(candidateId),
            name,
            info: info || 'No additional information available.',
            voteCount: Number(votes)
          });
        }

        // Check if user has voted
        const voted = await votingContract.checkVoted(Number(id), account);
        console.log('Has voted:', voted); // Debug log
        
        // Check if user is whitelisted
        const whitelisted = await votingContract.checkWhitelisted(Number(id), account);
        
        // Check if user is creator
        const isUserCreator = creator.toLowerCase() === account.toLowerCase();

        const electionObj: Election = {
          id: Number(electionId),
          title,
          description,
          startTime: Number(startTime),
          endTime: Number(endTime),
          active,
          candidateCount: Number(candidateCount),
          creator,
          enableWhitelist: await votingContract.whitelistEnabled(Number(id)),
          candidates: candidatesData
        };

        setElection(electionObj);
        setCandidates(candidatesData);
        setHasVoted(voted);
        setIsWhitelisted(whitelisted);

        // Fetch election results after setting election data
        await fetchElectionResults();
      } catch (err) {
        console.error('Error fetching election data:', err);
        setError('Failed to load election data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contract, account, id, connect, isConnecting]);

  // Add a debug log for the election state
  useEffect(() => {
    if (election) {
      console.log('Election state updated:', election);
    }
  }, [election]);

  // Add a debug log for the error state
  useEffect(() => {
    if (error) {
      console.log('Error state updated:', error);
    }
  }, [error]);

  // Add function to fetch whitelisted addresses
  const fetchWhitelistedAddresses = async () => {
    if (!contract || !election) return;
    
    try {
      setIsLoadingWhitelist(true);
      const votingContract = contract as unknown as VotingContract;
      
      // Get all whitelisted addresses from events
      const filter = votingContract.filters.VoterWhitelisted(election.id, null);
      const events = await votingContract.queryFilter(filter);
      
      // Extract unique addresses from events
      const addresses = [...new Set(events.map(event => event.args?.voter.toLowerCase()))];
      setWhitelistAddresses(addresses);
      
      console.log('Fetched whitelisted addresses:', addresses);
    } catch (err) {
      console.error('Error fetching whitelisted addresses:', err);
      toast.error('Failed to fetch whitelisted addresses');
    } finally {
      setIsLoadingWhitelist(false);
    }
  };

  // Add effect to fetch whitelisted addresses when election data is loaded
  useEffect(() => {
    if (election?.enableWhitelist) {
      fetchWhitelistedAddresses();
    }
  }, [election, contract]);

  const handleVote = async (candidateId: number) => {
    if (!contract || !account || !election) return;

    try {
      setSelectedCandidate(candidateId);
      const votingContract = contract as VotingContract;
      const tx = await votingContract.castVote(election.id, candidateId);
      toast.info("Voting... Please confirm the transaction in MetaMask");
      await tx.wait();
      toast.success("Vote cast successfully!");
      setHasVoted(true);
      
      // Refresh election data while preserving candidate info
      const updatedCandidates = await Promise.all(
        candidates.map(async (candidate) => {
          const [id, name, info, votes] = await votingContract.getCandidate(election.id, candidate.id);
          return {
            id: Number(id),
            name,
            info: info || 'No additional information available.',
            voteCount: Number(votes)
          };
        })
      );
      
      setCandidates(updatedCandidates);
    } catch (err) {
      console.error('Error voting:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to cast vote');
    } finally {
      setSelectedCandidate(null);
    }
  };

  const handleAddToWhitelist = async () => {
    if (!contract || !account || !election || !newWhitelistAddress) return;

    try {
      setIsAddingToWhitelist(true);
      const votingContract = contract as VotingContract;
      const tx = await votingContract.addToWhitelist(election.id, [newWhitelistAddress.toLowerCase()]);
      toast.info("Adding to whitelist... Please confirm the transaction in MetaMask");
      await tx.wait();
      toast.success("Address added to whitelist successfully!");
      setNewWhitelistAddress("");
      
      // Refresh whitelist status
      const whitelisted = await votingContract.checkWhitelisted(election.id, newWhitelistAddress);
      if (whitelisted) {
        toast.success("Address is now whitelisted!");
      }
    } catch (err) {
      console.error('Error adding to whitelist:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add to whitelist');
    } finally {
      setIsAddingToWhitelist(false);
    }
  };

  // Update handleAddWhitelistAddress to refresh the list after adding
  const handleAddWhitelistAddress = async () => {
    if (!contract || !account || !election || !newWhitelistAddress) return;

    try {
      setIsAddingToWhitelist(true);
      const votingContract = contract as unknown as VotingContract;
      const tx = await votingContract.addToWhitelist(election.id, [newWhitelistAddress.toLowerCase()]);
      toast.info("Adding to whitelist... Please confirm the transaction in MetaMask");
      await tx.wait();
      
      // Refresh the whitelist addresses
      await fetchWhitelistedAddresses();
      
      setNewWhitelistAddress("");
      toast.success("Address added to whitelist successfully");
    } catch (err) {
      console.error('Error adding to whitelist:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add to whitelist');
    } finally {
      setIsAddingToWhitelist(false);
    }
  };

  // Update the fetchElectionResults function with debug logging
  const fetchElectionResults = async () => {
    if (!contract || !election) return;

    try {
      console.log('Fetching results for election:', election.id);
      const votingContract = contract as unknown as VotingContract;
      
      // First try to get results directly
      console.log('Calling getElectionResults...');
      const [ids, names, votes] = await votingContract.getElectionResults(election.id);
      console.log('Raw results:', { ids, names, votes });
      
      const resultsData = ids.map((id: BigNumber, index: number) => ({
        id: id.toNumber(),
        name: names[index],
        votes: votes[index].toNumber()
      }));
      console.log('Processed results:', resultsData);

      // If no results, try getting individual candidate data
      if (resultsData.length === 0) {
        console.log('No results from getElectionResults, trying individual candidates...');
        const candidateResults = [];
        for (let i = 1; i <= election.candidateCount; i++) {
          const [id, name, info, voteCount] = await votingContract.getCandidate(election.id, i);
          candidateResults.push({
            id: id.toNumber(),
            name,
            votes: voteCount.toNumber()
          });
        }
        console.log('Candidate results:', candidateResults);
        setResults(candidateResults);
      } else {
        setResults(resultsData);
      }
    } catch (err) {
      console.error('Error fetching election results:', err);
      toast.error('Failed to fetch election results');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading election details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-600">Please connect your wallet to view election details</p>
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="mt-4"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-600">Initializing contract... Please wait</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-600">Error: {error || 'Election not found'}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const isActive = election.active && election.startTime <= now && election.endTime > now;
  const status = !election.active ? 'Not Active' :
                election.startTime > now ? 'Upcoming' :
                election.endTime <= now ? 'Ended' :
                'Active';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{election.title}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={
                !election.active ? "destructive" :
                election.startTime > now ? "secondary" :
                election.endTime <= now ? "outline" :
                "default"
              }>
                {status}
              </Badge>
            </div>
          </div>
          <p className="text-lg text-gray-600">{election.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {election.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        console.log('Selected candidate:', candidate); // Debug log
                        setSelectedCandidateInfo({
                          name: candidate.name,
                          info: candidate.info || 'No additional information available.'
                        });
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium text-lg">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.voteCount} votes</p>
                        </div>
                        <Button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVote(candidate.id);
                          }}
                          disabled={!isActive || hasVoted}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {hasVoted ? 'Voted' : isActive ? 'Vote' : 'Upcoming'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Election Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Start Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(election.startTime * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">End Time</p>
                      <p className="text-sm text-gray-600">
                        {new Date(election.endTime * 1000).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Total Candidates</p>
                      <p className="text-sm text-gray-600">{election.candidates.length}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Your Vote Status</p>
                    <p className="text-sm text-gray-600">
                      {hasVoted ? 'You have voted' : 'You have not voted yet'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">Whitelist Status</p>
                    <p className="text-sm text-gray-600">
                      {election.enableWhitelist ? 
                        (isWhitelisted ? 'You are whitelisted' : 'You are not whitelisted') :
                        'Whitelist is not enabled'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {election.enableWhitelist && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Voter Whitelist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-white">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-blue-900">Add Whitelist Addresses</Label>
                      <p className="text-sm text-blue-700">
                        Enter Ethereum addresses that will be allowed to vote in this election.
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newWhitelistAddress}
                          onChange={(e) => setNewWhitelistAddress(e.target.value)}
                          placeholder="0x..."
                          className="font-mono"
                        />
                        <Button
                          type="button"
                          onClick={handleAddWhitelistAddress}
                          disabled={!newWhitelistAddress || isAddingToWhitelist}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {isAddingToWhitelist ? 'Adding...' : 'Add Address'}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-lg font-semibold text-blue-900">
                        Whitelisted Addresses ({whitelistAddresses.length})
                      </Label>
                      {isLoadingWhitelist ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        </div>
                      ) : whitelistAddresses.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {whitelistAddresses.map((address) => (
                            <div
                              key={address}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                            >
                              <span className="font-mono text-sm">{address}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No addresses whitelisted yet
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!election.active && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Election Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {election.endTime * 1000 < Date.now() 
                      ? "This election has ended. You can view the results above."
                      : "This election has not started yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Update the Election Results Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-blue-500" />
              Election Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.length > 0 ? (
                results.map((result) => (
                  <div key={result.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.name}</span>
                      <span className="text-sm text-gray-500">{result.votes} votes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(result.votes / Math.max(...results.map(r => r.votes), 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center space-y-2">
                  <p className="text-gray-500">
                    {election && election.endTime * 1000 > Date.now() 
                      ? "Results will be available after the election ends"
                      : "No votes have been cast yet"}
                  </p>
                  {election && election.endTime * 1000 <= Date.now() && (
                    <p className="text-sm text-gray-400">
                      Election ended on {new Date(election.endTime * 1000).toLocaleString()}
                    </p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fetchElectionResults()}
                    className="mt-2"
                  >
                    Refresh Results
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Candidate Info Dialog */}
        <Dialog open={!!selectedCandidateInfo} onOpenChange={() => setSelectedCandidateInfo(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{selectedCandidateInfo?.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Candidate Information:</h4>
              <p className="text-gray-700 whitespace-pre-wrap">
                {selectedCandidateInfo?.info}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Main component that handles params
export default function ElectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ElectionPageContent id={id} />;
}
