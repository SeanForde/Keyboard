const noteMapping = {
    1: "C3", 2: "C#3 / Db3", 3: "D3", 4: "D#3 / Eb3", 5: "E3", 
    6: "F3", 7: "F#3 / Gb3", 8: "G3", 9: "G#3 / Ab3", 10: "A3", 
    11: "A#3 / Bb3", 12: "B3", 13: "C4", 14: "C#4 / Db4", 15: "D4", 
    16: "D#4 / Eb4", 17: "E4", 18: "F4", 19: "F#4 / Gb4", 20: "G4", 
    21: "G#4 / Ab4", 22: "A4", 23: "A#4 / Bb4", 24: "B4", 25: "C5"
};

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

function checkOrientation() {
    if (window.innerHeight > window.innerWidth) {
        // Portrait mode
        document.getElementById('orientationAlert').style.display = 'block';
        document.querySelector('.piano').style.display = 'none';
    } else {
        // Landscape mode
        document.getElementById('orientationAlert').style.display = 'none';
        document.querySelector('.piano').style.display = 'block';
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
        // Clear previous root keys designation
        var keys = document.querySelectorAll('.root-key');
        keys.forEach(function(key) {
            key.classList.remove('root-key');
        });
    
        // Hide or show jamCardSelect and label based on root selection
        if (this.value === 'none') {
            jamCardSelect.style.display = 'none';
            jamCardLabel.style.display = 'none';
            jamCardSelect.value = 'none';
            clearCardTones();
        } else {
            jamCardSelect.style.display = 'block';
            jamCardLabel.style.display = 'block';
            colorRootNotes(this.value);
            
            // Recalculate and recolor card tones based on the new root and selected jam card
            if (jamCardSelect.value !== 'none') {
                colorPentatonicScale(this.value, [
                    "C", "C# / Db", "D", "D# / Eb", "E", "F", "F# / Gb", 
                    "G", "G# / Ab", "A", "A# / Bb", "B"
                ]);
            }
        }
    });
    

    jamCardSelect.addEventListener('change', function() {
        const rootNote = rootSelect.value;
        const chromaticScale = [
            "C", "C# / Db", "D", "D# / Eb", "E", "F", "F# / Gb", 
            "G", "G# / Ab", "A", "A# / Bb", "B"
        ];

        if (this.value === 'majorPentatonic' && rootNote !== 'none') {
            colorPentatonicScale(rootNote, chromaticScale);
        } else {
            clearCardTones();
        }
    });

    // Initially hide the jamCardSelect and label
    jamCardSelect.style.display = 'none';
    jamCardLabel.style.display = 'none';
    jamCardContainer.style.display = 'none';
});
