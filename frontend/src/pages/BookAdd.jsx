import { useEffect, useState } from "react";
import { useNavigate, NavLink } from 'react-router-dom';
import { 
  useAccount,
  usePrepareContractWrite, 
  useContractWrite, 
  useWaitForTransaction 
} from 'wagmi';
import Form from 'react-bootstrap/Form';
import Button from '../components/ui/Button';

import contractJson from "../abi/BookLibrary.json";
import { contractAddress } from '../utils';

function BookAdd() {
  const { isConnected } = useAccount();

  const navigate = useNavigate();
  useEffect(() => {
    if (!isConnected) {
      navigate("/");
    }
  });

  const [bookForm, setBookForm] = useState({
    title: '',
    copies: 0
  });

  const [ isFailure, setIsFailure ] = useState("");

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: contractJson.abi,
    functionName: 'addBook',
    enabled: isConnected && !!bookForm.title && !!bookForm.copies,
    args: [ bookForm.title, bookForm.copies ],
    onError(error) {
      setIsFailure(error.message);
    },
  });

  const { data, write } = useContractWrite(config);

  const { isLoading, isSuccess, isError, error } = useWaitForTransaction({
    hash: data?.hash,
  });

  const handleInputChange = (evt) => {
    setBookForm({
      ...bookForm,
      [evt.target.name]: evt.target.value
    });
  }

  const handleAddingBook = (evt) => {
    evt.preventDefault();
    write(); // actual adding
    resetBookForm();
  };

  const resetBookForm = () => {
    setBookForm({
      title: '',
      copies: 0
    });
  };

  return (
    <div className="container my-6">
      <h1>Book Add</h1>

      <Form className="mt-4 w-75">
        <Form.Group className="my-3">
          <Form.Label>Book title:</Form.Label>
          <Form.Control type="text" 
                        name="title" 
                        value={ bookForm.title }
                        placeholder="Enter book title" 
                        onChange={ handleInputChange } />
        </Form.Group>

        <Form.Group className="my-3">
          <Form.Label>Book copies:</Form.Label>
          <Form.Control type="number" min="1" 
                        name="copies" 
                        value={ bookForm.copies }
                        placeholder="Enter book copies" 
                        onChange={ handleInputChange } />
        </Form.Group>

        <div className="mt-6 d-flex justify-content-between align-item-center">
          <Button 
            disabled={!write || isLoading} 
            onClick={ handleAddingBook }>
            Submit
          </Button>

          <NavLink to="/" 
            className="btn btn-secondary">
            Back
          </NavLink>
        </div>
      </Form>

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

export default BookAdd;
