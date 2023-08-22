import { ethers } from "hardhat";

const NETWORK_URL = "http://localhost:8545";
const PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Account #0

export async function main() {
  const provider = new ethers.JsonRpcProvider(NETWORK_URL);
  const wallet = new ethers.Wallet(PK, provider);
  console.log("Deploying with account:", wallet.address);

  const bookLibraryFactory = await ethers.getContractFactory("BookLibrary");
  const bookLibrary = await bookLibraryFactory.connect(wallet).deploy();
  await bookLibrary.waitForDeployment();

  return { deployTarget: bookLibrary.target };
}
