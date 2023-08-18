# book-library

Smart contract for managing a book library.

```shell
bash setup.sh

npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts

### deployment task
npx hardhat deploy-sepolia --private-key {SEPOLIA_PRIVATE_KEY} --network sepolia
```

Please create an ***.env*** file as a copy of the ***env.example*** and populate your INFURA_API_KEY in order to use the deployment task for the Sepolia Testnet!

P.S. the ***setup.sh*** script will create the .env file from the env.example automatically :)

Sepolia Etherscan link to the verified contract:
[https://sepolia.etherscan.io/tx/0x709fc48f4076aab2aa999e40642ed10e17237cf79fc5d573e133b3c2516fd03f](https://sepolia.etherscan.io/tx/0x709fc48f4076aab2aa999e40642ed10e17237cf79fc5d573e133b3c2516fd03f)
