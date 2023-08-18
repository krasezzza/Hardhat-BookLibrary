import 'dotenv/config';
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig, task } from "hardhat/config";

const lazyImport = async (module: any) => {
  return await import(module);
};

task("deploy-sepolia", "Deploys a contract on the Sepolia network")
  .addParam("privateKey", "Please provide your private key")
  .setAction(async ({ privateKey }) => {
    const { main } = await lazyImport("./scripts/deploy-sepolia");

    await main(privateKey).catch((error: any) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
);

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: "DR7FQRE2X84B59DC78N12JHSU5F9UACQ9W"
  }
};

export default config;
