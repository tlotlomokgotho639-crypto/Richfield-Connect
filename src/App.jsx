import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './AppContext'
import { Navbar, Footer } from './components'
import Home from './views/Home'
import About from './views/About'
import Auth from './views/Auth'
import Profile from './views/Profile'
import Feed from './views/Feed'
import './App.css'

function App() {
  return <BrowserRouter><AppProvider><div className="app-shell"><Navbar /><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/signup" element={<Auth />} /><Route path="/login" element={<Auth mode="login" />} /><Route path="/profile" element={<Profile />} /><Route path="/feed" element={<Feed />} /></Routes><Footer /></div></AppProvider></BrowserRouter>
}

export default App
