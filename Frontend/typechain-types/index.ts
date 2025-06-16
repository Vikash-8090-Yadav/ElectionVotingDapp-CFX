import { ethers } from "ethers";

export interface ElectionContract extends ethers.Contract {
  createElection(
    title: string,
    description: string,
    startTime: number,
    endTime: number,
    enableWhitelist: boolean
  ): Promise<ethers.ContractTransaction>;
  
  addToWhitelist(
    electionId: number,
    addresses: string[]
  ): Promise<ethers.ContractTransaction>;
}

export class ElectionContract__factory {
  static connect(
    address: string,
    signerOrProvider: ethers.Signer | ethers.providers.Provider
  ): ElectionContract {
    return new ethers.Contract(
      address,
      [
        "function createElection(string title, string description, uint256 startTime, uint256 endTime, bool enableWhitelist) returns (uint256)",
        "function addToWhitelist(uint256 electionId, address[] addresses) returns (bool)"
      ],
      signerOrProvider
    ) as ElectionContract;
  }
} 