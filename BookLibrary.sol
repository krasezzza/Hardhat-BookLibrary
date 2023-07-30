// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Ownable.sol";

contract BookLibrary is Ownable {

  struct Book {
    string title;
    uint8 numberOfCopies;
  }

  Book[] public books;

  mapping (uint => uint) public bookCountById;
  mapping (uint => address[]) bookBorrowedByUsers;

  event NewBookAdded(uint id, string title, uint copies);
  event BookBorrowed(uint id);
  event BookReturned(uint id);

  modifier userAllowed(uint _book_id, address _user_address) {
    bool userAlreadyHasThisBook = false;

    for (uint i = 0; i < bookBorrowedByUsers[_book_id].length; i++) {
      if (bookBorrowedByUsers[_book_id][i] == _user_address) {
        userAlreadyHasThisBook = true;
      }
    }

    require(userAlreadyHasThisBook, "The user has already borrowed this book");
    _;
  }

  modifier bookIsAvailable(uint _book_id) {
    bool bookCanBeBorrowed = false;

    if (bookCountById[_book_id] > 0) {
      bookCanBeBorrowed = true;
    }

    require(bookCanBeBorrowed, "The book is not available at this time");
    _;
  }

  function addNewBook(string memory _title, uint _numberOfCopies) public onlyOwner {
    books.push(Book(_title, uint8(_numberOfCopies)));
    uint id = books.length - 1;
    bookCountById[id] = _numberOfCopies;
    emit NewBookAdded(id, _title, _numberOfCopies);
  }

  function getBooksList() public view returns (Book[] memory) {
    return books;
  }

  function borrowBook(address _user_address, uint _book_id) public userAllowed(_book_id, _user_address) bookIsAvailable(_book_id) {
    bookBorrowedByUsers[_book_id].push(_user_address);
    bookCountById[_book_id]--;

    emit BookBorrowed(_book_id);
  }

  function getBookHolders(uint _book_id) public view returns (address[] memory) {
    return bookBorrowedByUsers[_book_id];
  }

  function returnBook(address _user_address, uint _book_id) public {
    address[] memory bookHolders = new address[](bookBorrowedByUsers[_book_id].length - 1);

    for (uint i = 0; i < bookBorrowedByUsers[_book_id].length; i++) {
      if (bookBorrowedByUsers[_book_id][i] != _user_address) {
        bookHolders[i] = bookBorrowedByUsers[_book_id][i];
      }
    }

    bookBorrowedByUsers[_book_id] = bookHolders;
    bookCountById[_book_id]++;

    emit BookReturned(_book_id);
  }

}
