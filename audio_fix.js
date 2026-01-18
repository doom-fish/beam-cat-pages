// Simplified audio that works on iOS
let audioCtx = null;
let masterGain = null;
let oscillators = [];
let audioStarted = false;

function initAudio() {
    if (audioStarted) return;
    audioStarted = true;
    
    const hint = document.getElementById('sound-hint');
    if (hint) hint.style.opacity = '0';
    
    // Create audio context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
    
    // iOS requires user gesture to start - use a silent buffer trick
    const silentBuffer = audioCtx.createBuffer(1, 1, 22050);
    const silentSource = audioCtx.createBufferSource();
    silentSource.buffer = silentBuffer;
    silentSource.connect(audioCtx.destination);
    silentSource.start(0);
    
    // Now create the actual sound
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
    
    // Simple drone chord - fewer oscillators for iOS
    const freqs = [73.42, 110, 146.83, 185, 220];
    freqs.forEach(freq => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = freq;
        
        const gain = audioCtx.createGain();
        gain.gain.value = 0.08;
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        osc.start();
        oscillators.push(osc);
    });
    
    console.log('Audio initialized, context state:', audioCtx.state);
}

document.addEventListener('click', initAudio, { once: true });
document.addEventListener('touchend', initAudio, { once: true });
