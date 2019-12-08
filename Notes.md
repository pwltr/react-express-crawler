# Notes

1. Project setup
2. Build initial Frontend
3. Build initial API
4. Make API request in Frontend, add loading, success and error states
5. Add validation, error handling (API)
6. Add basic testing
7. Bug fixing
8. Write documentation

### Explain how it could work to crawl a SPA page
Use puppeteer, as the headless Chrome browser will apply styles and run JavaScript to generate the DOM

### Explain how you would improve the app if you’d want to make it prepared for:

1. Production-ready
- add .env variables and update Dockerfile
- add logging
- handle all exceptions
- add responsive styles
- add more tests
- test in all browsers

2. Secured
- add rate limiting
- use TLS
- add shared secret
- ensure dependencies are secure

3. Scalable
- add caching
- run app in a cluster
- use load balancer
- use reverse proxy

4. Faster
- use React production mode
- use gzip compression
