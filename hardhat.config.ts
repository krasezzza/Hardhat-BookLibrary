import 'dotenv/config';
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig, task, subtask } from "hardhat/config";

const lazyImport = async (module: any) => {
  return await import(module);
};

task("deploy-local", "Deploys a contract on the Localhost network")
  .setAction(async ({ }, hre) => {
    const { main } = await lazyImport("./scripts/deploy-local");

    await main().then((args: any) => {
      hre.run("print", {
        type: 'success',
        text: `BookLibrary deployed to: ${args.deployTarget}`
      });

      process.exitCode = 0;
    }).catch((error: any) => {
      hre.run("print", {
        type: 'error',
        text: error.message
      });

      process.exitCode = 1;
    });
  });

task("deploy-testnet", "Deploys a contract on the Sepolia network")
  .setAction(async ({ }, hre) => {
    const { main } = await lazyImport("./scripts/deploy-testnet");
    const PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

    await main(PRIVATE_KEY).then((args: any) => {
      hre.run("print", {
        type: 'success',
        text: `BookLibrary owner is: ${args.contractOwner}`
      });

      process.exitCode = 0;
    }).catch((error: any) => {
      hre.run("print", {
        type: 'error',
        text: error.message
      });

      process.exitCode = 1;
    });
  });

subtask("print", "Prints a message")
  .addParam("type", "Type of the message")
  .addParam("text", "The given message text")
  .setAction(async (taskArgs) => {
    if (taskArgs.type === 'error') {
      console.error(taskArgs.text);
    } else {
      console.log(taskArgs.text);
    }
  });

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
    localhost: {
      url: `http://localhost:8545`,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [
        `${process.env.SEPOLIA_PRIVATE_KEY}`,
      ]
    },
  },
  defaultNetwork: "localhost",
  etherscan: {
    apiKey: "DR7FQRE2X84B59DC78N12JHSU5F9UACQ9W",
  }
};

export default config;
