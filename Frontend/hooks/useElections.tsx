"use client";

import { useState, useEffect } from 'react';
import { useEthers } from '@/lib/EthersProvider';

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
  candidates?: Candidate[];
}

export function useElections() {
  const { contract } = useEthers();
  const [elections, setElections] = useState<Election[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElections = async () => {
      if (!contract) {
        console.log('No contract available');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Get total number of elections
        const totalElections = await contract.electionCount();
        console.log('Total elections:', totalElections.toString());
        
        const electionsArray: Election[] = [];

        // Fetch each election
        for (let i = 1; i <= totalElections; i++) {
          console.log('Fetching election:', i);
          const election = await contract.getElection(i);
          console.log('Raw election data:', {
            id: election[0].toString(),
            title: election[1],
            description: election[2],
            startTime: election[3].toString(),
            endTime: election[4].toString(),
            active: election[5],
            candidateCount: election[6].toString(),
            creator: election[7]
          });
          
          const [ids, names, voteCounts] = await contract.getElectionResults(i);
          console.log('Election results:', { 
            ids: ids.map(id => id.toString()),
            names,
            voteCounts: voteCounts.map(vc => vc.toString())
          });
          
          const candidates: Candidate[] = ids.map((id: number, index: number) => ({
            id: id.toNumber(),
            name: names[index],
            info: "", // You might want to fetch this separately if needed
            voteCount: voteCounts[index].toNumber()
          }));

          const electionData = {
            id: election[0].toNumber(),
            title: election[1],
            description: election[2],
            startTime: election[3].toNumber(),
            endTime: election[4].toNumber(),
            active: election[5],
            candidateCount: election[6].toNumber(),
            creator: election[7],
            candidates
          };

          console.log('Processed election data:', {
            ...electionData,
            startTimeFormatted: new Date(electionData.startTime * 1000).toLocaleString(),
            endTimeFormatted: new Date(electionData.endTime * 1000).toLocaleString(),
            now: new Date().toLocaleString(),
            isActive: electionData.active && 
                     electionData.startTime <= Math.floor(Date.now() / 1000) && 
                     electionData.endTime > Math.floor(Date.now() / 1000)
          });
          
          electionsArray.push(electionData);
        }

        console.log('All elections:', electionsArray.map(e => ({
          ...e,
          startTimeFormatted: new Date(e.startTime * 1000).toLocaleString(),
          endTimeFormatted: new Date(e.endTime * 1000).toLocaleString(),
          now: new Date().toLocaleString(),
          isActive: e.active && 
                   e.startTime <= Math.floor(Date.now() / 1000) && 
                   e.endTime > Math.floor(Date.now() / 1000)
        })));
        
        setElections(electionsArray);
      } catch (err) {
        console.error('Error fetching elections:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch elections');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [contract]);

  return { elections, loading, error };
} 