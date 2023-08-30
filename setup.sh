#!/bin/bash

echo ""
echo "****************************"
echo "*   PROJECT SETUP START!   *"
echo "****************************"
echo ""
sleep 2

if [ -d "./artifacts" ];
then
  echo "Clearing the 'artifacts' directory..."
  rm -rf ./artifacts
  echo ""
  sleep 1
fi

if [ -d "./cache" ];
then
  echo "Clearing the 'cache' directory..."
  rm -rf ./cache
  echo ""
  sleep 1
fi

if [ -d "./coverage" ];
then
  echo "Clearing the 'coverage' directory..."
  rm -rf ./coverage
  echo ""
  sleep 1
fi

if [ -d "./frontend/node_modules" ];
then
  echo "Clearing the 'frontend/node_modules' directory..."
  rm -rf ./frontend/node_modules
  echo ""
  sleep 1
fi

if [ -d "./node_modules" ];
then
  echo "Clearing the 'node_modules' directory..."
  rm -rf ./node_modules
  echo ""
  sleep 1
fi

if [ -d "./typechain-types" ];
then
  echo "Clearing the 'typechain-types' directory..."
  rm -rf ./typechain-types
  echo ""
  sleep 1
fi

if [ -f "./frontend/package-lock.json" ];
then
  echo "Clearing the 'frontend/package-lock.json' file..."
  rm -f ./frontend/package-lock.json
  echo ""
  sleep 1
fi

if [ -f "./package-lock.json" ];
then
  echo "Clearing the 'package-lock.json' file..."
  rm -f ./package-lock.json
  echo ""
  sleep 1
fi

if [ -f "./coverage.json" ];
then
  echo "Clearing the 'coverage.json' file..."
  rm -f ./coverage.json
  echo ""
  sleep 1
fi

if [ -f "./hardhat.log" ];
then
  echo "Clearing the 'hardhat.log' file..."
  rm -f ./hardhat.log
  echo ""
  sleep 1
fi

if [ -f "./frontend/.env" ];
then
  echo "frontend/ENV file was already configured!"
else
  cp ./frontend/env.example ./frontend/.env
  echo "frontend/ENV file is now configured."
fi
echo ""
sleep 1

if [ -f "./.env" ];
then
  echo "ENV file was already configured!"
else
  cp ./env.example ./.env
  echo "ENV file is now configured."
fi
echo ""
sleep 1

echo "Installing frontend/node_modules..."
npm install --prefix frontend
echo ""
sleep 2

echo "Installing node_modules..."
npm install
echo ""
sleep 2

echo "Compiling the typechain data..."
npx hardhat compile
echo ""
sleep 2

echo "Running the hardhat test coverage..."
npx hardhat coverage
echo ""
sleep 2

if [ -f "./artifacts/contracts/BookLibrary.sol/BookLibrary.json" ];
then
  echo "Updating the ABI in the frontend/src/abi folder..."
  rm ./frontend/src/abi/BookLibrary.json
  cp ./artifacts/contracts/BookLibrary.sol/BookLibrary.json ./frontend/src/abi/
  echo ""
  sleep 2
fi

echo "Starting up the localhost network..."
npx hardhat node
echo ""
sleep 2
