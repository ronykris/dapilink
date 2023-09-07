import { ethers } from "hardhat";

async function main() {
  const Apilink = await ethers.getContractFactory("Apilink");
  const apilink = await Apilink.deploy()
  console.log('Apilink deployed to: ',apilink.address)  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
