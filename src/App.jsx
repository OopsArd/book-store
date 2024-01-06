import { useEffect } from 'react';
import { useNavigate } from 'react-router'
import './App.css'
import HomePage from './pages/Home/Home'


function App() {
  const navigate = useNavigate();
  useEffect(() => {
    let token = localStorage.getItem('ACCESS_TOKEN');
    console.log("token: ", token)
    if(!token){
      navigate('/login');
    }
  },[])

  return (
    <>
      <HomePage />
    </>
  )
}

export default App
