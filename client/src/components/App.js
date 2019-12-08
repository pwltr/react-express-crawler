import React, { useState } from 'react'
import axios from 'axios'
import './App.css'

const UrlRegex = new RegExp(
  '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?',
)

const App = () => {
  // const [url, setURL] = useState('https://www.google.at/')
  const [url, setURL] = useState('')
  const [urlIsValid, setUrlIsValid] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onChange = event => {
    setURL(event.target.value)
    setUrlIsValid(UrlRegex.test(event.target.value))
  }

  const onSubmit = event => {
    event.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)

    axios.get(`http://localhost:3000?url=${url}`).then(response => {
      if (response.data.success) {
        setResult(response.data)
      } else {
        setError(response.data)
      }

      setLoading(false)
    })
  }

  return (
    <div className="container">
      <h1 className="title">Website Analyzer</h1>
      <form className="form" onSubmit={onSubmit}>
        <input
          className="input"
          type="text"
          value={url}
          placeholder="https://www.example.com"
          autoFocus
          onChange={onChange}
        />
        <button className={`button ${!urlIsValid ? 'button--disabled' : ''}`} type="submit">
          Analyze
        </button>
      </form>

      {loading && <div className="loading">Loading...</div>}

      {result && !loading && (
        <div className="result">
          {/* <pre className="result__code">{JSON.stringify(result, null, 2)}</pre> */}

          <table className="result__table">
            <tbody>
              <tr>
                <td>Status</td>
                <td>
                  <div className="indicator indicator--success"></div>
                  {result.statusCode}
                </td>
              </tr>

              <tr>
                <td>Page Title</td>
                <td>{result.pageTitle}</td>
              </tr>

              <tr>
                <td>URL:</td>
                <td>
                  <a href={result.url}>{result.url}</a>
                </td>
              </tr>

              <tr>
                <td>Headings</td>
                <td style={{ textTransform: 'capitalize' }}>
                  {Object.entries(result.headings).map(([key, value]) => (
                    <div key={key}>
                      <span>{key}: </span>
                      <span>{value}</span>
                    </div>
                  ))}
                </td>
              </tr>

              <tr>
                <td>Number of Images</td>
                <td>{result.imagesCount}</td>
              </tr>

              <tr>
                <td>Largest Image</td>
                <td>{result.largestImageURL ? <img src={result.largestImageURL} /> : 'Kein Bild'}</td>
              </tr>

              <tr>
                <td>Internal Links: {result.linksInternal.length}</td>
                <td>
                  <ul>
                    {result.linksInternal.map((link, index) => {
                      return (
                        <li key={index}>
                          <a href={link}>{link}</a>
                        </li>
                      )
                    })}
                  </ul>
                </td>
              </tr>

              <tr>
                <td>External Links: {result.linksExternal.length}</td>
                <td>
                  <ul>
                    {result.linksExternal.map((link, index) => {
                      return (
                        <li key={index}>
                          <a href={link}>{link}</a>
                        </li>
                      )
                    })}
                  </ul>
                </td>
              </tr>

              <tr>
                <td>Inaccessible Links</td>
                <td>{result.linksInaccessible}</td>
              </tr>

              <tr>
                <td>Loading Time</td>
                <td>{result.loadingTime}ms</td>
              </tr>
            </tbody>
          </table>

          <div className="result__html">
            <h3 className="result__htmlTitle">HTML:</h3>
            <div className="result__htmlCode">{result.html}</div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="result error">
          <table className="result__table">
            <tbody>
              <tr>
                <td>Status</td>
                <td>
                  <div className="indicator indicator--error"></div>
                  {error.statusCode}
                </td>
              </tr>

              <tr>
                <td>Description</td>
                <td>{error.error.message}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default App
