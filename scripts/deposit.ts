import { ethers } from "hardhat";


const Entrypoint_Address = "0x931a4807fbE243fBe10Fa9FF84e3744E67A9c735";
const Paymaster_ADDRESS = "0x652DAfCD02A6Ea3aaD10692b2E125EA822AC1B3e";

async function main() {
  const entryPoint = await ethers.getContractAt("EntryPoint", Entrypoint_Address);

  await entryPoint.depositTo(Paymaster_ADDRESS, {
    value: ethers.parseEther("0.02"),
  });

  console.log("deposit was successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});