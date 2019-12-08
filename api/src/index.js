const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const rp = require('request-promise')
const cheerio = require('cheerio')

const app = express()
const port = 3000

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Enable CORS
app.use(cors())

const UrlRegex = new RegExp(
  '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?',
)

app.get('/', (req, res) => {
  const url = req.query.url

  // validate URL
  if (UrlRegex.test(url)) {
    analyzeWebsite(url)
      .then(result => {
        res.setHeader('Content-Type', 'application/json')
        res.send({
          url,
          ...result,
        })
      })
      .catch(error => {
        res.setHeader('Content-Type', 'application/json')
        res.send({
          success: false,
          statusCode: 500,
          error,
        })
      })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send({
      success: false,
      statusCode: 500,
      error: {
        message: 'The URL you entered is not valid',
      },
    })
  }
})

function analyzeWebsite(uri) {
  const options = {
    uri,
    simple: false, // TODO: doesnt work yet
    time: true,
    transform: (body, response) => [cheerio.load(body), response],
    transform2xxOnly: true,
  }

  return new Promise((resolve, reject) => {
    rp(options)
      .then(([$, response]) => {
        let data = {}

        if (response.statusCode === 200) {
          // Crawling successful
          const images = $('img, picture')
          const largestImagePath = images.length
            ? images
                .toArray()
                .sort((a, b) => b.attribs.width * b.attribs.height - a.attribs.width * a.attribs.height)[0].attribs.src
            : undefined
          const largestImageURL = largestImagePath ? `${uri}${largestImagePath}` : null

          const linksInternalElements = $('a:not([target="_blank"])')
          const linksInternal = linksInternalElements.toArray().map(element => element.attribs.href)

          const linksExternalElements = $('a[target="_blank"]')
          const linksExternal = linksExternalElements.toArray().map(element => element.attribs.href)

          const linksElements = $('a')
          const linksInaccessible = linksElements.toArray().map(element => element.attribs.href === undefined)

          data = {
            success: true,
            html: $.html(),
            pageTitle: $('title').text(),
            headings: {
              heading1: $('h1').length,
              heading2: $('h2').length,
              heading3: $('h3').length,
              heading4: $('h4').length,
              heading5: $('h5').length,
              heading6: $('h6').length,
            },
            imagesCount: images.length,
            largestImageURL,
            linksInternal,
            linksExternal,
            linksInaccessible,
            loadingTime: response.elapsedTime,
            statusCode: response.statusCode,
          }
        } else {
          data = {
            response,
          }
        }

        resolve(data)
      })
      .catch(error => {
        // Request failed due to technical reasons...
        // TEMP: add hardcoded 404 status
        resolve({ success: false, statusCode: 404, error })
      })
  })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
