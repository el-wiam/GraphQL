import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

const TransactionList = () => {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="transaction-container">
      <h2 className="title">Transaction List</h2>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Type</th>
            <th>Account ID</th>
            <th>Account Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.allTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.id}</td>
              <td>{transaction.montant}</td>
              <td>{transaction.date}</td>
              <td>{transaction.type}</td>
              <td>{transaction.compte.id}</td>
              <td>{transaction.compte.solde}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        /* Transaction List Container */
        .transaction-container {
          padding: 20px;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        /* Title Styling */
        .title {
          text-align: center;
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }

        /* Table Styling */
        .transaction-table {
          width: 100%;
          border-collapse: collapse;
          margin: 0 auto;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        /* Table Headers */
        .transaction-table th {
          background-color: #2980b9;
          color: white;
          padding: 10px;
          text-align: left;
          font-weight: bold;
        }

        /* Table Data Cells */
        .transaction-table td {
          background-color: #fff;
          color: #333;
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        /* Zebra Striping for Table Rows */
        .transaction-table tr:nth-child(even) td {
          background-color: #f2f2f2;
        }

        /* Hover Effect on Rows */
        .transaction-table tr:hover td {
          background-color: #f1f1f1;
        }

        /* Table Border */
        .transaction-table {
          border: 1px solid #ddd;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default TransactionList;
