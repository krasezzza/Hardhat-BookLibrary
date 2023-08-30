import { useAccount, useContractReads } from "wagmi";
import { useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import { ethers } from "ethers";

import contractJson from "../../abi/BookLibrary.json";
import { contractAddress } from '../../utils';

function BookList(props) {
  const { isConnected } = useAccount();

  const [ bookList, setBookList ] = useState([]);

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

  useEffect(() => {
    if (!bookList.length && booksData) {
      let booksArray = [];

      for (let i = 0; i < booksData.length; i++) {
        if (booksData[i].status === "success") {
          const bookResult = booksData[i].result;
          booksArray.push({
            ...bookResult,
            id: ethers.solidityPackedKeccak256(["string"], [bookResult.title])
          });
        }
      }

      setBookList(booksArray);
    }
  }, [bookList, booksData]);

  const renderBookList = (listItems) => {
    return listItems.map(item => (
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
    <div className="container mt-4 mb-8">
      <ul className="list-unstyled w-75 p-0">
        <li className="d-flex justify-content-between align-item-center">
          <strong>Title</strong>
          <strong>Copies</strong>
        </li>

        { renderBookList(bookList) }
      </ul>

      {!!isFailure && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure }</p>
        </div>
      )}
    </div>
  );
}

export default BookList;
