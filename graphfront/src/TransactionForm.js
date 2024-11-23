import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

// GraphQL mutation to save a new transaction
const ADD_TRANSACTION = gql`
  mutation AddTransaction($transaction: TransactionRequest!) {
    addTransaction(transactionRequest: $transaction) {
      id
      montant
      date
      type
      compte {
        id
        solde
      }
    }
  }
`;

// GraphQL query to refetch transactions after a mutation
const GET_TRANSACTIONS = gql`
  query GetTransactions {
    allTransactions {
      id
      montant
      date
      type
      compte {
        id
        solde
      }
    }
  }
`;

const TransactionForm = () => {
  const [montant, setMontant] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState('DEPOT');
  const [compteId, setCompteId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  const [addTransaction] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [{ query: GET_TRANSACTIONS }],
  });
  

  const handleSubmit = (e) => {
    e.preventDefault();

    addTransaction({
      variables: {
        transaction: {
          montant: parseFloat(montant),
          date,
          type,
          compteId: parseInt(compteId),
        },
      },
    })
      .then(() => {
        console.log('Transaction saved successfully!');
        setIsModalOpen(false); // Close modal after saving
        // Reset form fields
        setMontant('');
        setDate('');
        setType('DEPOT');
        setCompteId('');
      })
      .catch((error) => {
        console.error('Error saving transaction:', error);
      });
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
        Create New Transaction
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Transaction</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Amount:</label>
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Date (yyyy-MM-dd):</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="DEPOT">DEPOT</option>
                  <option value="RETRAIT">RETRAIT</option>
                </select>
              </div>
              <div>
                <label>Account ID:</label>
                <input
                  type="number"
                  value={compteId}
                  onChange={(e) => setCompteId(e.target.value)}
                  required
                />
              </div>
              <button className="submit-btn" type="submit">Save Transaction</button>
            </form>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Modal and button styles */}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }
        .close-btn {
          background-color: #f44336;
          color: white;
          margin-top: 10px;
        }
        .submit-btn {
          background-color: #4CAF50;
          color: white;
          margin-top: 10px;
        }
        .open-modal-btn {
        margin : 15px ;
          background-color: #008CBA;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
        }
        button:hover {
          opacity: 0.8;
        }
        .open-modal-btn:hover {
          background-color: #007bb5;
        }
        .submit-btn:hover {
          background-color: #45a049;
        }
        .close-btn:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
