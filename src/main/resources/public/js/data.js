function freq(note, pos) {
    const freqs = {
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
    const octaves = {
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
    const keys = {
        'a': 1,
        's': 3,
        'd': 5,
        'f': 6,
        'g': 8,
        'h': 10,
        'j': 12,
        'k': 13,
        'l': 15,
        'é': 17,
        'á': 18,
        'ű': 20,
        'w': 2,
        'e': 4,
        't': 7,
        'z': 9,
        'u': 11,
        'o': 14,
        'p': 16,
        'ú': 19
    };
    if (key in keys) {
        return keys[key]
    }
    return false
}


function keyToNote(key) {
    const keys = {
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
        'ú': ['F#', 4]
    };
    if (key in keys) {
        return keys[key]
    }
    return false
}