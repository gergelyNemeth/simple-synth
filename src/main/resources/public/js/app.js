function generateKeyboard() {
    let keyboard = document.getElementById('keyboard');
    let whiteKeys = {
        1: ['a', 'C', 3],
        2: ['s', 'D', 3],
        3: ['d', 'E', 3],
        4: ['f', 'F', 3],
        5: ['g', 'G', 3],
        6: ['h', 'A', 3],
        7: ['j', 'B', 3],
        8: ['k', 'C', 4],
        9: ['l', 'D', 4],
        10: ['é', 'E', 4],
        11: ['á', 'F', 4],
        12: ['ű', 'G', 4]
    };
    let blackKeys = {
        1: ['w', 'C#', 3],
        2: ['e', 'D#', 3],
        3: ['t', 'F#', 3],
        4: ['z', 'G#', 3],
        5: ['u', 'Bb', 3],
        6: ['o', 'C#', 4],
        7: ['p', 'D#', 4],
        8: ['ő', 'F#', 4]
    };
    for (let i = 0; i < 12; i++) {
        let key = document.createElement('div');
        key.className = 'white-key';
        key.dataset.key = whiteKeys[i + 1][0];
        key.style.left = String(i * 80) + 'px';

        let whiteKeyLabel = document.createElement('div');
        whiteKeyLabel.innerHTML = '<b>' + whiteKeys[i + 1][0].toUpperCase() + '</b>' + '<br><br>' +
            whiteKeys[i + 1][1] + '<span class="octave">' + whiteKeys[i + 1][2] + '</span>';
        whiteKeyLabel.className = 'key-label';
        key.appendChild(whiteKeyLabel);

        keyboard.appendChild(key);
    }
    let index = 0;
    for (let i = 0; i < 11; i++) {
        let key = document.createElement('div');
        key.className = 'black-key';
        key.style.left = String(50 + i * 80) + 'px';
        if (i !== 2 && i !== 6 && i !== 9) {
            key.dataset.key = blackKeys[index + 1][0];
            let blackKeyLabel = document.createElement('div');
            blackKeyLabel.innerHTML = '<b>' + blackKeys[index + 1][0].toUpperCase() + '</b>' + '<br><br>' +
                blackKeys[index + 1][1] + '<span class="octave">' + blackKeys[index + 1][2] + '</span>';
            blackKeyLabel.className = 'key-label black-key-label';
            key.appendChild(blackKeyLabel);

            index++;
            keyboard.appendChild(key);
        }
    }
}

function refreshLabel(octaveChanger) {
    let octaveLabels = document.getElementsByClassName('octave');
    for (let i = 0; i < octaveLabels.length; i++) {
        let label = octaveLabels[i];
        label.innerText = String(Number(label.innerText) + octaveChanger);
    }
}

function makeSound() {
    let started = false;
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let osc = ctx.createOscillator();
    let gainNode = ctx.createGain();
    let volume = 0.5;
    let portamento = 0.05;
    gainNode.gain.value = volume;
    osc.type = 'square';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    let pressedKeys = {};
    let octaveChanger = 0;
    let octaveChangerBeforeRecord;
    let loopStartTime;
    let loopStopTime;
    let lastKey = null;
    let storage = {};
    let timeoutList = [];
    let loop;
    let recordIsOn = false;
    let playBackIsOn = false;
    let recordButton = document.getElementById('record-button');
    let recordIcon = document.getElementById('record-icon');

    recordButton.addEventListener('click', record);

    document.addEventListener('keypress', recordWithKey)

    document.addEventListener('keydown', keyDown);

    document.addEventListener('keyup', keyUp);

    function record() {
        if (!recordIsOn && !playBackIsOn) {
            recordIsOn = true;
            clearAll();
            octaveChangerBeforeRecord = octaveChanger;
            loopStartTime = ctx.currentTime;
            recordIcon.classList.remove('fa-circle');
            recordIcon.classList.remove('fa-stop-circle');
            recordIcon.classList.add('fa-circle-o-notch');
            recordIcon.classList.add('fa-spin');
            recordIcon.classList.add('fa-fw');
        } else if (recordIsOn) {
            recordIsOn = false;
            recordIcon.classList.remove('fa-circle-o-notch');
            recordIcon.classList.remove('fa-spin');
            recordIcon.classList.remove('fa-fw');
            recordIcon.classList.add('fa-stop-circle');
            loopStopTime = ctx.currentTime;
            playBackIsOn = true;
            playBack();
        } else if (!recordIsOn && playBackIsOn) {
            recordIcon.classList.remove('fa-stop-circle');
            recordIcon.classList.add('fa-circle');
            playBackIsOn = false;
            clearInterval(loop);
            clearAll();
        }
    }

    function recordWithKey(event) {
        if (event.key === " ") {
            record();
        }
    }

    function octaveRevertBack() {
        let octaveDiff = octaveChanger - octaveChangerBeforeRecord;
        let increment = 0;
        if (octaveDiff !== 0) {
            if (octaveDiff < 0) {
                increment = 1;
            } else {
                increment = -1;
            }
            for (let i = 0; i < Math.abs(octaveDiff); i++) {
                octaveChanger = octaveChanger + increment;
                refreshLabel(increment);
            }
        }
    }

    function loopStorage(playBackStartTime, loopTime, loopCounter) {
        for (let time in storage) {
            octaveRevertBack();
            playBackStartTime = ctx.currentTime + loopTime * loopCounter;
            let key = storage[time][0];
            let keyEvent = storage[time][1];

            let waitTime = time - (ctx.currentTime - playBackStartTime);
            let timeout = setTimeout(eventAction, waitTime * 1000, keyEvent, key);

            timeoutList.push(timeout);

            function eventAction(keyEvent, key) {
                if (keyEvent === 'down') {
                    keyDownAction(key);
                    console.log('key down');
                }
                if (keyEvent === 'up') {
                    keyUpAction(key);
                }
                console.log('play');
            }
        }
    }

    function playBack() {
        let loopCounter = 0;
        let playBackStartTime;
        let loopTime = (loopStopTime - loopStartTime);
        loopStorage(playBackStartTime, loopTime, loopCounter);
        loop = setInterval(function () {
            loopStorage(playBackStartTime, loopTime, loopCounter);
        }, loopTime * 1000);

    }

    function keyDown(event) {
        let downKey = event.key;
        keyDownAction(downKey);
    }

    function keyDownAction(downKey) {
        if (downKey !== lastKey && (downKey === 'x' || downKey === 'y' || keyToNote(downKey))) {
            if (recordIsOn) {
                let keyStartTime = ctx.currentTime - loopStartTime;
                saveStartEvent(downKey, keyStartTime);
            }

            console.log("down: " + downKey);
            lastKey = downKey;

            if (downKey === 'x') {
                if (octaveChanger <= 1) {
                    octaveChanger += 1;
                    refreshLabel(1);
                    playHighestNote();
                }
            } else if (downKey === 'y') {
                if (octaveChanger >= -1) {
                    octaveChanger -= 1;
                    refreshLabel(-1);
                    playHighestNote();
                }
            }
            if (keyToNote(downKey)) {
                playSound(downKey);
                let key = document.querySelector(`[data-key = ${downKey}]`);
                let label = key.children[0];
                if (label.classList.contains('black-key-label')) {
                    key.classList.add('black-pressed');
                    label.classList.add('black-key-label-pressed');
                } else {
                    key.classList.add('white-pressed');
                }
            }
        }
    }

    function keyUp(event) {
        let upKey = event.key;
        keyUpAction(upKey);
    }

    function keyUpAction(upKey) {
        if (upKey in pressedKeys) {
            if (recordIsOn) {
                let keyStopTime = ctx.currentTime - loopStartTime;
                saveStopEvent(upKey, keyStopTime);
            }

            console.log("up: " + upKey);
            lastKey = null;
            stopSound(upKey);
            let key = document.querySelector(`[data-key = ${upKey}]`);
            let label = key.children[0];
            if (label.classList.contains('black-key-label')) {
                key.classList.remove('black-pressed');
                label.classList.remove('black-key-label-pressed');
            } else {
                key.classList.remove('white-pressed');
            }
        }
    }

    function playSound(key) {
        if (keyToNote(key)) {
            pressedKeys[key] = 'pressed';
            if (highestKey()) key = highestKey();
            let note = keyToNote(key)[0];
            let octave = keyToNote(key)[1];
            let keyFreq = freq(note, octave + octaveChanger);
            osc.frequency.exponentialRampToValueAtTime(keyFreq, ctx.currentTime + portamento);
            if (started) {
                gainNode.gain.value = volume;
                gainNode.connect(ctx.destination);
            } else if (!started) {
                osc.start(ctx.currentTime);
                started = true;
            }
        }
    }

    function stopSound(key) {
        delete pressedKeys[key];
        if (!Object.keys(pressedKeys).length) {
            mute();
        }
        else {
            playHighestNote();
        }
    }

    function mute() {
        if (started) {
            for (let g = volume; g > 0; g = g - 0.01) {
                gainNode.gain.value = g;
            }
            gainNode.disconnect();
        }
    }

    function highestKey() {
        let keys = Object.keys(pressedKeys);
        let highestKey;
        keys.forEach(function (item) {
            if (keyOrder(item) > keyOrder(highestKey)) {
                highestKey = item;
            }
        });
        if (highestKey) {
            return highestKey;
        }
        return false;
    }

    function playHighestNote() {
        let key = highestKey();
        lastKey = key;
        playSound(key);
    }

    function saveStartEvent(key, startTime) {
        storage[startTime] = [key, "down"];
        let request = $.ajax({
            url: '/saveStart',
            method: 'POST',
            data: {'key': key, 'startTime': startTime}
        });
        request.done(function (response) {
            console.log("start: " + response);
        })
    }

    function saveStopEvent(key, stopTime) {
        storage[stopTime] = [key, "up"];
        let request = $.ajax({
            url: '/saveStop',
            method: 'PUT',
            data: {'key': key, 'stopTime': stopTime}
        });
        request.done(function (response) {
            console.log("stop: " + response);
        })
    }

    function clearAll() {
        timeoutList.forEach(function (timeout) {
            clearTimeout(timeout);
        });
        storage = {};
        pressedKeys = {};
        mute();
        let request = $.ajax({
            url: '/',
            method: 'DELETE'
        });
        request.done(function (response) {
            console.log(response);
        })
    }
}

function main() {
    generateKeyboard();
    makeSound();
}

window.onload = function () {
    main();
};