var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose')
 
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// TODO: learn to make this secret
var dburl = 'mongodb+srv://user:user@cluster0-6fvf1.mongodb.net/test?retryWrites=true'

var messages = [{name : "Bob", message : "Yo"},{name : "Not Bob", message : "Yoyo"}]

app.get('/messages', (req, res) => {
    res.send(messages);
})

app.post('/messages', (req, res) => {
    io.emit('message', req.body)
    messages.push(req.body)
    res.sendStatus(200);
})

io.on('connection', (socket) => {
    console.log("A new user connected");
})

mongoose.connect(dburl, (err) => {
    console.log('Mongo DB connection', err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port ', server.address().port)
})