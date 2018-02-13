function generateKeyboard() {
    let keyboard = document.getElementById('keyboard');
    const whiteKeys = {
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
    const blackKeys = {
        1: ['w', 'C#', 3],
        2: ['e', 'D#', 3],
        3: ['t', 'F#', 3],
        4: ['z', 'G#', 3],
        5: ['u', 'Bb', 3],
        6: ['o', 'C#', 4],
        7: ['p', 'D#', 4],
        8: ['ú', 'F#', 4]
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
