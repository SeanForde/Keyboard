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

const noteToMarginMapping = {
    "C": "0.69",
    "C# / Db": "4.53",
    "D": "8.38",
    "D# / Eb": "12.23",
    "E": "16.07",
    "F": "19.92",
    "F# / Gb": "23.76",
    "G": "27.61",
    "G# / Ab": "31.46",
    "A": "35.30",
    "A# / Bb": "39.15",
    "B": "43"
};

// Reverse mapping for margin to note
const marginToNoteMapping = Object.fromEntries(Object.entries(noteToMarginMapping).map(([note, margin]) => [margin, note]));


const keyboardToNoteMapping = {
    //Lower Octave
    'KeyZ': 'C3',
    'KeyS': 'C#3 / Db3',
    'KeyX': 'D3',
    'KeyD': 'D#3 / Eb3',
    'KeyC': 'E3',
    'KeyV': 'F3',
    'KeyG': 'F#3 / Gb3',
    'KeyB': 'G3',
    'KeyH': 'G#3 / Ab3',
    'KeyN': 'A3',
    'KeyJ': 'A#3 / Bb3',
    'KeyM': 'B3',
    'Comma': 'C4',
    //Higher Octave
    'KeyW': 'C4',
    'Digit3': 'C#4 / Db4',
    'KeyE': 'D4',
    'Digit4': 'D#4 / Eb4',
    'KeyR': 'E4',
    'KeyT': 'F4',
    'Digit6': 'F#4 / Gb4',
    'KeyY': 'G4',
    'Digit7': 'G#4 / Ab4',
    'KeyU': 'A4',
    'Digit8': 'A#4 / Bb4',
    'KeyI': 'B4',
    'KeyO': 'C5',
    // Add mappings for the rest of your keys
};

let jamAlongAudio = null;

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

let audioBuffers = {}; // Replace `audioFiles` initialization

// Drag-related variables
let isDragging = false;
let startX;
let startLeftOffset;

// New DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async function () {
    console.log("First DOMContentLoaded listener.");
    const noteIds = Object.keys(noteMapping);
    const promises = noteIds.map(noteId => {
        const noteName = noteMapping[noteId];
        const url = `keyboardNotes/${noteId}.mp3`;
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                audioBuffers[noteName] = audioBuffer;
            });
    });

    await Promise.all(promises).then(() => {
        console.log('All audio files loaded into buffers');
    }).catch(error => console.error('Error loading audio files into buffers:', error));

    // Additional initialization code can go here, if any
});


// Define loadAudioFiles function here
async function loadAudioFiles() {
    const noteIds = Object.keys(noteMapping);
    const promises = noteIds.map(noteId => {
        const noteName = noteMapping[noteId];
        const url = `keyboardNotes/${noteId}.mp3`;
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                audioBuffers[noteName] = audioBuffer;
            });
    });

    try {
        await Promise.all(promises);
        console.log('All audio files loaded into buffers');
    } catch (error) {
        console.error('Error loading audio files into buffers:', error);
    }
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

function adjustJamCardImageMargin(rootNote) {

    const rootKeyElement = document.querySelector(`.key[data-note="${rootNote}"]`);

    if (rootKeyElement) {
        // Calculate the new margin based on the mapping
        const newLeftMargin = noteToMarginMapping[rootNote];

        // Check if the newLeftMargin is defined to avoid setting undefined or incorrect values
        if (newLeftMargin !== undefined) {
            const jamCardImage = document.getElementById('jamCardImage');
            // Append the '%' symbol to make it a valid CSS value
            jamCardImage.style.left = `${newLeftMargin}%`;
        }
    }
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


function playNote(noteName, keyId) {
    if (!audioBuffers[noteName]) {
        console.error('Audio buffer for note', noteName, 'not found');
        return;
    }

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[noteName];
    source.connect(audioContext.destination);
    source.start(0);

    // Visual feedback code remains unchanged
    const keyElement = document.getElementById(keyId);
    keyElement.classList.add('key-pressed');
    setTimeout(() => {
        keyElement.classList.remove('key-pressed');
    }, 200);
}

function initializeJamCardImageListeners() {
    const jamCardImage = document.getElementById('jamCardImage');
    const jamCardContainer = document.getElementById('jamCardContainer');

    // Function to handle the start of interactions
    function startInteraction(event) {
        // Prevent default action for touch events to avoid scrolling, etc.
        if (event.type.startsWith('touch')) {
            event.preventDefault();
        }

        // Determine if the interaction is directly on the jamCardImage or through delegation
        const targetId = event.type.startsWith('touch') ? event.touches[0].target.id : event.target.id;
        if (targetId === 'jamCardImage') {
            startDrag(event);
        }
    }

    // Directly attach events if jamCardImage is present
    if (jamCardImage) {
        console.log("Attaching mousedown event listener to jamCardImage...");
        jamCardImage.addEventListener('mousedown', startInteraction);
        console.log("Attaching touchstart event listener to jamCardImage...");
        jamCardImage.addEventListener('touchstart', startInteraction, { passive: false });
    }

    // Event delegation approach for the container
    if (jamCardContainer) {
        jamCardContainer.addEventListener('mousedown', function (event) {
            startInteraction(event);
        });
        jamCardContainer.addEventListener('touchstart', function (event) {
            startInteraction(event);
        }, { passive: false });
    }

    // Ensure to attach corresponding move and end events within startDrag or as needed
}





document.addEventListener("DOMContentLoaded", function () {
    console.log("Second DOMContentLoaded listener.");
    var keys = document.querySelectorAll('.white-key, .black-key');
    var rootSelect = document.getElementById('rootSelect');
    var jamCardSelect = document.getElementById('jamCardSelect');
    var jamCardLabel = document.querySelector('label[for="jamCardSelect"]');
    var jamCardContainer = document.getElementById('jamCardContainer');
    const labelShowJamCards = document.querySelector('#labelShowJamCards span');
    const jamCardImage = document.getElementById('jamCardImage'); // Reference to the jam card image
    const showNoteNamesCheckbox = document.getElementById('showNoteNames');
    const showJamCardsCheckbox = document.getElementById('showJamCards');
    const showControlsCheckbox = document.getElementById('showControls');
    const jamAlongTempo = document.getElementById('jamAlongTempo');
    const noteNames = document.querySelectorAll('.note-name-white, .note-name-black');
    const controls = document.querySelector('.controls');
    const piano = document.querySelector('.piano'); // Get the parent element
    const showKeyLabelsCheckbox = document.getElementById('showKeyLabels');
    const keyLabels = document.querySelectorAll('.key-label');
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

    keys.forEach(function (key) {
        key.addEventListener('touchstart', function (event) {
            event.preventDefault(); // Prevent scrolling and other default touch behaviors
            playNote(noteMapping[key.id], key.id);
        }, { passive: false }); // Use passive: false to allow preventDefault
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
            const marginPercentage = noteToMarginMapping[this.value];
            // Set the jamCardImage left position based on the selected root note's margin percentage
            jamCardImage.style.left = `${marginPercentage}%`;


            jamCardSelect.style.display = 'block';
            jamCardLabel.style.display = 'block';
            colorRootNotes(this.value);
            console.log(marginPercentage)

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

        // Handle the coloring of keys based on the selected jam card
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
            };
            if (rootNote !== 'none') {
                adjustJamCardImageMargin(rootNote);
            }
        }

        // Update jam card container visibility and label text based on selection
        if (this.value !== 'none') {
            jamCardImage.src = `jamCards/${this.value}.jpg`; // Adjust path and extension as needed
            jamCardImage.alt = `${this.value} Jam Card`;

            // Default to showing the jam cards when a selection is made
            jamCardContainer.style.display = 'block';
            showJamCardsCheckbox.checked = true; // Ensure the checkbox is checked
            labelShowJamCards.textContent = 'Hide Jam Cards'; // Reflect that jam cards can now be hidden
        } else {
            // No jam card is selected
            jamCardContainer.style.display = 'none';
            showJamCardsCheckbox.checked = false; // Ensure checkbox is not checked
            labelShowJamCards.textContent = 'No Jam Cards to Show'; // Reflect absence of a selection
        }
    });

















    // Function to toggle visibility
    function toggleKeyLabelsVisibility() {
        const isChecked = showKeyLabelsCheckbox.checked;
        keyLabels.forEach(label => {
            label.style.display = isChecked ? '' : 'none';
        });
        // Update label text based on the checkbox state
        document.querySelector('#labelShowKeyLabels span').textContent = isChecked ? 'Hide Computer Keys' : 'Show Computer Keys';
    }

    // Event listener for the checkbox
    showKeyLabelsCheckbox.addEventListener('change', toggleKeyLabelsVisibility);

    // Call the function on page load to apply the initial state
    toggleKeyLabelsVisibility();

    // Start Button Event Listener
    document.getElementById('startButton').addEventListener('click', async function () {
        document.getElementById('overlay').style.display = 'none';

        if (audioContext.state === 'suspended') {
            try {
                await audioContext.resume();
                console.log('AudioContext resumed successfully.');
            } catch (error) {
                console.error('Error resuming AudioContext:', error);
            }
        }

        if (Object.keys(audioBuffers).length === 0) { // Check if audioBuffers is empty
            await loadAudioFiles(); // Call a function to load audio files
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.repeat) return; // Prevent multiple triggers for long key presses
        const note = keyboardToNoteMapping[event.code];
        if (note) {
            // Find the keyId corresponding to the note
            const keyId = Object.keys(noteMapping).find(key => noteMapping[key] === note);
            if (keyId) {
                playNote(note, keyId);
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
        // Determine the state based on jam card selection and checkbox checked state
        if (jamCardSelect.value === 'none') {
            // No jam card is selected
            jamCardContainer.style.display = 'none'; // Ensure container is hidden
            labelShowJamCards.textContent = 'No Jam Cards to Show'; // Reflect no selection
            showJamCardsCheckbox.checked = false; // Uncheck the checkbox as there's nothing to show
        } else if (this.checked) {
            // A jam card is selected, and the checkbox is checked to show it
            if (jamCardImage.getAttribute('src') !== '') {
                jamCardContainer.style.display = 'block'; // Only show if the src is not empty
                labelShowJamCards.textContent = 'Hide Jam Cards'; // Indicate that the jam cards can be hidden
            } else {
                this.checked = false; // Prevent checking if the image src is empty
                labelShowJamCards.textContent = 'No Jam Cards to Show'; // Reflect that there's no image
            }
        } else {
            // The checkbox is unchecked but a jam card is selected
            jamCardContainer.style.display = 'none'; // Hide the container
            labelShowJamCards.textContent = 'Show Jam Cards'; // Offer to show the jam card
        }
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
    jamCardContainer.style.display = 'none'; // Make the Jam Card container visible
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Third DOMContentLoaded listener.");
    const jamCardImage = document.getElementById('jamCardImage');
    const jamCardContainer = document.getElementById('jamCardContainer');
    let isDragging = false;
    let startX = 0;
    let startLeftPercentage = 0; // Track the start left percentage

    function startDrag(e) {
        e.preventDefault(); // Prevent default action (text selection, etc.)
        isDragging = true;
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        startLeftPercentage = (jamCardImage.offsetLeft / jamCardContainer.offsetWidth) * 100;
        jamCardContainer.style.cursor = 'grabbing'; // Visual cue for dragging
        console.log("startDrag Initiated"); // Logging the initiation of drag
    }

    function onDrag(e) {
        if (!isDragging) {
            console.log("onDrag called but not dragging"); // Log for debugging
            return;
        }
        const currentX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const dx = currentX - startX; // Change in X from the start of the drag
        const movePercentage = (dx / jamCardContainer.offsetWidth) * 100;
        jamCardImage.style.left = `${startLeftPercentage + movePercentage}%`;
        console.log("Dragging..."); // Logging dragging movement
    }

    function stopDrag() {
        if (!isDragging) {
            console.log("stopDrag called but wasn't dragging"); // Log for debugging
            return;
        }
        isDragging = false;
        document.body.style.userSelect = ""; // Re-enable text select
        jamCardContainer.style.cursor = ''; // Reset cursor
        console.log("Drag stopped"); // Logging the end of drag

        const jamCardContainerWidth = jamCardContainer.offsetWidth;
        const jamCardFinalLeft = jamCardImage.offsetLeft;
        const finalPositionPercentage = (jamCardFinalLeft / jamCardContainerWidth) * 100;

        let closestNote = null;
        let smallestDifference = Infinity;
        Object.entries(noteToMarginMapping).forEach(([note, marginPercentage]) => {
            const margin = parseFloat(marginPercentage);
            const difference = Math.abs(margin - finalPositionPercentage);
            if (difference < smallestDifference) {
                closestNote = note;
                smallestDifference = difference;
            }
        });

        if (closestNote) {
            rootSelect.value = closestNote;
            rootSelect.dispatchEvent(new Event('change')); // Programmatically trigger the change event
            console.log(`Changed root to ${closestNote}`);
        }
    }

    // Attaching event listeners
    console.log("Attaching mousedown event listener to jamCardImage...");
    jamCardImage.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', stopDrag);
    console.log("Attaching touchstart event listener to jamCardImage...");
    jamCardImage.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', onDrag, { passive: false });
    document.addEventListener('touchend', stopDrag);

    console.log("Event listeners attached");
});








// Other UI initialization code can go here

// Optionally resume the audio context if using Web Audio API elsewhere
if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
        console.log('AudioContext resumed successfully.');
    });
}



function checkOrientation() {
    const orientationAlert = document.getElementById('orientationAlert');
    const piano = document.querySelector('.piano');
    const controls = document.querySelector('.controls');
    const options = document.querySelector('.options'); // Selector for the options container
    const jamCardContainer = document.getElementById('jamCardContainer');
    const rootSelect = document.getElementById('rootSelect');
    const jamCardSelect = document.getElementById('jamCardSelect');

    // Determine if a jam card is selected
    const isJamCardSelected = jamCardSelect && jamCardSelect.value !== 'none';
    const isRootSelected = rootSelect && rootSelect.value !== 'none';

    if (window.innerHeight > window.innerWidth) {
        // In Portrait Mode
        orientationAlert.style.display = 'block';
        h1.style.display = 'none';
        piano.style.display = 'none';
        controls.style.display = 'none'; // Hide controls
        options.style.display = 'none'; // Hide options
        document.body.style.overflow = 'hidden'; // Disable scrolling
        jamCardContainer.style.display = 'none'; // Ensure jam card container is hidden
    } else {
        // In Landscape Mode
        orientationAlert.style.display = 'none';
        h1.style.display = 'block';
        piano.style.display = 'block';
        controls.style.display = 'grid'; // Show controls
        options.style.display = 'flex'; // Show options, adjust the display value as needed
        document.body.style.overflow = 'auto'; // Enable scrolling

        // Only show the jam card container if a root note and jam card are selected
        if (isRootSelected && isJamCardSelected) {
            jamCardContainer.style.display = 'block';
        } else {
            jamCardContainer.style.display = 'none';
        }
    }
}

// Ensure the checkOrientation function is called both on page load and on window resize.
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
