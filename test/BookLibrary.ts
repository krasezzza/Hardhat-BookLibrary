import { BookLibrary } from "./../typechain-types/contracts/BookLibrary";
import { network, ethers } from "hardhat";
import { expect } from "chai";

let bookLibrary: BookLibrary;
let snapshotId: any;
let initialSnapshotId: any;

describe("BookLibrary", () => {
  let owner: any;
  let addr1: any;
  let addr2: any;
  let addrs: any;

  const bookWithEmptyTitle = {
    title: "",
    copies: 1
  };
  const bookWithZeroCopies = {
    title: "Some book",
    copies: 0
  }
  const bookOneAdded = {
    title: "Added Book 1",
    copies: 1
  }
  const bookTwoAdded = {
    title: "Added Book 2",
    copies: 2
  }

  before(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    bookLibrary = await ethers.deployContract("BookLibrary");
    await bookLibrary.waitForDeployment();

    initialSnapshotId = await network.provider.send('evm_snapshot');
  });

  beforeEach(async () => {
    snapshotId = await network.provider.send('evm_snapshot');
  });

  afterEach(async () => {
    await network.provider.send("evm_revert", [snapshotId]);
  });

  after(async () => {
    await network.provider.send('evm_revert', [initialSnapshotId]);
  });

  describe("Validations", () => {
    it("Should throw when try to submit from different address", () => {
      expect(bookLibrary.connect(addr1).addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      )).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should throw when try to submit empty-string book title", () => {
      expect(bookLibrary.addBook(
        bookWithEmptyTitle.title, 
        bookWithEmptyTitle.copies
      )).to.be.revertedWith(
        "Title cannot be an empty string!"
      );
    });

    it("Should throw when try to submit zero copies of a book", () => {
      expect(bookLibrary.addBook(
        bookWithZeroCopies.title, 
        bookWithZeroCopies.copies
      )).to.be.revertedWith(
        "Copies should be greater than zero!"
      );
    });

    it("Should throw when try to borrow a book with zero copies", async () => {
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);

      expect(bookLibrary.connect(addr2).borrowBook(
        _bookId
      )).to.be.revertedWith(
        "This book does not have available copies currently!"
      );
    });

    it("Should throw when try to borrow the same book again", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);

      expect(bookLibrary.connect(addr1).borrowBook(
        _bookId
      )).to.be.revertedWith(
        "You already borrowed this book!"
      );
    });

    it("Should throw when try to return a non-borrowed book", async () => {
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      expect(bookLibrary.connect(addr1).returnBook(
        _bookId
      )).to.be.revertedWith(
        "You don't have to return this book!"
      );
    });
  });

  describe("Events", () => {
    it("Should emit event for adding a book", async () => {
      const addBookTx = await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      expect(await addBookTx.wait()).to.emit(
        bookLibrary, "BookAdded"
      ).withArgs(
        bookOneAdded.title, 
        bookOneAdded.copies
      );
    });

    it("Should emit event for updating a book", async () => {
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      const updateBookTx = await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      expect(await updateBookTx.wait()).to.emit(
        bookLibrary, "BookUpdated"
      ).withArgs(
        bookOneAdded.title, 
        bookOneAdded.copies
      );
    });

    it("Should emit event for borrowing a book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      const borrowBookTx = await bookLibrary.connect(addr1).borrowBook(_bookId);

      expect(await borrowBookTx.wait()).to.emit(
        bookLibrary, "BookBorrowed"
      ).withArgs(
        bookOneAdded.title, 
        addr1
      );
    });

    it("Should emit event for returning a book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);

      const returnBookTx = await bookLibrary.connect(addr1).returnBook(_bookId);

      expect(await returnBookTx.wait()).to.emit(
        bookLibrary, "BookReturned"
      ).withArgs(
        bookOneAdded.title, 
        addr1
      );
    });
  });

  describe("Transactions", () => {
    it("Should add new books to the books list", async () => {
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );
      let _booksList = await bookLibrary.getBooksList();

      expect(_booksList.length).to.equal(1);

      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );
      _booksList = await bookLibrary.getBooksList();

      expect(_booksList.length).to.equal(2);
    });

    it("Should increase the copies of an updated book", async () => {
      // add the book
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      let _book = await bookLibrary.getBookData(_bookId);

      expect(_book.copies).to.equal(1);
      
      // update the book
      await bookLibrary.addBook(
        bookOneAdded.title, 
        bookOneAdded.copies
      );

      _book = await bookLibrary.getBookData(_bookId);

      expect(_book.copies).to.equal(2);
    });

    it("Should decrease the copies of a borrowed book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);
      const _book = await bookLibrary.getBookData(_bookId);

      expect(_book.copies).to.equal(1);
    });

    it("Should increase the copies of a returned book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);
      let _book = await bookLibrary.getBookData(_bookId);

      expect(_book.copies).to.equal(1);

      await bookLibrary.connect(addr1).returnBook(_bookId);
      _book = await bookLibrary.getBookData(_bookId);

      expect(_book.copies).to.equal(2);
    });

    it("Should store the user address when borrowing a book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      await bookLibrary.connect(addr1).borrowBook(_bookId);
      let _book = await bookLibrary.getBookData(_bookId);

      expect(_book.borrowers.length).to.equal(1);
      expect(_book.borrowers.includes(addr1.address)).to.equal(true);

      await bookLibrary.connect(addr2).borrowBook(_bookId);
      _book = await bookLibrary.getBookData(_bookId);

      expect(_book.borrowers.length).to.equal(2);
      expect(_book.borrowers.includes(addr1.address)).to.equal(true);
      expect(_book.borrowers.includes(addr2.address)).to.equal(true);
    });

    it("Should not store the user address again when borrowing a previously borrowed book", async () => {
      await bookLibrary.addBook(
        bookTwoAdded.title, 
        bookTwoAdded.copies
      );

      const _bookIds = await bookLibrary.getBooksList();
      const _bookId = _bookIds[0];

      // should store user address as a borrower
      await bookLibrary.connect(addr1).borrowBook(_bookId);
      await bookLibrary.connect(addr1).returnBook(_bookId);

      // should not store the user address again
      await bookLibrary.connect(addr1).borrowBook(_bookId);

      const _book = await bookLibrary.getBookData(_bookId);

      expect(_book.borrowers.length).to.equal(1);
      expect(_book.borrowers.includes(addr1.address)).to.equal(true);
    });
  });
});
