function main(){
    var started = false;
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator(); // instantiate an oscillator
    osc.type = 'square'; // sine is the default - also square, sawtooth, triangle
    osc.connect(ctx.destination); // connect it to the destination
    var keyPressed = true;
    var pressedKeys = {};

    document.addEventListener('keypress', function(event){
        if (keyToNote(event.key)){
            playSound(event.key);
        }
    })

    document.addEventListener('keyup', function(event){
        if (event.key in pressedKeys){
            stopSound(event.key);
        }
    });

    function playSound(key){
        pressedKeys[key] = 'pressed';
        console.log(pressedKeys)
        if (keyToNote(key)){
            var note = keyToNote(key)[0];
            var octave = keyToNote(key)[1];
            var keyFreq = freq(note, octave);
            osc.frequency.value = keyFreq;
            if (started){
                osc.connect(ctx.destination);
                keyPressed = true;
            } else if (!started){
                osc.start(ctx.currentTime);
                started = true;
                console.log('start');
            }
            console.log(note, octave, keyFreq);
        }
    }

    function stopSound(key){
        delete pressedKeys[key];
        console.log(pressedKeys)
        if (!Object.keys(pressedKeys).length){
            osc.disconnect(ctx.destination);
            keyPressed = false;
            console.log('stop');
        }
    }

    function freq(note, pos){
        var freqs = {'C': 130.81,
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
                }
        var octaves = {1: 0.25,
                2: 0.5,
                3: 1,
                4: 2,
                5: 4,
                6: 8}
        if (note in freqs){
            return freqs[note] * octaves[pos]
        }
    }


    function keyToNote(key){
        var keys = {'a': ['C', 3],
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
                }
        if (key in keys){
            return keys[key]
        }
        return false
    }
}

window.onload = function(event){
    main();
}