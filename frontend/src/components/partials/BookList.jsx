import { useAccount, useContractReads } from "wagmi";
import { NavLink } from 'react-router-dom';
import { useState } from "react";
import { ethers } from "ethers";

import contractJson from "../../abi/BookLibrary.json";
import { contractAddress } from '../../utils';

function BookList(props) {
  const { isConnected } = useAccount();

  const [ isFailure, setIsFailure ] = useState("");

  const { data: booksData } = useContractReads({
    contracts: props.bookIds.map((item) => ({
      address: contractAddress,
      abi: contractJson.abi,
      functionName: 'getBookData',
      enabled: isConnected,
      args: [ item ],
      watch: true,
      onError(error) {
        setIsFailure(error.message);
      },
    }))
  });

  const renderBookList = (listItems) => {
    let bookItems = [];

    for (let i = 0; i < listItems.length; i++) {
      if (listItems[i].status === "success") {
        const bookResult = listItems[i].result;
        const bookResultId = ethers.solidityPackedKeccak256(["string"], [bookResult.title]);
        const suchAnotherBook = bookItems.find(element => element.id === bookResultId);

        if (!suchAnotherBook) {
          bookItems.push({
            ...bookResult,
            id: bookResultId
          });
        }
      }
    }

    return bookItems.map(item => (
      <li key={ item.id } className="py-2">
        <NavLink 
          to={`/${ item.id }`} 
          className="d-flex justify-content-between align-item-center">
          <span>{ item.title }</span>
          <span>{ item.copies }</span>
        </NavLink>
      </li>
    ));
  };

  return (
    <div className="container mt-6 mb-8">
      {booksData && booksData.length ? (
        <ul className="list-unstyled w-75 p-0">
          <li className="d-flex justify-content-between align-item-center">
            <strong>Title</strong>
            <strong>Copies</strong>
          </li>

          { renderBookList(booksData) }
        </ul>
      ) : (
        <div className="mt-6">No books available.</div>
      )}

      {!!isFailure && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure }</p>
        </div>
      )}
    </div>
  );
}

export default BookList;
