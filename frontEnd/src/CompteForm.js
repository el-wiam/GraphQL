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
    }).catch((error) => {
      console.error('Error saving account:', error);
    });
  };

  return (
    <div>
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
        <button type="submit">Save Account</button>
      </form>
    </div>
  );
};

export default CompteForm;
