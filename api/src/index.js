const express = require('express')
const bodyParser = require('body-parser')
const url = require('url')
const cors = require('cors')
const rp = require('request-promise')
const cheerio = require('cheerio')
const probeImageSize = require('probe-image-size')
const checkBrokenLinks = require('check-broken-links')

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
  const address = req.query.url

  // validate URL
  if (UrlRegex.test(address)) {
    analyzeWebsite(address)
      .then(result => {
        res.setHeader('Content-Type', 'application/json')
        res.send({
          url: address,
          ...result,
        })
      })
      .catch(error => {
        console.log(error)

        res.setHeader('Content-Type', 'application/json')
        res.send({
          statusCode: 500,
          error: {
            message: 'An error occured while analyzing the website.',
          },
        })
      })
  } else {
    res.setHeader('Content-Type', 'application/json')
    res.send({
      statusCode: 500,
      error: {
        message: 'The URL you entered is not valid',
      },
    })
  }
})

async function analyzeWebsite(uri) {
  const options = {
    uri,
    simple: false,
    resolveWithFullResponse: true,
    time: true,
    headers: {
      'User-Agent': 'Request-Promise',
    },
  }

  const parsedURL = url.parse(uri, true)
  const baseURL = `${parsedURL.protocol}//${parsedURL.host}`
  // const fullURL = `${baseURL}${parsedURL.pathname}`
  const response = await rp(options)

  // statusCode === 2xx
  if (/^2/.test('' + response.statusCode)) {
    const $ = cheerio.load(response.body)

    // Images
    const imageElements = $('img')
    const imageURLs = imageElements.toArray().map(elem => elem.attribs.src)
    const imageURLsParsed = imageURLs.map(imageURL => {
      // const parsedImageURL = url.parse(imageURL, true)
      // TODO: fix all edge cases
      // if protocol missing, add 'https:'
      if (imageURL.startsWith('//')) {
        return `https:${imageURL}`
      }
      // if relative url, add baseURL
      if (imageURL.startsWith('/')) {
        return `${baseURL}${imageURL}`
      }

      return imageURL
    })

    // get image size without full download
    const imagesWithSizes = await Promise.all(imageURLsParsed.map(imageURL => probeImageSize(imageURL)))
    const largestImageURL = imagesWithSizes.length
      ? imagesWithSizes.sort((a, b) => b.width * b.height - a.width * a.height)[0].url
      : null

    // Links
    const links = $('a[href]')
      .toArray()
      .map(element => element.attribs.href)
    const linksInternal = links.filter(link => link.includes(baseURL) || link.startsWith('/'))
    const linksExternal = links.filter(link => !link.includes(baseURL) && !link.startsWith('/'))
    const brokenLinks = await checkBrokenLinks(baseURL, links)
    const linksInaccessible = brokenLinks.top.map(link => link.url)

    return {
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
      imagesCount: imageURLs.length,
      largestImageURL,
      linksInternal,
      linksExternal,
      linksInaccessible,
      loadingTime: response.elapsedTime,
      statusCode: response.statusCode,
    }
  } else if (response.statusCode === 404) {
    return {
      statusCode: response.statusCode,
      // hardcoded because no error description provided by rp
      error: {
        message: '404 - Page not found',
      },
    }
  } else {
    return {
      // for every other statusCode show generic message
      statusCode: response.statusCode,
      error: {
        message: 'An unknown error occured',
      },
    }
  }
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
