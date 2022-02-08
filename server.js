const express = require('express');
const app = express();
const createError = require('http-errors')
require('dotenv').config();
const userRoute = require('./routes/user.route')
var bodyParser = require('body-parser')
const PORT  = process.env.PORT || 3001;
const Database = require('./helpers/connections_mongodb')
app.use(bodyParser.json());
app.get('/', (req, res, next)=>{
    res.send(`Hello`)
})

app.use('/user', userRoute)

app.use((req, res, next)=>{
    next(createError.NotFound(`This route does not exits`))
})
app.use((err, req, res, next)=>{
    res.json({
        status: err.status || 500,
        message: err.message
    })
})

app.listen(PORT, async ()=>{
    await Database.instance.connect()
    console.log(`server running on ${PORT}`)
})