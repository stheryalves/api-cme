const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors')

require('dotenv').config();
const conn = require('./database/conn');
conn();

const brandRoute = require('./routes/autoclaveBrandRoute')
const modelRoute = require('./routes/autoclaveModelRoute')
const leadRoute = require('./routes/leadRoute')

app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.get('/', (_, res) => {
    return res.json({ message: '👋 Welcome to CME API!' })
})

app.use('/autoclaveBrand', brandRoute)
app.use('/autoclaveModel', modelRoute)
app.use('/lead', leadRoute)

module.exports = app;