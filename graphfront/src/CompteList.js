// src/CompteList.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

const CompteList = () => {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>All Accounts</h2>
      <ul>
        {data.allComptes.map((compte) => (
          <li key={compte.id}>
            <strong>Account ID:</strong> {compte.id} <br />
            <strong>Balance:</strong> {compte.solde} <br />
            <strong>Creation Date:</strong> {compte.dateCreation} <br />
            <strong>Type:</strong> {compte.type} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompteList;
