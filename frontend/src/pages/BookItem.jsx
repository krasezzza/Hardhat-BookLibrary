import { useParams, NavLink } from 'react-router-dom';
import { useAccount, useContractReads } from "wagmi";
import { useState } from "react";

import contractJson from "../abi/BookLibrary.json";
import { contractAddress } from '../utils';

function BookItem() {
  const { isConnected, address } = useAccount();

  const routeParams = useParams();

  const [ isFailure0, setIsFailure0 ] = useState("");
  const [ isFailure1, setIsFailure1 ] = useState("");

  const { data: bookData, isLoading } = useContractReads({
    contracts: [
      {
        address: contractAddress,
        abi: contractJson.abi,
        functionName: 'getBookData',
        enabled: isConnected,
        args: [ routeParams.bookId ],
        watch: true,
        onError(error) {
          setIsFailure0(error.message);
        },
      },
      {
        address: contractAddress,
        abi: contractJson.abi,
        functionName: 'isBookBorrowed',
        enabled: isConnected,
        args: [ address, routeParams.bookId ],
        watch: true,
        onError(error) {
          setIsFailure1(error.message);
        },
      }
    ]
  });

  return (
    <div className="container my-6">
      <h1>Book Item</h1>

      {isLoading || !bookData[0].result ? (
        <div className="my-6">Loading...</div>
      ) : (
        <div className="w-75">
          <div className="my-6">
            <span>
              <b>"{ bookData[0].result.title }"</b> has <b>{ bookData[0].result.copies }</b> copies available.
            </span>
          </div>

          {bookData[0].result.borrowers.length > 0 && (
            <div className="mb-3">
              <span>
                This book has been ever borrowed by these users:
              </span>
              <br />
              <span>{ bookData[0].result.borrowers.toString().replace(/,/g, ',\n') }</span>
            </div>
          )}

          <div className="mt-6 d-flex justify-content-between align-item-center">
            {bookData[1].result && (
              <NavLink to={`/${ routeParams.bookId }/return`} 
                state={ bookData[0].result.title } 
                className="btn btn-primary">
                Return
              </NavLink>
            )}

            {!bookData[1].result && bookData[0].result.copies > 0 && (
              <NavLink to={`/${ routeParams.bookId }/borrow`} 
                state={ bookData[0].result.title } 
                className="btn btn-primary">
                Borrow
              </NavLink>
            )}

            <NavLink to="/" 
              className="btn btn-secondary">
              Back
            </NavLink>
          </div>
        </div>
      )}

      {!!isFailure0 && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure0 }</p>
        </div>
      )}

      {!!isFailure1 && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure1 }</p>
        </div>
      )}
    </div>
  );
}

export default BookItem;
