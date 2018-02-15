function makeSound() {
    let started = false;
    let ctx = new (window.AudioContext || window.webkitAudioContext)();
    let osc = ctx.createOscillator();
    let gainNode = ctx.createGain();
    let volume = 0.1;
    let portamento = 0.05;
    gainNode.gain.setValueAtTime(volume, 0);
    osc.type = 'square';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    let bpm = 70;
    let barTime = (60 / bpm) * 4; // 4/4

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
    let timeCorrection = 0.000000000000001;

    let oneLoop = false;

    // Separate loop playback from realtime playing
    let loopCounter = 0;
    let loops = [];
    let oscillators = [];
    let gains = [];
    let loopPressedKeys = [];
    let playbackStartedArray = [];
    let octaveChangers = [];
    let timeSyncCorrections = [];

    let playbackVolume = 0.1;

    // TODO: Make a loop into an object instead of using a lot of lists
    //
    // function Loop() {
    //     this.loopOsc = ctx.createOscillator();
    //     this.loopGain = ctx.createGain();
    //
    //     this.loopGain.gain.setValueAtTime(playbackVolume, 0);
    //     this.loopOsc.type = 'square';
    //
    //     this.loopOsc.connect(this.loopGain);
    //     this.loopGain.connect(ctx.destination);
    //
    //     this.playbackStarted = false;
    //     this.pressedKeys = [];
    //     this.loopOctaveChanger = 0;
    // }

    // function createNewLoop() {
    //     loops.push(new Loop());
    // }
    function createNewLoop() {
        let playbackPressedKeys = {};
        let playbackOsc = ctx.createOscillator();
        let playbackGain = ctx.createGain();
        playbackGain.gain.setValueAtTime(playbackVolume, 0);

        playbackOsc.type = 'square';
        playbackOsc.connect(playbackGain);

        playbackGain.connect(ctx.destination);
        oscillators.push(playbackOsc);
        gains.push(playbackGain);
        loopPressedKeys.push(playbackPressedKeys);
        playbackStartedArray.push(false);
        octaveChangers.push(0);

        let timeSyncCorrection = Math.round(ctx.currentTime / barTime) * barTime - ctx.currentTime;
        console.log(timeSyncCorrection);
        timeSyncCorrections.push(timeSyncCorrection);
    }

    let recordButton = document.getElementById('record-button');
    let recordIcon = document.getElementById('record-icon');
    let trashButton = document.getElementById('trash-icon');

    recordButton.addEventListener('click', record);
    trashButton.addEventListener('click', clearLoops);

    document.addEventListener('keypress', recordWithKey);
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

    function loopKeyDownAction(downKey, loopNumber) {
        if (downKey === 'x' || downKey === 'y' || keyToNote(downKey)) {
            if (downKey === 'x') {
                if (octaveChangers[loopNumber] <= 1) {
                    octaveChangers[loopNumber] += 1;
                    playLoopHighestNote(loopNumber);
                }
            } else if (downKey === 'y') {
                if (octaveChangers[loopNumber] >= -1) {
                    octaveChangers[loopNumber] -= 1;
                    playLoopHighestNote(loopNumber);
                }
            }
            if (keyToNote(downKey)) {
                playLoopSound(downKey, loopNumber);
                let key = document.querySelector(`[data-key = ${downKey}]`);
                let label = key.children[0];
                if (label.classList.contains('black-key-label')) {
                    key.classList.add('black-pressed-playback');
                    label.classList.add('black-key-label-pressed');
                } else {
                    key.classList.add('white-pressed-playback');
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

    function loopKeyUpAction(upKey, loopNumber) {
        if (upKey in loopPressedKeys[loopNumber]) {
            stopLoopSound(upKey, loopNumber);
            let key = document.querySelector(`[data-key = ${upKey}]`);
            let label = key.children[0];
            if (label.classList.contains('black-key-label')) {
                key.classList.remove('black-pressed-playback');
                label.classList.remove('black-key-label-pressed');
            } else {
                key.classList.remove('white-pressed-playback');
            }
        }
    }

    function playSound(key) {
        if (keyToNote(key)) {
            pressedKeys[key] = 'pressed';
            if (highestKey(pressedKeys)) key = highestKey(pressedKeys);
            let note = keyToNote(key)[0];
            let octave = keyToNote(key)[1];
            let keyFreq = freq(note, octave + octaveChanger);
            osc.frequency.exponentialRampToValueAtTime(keyFreq, ctx.currentTime + portamento);
            if (started) {
                gainNode.gain.setValueAtTime(volume, 0);
                gainNode.connect(ctx.destination);
            } else if (!started) {
                osc.start(ctx.currentTime + 0.001);
                started = true;
            }
        }
    }

    function playLoopSound(key, loopNumber) {
        if (keyToNote(key)) {
            let pressedKeys = loopPressedKeys[loopNumber];
            pressedKeys[key] = 'pressed';
            if (highestKey(pressedKeys)) key = highestKey(pressedKeys);
            let note = keyToNote(key)[0];
            let octave = keyToNote(key)[1];
            let keyFreq = freq(note, octave + octaveChangers[loopNumber]);
            oscillators[loopNumber].frequency.exponentialRampToValueAtTime(keyFreq, ctx.currentTime + portamento);
            if (playbackStartedArray[loopNumber]) {
                gains[loopNumber].gain.setValueAtTime(playbackVolume, 0);
                gains[loopNumber].connect(ctx.destination);
            } else if (!playbackStartedArray[loopNumber]) {
                oscillators[loopNumber].start(ctx.currentTime + 0.001);
                playbackStartedArray[loopNumber] = true;
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

    function stopLoopSound(key, loopNumber) {
        delete loopPressedKeys[loopNumber][key];
        if (!Object.keys(loopPressedKeys[loopNumber]).length) {
            muteLoop(loopNumber);
        }
        else {
            playLoopHighestNote(loopNumber);
        }
    }

    function mute() {
        if (started) {
            for (let g = volume; g > 0; g = g - 0.01) {
                gainNode.gain.setValueAtTime(g, 0);
            }
            gainNode.disconnect();
        }
    }

    function muteLoop(loopNumber) {
        if (playbackStartedArray[loopNumber]) {
            for (let g = playbackVolume; g > 0; g = g - 0.01) {
                gains[loopNumber].gain.setValueAtTime(g, 0);
            }
            gains[loopNumber].disconnect();
        }
    }

    function highestKey(pressedKeys) {
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
        let key = highestKey(pressedKeys);
        lastKey = key;
        playSound(key);
    }

    function playLoopHighestNote(loopNumber) {
        let key = highestKey(loopPressedKeys[loopNumber]);
        playLoopSound(key, loopNumber);
    }

    function saveStartEvent(key, startTime) {
        if (startTime in storage) startTime += timeCorrection;
        let note;
        let octave;
        if (key !== 'x' && key !== 'y') {
            note = keyToNote(key)[0];
            octave = keyToNote(key)[1] + octaveChanger;
        } else {
            note = null;
            octave = null;
        }
        storage[startTime] = [key, "down", note, octave];
        let request = $.ajax({
            url: '/saveStart',
            method: 'POST',
            data: {
                'key': key, 'startTime': startTime,
                'note': note, 'octave': octave
            }
        });
        request.done(function (response) {
            console.log("start: " + response);
        })
    }

    function saveStopEvent(key, stopTime) {
        if (stopTime in storage) stopTime += timeCorrection;

        let note = keyToNote(key)[0];
        let octave = keyToNote(key)[1] + octaveChanger;

        storage[stopTime] = [key, "up", note, octave];
        let request = $.ajax({
            url: '/saveStop',
            method: 'PUT',
            data: {
                'key': key, 'stopTime': stopTime,
                'note': note, 'octave': octave
            }
        });
        request.done(function (response) {
            console.log("stop: " + response);
        })
    }

    function saveLoopIntoDatabase() {
        let request = $.ajax({
            url: '/saveLoop',
            method: 'POST',
            data: "saveLoop"
        });
        request.done(function (response) {
            console.log(response);
        })
    }

    function record() {
        if (!recordIsOn && !playBackIsOn) {
            // Start loop recording
            recordIsOn = true;
            createNewLoop();
            let keys = Object.keys(pressedKeys);
            keys.forEach(function (item) {
                saveStartEvent(item, 0);
            });
            octaveChangerBeforeRecord = octaveChanger;
            loopStartTime = ctx.currentTime;
            recordIcon.classList.remove('fa-circle');
            recordIcon.classList.remove('fa-stop-circle');
            recordIcon.classList.add('fa-circle-o-notch');
            recordIcon.classList.add('fa-spin');
        } else if (recordIsOn) {
            // Stop loop recording
            initializeKeys();
            recordIsOn = false;
            recordIcon.classList.remove('fa-circle-o-notch');
            recordIcon.classList.remove('fa-spin');
            recordIcon.classList.add('fa-stop-circle');
            recordIcon.classList.add('faa-pulse');
            recordIcon.classList.add('animated');
            loopStopTime = ctx.currentTime;
            playBackIsOn = true;
            loops.push(storage);
            console.log(loops);
            playBack(loopCounter);
            saveLoopIntoDatabase();
            loopCounter++;
        }
        else if (!recordIsOn && playBackIsOn) {
            stopLoops();
        }
    }

    function recordWithKey(event) {
        if (event.key === " ") {
            record();
        }
    }

    function playBack(loopCounter) {
        octaveChangers[loopCounter] = octaveChanger;
        let loopTime = loopStopTime - loopStartTime;
        let roundedLoopTime = Math.round(loopTime / barTime) * barTime;
        if (roundedLoopTime === 0) roundedLoopTime = barTime;
        let roundDiff = loopTime - roundedLoopTime;
        let playbackStartTime = ctx.currentTime - roundDiff;
        playLoop(playbackStartTime, loopCounter);
        loop = setInterval(function () {
            playbackStartTime = ctx.currentTime - roundDiff;
            playLoop(playbackStartTime, loopCounter);
        }, roundedLoopTime * 1000);
    }

    function playLoop(playbackStartTime, loopCounter) {
        octaveRevertBack(loopCounter);
        for (let loopNumber = 0; loopNumber < loops.length; loopNumber++) {
            let storage = loops[loopNumber];
            for (let time in storage) {
                let key = storage[time][0];
                let keyEvent = storage[time][1];
                let waitTime = time - (ctx.currentTime - playbackStartTime) + (timeSyncCorrections[loopCounter] - timeSyncCorrections[loopNumber]);
                let timeout = setTimeout(eventAction, waitTime * 1000, keyEvent, key);

                timeoutList.push(timeout);

                function eventAction(keyEvent, key) {
                    if (keyEvent === 'down') {
                        loopKeyDownAction(key, loopNumber);
                    }
                    if (keyEvent === 'up') {
                        loopKeyUpAction(key, loopNumber);
                    }
                }
            }
        }
    }

    function octaveRevertBack(loopNumber) {
        let octaveDiff = octaveChangers[loopNumber] - octaveChangerBeforeRecord;
        let increment = 0;
        if (octaveDiff !== 0) {
            if (octaveDiff < 0) {
                increment = 1;
            } else {
                increment = -1;
            }
            for (let i = 0; i < Math.abs(octaveDiff); i++) {
                octaveChangers[loopNumber] = octaveChangers[loopNumber] + increment;
                // refreshLabel(increment);
            }
        }
    }

    function initializeKeys() {
        let keys = Object.keys(pressedKeys);
        keys.forEach(function (key) {
            keyUpAction(key);
        });
        pressedKeys = {};
    }

    function initializeLoopKeys() {
        // Stop playing pressed keys
        for (let loopNumber = 0; loopNumber < loops.length; loopNumber++) {
            let keys = Object.keys(loopPressedKeys[loopNumber]);
            keys.forEach(function (key) {
                loopKeyUpAction(key, loopNumber);
            });
            loopPressedKeys[loopNumber] = {};
        }
    }

    function stopLoops() {
        // Stop playing the loop
        recordIcon.classList.remove('animated');
        recordIcon.classList.remove('faa-pulse');
        recordIcon.classList.remove('fa-stop-circle');
        recordIcon.classList.add('fa-circle');
        playBackIsOn = false;
        clearInterval(loop);
        clearAll();
    }

    function clearLoops() {
        stopLoops();
        // Stop loops and delete the data
        for (let loopNumber = 0; loopNumber < loops.length; loopNumber++) {
            muteLoop(loopNumber);
        }
        loopCounter = 0;
        loops = [];
        oscillators = [];
        gains = [];
        loopPressedKeys = [];
        playbackStartedArray = [];
        octaveChangers = [];
        timeSyncCorrections = [];
        let request = $.ajax({
            url: '/deleteAllLoops',
            method: 'DELETE'
        });
        request.done(function (response) {
            console.log(response);
        })
    }

    function clearAll() {
        timeoutList.forEach(function (timeout) {
            clearTimeout(timeout);
        });
        storage = {};
        initializeKeys();
        initializeLoopKeys();
        mute();

        if (oneLoop) clearLoops();

        let request = $.ajax({
            url: '/deleteLoop',
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