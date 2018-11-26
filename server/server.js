const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const config = require('./config')

const app = express()

mongoose.set('useCreateIndex', true)
mongoose.connect(config.database, {useNewUrlParser:true})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(cors())

const userRoutes = require('./routes/account')
app.use('/api/accounts', userRoutes)

app.listen(config.port, () => {
  console.log("Started on port " + config.port)
})