const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

const brandRoute = require('./routes/autoclaveBrandRoute')
const modelRoute = require('./routes/autoclaveModelRoute')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


app.get('/', (req, res) => {
    return res.json({ message: '👋 Welcome to CME API!' })
})

app.use('/autoclaveBrand', brandRoute)
app.use('/autoClaveModel', modelRoute)

module.exports = app;