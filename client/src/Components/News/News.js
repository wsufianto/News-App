import React, { useState, useEffect } from 'react'
import NewsList from '../NewsItem/NewsList'
import { useParams, Navigate } from 'react-router-dom'
import { country } from '../../Helpers/CountryCode'
import axios from 'axios'
import * as api from '../../api/index'

const News = () => {

  let { region } = useParams()

  const validRegion = Object.keys(country).includes(region)

  const buttonLabel = (
    <svg
      className="w-6 h-6 text-blue-400"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
      clipRule="evenodd"
    />
    </svg>
  )

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errMessage, setErrMessage] = useState('')

  useEffect(() => {
      const source = axios.CancelToken.source();

      api.fetchNews(region, source)
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
  }, [region])

  const [user] = useState(JSON.parse(localStorage.getItem('user')))
  const [errText, setErrText] = useState('')

  const handleSave = (id) => {
    const selectedNews = data.articles.filter(item => item.title === id)
    
    const saveNews = {
      userId: user.result._id,
      title: selectedNews[0].title,
      description: selectedNews[0].description, 
      author: selectedNews[0].author || '',
      url: selectedNews[0].url, 
      urlToImage: selectedNews[0].urlToImage, 
      publishedAt: selectedNews[0].publishedAt, 
      source: selectedNews[0].source.name
    }
    
    api.addNews(saveNews)
      .then(response => {
        if(response.data.code === 409) {
          setErrText(prevStatus => response.data.msg)
        } else if(response.data.code === 200) {
          setErrText(prevStatus => response.data.msg)
        } else {
          setErrText(prevStatus => "Unknown Error")
        }
      }) 

    const articles = data.articles.filter(item => item.title !== id)
    setData({articles})
  }

  const handleRefresh = () => {
    console.log("refreshing")
    setErrText(prevText => '')
    window.location.reload(false)
  }

  if (!validRegion) {
    return <Navigate to="/*" />
  }  

  return (
    <div className="container bg-blue-100 rounded-lg max-w-7xl max-h-3/4 overflow-auto text-center mx-auto md:my-10 bg-gray-100">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl py-3 px-3 text-blue-600"> Latest News </h1> 
        <button className="p-2 bg-blue-500 text-white rounded-lg border-2 shadow-md" onClick={handleRefresh}>Refresh</button>
      </div>
      <div className="text-red-600">
        { errText !== '' && <p>{errText}</p>}
      </div>
      <NewsList items={data.articles} title={`${country[region]} News`} handleClick={handleSave} isLoading={isLoading} errMessage={errMessage} label={buttonLabel} style={!user?.token ? "invisible" : "visible"} />
    </div>
    
  )
}

export default News