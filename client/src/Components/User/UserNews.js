import React, { useState, useEffect } from 'react'
import axios from 'axios'
import NewsList from '../NewsItem/NewsList'
import * as api from '../../api/index'
import { useParams, Navigate } from 'react-router-dom'

const UserNews = () => {

  const buttonLabel = (
    <svg
      className="w-6 h-6 text-blue-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
        clipRule="evenodd"
      />
    </svg>
  )

  let { userId } = useParams()

  const [user] = useState(JSON.parse(localStorage.getItem('user')))

  
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errMessage, setErrMessage] = useState('')
  
  useEffect(() => {
      const source = axios.CancelToken.source();

      api.userNews(userId, source)
        .then(response => { 
          setData(prevData => response.data)
          setIsLoading(false)
          setErrMessage('')
        })
        .catch(err => {
          if (axios.isCancel(err)) {
            console.log('fetch cancelled!')
          } else {
            setIsLoading(false)
            setErrMessage(err.message)
          }
        })

        return () => {
          source.cancel()
        }    
  }, [userId])

  if (!user || user === null) {
    return <Navigate to="/" />
  }

  const username = `${user.result.firstName} ${user.result.lastName}`

  const handleDelete = (title) => {

    const toDelete = data.filter(item => item.title === title)

    api.deleteNews(toDelete[0]._id)
    console.log("News Deleted!")
    const articles = data.filter(item => item.title !== title)
    setData(articles)
  }

  return (
    <div className="container bg-blue-100 rounded-lg max-w-7xl max-h-3/4 overflow-auto text-center mx-auto md:my-10 bg-gray-100">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl py-3 px-3 text-blue-600"> Saved News </h1>
      </div>
      {userId !== user.result._id ? <Navigate to="/*" /> :
      data.length === 0 && !isLoading? <div className="text-red-500 py-5">No News Found</div> :
        <NewsList items={data} title={`${username}'s News`} isLoading={isLoading} errMessage={errMessage} handleClick={handleDelete} label={buttonLabel} />}
      {(errMessage !== '') && <div className="text-red-500">{errMessage} </div>}
    </div>
  )
}

export default UserNews
