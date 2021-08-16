const express = require('express');
const app = express();

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use('/', express.static(__dirname + '/public'))

const http = require('http')
const server = http.createServer(app)


server.listen(8000, ()=>{
    console.log('Server started at http://localhost:8000');
})
