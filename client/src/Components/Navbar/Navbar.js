import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../../App' // import authentication context
import HomeIcon from '../../Icons/HomeIcon.js'
import ContactIcon from '../../Icons/ContactIcon.js'
import LoginIcon from '../../Icons/LoginIcon.js'
import LogoutIcon from '../../Icons/LogoutIcon.js'
import NewsIcon from '../../Icons/NewsIcon.js'
import { jwtDecode } from 'jwt-decode'

const Navbar = () => {
  const { dispatch } = React.useContext(AuthContext); // useContext to get reducer dispatch function 
  
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
    navigate("/")
    setUser(null)
  },[dispatch, navigate, setUser])
  
  const token = user?.token

  useEffect(() => {
    
    if(token) {
      const decodedToken = jwtDecode(token)
      if (decodedToken.exp * 1000 < new Date().getTime()) handleLogout()
    }

    setUser(JSON.parse(localStorage.getItem('user')))
  },[location, token, handleLogout])

  return (
    <nav className="flex bg-blue-600 h-auto items-center justify-center md:justify-between md:px-5 text-white p-2">
      <h1 className="md:text-lg md:font-bold hidden md:block"> Latest International News </h1>
      <div className="flex md:space-x-3 text-sm md:text-lg">
        <Link to="/" className="p-2 rounded-xl hover:text-blue-600 hover:bg-blue-100">
          <div className="block md:hidden"><HomeIcon /></div>
          <div className="hidden md:block">Home</div> 
        </Link>
        {user?.result &&
          <Link to={`/user/${user?.result._id}`} className="p-2 rounded-xl hover:text-blue-600 hover:bg-blue-100"> 
            <div className="font-bold block md:hidden flex text-xl px-2">{user.result.firstName.charAt(0)}{user.result.lastName.charAt(0)}<NewsIcon /></div> 
            <div className="hidden md:block">{user.result.firstName} {user.result.lastName}'s News </div>
          </Link>
        }
        <Link to="/contact" className="p-2 rounded-xl hover:text-blue-600 hover:bg-blue-100">
          <div className="block md:hidden"><ContactIcon /></div> 
          <div className="hidden md:block">Contact</div> 
        </Link>
        {user?.result?
          <button className="p-2 rounded-xl hover:text-blue-600 hover:bg-blue-100" onClick={handleLogout}>
            <div className="block md:hidden"><LogoutIcon /></div> 
            <div className="hidden md:block">Logout</div>
          </button>
          :
          <Link to="/signin" className="p-2 rounded-xl hover:text-blue-600 hover:bg-blue-100">
            <div className="block md:hidden"><LoginIcon /></div>
            <div className="hidden md:block">Sign-In</div>
          </Link>
        }
      </div>
    </nav>
  )
}

export default Navbar
