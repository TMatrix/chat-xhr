const app = require('express')();
const http = require('http').Server(app);
const bodyParser = require('body-parser');

let messages = [];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get('/script.js', (req,  res) => {
  res.sendFile(__dirname + '/script.js')
});

app.get('/messages', (req, res) => {
  res.json(messages);
});

app.post('/messages', (req, res) => {
  messages.push(req.body);
});

http.listen(5000, () => {
  console.log('listening on *:5000');
});