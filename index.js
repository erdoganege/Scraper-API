//Followed this tutorial and added more functionality to program: https://www.youtube.com/watch?v=be9sHQ7xqo0
require("dotenv").config()

const express = require("express")
const request = require("request-promise")


const app = express()
const PORT = process.env.PORT || 5000


const baseURL = `https://api.scraperapi.com?api_key=${process.env.apiKey}&autoparse=true`

app.use(express.json()) //json middleware

app.get('/', (req, res) => {
  res.send("HELLO! This my Scraper API")
})

//GET specific product with ID
app.get('/products/:productID', async (req, res) => {
  const {productID} = req.params
  try {
      const response = await request(`${baseURL}&url=https://www.amazon.com/dp/${productID}`)
      res.json(JSON.parse(response))
  } catch (error) {
      res.json(error)
  }
})

//GET reviews of a specific product with ID
app.get('/products/:productID/reviews', async (req, res) => {
  const {productID} = req.params
  try {
      const response = await request(`${baseURL}&url=https://www.amazon.com/product-reviews/${productID}`)
      res.json(JSON.parse(response))
  } catch (error) {
      res.json(error)
  }
})

//GET reviews by filtering according to number of stars (queries =>one_star, two_star, three_star, four_star, five_star)
app.get('/products/:productID/reviews/filter-by-star/:inputQuery', async (req, res) => {
  const {productID, inputQuery} = req.params
  try {
      const response = await request(`${baseURL}&url=https://www.amazon.com/product-reviews/${productID}?filterByStar=${inputQuery}`)
      const data = JSON.parse(response)
      const reviews = data["reviews"]
      //console.log(reviews)
      res.json(reviews)
  } catch (error) {
      res.json(error)
  }
})

//GET results of a search query in search bar (noAds = 1 --> no Ads)
app.get('/search/:inputQuery/:noAds', async (req, res) => {
  const {inputQuery, noAds} = req.params
  try {
      const response = await request(`${baseURL}&url=https://www.amazon.com/s?k=${inputQuery}`)
      //if user does not want any ads
      if (noAds === '1'){
        const data = JSON.parse(response)
        const results = data["results"]
        //console.log(results)
        res.json(results)
      }
      else{
        res.json(JSON.parse(response))
      }  
  } catch (error) {
      res.json(error)
  }
})

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`))
