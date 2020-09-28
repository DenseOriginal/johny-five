// const io = require('socket.io-client');
// const socket = io('localhost:3000');
const socket = io();

const strobeButton = document.getElementById('strobeButton');
const turnOffButton = document.getElementById('turnOffButton');
const pinInput = document.getElementById('pinInput');
const strobeMsInput = document.getElementById('strobeMsInput');
const buttonHistory = document.getElementById('buttonHistory');

strobeButton.addEventListener('click', () => {
    let update = {
        fn: getUpdate(strobeMsInput.value),
        pin: pinInput.value
    };

    socket.emit('updateLED', {
        ...update,
        fn: update.fn
    })
});

turnOffButton.addEventListener('click', () => {
    let update = {
        fn: (LED) => {
            LED.stop();
        },
        pin: pinInput.value
    };

    socket.emit('updateLED', {
        ...update,
        fn: update.fn.toString()
    })
});

function getUpdate(ms) {
    return `(LED) => {
        LED.strobe(${ms});
    }`;
}

socket.on('buttonPressed', (data) => {
    console.log(`Button ${data.pin} was pressed!`);
    let p = document.createElement('p');
    p.innerHTML = `Button ${data.pin} was pressed`;
    buttonHistory.append(p)
})