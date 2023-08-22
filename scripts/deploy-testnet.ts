import { ethers, run } from "hardhat";
import { setTimeout } from "timers/promises";

export async function main(_privateKey: any) {
  const wallet = new ethers.Wallet(_privateKey, ethers.provider);
  console.log("Deploying with account:", wallet.address);

  const bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
  const bookLibrary = await bookLibraryFactory.connect(wallet).deploy();
  await bookLibrary.waitForDeployment();

  console.log("BookLibrary was deployed to:", bookLibrary.target);

  // Wait for 5 blocks
  let currentBlock = await ethers.provider.getBlockNumber();
  while (currentBlock + 5 > (await ethers.provider.getBlockNumber())) {
    await setTimeout(15000);
    console.log("Waiting for the 5th block confirmation...");
  }

  try {
    await run("verify:verify", {
      address: bookLibrary.target,
      constructorArguments: [],
    });
  } catch (err: any) {
    console.log("Could not verify the contract!");
  }

  const owner = await bookLibrary.owner();

  return { contractOwner: owner };
}
