function handleKeyPress(note) {
    document.getElementById('noteName').textContent = 'Note: ' + note;
}

function resetKeyColors() {
    var keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(function(key) {
        key.style.backgroundColor = key.classList.contains('white-key') ? '#FFFFFF' : '#000000';
    });
}

function colorRootNotes(rootNote) {
    resetKeyColors();

    var noteToIdMapping = {
        "C": ["C3", "C4"],
        "C# / Db": ["C#3 / Db3", "C#4 / Db4"],
        "D": ["D3", "D4"],
        "D# / Eb": ["D#3 / Eb3", "D#4 / Eb4"],
        "E": ["E3", "E4"],
        "F": ["F3", "F4"],
        "F# / Gb": ["F#4 / Gb4", "F#5 / Gb5"],
        "G": ["G3", "G4"],
        "G# / Ab": ["G#4 / Ab4", "G#5 / Ab5"],
        "A": ["A3", "A4"],
        "A# / Bb": ["A#4 / Bb4", "A#5 / Bb5"],
        "B": ["B3", "B4"],
    };

    var rootKeyIds = noteToIdMapping[rootNote];

    if (rootKeyIds) {
        rootKeyIds.forEach(function(keyId) {
            var keyElement = document.getElementById(keyId);
            if (keyElement) {
                keyElement.style.backgroundColor = '#8C52DB';
            }
        });
    }
}

function getNoteAtInterval(rootNote, interval, chromaticScale) {
    let rootIndex = chromaticScale.indexOf(rootNote);
    if (rootIndex === -1) {
        return null;
    }

    let noteIndex = (rootIndex + interval) % chromaticScale.length;
    return chromaticScale[noteIndex];
}

function colorPentatonicScale(rootNote, chromaticScale) {
    resetKeyColors();

    const intervals = [0, 2, 4, 7, 9]; // Intervals for Major Pentatonic scale
    [3, 4].forEach(octave => {
        intervals.forEach(interval => {
            const note = getNoteAtInterval(rootNote, interval, chromaticScale);
            if (note) {
                let noteId = note + octave;
                let keyElement = document.getElementById(noteId);
                if (keyElement) {
                    keyElement.style.backgroundColor = interval === 0 ? '#8C52DB' : '#3E78F1';
                }
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    var keys = document.querySelectorAll('.white-key, .black-key');
    var rootSelect = document.getElementById('rootSelect');
    var jamCardSelect = document.getElementById('jamCardSelect');
    var jamCardContainer = document.querySelector('.jam-card-container');

    keys.forEach(function(key) {
        key.addEventListener('click', function() {
            handleKeyPress(key.id);
        });
    });

    rootSelect.addEventListener('change', function() {
        colorRootNotes(this.value);

        var showJamCard = this.value !== 'none';
        jamCardContainer.style.display = showJamCard ? 'block' : 'none';
        if (!showJamCard) jamCardSelect.value = 'none';
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
            resetKeyColors();
        }
    });

    jamCardContainer.style.display = 'none';
});
