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

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages);
    })
    
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body);

    message.save((err) => {
        if (err) sendStatus(500)

        io.emit('message', req.body)
        res.sendStatus(200);
    })
})

io.on('connection', (socket) => {
    console.log("A new user connected");
})

mongoose.connect(dburl, {useNewUrlParser: true} ,(err) => {
    console.log('Mongo DB connection', err)
})

var server = http.listen(3000, () => {
    console.log('Server is listening on port ', server.address().port)
})