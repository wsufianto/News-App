import * as api from '../api/index.js'

export const signin = async ({dispatch, payload}) => {
  try {
    const { data } = await api.signIn(payload.formData)

    payload.navigate("/")
    
    return dispatch({ 
      type: 'LOGIN', payload: data
    })
  } catch (err) {
    console.log("Something is wrong!")
    if(err.message.includes("404")) return alert("User does not exists!")
    if(err.message.includes("400")) return alert("Invalid Password")
  }
}

export const signup = async ({dispatch, payload}) => {
  try {
    const { data } = await api.signUp(payload.formData)
    payload.navigate("/")
    
    return dispatch({ 
      type: 'LOGIN', payload: data
    })
  } catch (err) {
    console.log(err.message)
  }
}