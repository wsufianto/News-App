import React, { useReducer } from 'react'
import Home from './Components/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import News from './Components/News/News';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotFound from './Components/NotFound/NotFound';
import Footer from './Components/Footer/Footer';
import UserNews from './Components/User/UserNews';
import Contact from './Components/Contact/Contact';
import Auth from './Components/Auth/Auth';
import { reducer, initialState } from './Helpers/AuthContext'

export const AuthContext = React.createContext(null); // exporting authentication context

function App() {

  const [state, dispatch] = useReducer(reducer, initialState) // use the reducer from AuthContext.js

  return (
    <Router>
      {/* Providing context to child if user login or not */}
      <AuthContext.Provider value={{state, dispatch}}> 
      {/* ================================ */}

        <div className="container max-w-full h-screen overflow-auto bg-blue-600">
          <Navbar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/news/:region" element={<News />} />
            <Route exact path="/user/:userId" element={<UserNews />} />
            <Route exact path="/contact" element={<Contact />} />
            <Route exact path="/signin" element={<Auth />} />
            <Route path="/*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </AuthContext.Provider>
    </Router>
  );
}

export default App;
