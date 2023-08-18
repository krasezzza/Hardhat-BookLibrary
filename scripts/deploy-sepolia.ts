import { ethers, run } from "hardhat";

export async function main(_privateKey: any) {
  const wallet = new ethers.Wallet(_privateKey, ethers.provider);
  console.log("Deploying contract with account:", wallet.address);

  const bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
  const bookLibrary = await bookLibraryFactory.connect(wallet).deploy();

  await bookLibrary.waitForDeployment();
  console.log("The BookLibrary contract was deployed to:", bookLibrary.target);

  // Wait for 5 blocks
  let currentBlock = await ethers.provider.getBlockNumber();
  let hasSucceeded: boolean = false;

  while (currentBlock + 5 > (await ethers.provider.getBlockNumber())) {
    try {
      await run("verify:verify", {
        address: bookLibrary.target,
        constructorArguments: [],
      });

      hasSucceeded = true;
    } catch (err: any) {

      hasSucceeded = false;
    }
  }

  if (hasSucceeded) {
    console.log("Contract verified.");
  }

  const owner = await bookLibrary.owner();
  console.log(`The BookLibrary contract owner is ${owner}`);
}
