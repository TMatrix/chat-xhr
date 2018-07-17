const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

let messages = [];
let usersOnline = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get('/script.js', (req,  res) => {
  res.sendFile(__dirname + '/public/script.js')
});

app.get('/reset.css', (req,  res) => {
  res.sendFile(__dirname + '/public/reset.css')
});
app.get('/chat-body.css', (req,  res) => {
  res.sendFile(__dirname + '/public/chat-body.css')
});
app.get('/style.css', (req,  res) => {
  res.sendFile(__dirname + '/public/style.css')
});

app.post('/', (req, res) => {
  usersOnline.push(req.body)
  // res.json(usersOnline);
  res.end();
});

app.delete('/', (req, res) => {
  usersOnline.splice(usersOnline.indexOf(req.body.nick), 1);
  // res.json(usersOnline);
  res.end();
});

app.get('/messages', (req, res) => {
  res.send(JSON.stringify({messages, usersOnline}));
});

app.post('/messages', (req, res) => {
  messages.push(req.body);
  if (messages.length >= 100){
    messages.shift();
  }
  // res.json(messages);
  res.end();
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});