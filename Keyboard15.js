let audioFiles = {};

document.addEventListener("DOMContentLoaded", function() {
    // Preloading audio files
    Object.keys(noteMapping).forEach(noteId => {
        const noteName = noteMapping[noteId];
        audioFiles[noteName] = new Audio('keyboardNotes/' + noteName + '.mp3');
    });

    // ... Rest of your initialization code

    const keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(key => key.addEventListener('click', () => {
        const noteName = noteMapping[key.id];
        playNote(noteName);
    }));
});

function playNote(noteName) {
    if (audioFiles[noteName]) {
        audioFiles[noteName].play();
    }
}

// ... Rest of your JavaScript code


const noteMapping = {
    1: "C3", 2: "C#3 / Db3", 3: "D3", 4: "D#3 / Eb3", 5: "E3", 
    6: "F3", 7: "F#3 / Gb3", 8: "G3", 9: "G#3 / Ab3", 10: "A3", 
    11: "A#3 / Bb3", 12: "B3", 13: "C4", 14: "C#4 / Db4", 15: "D4", 
    16: "D#4 / Eb4", 17: "E4", 18: "F4", 19: "F#4 / Gb4", 20: "G4", 
    21: "G#4 / Ab4", 22: "A4", 23: "A#4 / Bb4", 24: "B4", 25: "C5"
};

const noteToIdMapping = {
    "C": [1, 13, 25],
    "C# / Db": [2, 14],
    "D": [3, 15],
    "D# / Eb": [4, 16],
    "E": [5, 17],
    "F": [6, 18],
    "F# / Gb": [7, 19],
    "G": [8, 20],
    "G# / Ab": [9, 21],
    "A": [10, 22],
    "A# / Bb": [11, 23],
    "B": [12, 24],
};

const chromaticScale = ["C", "C# / Db", "D", "D# / Eb", "E", "F", "F# / Gb", "G", "G# / Ab", "A", "A# / Bb", "B"];

function handleKeyPress(noteNumber) {
    const noteName = noteMapping[noteNumber];
    document.getElementById('noteName').textContent = 'Note: ' + noteName;
}

function clearCardTones() {
    var keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(function(key) {
        // Reset only non-root keys
        if (!key.classList.contains('root-key')) {
            key.style.backgroundColor = key.classList.contains('white-key') ? '#FFFFFF' : '#000000';
        }
    });
}

function colorRootNotes(rootNote) {
    clearCardTones();

    var noteToIdMapping = {
        "C": [1, 13, 25],
        "C# / Db": [2, 14],
        "D": [3, 15],
        "D# / Eb": [4, 16],
        "E": [5, 17],
        "F": [6, 18],
        "F# / Gb": [7, 19],
        "G": [8, 20],
        "G# / Ab": [9, 21],
        "A": [10, 22],
        "A# / Bb": [11, 23],
        "B": [12, 24],
    };

    var rootKeyIds = noteToIdMapping[rootNote];

    if (rootKeyIds) {
        rootKeyIds.forEach(function(keyId) {
            var keyElement = document.getElementById(keyId);
            if (keyElement) {
                keyElement.classList.add('root-key');
                keyElement.style.backgroundColor = '#8C52DB';
            }
        });
    }
}

function getAllIndices(arr, val) {
    let indices = [], i = -1;
    while ((i = arr.indexOf(val, i + 1)) !== -1){
        indices.push(i);
    }
    return indices;
}

function colorKey(keyId, color) {
    let keyElement = document.getElementById(keyId.toString());
    if (keyElement && !keyElement.classList.contains('root-key')) {
        keyElement.style.backgroundColor = color;
    }
}

function getNoteKeyIds(note) {
    // Mapping of note names to their corresponding key IDs
    const noteToKeyId = {
        "C": [1, 13, 25],
        "C# / Db": [2, 14],
        "D": [3, 15],
        "D# / Eb": [4, 16],
        "E": [5, 17],
        "F": [6, 18],
        "F# / Gb": [7, 19],
        "G": [8, 20],
        "G# / Ab": [9, 21],
        "A": [10, 22],
        "A# / Bb": [11, 23],
        "B": [12, 24]
    };

    return noteToKeyId[note] || []; // Return all occurrences of the note
}

//Jam Card Selection Logic

function colorPentatonicScale(rootNote, chromaticScale) {
    const cardTones = [2, 4, 7, 9]; // Intervals for Major Pentatonic scale

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        cardTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1');
            });
        });
    });
}

function colorMinorPentatonicScale(rootNote, chromaticScale) {
    const cardTones = [3, 5, 7, 10]; // Intervals for Minor Pentatonic scale

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        cardTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Or another color to differentiate from major pentatonic
            });
        });
    });
}

function colorMajorScale(rootNote, chromaticScale) {
    const cardTones = [2, 4, 5, 7, 9, 11]; // Intervals for Major scale

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        cardTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Use a distinct color for the Major scale
            });
        });
    });
}

function colorHarmonicMinorScale(rootNote, chromaticScale) {
    const cardTones = [2, 3, 5, 7, 8, 11]; // Intervals for Harmonic Minor scale

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        cardTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Use a distinct color for the Harmonic Minor scale
            });
        });
    });
}



function colorBluesScale(rootNote, chromaticScale) {
    const cardTones = [3, 5, 6, 7, 10]; // Intervals for Blues scale

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        cardTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                // Special color for interval 10
                const color = interval === 6 ? '#DC387D' : '#3E78F1';
                colorKey(keyId, color);
            });
        });
    });
}

function colorMajorChords(rootNote, chromaticScale) {
    const chordTones = [4, 7]; // Intervals for Major chord

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        chordTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Use a distinct color for Major chords
            });
        });
    });
}

function colorMinorChords(rootNote, chromaticScale) {
    const chordTones = [3, 7]; // Intervals for Minor chord

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        chordTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Use a distinct color for Minor chords
            });
        });
    });
}

function colorDominant7thChords(rootNote, chromaticScale) {
    const chordTones = [4, 7, 10]; // Intervals for Dominant 7th chord

    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        chordTones.forEach(interval => {
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
            keyIds.forEach(keyId => {
                colorKey(keyId, '#3E78F1'); // Use a distinct color for Dominant 7th chords
            });
        });
    });
}

function playNote(note) {
    const audio = new Audio('keyboardNotes/' + note + '.mp3');
    audio.play();
}


//Orientation and Event Listeners

function checkOrientation() {
    const orientationAlert = document.getElementById('orientationAlert');
    const piano = document.querySelector('.piano');
    const controls = document.querySelector('.controls');

    if (window.innerHeight > window.innerWidth) {
        orientationAlert.style.display = 'block';
        piano.style.display = 'none';
        controls.style.display = 'none';
    } else {
        orientationAlert.style.display = 'none';
        piano.style.display = 'block';
        controls.style.display = 'block';
    }
}

// Check orientation on load and on resize
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);




document.addEventListener("DOMContentLoaded", function() {
    var keys = document.querySelectorAll('.white-key, .black-key');
    var rootSelect = document.getElementById('rootSelect');
    var jamCardSelect = document.getElementById('jamCardSelect');
    var jamCardLabel = document.querySelector('label[for="jamCardSelect"]');
    var jamCardContainer = document.querySelector('.jam-card-container');

    keys.forEach(function(key) {
        key.addEventListener('click', function() {
            handleKeyPress(key.id);
        });
    });

    rootSelect.addEventListener('change', function() {
        const keys = document.querySelectorAll('.root-key');
        keys.forEach(function(key) {
            key.classList.remove('root-key');
        });
    
        if (this.value !== 'none') {
            jamCardSelect.style.display = 'block';
            jamCardLabel.style.display = 'block';
            colorRootNotes(this.value);
    
            switch (jamCardSelect.value) {
                case 'majorPentatonic':
                    colorPentatonicScale(this.value, chromaticScale);
                    break;
                case 'minorPentatonic':
                    colorMinorPentatonicScale(this.value, chromaticScale);
                    break;
                case 'major':
                    colorMajorScale(this.value, chromaticScale);
                    break;
                case 'harmonicMinor':
                    colorHarmonicMinorScale(this.value, chromaticScale);
                    break;
                case 'blues':
                    colorBluesScale(this.value, chromaticScale);
                    break;
                case 'chordsMajor':
                    colorMajorChords(this.value, chromaticScale);
                    break;
                case 'chordsMinor':
                    colorMinorChords(this.value, chromaticScale);
                    break;
                case 'chordsDominant7th':
                    colorDominant7thChords(this.value, chromaticScale);
                    break;
                default:
                    clearCardTones();
                    break;
            }
        } else {
            jamCardSelect.style.display = 'none';
            jamCardLabel.style.display = 'none';
            jamCardSelect.value = 'none';
            clearCardTones();
        }
    });
    
    
    
    

    jamCardSelect.addEventListener('change', function() {
        const rootNote = rootSelect.value;
        clearCardTones();
    
        if (rootNote !== 'none') {
            switch (this.value) {
                case 'majorPentatonic':
                    colorPentatonicScale(rootNote, chromaticScale);
                    break;
                case 'minorPentatonic':
                    colorMinorPentatonicScale(rootNote, chromaticScale);
                    break;
                case 'major':
                    colorMajorScale(rootNote, chromaticScale);
                    break;
                case 'harmonicMinor':
                    colorHarmonicMinorScale(rootNote, chromaticScale);
                    break;
                case 'blues':
                    colorBluesScale(rootNote, chromaticScale);
                    break;
                case 'chordsMajor':
                    colorMajorChords(rootNote, chromaticScale);
                    break;
                case 'chordsMinor':
                    colorMinorChords(rootNote, chromaticScale);
                    break;
                case 'chordsDominant7th':
                    colorDominant7thChords(rootNote, chromaticScale);
                    break;
                default:
                    clearCardTones();
                    break;
            }
        }
    });

    // Initially hide the jamCardSelect and label
    jamCardSelect.style.display = 'none';
    jamCardLabel.style.display = 'none';
    jamCardContainer.style.display = 'none';
});

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // Portrait mode
        document.getElementById('orientationAlert').style.display = 'block';
        document.querySelector('.piano').style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
    } else {
        // Landscape mode
        document.getElementById('orientationAlert').style.display = 'none';
        document.querySelector('.piano').style.display = 'block';
        document.querySelector('.controls').style.display = 'block';
    }
}

// Check orientation on load and on resize
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
