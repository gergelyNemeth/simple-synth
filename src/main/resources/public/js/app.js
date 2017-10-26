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
    let recordIsOn = false;
    let recordButton = document.getElementById('recordButton');

    recordButton.addEventListener('click', record);

    function record() {
        if (!recordIsOn) {
            recordIsOn = true;
            storage = {};
            octaveChangerBeforeRecord = octaveChanger;
            loopStartTime = ctx.currentTime;
            recordButton.firstChild.classList.remove('fa-circle');
            recordButton.firstChild.classList.add('fa-stop-circle');
        } else {
            recordIsOn = false;
            recordButton.firstChild.classList.remove('fa-stop-circle');
            recordButton.firstChild.classList.add('fa-circle');
            loopStopTime = ctx.currentTime;
            playBack();
        }
    }

    function octaveRevertBack() {
        let octaveDiff = octaveChanger - octaveChangerBeforeRecord;
        if (octaveDiff !== 0) {
            if (octaveDiff < 0) {
                for (let i = octaveDiff; i < 0; i++) {
                    refreshLabel(1);
                }
            } else {
                for (let i = octaveDiff; i > 0; i--) {
                    refreshLabel(-1)
                }
            }
            octaveChanger = octaveChangerBeforeRecord;
        }
    }

    function playBack() {
        let loopCounter = 0;
        let playBackStartTime;
        let loopTime = (loopStopTime - loopStartTime);
        while (loopCounter < 3) {
            octaveRevertBack();
            for (let time in storage) {
                playBackStartTime = ctx.currentTime + loopTime * loopCounter;
                let key = storage[time][0];
                let keyEvent = storage[time][1];
                let waitTime = time - (ctx.currentTime - playBackStartTime);

                setTimeout(eventAction, waitTime * 1000, keyEvent, key);

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
            if (loopCounter === 4) return;

            loopCounter++;
            console.log(loopCounter);
        }
    }

    document.addEventListener('keydown', keyDown);

    document.addEventListener('keyup', keyUp);

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

    function playHighestNote() {
        let key = highestKey();
        lastKey = key;
        playSound(key);
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

    function stopSound(key) {
        delete pressedKeys[key];
        if (!Object.keys(pressedKeys).length) {
            for (let g = volume; g > 0; g = g - 0.01) {
                gainNode.gain.value = g;
            }
            gainNode.disconnect(ctx.destination);
        }
        else {
            playHighestNote();
        }
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
            method: 'POST',
            data: {'key': key, 'stopTime': stopTime}
        });
        request.done(function (response) {
            console.log("stop: " + response);
        })
    }

    function freq(note, pos) {
        let freqs = {
            'C': 130.81,
            'D': 146.83,
            'E': 164.81,
            'F': 174.61,
            'G': 196.0,
            'A': 220.0,
            'B': 246.94,
            'C#': 138.59,
            'D#': 155.56,
            'F#': 185.0,
            'G#': 207.65,
            'Bb': 233.08
        };
        let octaves = {
            1: 0.25,
            2: 0.5,
            3: 1,
            4: 2,
            5: 4,
            6: 8
        };
        if (note in freqs) {
            return freqs[note] * octaves[pos]
        }
    }

    function keyOrder(key) {
        let keys = {
            'a': 1,
            's': 2,
            'd': 3,
            'f': 4,
            'g': 5,
            'h': 6,
            'j': 7,
            'k': 8,
            'l': 9,
            'é': 10,
            'á': 11,
            'ű': 12,
            'w': 13,
            'e': 14,
            't': 15,
            'z': 16,
            'u': 17,
            'o': 18,
            'p': 19,
            'ő': 20
        };
        if (key in keys) {
            return keys[key]
        }
        return false
    }


    function keyToNote(key) {
        let keys = {
            'a': ['C', 3],
            's': ['D', 3],
            'd': ['E', 3],
            'f': ['F', 3],
            'g': ['G', 3],
            'h': ['A', 3],
            'j': ['B', 3],
            'k': ['C', 4],
            'l': ['D', 4],
            'é': ['E', 4],
            'á': ['F', 4],
            'ű': ['G', 4],
            'w': ['C#', 3],
            'e': ['D#', 3],
            't': ['F#', 3],
            'z': ['G#', 3],
            'u': ['Bb', 3],
            'o': ['C#', 4],
            'p': ['D#', 4],
            'ő': ['F#', 4]
        };
        if (key in keys) {
            return keys[key]
        }
        return false
    }
}

function main() {
    generateKeyboard();
    makeSound();
}

window.onload = function () {
    main();
};