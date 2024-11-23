import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';

// Queries
const GET_COMPTES_BY_TYPE = gql`
query GetComptesByType($type: TypeCompte) {
  compteByType(type: $type) {
    id
    solde
    dateCreation
    type
  }
}

`;

const GET_ALL_COMPTES = gql`
  query GetAllComptes {
    allComptes {
      id
      solde
      dateCreation
      type
    }
  }
`;

const DELETE_COMPTE = gql`
  mutation DeleteCompte($id: ID!) {
    deleteCompte(id: $id)
  }
`;

const CompteList = () => {
  const [selectedType, setSelectedType] = useState('');
  const [accountTypes] = useState(['COURANT', 'EPARGNE']); // Account types: COURANT, EPARGNE
  
  // Fetch all accounts if no type is selected
  const { loading: loadingAll, error: errorAll, data: allComptesData } = useQuery(GET_ALL_COMPTES, {
    skip: selectedType !== '', // Skip when a type is selected
  });

  // Fetch accounts filtered by type when a type is selected
  const { loading: loadingFiltered, error: errorFiltered, data: filteredData } = useQuery(GET_COMPTES_BY_TYPE, {
    variables: { type: selectedType }, // Passing the selected type as a variable
    skip: !selectedType, // Skip if no type is selected
  });

  const [deleteCompte] = useMutation(DELETE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
    onError: (error) => {
      console.error('Error deleting compte:', error);
    }
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      deleteCompte({ variables: { id } })
        .then(() => {
          console.log('Account deleted successfully');
        })
        .catch((error) => {
          console.error('Error deleting account:', error);
        });
    }
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  // Determine which data to display: either filtered data or all accounts
  const comptesToDisplay = selectedType ? filteredData?.compteByType : allComptesData?.allComptes;

  if (loadingAll || loadingFiltered) return <p>Loading...</p>;
  if (errorAll || errorFiltered) return <p>Error: {errorFiltered?.message || errorAll?.message}</p>;

  return (
    <div>
      <h2>All Accounts</h2>

      {/* Dropdown to filter by account type */}
      <label htmlFor="accountType">Filter by Account Type:</label>
      <select id="accountType" value={selectedType} onChange={handleTypeChange}>
        <option value="">All</option>
        {accountTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <ul>
        {comptesToDisplay?.map((compte) => (
          <li key={compte.id}>
            <strong>Account ID:</strong> {compte.id} <br />
            <strong>Balance:</strong> {compte.solde} <br />
            <strong>Creation Date:</strong> {compte.dateCreation} <br />
            <strong>Type:</strong> {compte.type} <br />
            <button onClick={() => handleDelete(compte.id)} style={{ backgroundColor: '#f44336', color: 'white' }}>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompteList;
