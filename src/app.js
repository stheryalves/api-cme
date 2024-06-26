const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

const brandRoute = require('./routes/brandRoute')
const modelRoute = require('./routes/modelRoute')

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


app.get('/', (req, res) => {
    return res.json({ message: '👋 Welcome to CME API!' })
})

app.use('/brand', brandRoute)
app.use('/model', modelRoute)

module.exports = app;