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
    "C": "0",
    "C# / Db": "3.8",
    "D": "7.75",
    "D# / Eb": "11.65",
    "E": "15.55",
    "F": "19.5",
    "F# / Gb": "23.4",
    "G": "27.3",
    "G# / Ab": "31.2",
    "A": "35.2",
    "A# / Bb": "39",
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
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.1; // Set volume to 90%
gainNode.connect(audioContext.destination);




let audioBuffers = {}; // Replace `audioFiles` initialization

let currentProgression = '';




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
        const url = `keyboardNotes/Piano/${noteId}.mp3`;
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                audioBuffers[noteName] = audioBuffer;
            });
        checkOrientation();
    });

    await Promise.all(promises).then(() => {
        console.log('All audio files loaded into buffers');
    }).catch(error => console.error('Error loading audio files into buffers:', error));
    setDropdownsFromParameters();
    setVisibilityControlsFromParameters();

});

document.addEventListener("DOMContentLoaded", function () {
    // Ensure all elements are loaded before attaching listeners
    const copySettingsButton = document.getElementById('copySettingsButton');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupButton = document.getElementById('closePopup');
    const qrCodeContainer = document.getElementById('qrCodeContainer');

    // Event listener for "Copy my settings" button
    copySettingsButton.addEventListener('click', function () {
        console.log('Pop-up should be displayed')
        // Construct the settings URL dynamically
        const settingsUrl = constructSettingsUrl();
        // Generate QR code URL
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(settingsUrl)}`;
        // Set QR code URL to img src within the container
        qrCodeContainer.innerHTML = `<img src="${qrCodeUrl}" alt="Settings QR Code">`;
        // Show the popup
        popupOverlay.style.display = 'flex';
    });

    // Close popup functionality
    closePopupButton.addEventListener('click', function () {
        popupOverlay.style.display = 'none';
    });

    // Function to construct settings URL dynamically based on current settings
    function constructSettingsUrl() {
        const baseUrl = window.location.href.split('?')[0];
        const root = document.getElementById('rootSelect').value;
        const jamcard = document.getElementById('jamCardSelect').value;
        const showNoteNames = document.getElementById('showNoteNames').checked;
        const showJamCards = document.getElementById('showJamCards').checked;
        const showKeyLabels = document.getElementById('showKeyLabels').checked;
        return `${baseUrl}?root=${root}&jamcard=${jamcard}&showNoteNames=${showNoteNames}&showJamCards=${showJamCards}&showKeyLabels=${showKeyLabels}`;
    }
});


// Define loadAudioFiles function here
async function loadAudioFiles(selectedInstrument) {
    const noteIds = Object.keys(noteMapping);
    const promises = noteIds.map(noteId => {
        const noteName = noteMapping[noteId];
        // Update the URL path to include the selectedInstrument folder name
        const url = `keyboardNotes/${selectedInstrument}/${noteId}.mp3`;
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                audioBuffers[noteName] = audioBuffer;
            });
    });

    try {
        await Promise.all(promises);
        console.log('All audio files for', selectedInstrument, 'loaded into buffers');
    } catch (error) {
        console.error('Error loading audio files into buffers:', error);
    }
}


function getURLParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        root: params.get('root'),
        jamcard: params.get('jamcard'),
        showNoteNames: params.get('showNoteNames'),
        showJamCards: params.get('showJamCards'),
        showKeyLabels: params.get('showKeyLabels'),
        showControls: params.get('showControls')
    };
}

function setVisibilityControlsFromParameters() {
    const {
        showNoteNames,
        showJamCards,
        showKeyLabels
    } = getURLParameters();

    const showNoteNamesCheckbox = document.getElementById('showNoteNames');
    const showJamCardsCheckbox = document.getElementById('showJamCards');
    const showKeyLabelsCheckbox = document.getElementById('showKeyLabels');

    if (showNoteNames !== null) showNoteNamesCheckbox.checked = showNoteNames === 'true';
    if (showJamCards !== null) showJamCardsCheckbox.checked = showJamCards === 'true';
    if (showKeyLabels !== null) showKeyLabelsCheckbox.checked = showKeyLabels === 'true';

    // Trigger the change events for these checkboxes to apply the changes
    showNoteNamesCheckbox.dispatchEvent(new Event('change'));
    showJamCardsCheckbox.dispatchEvent(new Event('change'));
    showKeyLabelsCheckbox.dispatchEvent(new Event('change'));
}

function setDropdownsFromParameters() {
    const { root, jamcard } = getURLParameters();

    if (root && jamcard) {
        const rootSelect = document.getElementById('rootSelect');
        const jamCardSelect = document.getElementById('jamCardSelect');

        if (rootSelect && jamCardSelect) {
            rootSelect.value = root;
            jamCardSelect.value = jamcard;

            // Manually trigger change events as setting value programmatically doesn't do this
            rootSelect.dispatchEvent(new Event('change'));
            jamCardSelect.dispatchEvent(new Event('change'));
        }
    }
}


function handleKeyPress(noteNumber) {
    const noteName = noteMapping[noteNumber];
    document.getElementById('noteDisplay').textContent = `${noteName}`;
}



function clearCardTones() {
    const keys = document.querySelectorAll('.white-key, .black-key-1, .black-key-2, .black-key-3, .black-key-4, .black-key-5');
    keys.forEach(key => {
        // Reset background color for all keys
        key.style.backgroundColor = key.classList.contains('white-key') ? '#FFFFFF' : '#000000';
        // If you are using a special class for the root key, consider removing it to reset its state
        key.classList.remove('root-key');
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
                keyElement.style.backgroundColor = '#DC387D';
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
    // This assumes your black keys have IDs that still correlate correctly with your mapping
    let keyElement = document.getElementById(keyId.toString());
    if (keyElement) {
        // Apply color change to all related black key variants
        if (keyElement.classList.contains('black-key-1') || keyElement.classList.contains('black-key-2') || keyElement.classList.contains('black-key-3')) {
            keyElement.style.backgroundColor = color;
        } else if (!keyElement.classList.contains('root-key')) {
            keyElement.style.backgroundColor = color; // For white keys or non-variant black keys
        }
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
                colorKey(keyId, '#42E2D9');
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
                colorKey(keyId, '#42E2D9'); // Or another color to differentiate from major pentatonic
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
                colorKey(keyId, '#42E2D9'); // Use a distinct color for the Major scale
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
                colorKey(keyId, '#42E2D9'); // Use a distinct color for the Harmonic Minor scale
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
                const color = interval === 6 ? '#3E78F1' : '#42E2D9';
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
                colorKey(keyId, '#42E2D9'); // Use a distinct color for Major chords
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
                colorKey(keyId, '#42E2D9'); // Use a distinct color for Minor chords
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
                colorKey(keyId, '#42E2D9'); // Use a distinct color for Dominant 7th chords
            });
        });
    });
}

function colorProgression145(rootNote, chromaticScale) {
    // Chord tones intervals for a major chord (root, major third, perfect fifth)
    const chordTones = [0, 4, 7];

    // Find indices of the root note within the chromatic scale
    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        // For each interval (including the root itself)
        chordTones.forEach(interval => {
            // Calculate the note index within the scale
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            // Fetch key IDs for the calculated note
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);

            // Color each key ID based on whether it's the root or part of the chord
            keyIds.forEach(keyId => {
                if (interval === 0) {
                    // Special color for the root note
                    colorKey(keyId, '#DC387D');
                } else {
                    // Default color for the rest of the chord tones
                    colorKey(keyId, '#42E2D9');
                }
            });
        });
    });
}



function colorProgression1456(rootNote, chromaticScale) {
    // Chord tones intervals for a major chord (root, major third, perfect fifth)
    const chordTones = [0, 4, 7];

    // Find indices of the root note within the chromatic scale
    let rootIndices = getAllIndices(chromaticScale, rootNote);
    if (rootIndices.length === 0) {
        return; // Exit if root note not found
    }

    rootIndices.forEach(rootIndex => {
        // For each interval (including the root itself)
        chordTones.forEach(interval => {
            // Calculate the note index within the scale
            let noteIndex = (rootIndex + interval) % chromaticScale.length;
            // Fetch key IDs for the calculated note
            let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);

            // Color each key ID based on whether it's the root or part of the chord
            keyIds.forEach(keyId => {
                if (interval === 0) {
                    // Special color for the root note
                    colorKey(keyId, '#DC387D');
                } else {
                    // Default color for the rest of the chord tones
                    colorKey(keyId, '#42E2D9');
                }
            });
        });
    });
}

function handleProgressionBoxClick(boxId, rootNote, chromaticScale) {
    clearCardTones(); // Clear all previous colors

    // Exclude box4 logic if not in progression1456
    if (boxId === 'box4' && currentProgression !== 'progression1456') {
        return; // Exit if box4 is clicked but the current progression is not 1456
    }

    const boxToChordTones = {
        'box1': [0, 4, 7],
        'box2': [5, 9, 12],
        'box3': [7, 11, 14],
        'box4': currentProgression === 'progression1456' ? [9, 0, 4] : null
    };

    const specialColorNoteIndex = { 'box1': 0, 'box2': 5, 'box3': 7, 'box4': 9 }; // Index to color specifically

    const chordTones = boxToChordTones[boxId];
    if (!chordTones) return; // Exit if no mapping found for the box

    let rootIndex = chromaticScale.indexOf(rootNote);
    if (rootIndex === -1) return; // Exit if root note not found

    chordTones.forEach(interval => {
        let noteIndex = (rootIndex + interval) % chromaticScale.length;
        let keyIds = getNoteKeyIds(chromaticScale[noteIndex]);
        keyIds.forEach(keyId => {
            // Color the specific root note of each chord with #DC387D
            if (interval === specialColorNoteIndex[boxId]) {
                colorKey(keyId, '#DC387D');
            } else {
                colorKey(keyId, '#42E2D9'); // Use a distinct color for the other notes
            }
        });
    });
}



function adjustJamCardMargin() {
    const jamCardImage = document.getElementById('jamCardImage');
    const isProgression1456 = jamCardSelect.value === 'progression1456';
    jamCardImage.style.marginLeft = isProgression1456 ? '-3.8%' : '0';
}









const instrumentSelect = document.getElementById('instrumentSelect');

instrumentSelect.addEventListener('change', function () {
    const selectedInstrument = this.value;
    loadAudioFiles(selectedInstrument); // Pass the selected instrument to the load function
});






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
    const gainNode = audioContext.createGain(); // Create a new GainNode for each note
    gainNode.gain.value = 0.1; // Adjust if needed to prevent clipping
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
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
    var keys = document.querySelectorAll('.white-key, .black-key-1, .black-key-2, .black-key-3, .black-key-4, .black-key-5');
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
    var keys = document.querySelectorAll('.white-key, .black-key-1, .black-key-2, .black-key-3, .black-key-4, .black-key-5');

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
        console.log("Root select changed. New value:", this.value);
        const keys = document.querySelectorAll('.root-key');
        keys.forEach(function (key) {
            key.classList.remove('root-key');
        });

        // Reference to the jam card image
        const jamCardImage = document.getElementById('jamCardImage');

        if (this.value !== 'none') {
            // A root note is selected
            const marginPercentage = noteToMarginMapping[this.value];
            jamCardImage.style.left = `${marginPercentage}%`; // Adjust the jam card image position

            jamCardSelect.style.display = 'block';
            jamCardLabel.style.display = 'block';
            colorRootNotes(this.value);
            console.log(marginPercentage);

            if (jamCardSelect.value === 'none') {
                console.log("Jamcard set to none");
                // No specific jam card is selected, display the rootOnly.jpg jam card
                jamCardImage.src = 'jamCards/rootOnly.jpg';
                jamCardImage.alt = 'Root Only Jam Card';
                jamCardMessage.innerHTML = '';
                jamCardImage.style.display = 'block';
            } else {
                console.log("Jamcard selected");
                // A specific jam card is selected, apply coloring based on selection
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
                    case 'progression145':
                        colorProgression145(this.value, chromaticScale);
                        break;
                    case 'progression1456':
                        colorProgression1456(this.value, chromaticScale);
                        break;
                    default:
                        // If for some reason the value doesn't match, clear tones and ensure proper handling
                        clearCardTones();
                        break;
                }
            }
        } else {
            // No root note is selected, show the default home.jpg jam card
            jamCardSelect.style.display = 'none';
            jamCardLabel.style.display = 'block';
            jamCardMessage.innerHTML = 'No Root Selected';
            clearCardTones();

            // Set the jamCardImage source to the default home.jpg
            jamCardImage.src = 'jamCards/home.jpg';
            jamCardImage.alt = 'Home Jam Card';
            jamCardImage.style.display = 'block'; // Make sure the image is visible
        }
        // Additional check for special jam card margin adjustment
        if (jamCardSelect.value === 'progression1456') {
            jamCardImage.style.marginLeft = '-3.8%'; // Adjust margin for this special case
        } else {
            // Apply standard margin adjustment based on root note
            const marginPercentage = noteToMarginMapping[this.value];
            jamCardImage.style.left = `${marginPercentage}%`;
        }
        adjustJamCardMargin();
    });

    // Initial call to ensure default behavior on page load
    rootSelect.dispatchEvent(new Event('change'));




    jamCardSelect.addEventListener('change', function () {
        const rootNote = rootSelect.value;
        currentProgression = this.value;
        clearCardTones();
        // Check if the selected jam card is a progression
        if (this.value.startsWith('progression')) {
            // Display the progression boxes
            document.querySelector('.progression-boxes').style.visibility = 'visible';

            // Clear previous values
            document.querySelectorAll('.progression-box').forEach(box => {
                box.textContent = '';
            });

            // Define the chord mappings for each progression type
            const progressionMapping = {
                'progression145': ['I', 'IV', 'V'],
                'progression1456': ['I', 'IV', 'V', 'vi']
            };

            // Get the chords for the selected progression
            const chords = progressionMapping[this.value] || [];

            // Update the content of each progression box with the corresponding Roman numeral
            chords.forEach((chord, index) => {
                const box = document.querySelector(`#box${index + 1}`);
                box.textContent = chord;
                console.log("chords have been set");
            });

        } else {
            // Hide the progression boxes if the selection is not a progression
            document.querySelector('.progression-boxes').style.visibility = 'hidden';
        }

        // If no root note is selected, default actions to show the home jam card
        if (rootNote === 'none' || this.value === 'none') {
            jamCardImage.src = 'jamCards/home.jpg';
            jamCardImage.alt = 'Home Jam Card';
            jamCardContainer.style.display = 'block'; // Ensure container is visible if previously hidden
            labelShowJamCards.textContent = 'Hide Jam Cards'; // Update label to reflect action
            showJamCardsCheckbox.checked = true; // Ensure the checkbox is checked
        } else {
            // Determine the correct jam card based on selection
            let jamCardFilename;
            switch (this.value) {
                case 'majorPentatonic':
                    colorPentatonicScale(rootNote, chromaticScale);
                    jamCardFilename = 'majorPentatonic.jpg';
                    break;
                case 'minorPentatonic':
                    colorMinorPentatonicScale(rootNote, chromaticScale);
                    jamCardFilename = 'minorPentatonic.jpg';
                    break;
                case 'major':
                    colorMajorScale(rootNote, chromaticScale);
                    jamCardFilename = 'major.jpg';
                    break;
                case 'harmonicMinor':
                    colorHarmonicMinorScale(rootNote, chromaticScale);
                    jamCardFilename = 'harmonicMinor.jpg';
                    break;
                case 'blues':
                    colorBluesScale(rootNote, chromaticScale);
                    jamCardFilename = 'blues.jpg';
                    break;
                case 'chordsMajor':
                    colorMajorChords(rootNote, chromaticScale);
                    jamCardFilename = 'chordsMajor.jpg';
                    break;
                case 'chordsMinor':
                    colorMinorChords(rootNote, chromaticScale);
                    jamCardFilename = 'chordsMinor.jpg';
                    break;
                case 'chordsDominant7th':
                    colorDominant7thChords(rootNote, chromaticScale);
                    jamCardFilename = 'chordsDominant7th.jpg';
                    break;
                case 'progression145':
                    colorProgression145(rootNote, chromaticScale);
                    jamCardFilename = 'progression145.jpg';
                    break;
                case 'progression1456':
                    colorProgression1456(rootNote, chromaticScale);
                    jamCardFilename = 'progression1456.jpg';
                    break;
                default:
                    clearCardTones();
                    jamCardFilename = 'rootOnly.jpg'; // Use a default image if selection doesn't match
                    break;
            }

            // Update jam card image source and alternative text
            jamCardImage.src = `jamCards/${jamCardFilename}`;
            jamCardImage.alt = `${this.value.replace(/([A-Z])/g, ' $1').trim()} Jam Card`;
            jamCardContainer.style.display = 'block'; // Show the jam card container
            labelShowJamCards.textContent = 'Hide Jam Cards'; // Update label text to indicate action
            showJamCardsCheckbox.checked = true; // Ensure the checkbox is checked
        }
        // Special case for progression1456.jpg
        if (this.value === 'progression1456') {
            // Adjust the margin specifically for progression1456.jpg
            jamCardImage.style.marginLeft = '-3.8%';
        } else {
            // Reset to default or adjust based on root note if necessary
            const marginPercentage = noteToMarginMapping[rootNote] || '0'; // Fallback to '0' if not found
            jamCardImage.style.left = `${marginPercentage}%`;
        }
        adjustJamCardMargin();
    });


    document.getElementById('jamCardSelect').addEventListener('change', function () {
        const isProgression = this.value.startsWith('progression');
        const progressionBoxes = document.querySelector('.progression-boxes');
        const jamCardImage = document.getElementById('jamCardImage'); // Ensure you have this element correctly referenced

        if (isProgression) {
            progressionBoxes.style.visibility = 'visible';
            progressionBoxes.style.opacity = 1;
        } else {
            progressionBoxes.style.visibility = 'hidden';
            progressionBoxes.style.opacity = 0;
        }

        // Adjust margin for the jamCardImage based on specific progression selection
        if (this.value === 'progression1456') {
            jamCardImage.style.marginLeft = '-3.8%';
        } else {
            jamCardImage.style.marginLeft = '0'; // Reset to default if not progression1456
        }
    });

    // Initially set up the click listeners once outside the 'change' event listener
    document.querySelectorAll('.progression-box').forEach(box => {
        box.addEventListener('click', handleBoxClick);
    });

    function handleBoxClick() {
        const rootSelectElement = document.getElementById('rootSelect');
        const currentRootNote = rootSelectElement.value;
        // Ensure clearCardTones is called to reset the key colors
        clearCardTones();
        handleProgressionBoxClick(this.id, currentRootNote, chromaticScale); // 'this' refers to the clicked box
    }




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
        document.querySelectorAll('.note-name-white, .note-name-black-1, .note-name-black-2, .note-name-black-3').forEach(noteName => {
            noteName.style.display = this.checked ? '' : 'none';
        });
        document.querySelector('#labelShowNoteNames span').textContent = this.checked ? 'Hide Note Names' : 'Show Note Names';
    });

    // Toggle display of jam cards and update label text
    showJamCardsCheckbox.addEventListener('change', function () {
        // Assuming 'home.jpg' is the default view when no root or jam card is selected
        // and 'rootOnly.jpg' is shown when a root is selected but no specific jam card is chosen.
        const rootNote = rootSelect.value;
        const jamCardSelection = jamCardSelect.value;

        // Check if the checkbox is checked
        if (this.checked) {
            // Show the jam card container
            jamCardContainer.style.display = 'block';

            if (rootNote === 'none') {
                // No root note selected, show 'home' jam card
                jamCardImage.src = 'jamCards/home.jpg';
                jamCardImage.alt = 'Home Jam Card';
                labelShowJamCards.textContent = 'Hide Jam Cards';
            } else if (jamCardSelection === 'none') {
                // Root note selected but no specific jam card chosen, show 'rootOnly' jam card
                jamCardImage.src = 'jamCards/rootOnly.jpg';
                jamCardImage.alt = 'Root Only Jam Card';
                labelShowJamCards.textContent = 'Hide Jam Cards';
            } else {
                // A specific jam card is selected, no change needed here as the src should already be set
                labelShowJamCards.textContent = 'Hide Jam Cards';
            }
        } else {
            // The checkbox is unchecked
            jamCardContainer.style.display = 'none';
            labelShowJamCards.textContent = 'Show Jam Cards';
        }
    });





    // Initial state setup based on checkbox default values
    // Note: This step may be optional based on your initial CSS. It ensures the JavaScript respects the initial checkbox states.
    showNoteNamesCheckbox.dispatchEvent(new Event('change'));
    showJamCardsCheckbox.dispatchEvent(new Event('change'));

    // Initially hide the jamCardSelect and label
    jamCardSelect.style.display = 'none';
    jamCardLabel.style.display = 'No Root Selected';
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



document.addEventListener('keydown', function (event) {
    if (event.repeat) return; // Prevent multiple triggers for long key presses
    const note = keyboardToNoteMapping[event.code];
    if (note) {
        // Find the keyId corresponding to the note
        const keyId = Object.keys(noteMapping).find(key => noteMapping[key] === note);
        if (keyId) {
            playNote(note, keyId);
            // Update the note display
            const noteDisplay = document.getElementById('noteDisplay');
            noteDisplay.textContent = note; // Or use noteName for the formatted name
        }
    }
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
        mainContainer.style.display = 'none';
        overlay.style.display = 'none';
        document.body.style.overflow = 'hidden';
        jamCardContainer.style.display = 'none';
    } else {
        // In Landscape Mode
        orientationAlert.style.display = 'none';
        h1.style.display = 'block';
        piano.style.display = 'block';
        mainContainer.style.display = 'grid';
        overlay.style.display = 'flex';
        document.body.style.overflow = 'auto';
        jamCardContainer.style.display = 'relative';
    }
}




// Ensure the checkOrientation function is called both on page load and on window resize.
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
