import { ethers } from "hardhat";

const Factory_Address = "0xAD40a907e6378fcc8e71d4D75D781D3e7d354918";
const Entrypoint_Address = "0x931a4807fbE243fBe10Fa9FF84e3744E67A9c735";
const Paymaster_ADDRESS = "0xeE0768454F4C48c4A35B47d0b77b2789d10Cdf9d";


async function main() {    
   
  const entryPoint = await ethers.getContractAt("EntryPoint", Entrypoint_Address);
 

    const SmartWalletFactory = await ethers.getContractFactory("SmartWalletFactory");
    const [signer0] = await ethers.getSigners();
    const address0 = await signer0.getAddress();
    let initCode = Factory_Address + SmartWalletFactory.interface.encodeFunctionData("createSmartWallet",[address0]).slice(2);

    let sender;
      try {

        await entryPoint.getSenderAddress(initCode);

      }  catch (ex) {
        sender = "0x" + ex.data.slice(-40);
      } 

      const code = await ethers.provider.getCode(sender);
      if (code !== "0x") {
        initCode = "0x";
      }


    console.log({sender});

    // sender = 0x97f19c977cb4aff6ee80029074684efafd86e111
    
    await entryPoint.depositTo(Paymaster_ADDRESS, {value:ethers.parseEther("0.000000000000000001")});

    const smartWallet = await ethers.getContractFactory("SmartWallet");

  const userOp = {
    sender, // smart account address
    nonce: "0x" + ( await entryPoint.getNonce(sender,6)).toString(16),
    initCode,
    callData: smartWallet.interface.encodeFunctionData("addDeposit"),
    paymasterAndData: Paymaster_ADDRESS,
    signature: "0x",
  };

  const { preVerificationGas, verificationGasLimit, callGasLimit } = await ethers.provider.send("eth_estimateUserOperationGas", [Entrypoint_Address, userOp]);
  
  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const { maxFeePerGas } = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;


  // callGasLimit: 200_000,
  //   verificationGasLimit: 200_000,
  //   preVerificationGas: 50_000,
  //   maxFeePerGas: await ethers.parseUnits("10", "gwei"),
  //   maxPriorityFeePerGas: await ethers.parseUnits("5", "gwei"),

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(ethers.getBytes(userOpHash));

  // const tx = entryPoint.handleOps([userOp], address0);
  // const receipt = await tx.wait();
  // console.log(receipt);

  setTimeout(async () => {
    const { transactionHash } = await ethers.provider.send(
      "eth_getUserOperationByHash",
      [opHash]
    );

    console.log(transactionHash);
  }, 5000);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
