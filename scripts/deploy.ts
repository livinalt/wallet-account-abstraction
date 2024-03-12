import { ethers } from "hardhat";

async function main() {
  

  const entryPoint = await ethers.deployContract("EntryPoint");
  await entryPoint.waitForDeployment();

  console.log(`EntryPoint has been deployed to ${entryPoint.target}`); /// Deployed on sepolia: 0x931a4807fbE243fBe10Fa9FF84e3744E67A9c735
  
  
  const smartWallet = await ethers.deployContract("SmartWallet");
  await smartWallet.waitForDeployment();

  console.log(`SmartWalletFactory has been deployed to ${smartWallet.target}`); //0xAD40a907e6378fcc8e71d4D75D781D3e7d354918

  const smartWalletFactory = await ethers.deployContract("SmartWalletFactory");
  await smartWalletFactory.waitForDeployment();

  console.log(`SmartWalletFactory has been deployed to ${smartWalletFactory.target}`); //0xF1c6Beea38F607D65226d8cC609a9149b015cd9E
 
  
 
  const paymaster = await ethers.deployContract("Paymaster");
  await paymaster.waitForDeployment();

  console.log(`Paymaster has been deployed to ${paymaster.target}`); //0xeE0768454F4C48c4A35B47d0b77b2789d10Cdf9d





}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
