import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { parse, format } from 'date-fns';

// Define the mutation for saving a new compte
const SAVE_COMPTE = gql`
  mutation SaveCompte($compte: CompteRequest!) {
    saveCompte(compte: $compte) {
      id
      solde
      dateCreation
      type
    }
  }
`;

// Define the query for fetching all comptes
const GET_COMPTES = gql`
  query GetComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

const CompteForm = () => {
  const [solde, setSolde] = useState('');
  const [dateCreation, setDateCreation] = useState('');
  const [type, setType] = useState('COURANT');
  const [saveCompte] = useMutation(SAVE_COMPTE, {
    // After the mutation is successful, refetch the list of comptes
    refetchQueries: [{ query: GET_COMPTES }],
  });

  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Function to convert the date to yyyy-MM-dd format
  const convertDateToYYYYMMDD = (date) => {
    try {
      const parsedDate = parse(date, 'dd/MM/yyyy', new Date());
      return format(parsedDate, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Invalid date format', error);
      return ''; // Return empty string if invalid
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = convertDateToYYYYMMDD(dateCreation);

    saveCompte({
      variables: {
        compte: {
          solde: parseFloat(solde),
          dateCreation: formattedDate,
          type,
        },
      },
    }).then(({ data }) => {
      console.log('New account created:', data.saveCompte);
      setIsModalOpen(false); // Close the modal after successful submission
    }).catch((error) => {
      console.error('Error saving account:', error);
    });
  };

  return (
    <div>
      {/* Button to open the modal */}
      <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
        Create New Account
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create New Account</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Balance:</label>
                <input
                  type="number"
                  value={solde}
                  onChange={(e) => setSolde(e.target.value)}
                />
              </div>
              <div>
                <label>Creation Date (dd/MM/yyyy):</label>
                <input
                  type="text"
                  value={dateCreation}
                  onChange={(e) => setDateCreation(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </div>
              <div>
                <label>Account Type:</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="COURANT">Courant</option>
                  <option value="EPARGNE">Epargne</option>
                </select>
              </div>
              <button className="submit-btn" type="submit">Save Account</button>
            </form>
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Simple CSS for the modal and buttons */}
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

        /* General button styles */
        button {
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
        }

        /* Style for the modal's close button */
        .close-btn {
          background-color: #f44336;
          color: white;
          margin-top: 10px;
        }

        /* Style for the save button */
        .submit-btn {
          background-color: #4CAF50;
          color: white;
          margin-top: 10px;
        }

        /* Style for the button to open the modal */
        .open-modal-btn {
          background-color: #008CBA;
          color: white;
          padding: 10px 20px;
          border-radius: 4px;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }

        /* Button hover effects */
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

export default CompteForm;
