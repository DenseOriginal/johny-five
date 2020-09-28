import * as five from "johnny-five";
import * as ioc from "socket.io-client";
import { ILedChangeDTO } from "@johny-five/interfaces";
var client: SocketIOClient.Socket;
var port = 3333;
var board = new five.Board(); //the Board class from johnny-five module

//When the board is ready create a led object on pin 13 and blink it
//every 500 milliseconds.

enum PINS {
  UP = 12,
  DOWN = 8,
  LEFT = 13,
  RIGHT = 15,
  SPACE = 7,
  CLICK = 6,
}

var LEDS: {
  [index: number]: five.Led
} = {};

board.on("ready", function () {
  ////////////////
  // Socket stuff
  ////////////////
  client = ioc.connect("http://localhost:" + port);

  // Setup socket default event listeners
  client.once("connect", () => {
    console.log('Connected as: ' + client.id);
    identifyAsArduino();
  });

  client.on('reconnect', () => {
    console.log('Reconnected');
    identifyAsArduino();
  });

  client.on('disconnect', () => {
    console.log('Disconnected');
  });

  client.on('reconnect_attempt', () => {
    console.log('Trying to reconnect')
  });

  client.on('reconnect_failed', () => {
    console.log('Failed to reconnect')
  });


  client.on('updateLED', (data: ILedChangeDTO) => {
    try {
      data.fn = eval(data.fn);
      if (LEDS[data.pin]) {
        (data.fn as any)(LEDS[data.pin]);
      } else {
        let newLED = new five.Led(data.pin);
        LEDS[data.pin] = newLED;
        (data.fn as any as Function)(newLED);
      }
    } catch (e) { console.log(e) }
  });

  function identifyAsArduino() {
    client.emit('identifyAsArduino');
  }

  //////////////////
  // Arduino stuff
  //////////////////
  Object.keys(PINS)
    .filter(PIN => !isNaN(PIN as any))
    .forEach(PIN => {
      new five.Button(PIN).on('press', () => {
        client.emit('buttonPressed', {
          pin: PIN
        });
      });
    });


  this.repl.inject({
    LEDS,
    identifyAsArduino
  })
});

function closeConnection() {
  client.emit('arduinoDisconnect');
  client.close();
  console.log('Connection to server closed');
}

board.on('close', () => {
  closeConnection();
  console.log('Lost the board');
});