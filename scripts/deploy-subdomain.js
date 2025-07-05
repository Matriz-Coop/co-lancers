const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CoLancersSubdomain contract...");

  // Get the contract factory
  const CoLancersSubdomain = await ethers.getContractFactory("CoLancersSubdomain");

  // ENS addresses on mainnet
  const ENS_REGISTRY_ADDRESS = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e";
  const ENS_RESOLVER_ADDRESS = "0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41";
  
  // Calculate the namehash for co-lancers.eth
  // This is a simplified version - in production you'd use a proper namehash function
  const PARENT_NODE = ethers.utils.namehash("co-lancers.eth");

  console.log("ENS Registry Address:", ENS_REGISTRY_ADDRESS);
  console.log("ENS Resolver Address:", ENS_RESOLVER_ADDRESS);
  console.log("Parent Node (co-lancers.eth):", PARENT_NODE);

  // Deploy the contract
  const coLancersSubdomain = await CoLancersSubdomain.deploy(
    ENS_REGISTRY_ADDRESS,
    ENS_RESOLVER_ADDRESS,
    PARENT_NODE
  );

  await coLancersSubdomain.deployed();

  console.log("CoLancersSubdomain deployed to:", coLancersSubdomain.address);

  // Verify the deployment
  console.log("\nVerifying deployment...");
  
  const subdomainOwner = await coLancersSubdomain.subdomainOwners("test");
  console.log("Test subdomain owner (should be zero):", subdomainOwner);

  const isValid = await coLancersSubdomain.isValidSubdomain("test123");
  console.log("Is 'test123' a valid subdomain?", isValid);

  const isAvailable = await coLancersSubdomain.isSubdomainAvailable("test123");
  console.log("Is 'test123' available?", isAvailable);

  console.log("\nDeployment successful!");
  console.log("Contract address:", coLancersSubdomain.address);
  console.log("Network:", network.name);
  console.log("Block number:", await ethers.provider.getBlockNumber());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 