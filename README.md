# book-library

Smart contract for managing a book library.

```shell
# configure the project with one command
bash setup.sh

# start-up the frontend development server
npm run festart

# helper commands for hardhat environment
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

# deployment task for localhost
npx hardhat deploy-local

# deployment task for sepolia
npx hardhat deploy-testnet --network sepolia
```

Please create an ***.env*** file as a copy of the ***env.example*** and populate your INFURA_API_KEY and SEPOLIA_PRIVATE_KEY in order to use the deployment task for the Sepolia Testnet.

Please also create a ***frontend/.env*** file as a copy of the ***frontend/env.example*** and populate your REACT_APP_INFURA_API_KEY in order to connect to the provider successfully.

P.S. the ***setup.sh*** script will create the .env files from the env.example automatically and you have to populate them with a relevant data :)

Sepolia Etherscan link to the verified contract:
[https://sepolia.etherscan.io/tx/0xd2b25d4ebbfa679edac5d434afce5f67b6073f4176afc6255df10f7bdc364447](https://sepolia.etherscan.io/tx/0xd2b25d4ebbfa679edac5d434afce5f67b6073f4176afc6255df10f7bdc364447)
