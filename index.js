
var port = process.env.PORT || 3000,
  app = require('express')(),
  http = require('http').Server(app),
  io = require('socket.io')(http);



app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  next();
});

app.get('/ping', (req, res) => {

  res.send('pong');

})


app.get('/', (req, res) => {

  function generateGuid() {
    var result, i, j;
    result = '';
    for (j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20)
        result = result + '-';
      i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
      result = result + i;
    }
    return result;
  }

  var dummy = generateGuid();
  console.log(dummy);

  res.send({ text: dummy, status: 200 });
});


io.on('connection', (socket) => {

  console.log('User connected : ' + socket.id);

  socket.on('ping', () => {

    console.log('pong to ' + socket.id);

    io.emit('pong');

  });

  socket.on('add-message', (message) => {

    console.log({ key: message.key, message: message.message, sender: message.sender, published: message.published});
    io.emit('message', { key: message.key, message: message.message, sender: message.sender, published: message.published});

  });


  socket.on('set-nickname', (obj) => {
    console.log(socket.id + ' has changed its name to ' + obj.nickname);
    socket.id = obj.nickname;
  });


});


http.listen(port, function () {
  console.log('listening on port ' + port);
});
