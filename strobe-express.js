
const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const five = require("johnny-five");
const board = new five.Board();

app.use(express.static('js'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() { console.log('user disconnected'); });
  board.on("ready", initBoard)
  socket.on('allume led', manageMessageLED)
})


let boardInit = false;


function initBoard() {
  boardInit = true
  photoresistor = new five.Sensor({
    pin: "A0",
    freq: 50
  });

  board.repl.inject({
    pot: photoresistor
  });
  // "data" get the current reading from the photoresistor
  photoresistor.on("data", function() {
    // console.log(this.value);
    io.emit('LDR', { value: this.value });
  });

}

function manageMessageLED(msg){
  console.log('message: ' + msg);
  var led = new five.Led(9);
  if(boardInit){
    if(msg){
      led.on()
    }else{
      led.off();
    }
  }
}


http.listen(3000, function() {
  console.log('listening on *:3000');
});
