const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const app = express()
app.use(helmet())
app.use(morgan('tiny'))

const port = 3000






app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})