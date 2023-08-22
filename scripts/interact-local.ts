import { ethers } from "hardhat";
// import { setTimeout } from "timers/promises";
import BookLibrary from "../artifacts/contracts/BookLibrary.sol/BookLibrary.json";

const NETWORK_URL = "http://localhost:8545";
const PK = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Account #0
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const run = async () => {
  const provider = new ethers.JsonRpcProvider(NETWORK_URL);
  const wallet = new ethers.Wallet(PK, provider);
  const userAddress = wallet.address;

  const balance = await provider.getBalance(userAddress);
  console.log("Wallet balance:", ethers.formatEther(balance), "ETH");

  // Init the contract
  const bookLibraryContract = new ethers.Contract(CONTRACT_ADDRESS, BookLibrary.abi, wallet);

  // 1. Creates a book
  const addBookTx = await bookLibraryContract.addBook("Some book added", 1);
  const addBookReceipt = await addBookTx.wait();
  console.log("Book has been added to the library.");
  if (addBookReceipt.status != 1) {
    console.log("Transaction of addBook() failed!");
    return;
  }
  // await setTimeout(3000);

  // 2. Checks all available books
  const booksList = await bookLibraryContract.getBooksList();

  const firstBookId = booksList.length ? booksList[0] : null;
  if (!firstBookId) { return; }

  let bookResult = await bookLibraryContract.getBookData(firstBookId);
  let firstBook = {
    title: bookResult[0],
    copies: ethers.toNumber(bookResult[1]),
    borrowers: bookResult[2]
  }
  // Logs the state data
  console.log(firstBook);

  const initialCopiesCount = firstBook.copies;

  // 3. Rents a book
  if (initialCopiesCount > 0) {
    const borrowBookTx = await bookLibraryContract.borrowBook(firstBookId);
    const borrowBookReceipt = await borrowBookTx.wait();
    console.log("Book has been borrowed from the library.");
    if (borrowBookReceipt.status != 1) {
      console.log("Transaction of borrowBook() failed!");
      return;
    }
  }
  // await setTimeout(3000);

  // Fetch again the state data
  bookResult = await bookLibraryContract.getBookData(firstBookId);
  firstBook = {
    title: bookResult[0],
    copies: ethers.toNumber(bookResult[1]),
    borrowers: bookResult[2]
  }
  // Logs the state data
  console.log(firstBook);

  const updatedCopiesCount = firstBook.copies;

  // 4. Checks that it is rented
  const isFirstBookBorrowed = updatedCopiesCount < initialCopiesCount && firstBook.borrowers.includes(userAddress);
  console.log("Is the book borrowed indeed?", isFirstBookBorrowed);

  // 5. Returns the book
  const returnBookTx = await bookLibraryContract.returnBook(firstBookId);
  const returnBookReceipt = await returnBookTx.wait();
  console.log("Book has been returned to the library.");
  if (returnBookReceipt.status != 1) {
    console.log("Transaction of returnBook() failed!");
    return;
  }
  // await setTimeout(3000);

  // Fetch again the state data
  bookResult = await bookLibraryContract.getBookData(firstBookId);
  firstBook = {
    title: bookResult[0],
    copies: ethers.toNumber(bookResult[1]),
    borrowers: bookResult[2]
  }
  // Logs the state data
  console.log(firstBook);

  // 6. Checks the availability of the book
  const isFirstBookReturned = firstBook.copies === initialCopiesCount;
  console.log("Is the book returned indeed?", isFirstBookReturned);
}

run();
