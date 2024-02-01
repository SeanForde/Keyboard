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

let audioFiles = {};

let jamAlongAudio = null;



// Utility functions defined after global variables but before event-driven code for logical structuring

// Function to play a note and visually press a key
// Revised function to play a note and visually press a key
function playNote(noteName, keyId) {
    // Identifier for the audio element corresponding to the note
    const audioId = `audio_${noteName}`;

    let audioElement = document.getElementById(audioId);
    if (!audioElement) {
        // If the audio element doesn't exist, create it and append to the body
        audioElement = document.createElement('audio');
        audioElement.id = audioId;
        audioElement.src = `keyboardNotes/${keyId}.mp3`;
        document.body.appendChild(audioElement);
    }

    audioElement.currentTime = 0; // Rewind to the start
    audioElement.play();

    // Visual feedback for key press
    const keyElement = document.getElementById(keyId);
    keyElement.classList.add('key-pressed');
    setTimeout(() => {
        keyElement.classList.remove('key-pressed');
    }, 200);
}



function handleKeyPress(noteNumber) {
    const noteName = noteMapping[noteNumber];
    document.getElementById('noteName').textContent = noteName;
}

function clearCardTones() {
    var keys = document.querySelectorAll('.white-key, .black-key');
    keys.forEach(function (key) {
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
        rootKeyIds.forEach(function (keyId) {
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
    while ((i = arr.indexOf(val, i + 1)) !== -1) {
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





// Play-Along Controls
const jamAlongSelect = document.getElementById('jamAlongSelect');
const playStopButton = document.getElementById('playStopButton');

jamAlongSelect.addEventListener('change', function () {
    // Ensure to stop and reset the current track if one is playing
    if (jamAlongAudio) {
        jamAlongAudio.pause();
        jamAlongAudio.currentTime = 0;
    }
    loadJamAlongTrack(this.value);
});

function loadJamAlongTrack(trackName) {
    if (jamAlongAudio) {
        jamAlongAudio.pause();
    }
    jamAlongAudio = new Audio(`jamAlongs/${trackName}.mp3`);
    jamAlongAudio.loop = true;

    // Explicitly set the volume to 1.0 for maximum volume
    jamAlongAudio.volume = 1.0;

    updateJamAlongAudioSettings(); // Apply volume and tempo settings from sliders
}


// Adjust volume and tempo with sliders
document.getElementById('jamAlongVolume').addEventListener('input', updateJamAlongAudioSettings);
document.getElementById('jamAlongTempo').addEventListener('input', updateJamAlongAudioSettings);


// Update volume and tempo immediately after a new track is loaded
function updateJamAlongAudioSettings() {
    if (jamAlongAudio) {
        const volume = document.getElementById('jamAlongVolume').value;
        const tempo = document.getElementById('jamAlongTempo').value / 100;

        jamAlongAudio.volume = volume;
        jamAlongAudio.playbackRate = tempo;
    }
}








playStopButton.addEventListener('click', function () {
    if (jamAlongAudio && !jamAlongAudio.paused) {
        jamAlongAudio.pause();
        this.textContent = 'Play';
    } else if (jamAlongAudio) {
        jamAlongAudio.play();
        this.textContent = 'Stop';
    } else {
        // Load and play the first track by default if no track was previously selected
        const selectedTrack = jamAlongSelect.value || 'Beat 1'; // Default to 'Beat 1' or current selection
        loadJamAlongTrack(selectedTrack);
        jamAlongAudio.play();
        this.textContent = 'Stop';
    }
});


// DOMContentLoaded Event listeners

document.addEventListener("DOMContentLoaded", function () {
    var keys = document.querySelectorAll('.white-key, .black-key');
    var rootSelect = document.getElementById('rootSelect');
    var jamCardSelect = document.getElementById('jamCardSelect');
    var jamCardLabel = document.querySelector('label[for="jamCardSelect"]');
    var jamCardContainer = document.querySelector('.jam-card-container');
    const showNoteNamesCheckbox = document.getElementById('showNoteNames');
    const showJamCardsCheckbox = document.getElementById('showJamCards');
    const showControlsCheckbox = document.getElementById('showControls');
    const jamAlongTempo = document.getElementById('jamAlongTempo');
    const noteNames = document.querySelectorAll('.note-name-white, .note-name-black');
    const controls = document.querySelector('.controls');
    const piano = document.querySelector('.piano'); // Get the parent element
    var keys = document.querySelectorAll('.white-key, .black-key');

    keys.forEach(function (key) {
        key.addEventListener('click', function () {
            playNote(noteMapping[key.id], key.id);
        });
    });

    keys.forEach(function (key) {
        key.addEventListener('click', function () {
            var noteId = key.getAttribute('id');
            var noteName = noteMapping[noteId];
            playNote(noteName, noteId);
        });
    });

    piano.addEventListener('click', function (event) {
        // Check if the clicked element is a key
        if (event.target.classList.contains('white-key') || event.target.classList.contains('black-key')) {
            handleKeyPress(event.target.id); // Pass the key ID to the handler
        }
    });

    document.getElementById('jamAlongVolume').addEventListener('input', function () {
        if (jamAlongAudio) {
            jamAlongAudio.volume = this.value; // Assuming the slider value is between 0 and 100
        }
    });

    document.getElementById('jamAlongTempo').addEventListener('input', function () {
        if (jamAlongAudio) {
            // Convert the tempo slider value to a playback rate.
            // This example assumes the slider value ranges from 60 (slow) to 140 (fast),
            // with 100 being the normal speed. You'll need to adjust the calculation
            // based on your slider's range and desired effect.
            playbackRate = this.value / 100; // Simple example, adjust as needed
            jamAlongAudio.playbackRate = playbackRate;
        }
    });

    rootSelect.addEventListener('change', function () {
        const keys = document.querySelectorAll('.root-key');
        keys.forEach(function (key) {
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

    jamCardSelect.addEventListener('change', function () {
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

    document.addEventListener("DOMContentLoaded", function () {
        // Preloading audio files
        Object.keys(noteMapping).forEach(noteId => {
            const noteName = noteMapping[noteId];
            if (!audioFiles[noteName]) { // Check to avoid reloading if already loaded
                audioFiles[noteName] = new Audio(`keyboardNotes/${noteId}.mp3`);
            }
        });

        // Additional initialization code can go here
    });


    // Toggle display of note names and update label text
    showNoteNamesCheckbox.addEventListener('change', function () {
        document.querySelectorAll('.note-name-white, .note-name-black').forEach(noteName => {
            noteName.style.display = this.checked ? '' : 'none';
        });
        document.querySelector('#labelShowNoteNames span').textContent = this.checked ? 'Hide Note Names' : 'Show Note Names';
    });

    // Toggle display of jam cards and update label text
    showJamCardsCheckbox.addEventListener('change', function () {
        document.getElementById('jamCardContainer').style.display = this.checked ? '' : 'none';
        document.querySelector('#labelShowJamCards span').textContent = this.checked ? 'Hide Jam Cards' : 'Show Jam Cards';
    });

    // Toggle display of controls and update label text
    showControlsCheckbox.addEventListener('change', function () {
        document.querySelector('.controls').style.display = this.checked ? '' : 'none';
        document.querySelector('#labelShowControls span').textContent = this.checked ? 'Hide Controls' : 'Show Controls';
    });



    // Initial state setup based on checkbox default values
    // Note: This step may be optional based on your initial CSS. It ensures the JavaScript respects the initial checkbox states.
    showNoteNamesCheckbox.dispatchEvent(new Event('change'));
    showJamCardsCheckbox.dispatchEvent(new Event('change'));
    showControlsCheckbox.dispatchEvent(new Event('change'));

    // Initially hide the jamCardSelect and label
    jamCardSelect.style.display = 'none';
    jamCardLabel.style.display = 'none';
    jamCardContainer.style.display = 'none';
});

document.getElementById('startButton').addEventListener('click', function () {
    // Preload audio files for each piano key
    Object.keys(noteMapping).forEach(noteId => {
        const noteName = noteMapping[noteId];
        const audioId = `audio_${noteName}`;
        let audioElement = document.getElementById(audioId);
        if (!audioElement) {
            // If the audio element doesn't exist, create it
            audioElement = document.createElement('audio');
            audioElement.id = audioId;
            audioElement.src = `keyboardNotes/${noteId}.mp3`; // Adjust path as needed
            document.body.appendChild(audioElement);
        }
    });

    // Hide the overlay and show the piano interface (if applicable)
    document.getElementById('overlay').style.display = 'none';

    // Other UI initialization code can go here

    // Optionally resume the audio context if using Web Audio API elsewhere
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('AudioContext resumed successfully.');
        });
    }
});



function checkOrientation() {
    const orientationAlert = document.getElementById('orientationAlert');
    const piano = document.querySelector('.piano');
    const controls = document.querySelector('.controls');

    if (window.innerHeight > window.innerWidth) {
        orientationAlert.style.display = 'block';
        piano.style.display = 'none';
        controls.style.display = 'none';
        title.style.display = 'none';
        document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
        orientationAlert.style.display = 'none';
        piano.style.display = 'block';
        controls.style.display = 'grid';
        title.style.display = 'block';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }
}

// Check orientation on load and on resize
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
