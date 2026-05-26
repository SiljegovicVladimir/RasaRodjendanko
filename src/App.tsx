import React, { useState, useEffect } from 'react';
import { 
  AppStage, 
  RSVPData 
} from './types';
import MinecartGame from './components/MinecartGame';
import ChessGame from './components/ChessGame';
import InvitationCard from './components/InvitationCard';
import { 
  playSound, 
  playBackgroundMusic, 
  stopBackgroundMusic, 
  getIsMusicPlaying 
} from './utils/audio';
import { 
  Trophy, 
  Gamepad2, 
  Compass, 
  Unlock, 
  Lock, 
  VolumeX, 
  Volume2, 
  Crown, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState<AppStage>('intro');
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [level1Completed, setLevel1Completed] = useState(false);
  const [level2Completed, setLevel2Completed] = useState(false);

  // Initialize music toggles safely
  const handleMusicToggle = () => {
    if (isMusicOn) {
      stopBackgroundMusic();
      setIsMusicOn(false);
    } else {
      playBackgroundMusic();
      setIsMusicOn(true);
    }
  };

  const handleGame1Complete = () => {
    setLevel1Completed(true);
    setStage('game2');
    playSound.victory();
  };

  const handleGame2Complete = () => {
    setLevel2Completed(true);
    setStage('invitation');
    playSound.victory();
    // Auto-on music when they finally unlock the invitation card for extra festive vibe!
    if (!isMusicOn) {
      playBackgroundMusic();
      setIsMusicOn(true);
    }
  };

  const handleSkipAllGames = () => {
    setLevel1Completed(true);
    setLevel2Completed(true);
    setStage('invitation');
    playSound.teleport();
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-between py-8 px-4 selection:bg-yellow-400 selection:text-stone-950 relative overflow-x-hidden font-mono">
      
      {/* Starry/Nether Bento-style grid background decoration */}
      <div className="absolute inset-0 bg-[#1a1a1a] opacity-100 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(circle, #3c8527 2px, transparent 2px)',
          backgroundSize: '40px 40px'
        }} />
        {/* Abstract solid pixel elements */}
        <div className="absolute top-[15%] left-[5%] w-14 h-14 bg-[#3c8527]/10 border-4 border-[#3c8527]/20 rounded-none rotate-6" />
        <div className="absolute top-[45%] right-[3%] w-20 h-20 bg-[#4e3524]/10 border-4 border-[#4e3524]/20 rounded-none -rotate-12" />
        <div className="absolute bottom-[25%] left-[8%] w-12 h-12 bg-[#707070]/10 border-4 border-[#707070]/20 rounded-none rotate-45" />
      </div>

      {/* Main Container */}
      <div className="w-full max-w-2xl relative z-10 space-y-8 flex flex-col justify-start my-auto">
        
        {/* Bento Header section */}
        <div className="text-center md:text-left border-b-4 border-[#333] pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-2 w-full max-w-xl mx-auto">
          <div>
            <h1 className="text-[#3c8527] text-4xl md:text-5xl font-black uppercase tracking-tighter text-shadow-bento">
              RAŠIN ROĐENDAN #7
            </h1>
            <p className="text-[#888] text-sm md:text-md mt-1 font-sans">
              Zabavne misije i pixel avanture sa Savskog nasipa!
            </p>
          </div>
          <div className="self-center md:self-end bg-[#3c8527] px-4 py-1.5 border-4 border-white bento-shadow-sm text-white text-base font-bold select-none">
            LEVEL: 7.0
          </div>
        </div>

        {/* Navigation Breadcrumbs / Level indicators inside blocky Bento header */}
        <div className="w-full max-w-xl mx-auto bg-[#2a2a2a] border-4 border-[#333] p-1.5 rounded-none flex justify-between items-center text-[10.5px] md:text-xs font-mono font-bold tracking-tight bento-shadow-sm gap-1.5">
          {/* Intro Link */}
          <button 
            onClick={() => {
              playSound.click();
              setStage('intro');
            }} 
            className={`flex-1 py-2 text-center rounded-none transition-all cursor-pointer ${
              stage === 'intro' 
                ? 'bg-amber-600 text-stone-950 border-2 border-amber-400 font-extrabold shadow-none' 
                : 'bg-[#1a1a1a] text-stone-400 border border-[#333] hover:text-stone-300'
            }`}
          >
            🏰 LOBI
          </button>

          {/* Minecart Link */}
          <button 
            onClick={() => {
              playSound.click();
              setStage('game1');
            }} 
            className={`flex-grow py-2 px-1 text-center rounded-none transition-all relative cursor-pointer ${
              stage === 'game1' 
                ? 'bg-yellow-600 text-stone-100 border-2 border-yellow-400 font-extrabold shadow-none' 
                : 'bg-[#1a1a1a] text-stone-400 border border-[#333] hover:text-stone-300'
            }`}
          >
            {level1Completed ? '🛒 NIVO 1 ✓' : '🛒 NIVO 1'}
            {!level1Completed && stage !== 'game1' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-70"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            )}
          </button>

          {/* Chess Link */}
          <button 
            onClick={() => {
              playSound.click();
              setStage('game2');
            }} 
            className={`flex-grow py-2 px-1 text-center rounded-none transition-all relative cursor-pointer ${
              stage === 'game2' 
                ? 'bg-[#707070] text-stone-100 border-2 border-[#4b4b4b] font-extrabold shadow-none' 
                : 'bg-[#1a1a1a] text-stone-400 border border-[#333] hover:text-stone-300'
            }`}
          >
            {level2Completed ? '♟️ NIVO 2 ✓' : '♟️ NIVO 2'}
            {!level2Completed && stage !== 'game2' && (
              <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5 bg-stone-700 rounded-full" />
            )}
          </button>

          {/* Invitation Link */}
          <button 
            onClick={() => {
              playSound.click();
              setStage('invitation');
            }} 
            className={`flex-1 py-2 text-center rounded-none transition-all relative cursor-pointer ${
              stage === 'invitation' 
                ? 'bg-[#3c8527] text-white border-2 border-[#1e4213] font-extrabold animate-pulse' 
                : 'bg-[#1a1a1a] text-stone-400 border border-[#333] hover:text-stone-300'
            }`}
          >
            ✉️ POZIVNICA
            {(!level1Completed || !level2Completed) && (
              <Lock className="w-3 h-3 absolute -top-1 -right-1 text-stone-500" />
            )}
          </button>
        </div>

        {/* Dynamic State Rendering */}
        {stage === 'intro' && (
          <div className="w-full max-w-lg mx-auto bg-[#4e3524] border-4 border-[#2c1d14] p-6 rounded-none text-center bento-shadow space-y-6 relative overflow-hidden">
            
            {/* Ambient Grass block blocky header decoration */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-[#3c8527] border-b-2 border-[#1e4213]" />
            
            {/* Server banner info */}
            <div className="space-y-3 relative z-10 pt-4">
              <div className="inline-flex items-center gap-1.5 bg-black/45 border-2 border-[#3c8527] px-3 py-1 text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider select-none">
                <Crown className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
                RASIN KOZMIČKI SERVER: AKTIVAN
              </div>

              <h2 className="text-3xl md:text-4xl font-black text-yellow-400 uppercase leading-none text-shadow-bento tracking-tight pt-2">
                RAŠIN ROĐENDANSKI<br />
                <span className="text-white text-2xl md:text-3xl block mt-1 tracking-wider font-bold">KREATIVNI REVIJAL!</span>
              </h2>

              <p className="text-stone-200 font-sans text-xs md:text-sm max-w-md mx-auto leading-relaxed pt-2 bg-black/30 p-2.5 border border-black/45">
                Pozivamo sve drugare na nezaboravno druženje i proslavu <strong>Rasinog 7. rodjendana</strong>! 
                Otključaj sve tajne lokacije na Savskom nasipu kroz 2 brze arkadne i šahovske pitalice!
              </p>
            </div>

            {/* Simulated Server Card */}
            <div className="bg-[#1a1a1a] border-4 border-[#333] p-4 rounded-none space-y-3 bento-shadow-sm text-stone-200">
              <div className="flex border-b-2 border-[#333] pb-1.5 justify-between items-center text-xs font-mono text-stone-400">
                <span>📍 DETALJI MISIJE</span>
                <span className="text-yellow-400 font-bold">VERZIJA: 7.0-BDAY</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left text-xs">
                <div className="bg-[#4e3524] p-2.5 rounded-none border-2 border-[#2c1d14]">
                  <span className="block text-[9px] text-[#3c8527] font-bold uppercase tracking-wider">MISIJA #1</span>
                  <span className="text-xs font-semibold text-white">Vagon sakupljač ruda</span>
                </div>
                <div className="bg-[#707070] p-2.5 rounded-none border-2 border-[#4b4b4b]">
                  <span className="block text-[9px] text-amber-400 font-bold uppercase tracking-wider">MISIJA #2</span>
                  <span className="text-xs font-semibold text-white">Šahovski skakač skok</span>
                </div>
              </div>
              <p className="text-[10px] text-stone-400 text-center font-mono leading-tight bg-black/20 p-1.5 rounded-xs border border-[#222]">
                Optimizovano za laku kontrolu na svim mobilnim telefonima i računarima.
              </p>
            </div>

            {/* Core Action Menu */}
            <div className="space-y-3 max-w-sm mx-auto">
              <button
                onClick={() => {
                  playSound.click();
                  setStage('game1');
                }}
                className="w-full py-4 bg-[#3c8527] border-4 border-black bento-shadow-sm text-white font-extrabold uppercase tracking-widest text-sm rounded-none cursor-pointer hover:translate-y-0.5 active:translate-y-1 hover:shadow-none active:shadow-none transition-all flex items-center justify-center gap-2"
                id="btn_start_adventure"
              >
                <Gamepad2 className="w-5 h-5 animate-pulse text-yellow-300" /> KRENI U MISIJU ⛏️
              </button>

              <button
                onClick={handleSkipAllGames}
                className="w-full py-2 bg-[#2a2a2a] hover:bg-[#333] text-yellow-500 font-semibold text-xs uppercase rounded-none border-2 border-[#444] cursor-pointer"
                id="btn_skip_all"
              >
                🔓 PRESKOČI I OTVORI POZIVNICU
              </button>
            </div>

            {/* Audio configuration toggle */}
            <div className="pt-2 border-t border-[#2c1d14] flex justify-center">
              <button
                onClick={handleMusicToggle}
                className="text-stone-300 hover:text-stone-100 text-xs font-mono flex items-center gap-2 cursor-pointer bg-black/40 p-1.5 px-4 border border-black/50"
                id="btn_menu_melody"
              >
                {isMusicOn ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#3c8527] animate-bounce" /> UTIŠAJ RETRO MUZIKU 🔊
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-stone-500" /> PUSTI RETRO MUZIKU 🔇
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {stage === 'game1' && (
          <MinecartGame 
            onGameComplete={handleGame1Complete} 
            onSkipGame={handleSkipAllGames} 
          />
        )}

        {stage === 'game2' && (
          <ChessGame 
            onGameComplete={handleGame2Complete} 
            onSkipGame={handleSkipAllGames} 
          />
        )}

        {stage === 'invitation' && (
          <InvitationCard 
            isMusicPlaying={isMusicOn} 
            onToggleMusic={handleMusicToggle} 
          />
        )}

      </div>

      {/* Footer Branding details */}
      <footer className="mt-8 text-center text-[#555] text-xs font-mono select-none relative z-10 space-y-1 uppercase tracking-widest border-t border-[#333] pt-4 w-full max-w-xl mx-auto flex justify-between">
        <span>Server: rasha-craft.github.io</span>
        <span>Maca: X44 Y20</span>
      </footer>
    </div>
  );
}
