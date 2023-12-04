import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthWrapper } from './auth/AuthWrapper';
 

function App() {
  return (
    <BrowserRouter>
      <AuthWrapper />
    </BrowserRouter>
  )
}

export default App;