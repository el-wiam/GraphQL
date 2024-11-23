import './App.css';
import SoldeStats from './SoldeStats';
import CompteList from './CompteList';
import CompteForm from './CompteForm';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

function App() {
  return (
    <div>
      <h1>Welcome to Taziry's Bank</h1>
      <SoldeStats />
      <TransactionForm />
      <CompteForm />
      <CompteList />
      <TransactionList />
    </div>
  );
}

export default App;