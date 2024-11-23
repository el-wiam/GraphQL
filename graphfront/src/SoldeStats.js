import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_SOLDE_STATS = gql`
  query GetSoldeStats {
    totalSolde {
      count
      sum
      average
    }
  }
`;

const SoldeStats = () => {
  const { loading, error, data } = useQuery(GET_SOLDE_STATS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container">
      <div className="left-side">
        <div className="card">
          <h2>Balance Statistics</h2>
          <p>Total Accounts: {data.totalSolde.count}</p>
          <p>Total Balance: {data.totalSolde.sum}</p>
          <p>Average Balance: {data.totalSolde.average}</p>
        </div>
      </div>
    </div>
  );
};

export default SoldeStats;
