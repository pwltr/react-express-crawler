import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [url, setURL] = useState('')

  const onChange = event => {
    setURL(event.target.value)
  }

  const onSubmit = event => {
    event.preventDefault()
    axios.get(`http://localhost:3000?query=${url}`).then(response => {
      console.log('response', response)
    })
  }

  return (
    <div className="container">
      <h1 className="title">Website Analyzer</h1>
      <form className="form" onSubmit={onSubmit}>
        <input className="input" type="text" value={url} placeholder="Type in your URL" autoFocus onChange={onChange} />
        <button className="button" type="submit">
          Analyze
        </button>
      </form>
    </div>
  )
}

export default App
