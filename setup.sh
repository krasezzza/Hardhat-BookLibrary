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
fi
echo ""
sleep 1

if [ -d "./cache" ];
then
  echo "Clearing the 'cache' directory..."
  rm -rf ./cache
fi
echo ""
sleep 1

if [ -d "./coverage" ];
then
  echo "Clearing the 'coverage' directory..."
  rm -rf ./coverage
fi
echo ""
sleep 1

if [ -d "./node_modules" ];
then
  echo "Clearing the 'node_modules' directory..."
  rm -rf ./node_modules
fi
echo ""
sleep 2

if [ -d "./typechain-types" ];
then
  echo "Clearing the 'typechain-types' directory..."
  rm -rf ./typechain-types
fi
echo ""
sleep 2

if [ -f "./coverage.json" ];
then
  echo "Clearing the 'coverage.json' file..."
  rm -f ./coverage.json
fi
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

echo "Generating the unit test code coverage..."
npx hardhat coverage
echo ""
sleep 2

echo "Starting up the localhost network..."
echo ""
sleep 2
npx hardhat node
