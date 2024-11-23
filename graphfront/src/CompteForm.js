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
              <div className="form-field">
                <label>Amount:</label>
                <input
                  type="number"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Date (yyyy-MM-dd):</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="DEPOT">DEPOT</option>
                  <option value="RETRAIT">RETRAIT</option>
                </select>
              </div>
              <div className="form-field">
                <label>Account ID:</label>
                <input
                  type="number"
                  value={compteId}
                  onChange={(e) => setCompteId(e.target.value)}
                  required
                />
              </div>
              <div className="form-actions">
                <button className="submit-btn" type="submit">Save Transaction</button>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal and button styles */}
      <style jsx>{`
        /* Modal Styling */
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
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          width: 400px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        h2 {
          font-size: 1.5rem;
          color: #2980b9;
          margin-bottom: 20px;
        }

        /* Form and Inputs */
        .form-field {
          margin-bottom: 15px;
        }
        label {
          display: block;
          font-weight: 600;
          margin-bottom: 5px;
        }
        input[type="number"],
        input[type="date"],
        select {
          padding: 12px;
          font-size: 1rem;
          border: 2px solid #bdc3c7;
          border-radius: 6px;
          width: 100%;
          background-color: #ecf0f1;
          transition: all 0.3s;
        }
        input[type="number"]:focus,
        input[type="date"]:focus,
        select:focus {
          border-color: #3498db;
          outline: none;
          background-color: #eaf6fd;
        }

        /* Button Styles */
        button {
          padding: 12px 20px;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          width: 45%;
        }

        .close-btn {
          background-color: #e74c3c;
          color: white;
          margin-left: 10px;
        }
        .submit-btn {
          background-color: #27ae60;
          color: white;
        }

        /* Button Hover Effects */
        button:hover {
          opacity: 0.8;
        }
        .submit-btn:hover {
          background-color: #2ecc71;
        }
        .close-btn:hover {
          background-color: #c0392b;
        }

        /* Open Modal Button */
        .open-modal-btn {
          background-color: #008CBA;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 16px;
          margin-top: 15px;
        }
        .open-modal-btn:hover {
          background-color: #007bb5;
        }
      `}</style>
    </div>
  );
};

export default TransactionForm;
