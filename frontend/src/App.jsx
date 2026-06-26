import HomePage from './pages/HomePage';
import Navbar from './components/common/Navbar'; // Import the Navbar component
import './App.css'; // Keep existing CSS import if it contains global styles or Tailwind directives

function App() {
  return (
    <>
      <Navbar /> {/* Render the Navbar component */}
      <HomePage />
    </>
  );
}

export default App;
