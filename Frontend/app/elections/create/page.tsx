"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEthers } from "@/lib/EthersProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Users, Shield, X, User } from "lucide-react";
import { ElectionContract } from "@/typechain-types";
import { Badge } from "@/components/ui/badge";

const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export default function CreateElectionPage() {
  const router = useRouter();
  const { contract, account } = useEthers();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [enableWhitelist, setEnableWhitelist] = useState(false);
  const [whitelistAddresses, setWhitelistAddresses] = useState<string[]>([]);
  const [newWhitelistAddress, setNewWhitelistAddress] = useState("");

  const handleAddWhitelistAddress = () => {
    if (!newWhitelistAddress) return;
    
    // Basic Ethereum address validation
    if (!isValidAddress(newWhitelistAddress)) {
      toast.error("Invalid Ethereum address format");
      return;
    }

    if (whitelistAddresses.includes(newWhitelistAddress.toLowerCase())) {
      toast.error("Address already in whitelist");
      return;
    }

    setWhitelistAddresses([...whitelistAddresses, newWhitelistAddress.toLowerCase()]);
    setNewWhitelistAddress("");
  };

  const handleRemoveWhitelistAddress = (address: string) => {
    setWhitelistAddresses(whitelistAddresses.filter(addr => addr !== address));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !account) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      setLoading(true);

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(startTime).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(endTime).getTime() / 1000);

      // Create election
      const electionContract = contract as unknown as ElectionContract;
      const tx = await electionContract.createElection(
        title,
        description,
        startTimestamp,
        endTimestamp,
        enableWhitelist
      );

      toast.info("Creating election... Please confirm the transaction in MetaMask");
      const receipt = await tx.wait();

      // If whitelist is enabled and addresses are provided, add them to whitelist
      if (enableWhitelist && whitelistAddresses.length > 0) {
        const events = receipt.events || [];
        const electionCreatedEvent = events.find(event => event.event === 'ElectionCreated');
        if (!electionCreatedEvent?.args?.electionId) {
          throw new Error('Failed to get election ID from transaction');
        }
        const electionId = electionCreatedEvent.args.electionId;
        const whitelistTx = await electionContract.addToWhitelist(electionId, whitelistAddresses);
        toast.info("Adding addresses to whitelist... Please confirm the transaction in MetaMask");
        await whitelistTx.wait();
      }

      toast.success("Election created successfully!");
      router.push("/elections");
    } catch (err) {
      console.error('Error creating election:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to create election');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Election</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter election title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter election description"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="whitelist"
                    checked={enableWhitelist}
                    onCheckedChange={setEnableWhitelist}
                  />
                  <Label htmlFor="whitelist" className="text-lg font-semibold">Enable voter whitelist</Label>
                </div>

                {enableWhitelist && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div className="space-y-2">
                      <Label className="text-lg font-semibold">Whitelist Addresses</Label>
                      <p className="text-sm text-gray-500">
                        Add Ethereum addresses that are allowed to vote in this election.
                        At least one address is required when whitelist is enabled.
                      </p>
                      
                      <div className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder="0x..."
                          value={newWhitelistAddress}
                          onChange={(e) => setNewWhitelistAddress(e.target.value)}
                          className="flex-1"
                          required={enableWhitelist}
                        />
                        <Button
                          type="button"
                          onClick={handleAddWhitelistAddress}
                          disabled={!newWhitelistAddress || !isValidAddress(newWhitelistAddress)}
                          className="whitespace-nowrap"
                        >
                          Add Address
                        </Button>
                      </div>

                      {enableWhitelist && whitelistAddresses.length === 0 && (
                        <p className="text-sm text-red-500">
                          Please add at least one whitelist address
                        </p>
                      )}

                      {whitelistAddresses.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">Added Addresses ({whitelistAddresses.length})</Label>
                            <Badge variant={whitelistAddresses.length > 0 ? "default" : "destructive"}>
                              {whitelistAddresses.length} {whitelistAddresses.length === 1 ? 'address' : 'addresses'} added
                            </Badge>
                          </div>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {whitelistAddresses.map((address, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-2 bg-white rounded border"
                              >
                                <div className="flex items-center space-x-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm font-mono">{address}</span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveWhitelistAddress(address)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-8"
                disabled={
                  loading || 
                  !title || 
                  !description || 
                  !startTime || 
                  !endTime || 
                  (enableWhitelist && whitelistAddresses.length === 0)
                }
              >
                {loading ? "Creating..." : "Create Election"}
              </Button>
            </form>

            {enableWhitelist && whitelistAddresses.length === 0 && (
              <div className="mt-2 text-sm text-red-600">
                Please add at least one whitelist address before creating the election.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 