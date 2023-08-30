import { useNavigate, useLocation, useParams, NavLink } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  useAccount,
  usePrepareContractWrite, 
  useContractWrite, 
  useWaitForTransaction 
} from 'wagmi';
import { useEffect, useState } from "react";

import contractJson from "../abi/BookLibrary.json";
import { contractAddress } from '../utils';

function BookBorrow() {
  const { isConnected } = useAccount();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  });

  const location = useLocation();
  const bookTitle = location.state;

  const routeParams = useParams();

  const [ isFailure, setIsFailure ] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'borrowBook',
    enabled: isConnected,
    args: [ routeParams.bookId ],
    onError(error) {
      setIsFailure(error.message);
    },
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleBookBorrow = (evt) => {
    evt.preventDefault();
    write(); // actual borrowing
  }

  return (
    <div className="container my-6">
      <h1>Book Borrow</h1>

      <div className="w-75">
        <div className="mt-6 font-weight-bold">
          Are you sure you want to borrow "<b>{ bookTitle }</b>"?
        </div>

        <div className="mt-6 d-flex justify-content-between align-item-center">
          <Button 
            disabled={!write || isLoading} 
            onClick={ handleBookBorrow }>
            Proceed
          </Button>

          <NavLink to={`/${ routeParams.bookId }`} 
            className="btn btn-secondary">
            Back
          </NavLink>
        </div>
      </div>

      {isLoading && ( <div className="mt-6">Sending...</div> )}

      {isSuccess && (
        <div className="mt-6">
          <a href={`https://sepolia.etherscan.io/tx/${data?.hash}`} 
            target="_blank" rel="noreferrer" className="text-success">
            Successfully stored the contract data to the blockchain.
          </a>
        </div>
      )}

      {!!isFailure && (
        <div className="mt-6">
          <p className="text-danger">{ isFailure }</p>
        </div>
      )}

      {isError && (
        <div className="mt-6">
          <p className="text-danger">{ error.message }</p>
        </div>
      )}
    </div>
  );
}

export default BookBorrow;
