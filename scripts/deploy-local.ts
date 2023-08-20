import { ethers } from "hardhat";

export async function main() {
  const bookLibrary = await ethers.deployContract("BookLibrary");
  await bookLibrary.waitForDeployment();

  return { deployTarget: bookLibrary.target };
}
