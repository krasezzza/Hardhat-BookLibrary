// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;
pragma abicoder v2;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BookLibrary is Ownable {

  struct BookStruct {
    string title;
    uint8 copies;
    address[] borrowers;
  }

  bytes32[] public bookIds;
  mapping(bytes32 => BookStruct) public books;
  mapping(address => mapping(bytes32 => bool)) public borrowedBooks;
  mapping(bytes32 => mapping(address => bool)) private bookBorrowers;

  event BookAdded(string title, uint8 copies);
  event BookUpdated(string title, uint8 copies);
  event BookBorrowed(string title, address user);
  event BookReturned(string title, address user);

  // add new book or update existing one
  function addBook(string memory _title, uint8 _copies) public onlyOwner {
    require(bytes(_title).length > 0, "Title cannot be an empty string!");
    require(_copies > 0, "Copies should be greater than zero!");

    bytes32 _bookId = keccak256(abi.encodePacked(_title));

    if (books[_bookId].copies > 0) {
      books[_bookId].copies += _copies;

      emit BookUpdated(_title, _copies);
    } else {
      address[] memory _borrowers;
      BookStruct memory newBook = BookStruct(_title, _copies, _borrowers);

      books[_bookId] = newBook;
      bookIds.push(_bookId);

      emit BookAdded(_title, _copies);
    }
  }

  // borrow a book and decrement the number of copies available
  function borrowBook(bytes32 _bookId) public {
    BookStruct storage book = books[_bookId];
    address _bookBorrower = msg.sender;

    require(book.copies > 0, "This book does not have available copies currently!");
    require(!borrowedBooks[_bookBorrower][_bookId], "You already borrowed this book!");

    borrowedBooks[_bookBorrower][_bookId] = true;

    // push element to the array only in case it isn't available
    if (!bookBorrowers[_bookId][_bookBorrower]) {
      bookBorrowers[_bookId][_bookBorrower] = true;
      book.borrowers.push(_bookBorrower);
    }

    book.copies--;

    emit BookBorrowed(book.title, _bookBorrower);
  }

  // return a book and increment the number of copies available
  function returnBook(bytes32 _bookId) public {
    BookStruct storage book = books[_bookId];
    address _bookBorrower = msg.sender;

    require(borrowedBooks[_bookBorrower][_bookId], "You don't have to return this book!");

    borrowedBooks[_bookBorrower][_bookId] = false;
    book.copies++;

    emit BookReturned(book.title, _bookBorrower);
  }

  function getBooksList() public view returns (bytes32[] memory) {
    return bookIds;
  }

  function getBookData(bytes32 _bookId) public view returns (BookStruct memory) {
    return books[_bookId];
  }

  function isBookBorrowed(address _bookBorrower, bytes32 _bookId) public view returns (bool) {
    return borrowedBooks[_bookBorrower][_bookId];
  }

}
