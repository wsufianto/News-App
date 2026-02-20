import React, { useState, useContext } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { AuthContext } from '../../App' // import authentication context
import { useNavigate, Link } from 'react-router-dom'
import Input from '../Input/Input'
import { signin, signup } from '../../Helpers/AuthActions'
import axios from 'axios'

const Auth = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    cfmPassword: '',
  })
  
  const [signedUp, setSignedUp] = useState(false)
  const { dispatch } = useContext(AuthContext)
  const navigate = useNavigate()

  const clearForm = () => {
    setFormData({
      ...formData,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      cfmPassword: '',
    })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleSignedUp = (e) => {
    e.preventDefault()
    clearForm()
    setSignedUp(prevSignedUp => !signedUp)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if(signedUp) {
      signup({
        dispatch,
        payload: {formData, navigate}
      })
    } else {
      signin({
        dispatch,
        payload: {formData, navigate}
      })
    }
    clearForm()
  }

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        )
        const userInfo = userInfoRes.data
        const result = {
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          email: userInfo.email,
          _id: userInfo.sub,
        }
        const token = tokenResponse.access_token
        dispatch({ type: 'LOGIN', payload: { result, token } })
        navigate('/')
      } catch (error) {
        console.log(error)
      }
    },
    onError: () => {
      console.log("Google Sign In was unsuccessful. Try again later!")
    },
  })

  return (
    <div className="w-full mx-auto mt-8 max-w-sm">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        name="loginform"
        onSubmit={handleSubmit}
      >
        {signedUp ?
          <>
            <Input
              label="First Name"
              autoFocus="autoFocus"
              name="firstName"
              type="text"
              placeholder="First Name"
              value={formData.firstName}
              handleChange={handleChange}
              required="required"
            />
            <Input
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={formData.lastName}
              handleChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              handleChange={handleChange}
              required="required"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="**************"
              value={formData.password}
              handleChange={handleChange}
              required="required"
            />
            <Input
              label="Confirm Password"
              name="cfmPassword"
              type="password"
              placeholder="**************"
              value={formData.cfmPassword}
              handleChange={handleChange}
              required="required"
            />
          </>
          :
          <>
            <Input
              label="Email"
              autoFocus="autoFocus"
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              handleChange={handleChange}
              required="required"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="**************"
              value={formData.password}
              handleChange={handleChange}
              required="required"
            />
          </>
        }
        <div className="flex items-center justify-between">
          <button className="w-1/3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            {signedUp ? `Sign Up` : `Sign In`}
          </button>
          <div className="w-1/2 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            <Link to="#">
              {!signedUp && `Forgot Password?`}
            </Link>
          </div>
        </div>
        {!signedUp && <div className="flex items-center justify-between py-2">
          <button
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => googleLogin()}
          >
            Login with Google
          </button>
        </div>
        }
        <button
          className="text-blue-500 font-bold py-3 text-xs focus:outline-none"
          onClick={toggleSignedUp}> {signedUp ? `Have account? Sign in here.` : `No Account Yet? Sign up here.`}
        </button>
      </form>
    </div>
  )
}

export default Auth
