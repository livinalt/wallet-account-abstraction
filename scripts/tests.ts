import { ethers } from "hardhat";


// const EntryPointAddress = "0xFf3F50232E1afa3Cc1f740312080651FCDCf9625";

// async function main() {
  
//   const entryPoint = await ethers.provider.getCode(EntryPointAddress);
  
//   // this is to confirm that the address to which the entry point has been deployed to is ok 
//   console.log(entryPoint); 
//   // this returns a bytecode
// }

const SmartWalletAddress = "0x97f19c977cB4AFf6EE80029074684EfAFd86e111";

async function main() {
  
  const smartWallet = await ethers.getContractAt("SmartWallet", SmartWalletAddress);
  const count = await smartWallet.execute();
  
  // this is to confirm that the address to which the entry point has been deployed to is ok 
  console.log({count}); 
  // this returns a bytecode
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
