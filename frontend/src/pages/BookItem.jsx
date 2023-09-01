import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { useAccount, useContractReads } from "wagmi";
import { useEffect, useState } from "react";

import contractJson from "../abi/BookLibrary.json";
import { contractAddress } from '../utils';

function BookItem() {
  const { isConnected, address } = useAccount();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  });

  const routeParams = useParams();

  const [ bookLoaded, setBookLoaded ] = useState({
    id: routeParams.bookId,
    title: "",
    copies: 0,
    borrowers: [],
    isUserKeepingNow: false
  });

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
        onError(error) {
          setIsFailure0(error.message);
        },
      },
      {
        address: contractAddress,
        abi: contractJson.abi,
        functionName: 'isBookBorrowed',
        enabled: isConnected && address,
        args: [ address, routeParams.bookId ],
        onError(error) {
          setIsFailure1(error.message);
        },
      }
    ]
  });

  useEffect(() => {
    if (!isLoading && bookData.length && 
        bookData[0].status === "success" && 
        bookData[1].status === "success") {
      setBookLoaded({
        id: routeParams.bookId,
        title: bookData[0].result.title,
        copies: bookData[0].result.copies,
        borrowers: bookData[0].result.borrowers,
        isUserKeepingNow: bookData[1].result
      });
    }
  }, [isLoading, bookData, routeParams.bookId]);

  return (
    <div className="container my-6">
      <h1>Book Item</h1>

      {isLoading && !!bookLoaded.title ? (
        <div className="my-6">Loading...</div>
      ) : (
        <div className="w-75">
          <div className="my-6">
            <span>
              <b>"{ bookLoaded.title }"</b> has <b>{ bookLoaded.copies }</b> copies available.
            </span>
          </div>

          {bookLoaded.borrowers.length > 0 && (
            <div className="mb-3">
              <span>
                This book has been ever borrowed by these users:
              </span>
              <br />
              <span>{ bookLoaded.borrowers.toString().replace(/,/g, ',\n') }</span>
            </div>
          )}

          <div className="mt-6 d-flex justify-content-between align-item-center">
            {bookLoaded.isUserKeepingNow && (
              <NavLink to={`/${ bookLoaded.id }/return`} 
                state={ bookLoaded.title } 
                className="btn btn-primary">
                Return
              </NavLink>
            )}

            {!bookLoaded.isUserKeepingNow && bookLoaded.copies > 0 && (
              <NavLink to={`/${ bookLoaded.id }/borrow`} 
                state={ bookLoaded.title } 
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
