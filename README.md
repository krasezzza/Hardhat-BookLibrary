# book-library

Smart contract for managing a book library.

```shell
bash setup.sh

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

Please create an ***.env*** file as a copy of the ***env.example*** and populate your INFURA_API_KEY and SEPOLIA_PRIVATE_KEY in order to use the deployment task for the Sepolia Testnet!

P.S. the ***setup.sh*** script will create the .env file from the env.example automatically :)

Sepolia Etherscan link to the verified contract:
[https://sepolia.etherscan.io/tx/0xe1fb74f3dc9ee58214e903e2c0f80947c853815c51366d17dd1f194502b9ef51](https://sepolia.etherscan.io/tx/0xe1fb74f3dc9ee58214e903e2c0f80947c853815c51366d17dd1f194502b9ef51)
