const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const ElectionVoting = await hre.ethers.getContractFactory("VotingDApp")
  const electionvoting = await ElectionVoting.deploy();
  await electionvoting.deployed();
  console.log("ElectionVoting deployed to:", electionvoting.address);

  // Create config directory if it doesn't exist
  const configDir = path.join(__dirname, '..', '..', 'Frontend');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Save contract address to config file
  const configPath = path.join(configDir, 'config.ts');
  const configContent = `export const electionvotingAddress = "${electionvoting.address}";\n`;
  fs.writeFileSync(configPath, configContent);
  console.log("Contract address saved to:", configPath);
}

main()
  .then(() => process.exit(0))  
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


  //  0x3f02EfF698eF7DB54DeadFAFF7CCd2fb7E2024D3


