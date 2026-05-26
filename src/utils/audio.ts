// Web Audio API Retro Sound Effects and Music Synthesizer for Raša's Birthday Invite

let audioCtx: AudioContext | null = null;
let bgMusicNode: OscillatorNode | null = null;
let bgGainNode: GainNode | null = null;
let isMusicPlaying = false;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// Low level play helper
function playTone(freq: number, type: OscillatorType, duration: number, startVolume: number, endVolume: number, detune = 0) {
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (detune) {
      osc.detune.setValueAtTime(detune, audioCtx.currentTime);
    }

    gainNode.gain.setValueAtTime(startVolume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(endVolume, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.warn('Audio error:', e);
  }
}

export const playSound = {
  click: () => {
    // Crisp retro click
    playTone(1200, 'square', 0.05, 0.1, 0.01);
  },

  pop: () => {
    // Minecraft pickup XP 'orb' sound or item popup
    playTone(880, 'sine', 0.1, 0.15, 0.01);
    setTimeout(() => {
      playTone(1320, 'sine', 0.15, 0.12, 0.01);
    }, 50);
  },

  explosion: () => {
    // Low frequency rumbling noise for TNT
    try {
      initAudio();
      if (!audioCtx) return;
      
      const bufferSize = audioCtx.sampleRate * 0.4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(10, audioCtx.currentTime + 0.4);
      
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noise.start();
    } catch {
      // Fallback
      playTone(80, 'sawtooth', 0.4, 0.3, 0.01);
    }
  },

  chessMove: () => {
    // Wooden chess click sound
    playTone(330, 'triangle', 0.08, 0.15, 0.01);
    setTimeout(() => {
      playTone(220, 'triangle', 0.05, 0.1, 0.01);
    }, 40);
  },

  victory: () => {
    // Beautiful level up sound: sweeping pentatonic arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'square', 0.15, 0.1, 0.02);
      }, idx * 80);
    });
  },

  teleport: () => {
    // Enderman-like swoosh
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, audioCtx.currentTime + 0.35);
      gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      playTone(600, 'sine', 0.3, 0.15, 0.01);
    }
  }
};

// Retro Chip-tune Happy Birthday Melody
const BIRTHDAY_MELODY = [
  { note: 'G4', freq: 392.00, dur: 0.3 },
  { note: 'G4', freq: 392.00, dur: 0.1 },
  { note: 'A4', freq: 440.00, dur: 0.4 },
  { note: 'G4', freq: 392.00, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.4 },
  { note: 'B4', freq: 493.88, dur: 0.8 },
  
  { note: 'G4', freq: 392.00, dur: 0.3 },
  { note: 'G4', freq: 392.00, dur: 0.1 },
  { note: 'A4', freq: 440.00, dur: 0.4 },
  { note: 'G4', freq: 392.00, dur: 0.4 },
  { note: 'D5', freq: 587.33, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.8 },
  
  { note: 'G4', freq: 392.00, dur: 0.3 },
  { note: 'G4', freq: 392.00, dur: 0.1 },
  { note: 'G5', freq: 783.99, dur: 0.4 },
  { note: 'E5', freq: 659.25, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.4 },
  { note: 'B4', freq: 493.88, dur: 0.4 },
  { note: 'A4', freq: 440.00, dur: 0.8 },
  
  { note: 'F5', freq: 698.46, dur: 0.3 },
  { note: 'F5', freq: 698.46, dur: 0.1 },
  { note: 'E5', freq: 659.25, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.4 },
  { note: 'D5', freq: 587.33, dur: 0.4 },
  { note: 'C5', freq: 523.25, dur: 0.8 },
];

let noteTimeout: any = null;
let currentNoteIndex = 0;

export function playBackgroundMusic() {
  if (isMusicPlaying) return;
  initAudio();
  if (!audioCtx) return;

  isMusicPlaying = true;
  currentNoteIndex = 0;

  function playNextNote() {
    if (!isMusicPlaying || !audioCtx) return;

    const note = BIRTHDAY_MELODY[currentNoteIndex];
    
    // Create oscillator and gain
    bgMusicNode = audioCtx.createOscillator();
    bgGainNode = audioCtx.createGain();

    // Retro square/triangle pulse wave
    bgMusicNode.type = 'triangle';
    bgMusicNode.frequency.value = note.freq;

    // Soft volume for background music so it's pleasant and not piercing
    bgGainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    bgGainNode.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + note.dur - 0.05);

    bgMusicNode.connect(bgGainNode);
    bgGainNode.connect(audioCtx.destination);

    bgMusicNode.start();
    bgMusicNode.stop(audioCtx.currentTime + note.dur - 0.02);

    currentNoteIndex = (currentNoteIndex + 1) % BIRTHDAY_MELODY.length;
    noteTimeout = setTimeout(playNextNote, note.dur * 1000);
  }

  playNextNote();
}

export function stopBackgroundMusic() {
  isMusicPlaying = false;
  if (noteTimeout) {
    clearTimeout(noteTimeout);
    noteTimeout = null;
  }
  if (bgMusicNode) {
    try {
      bgMusicNode.stop();
    } catch {}
    bgMusicNode = null;
  }
  if (bgGainNode) {
    bgGainNode = null;
  }
}

export function toggleBackgroundMusic() {
  if (isMusicPlaying) {
    stopBackgroundMusic();
    return false;
  } else {
    playBackgroundMusic();
    return true;
  }
}

export function getIsMusicPlaying() {
  return isMusicPlaying;
}
