import React, { useState, useEffect } from 'react';
import { playSound } from '../utils/audio';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Copy, 
  Check, 
  Music, 
  VolumeX, 
  Compass, 
  Sparkle, 
  Share2 
} from 'lucide-react';

interface InvitationCardProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
}

interface RSVPRecord {
  name: string;
  coming: 'yes' | 'no' | 'maybe';
  guestsCount: number;
  message: string;
  timestamp: string;
}

export default function InvitationCard({ isMusicPlaying, onToggleMusic }: InvitationCardProps) {
  const eventDate = new Date('2026-05-30T12:00:00'); // Event is 30. May 2026 at 12:00 CEST
  
  // Local states
  const [copied, setCopied] = useState(false);
  const [rsvpList, setRsvpList] = useState<RSVPRecord[]>([]);
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpComing, setRsvpComing] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpMessage, setRsvpMessage] = useState('');
  const [userRsvp, setUserRsvp] = useState<RSVPRecord | null>(null);

  // Countdown State
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  // Load RSVP from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rasa_birthday_rsvp_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserRsvp(parsed);
      }
      
      const listStored = localStorage.getItem('rasa_birthday_rsvp_list');
      if (listStored) {
        setRsvpList(JSON.parse(listStored));
      } else {
        // Pre-populate with some fun simulated classmate friends to feel like an active Minecraft server
        const mockFriends: RSVPRecord[] = [
          { name: 'Steve (Relja)', coming: 'yes', guestsCount: 1, message: 'Jedva čekam rođendansku tortu!', timestamp: '24.05.2026' },
          { name: 'Alex (Una)', coming: 'yes', guestsCount: 1, message: 'Donesiću ti poklon u kutiji od česta!', timestamp: '25.05.2026' },
          { name: 'Todor_Miners', coming: 'yes', guestsCount: 2, message: 'Dolazimo brat i ja da igramo sah i prezivljavamo!', timestamp: '25.05.2026' },
          { name: 'Vuk_Creeper', coming: 'maybe', guestsCount: 1, message: 'Pre podne imam trening, ali stižem sigurno!', timestamp: '26.05.2026' }
        ];
        setRsvpList(mockFriends);
        localStorage.setItem('rasa_birthday_rsvp_list', JSON.stringify(mockFriends));
      }
    } catch (e) {
      console.error('Error loading localStorage RSVP:', e);
    }
  }, []);

  // Update Countdown Timer every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        setCountdown({ days: d, hours: h, minutes: m, seconds: s, isOver: false });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle RSVP Submit
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    playSound.pop();

    const newRecord: RSVPRecord = {
      name: rsvpName.trim(),
      coming: rsvpComing,
      guestsCount: rsvpGuests,
      message: rsvpMessage.trim(),
      timestamp: new Date().toLocaleDateString('sr-RS')
    };

    // Save user's own RSVP
    setUserRsvp(newRecord);
    localStorage.setItem('rasa_birthday_rsvp_user', JSON.stringify(newRecord));

    // Update list
    const updatedList = [newRecord, ...rsvpList.filter(item => item.name.toLowerCase() !== rsvpName.trim().toLowerCase())];
    setRsvpList(updatedList);
    localStorage.setItem('rasa_birthday_rsvp_list', JSON.stringify(updatedList));

    // Reset inputs
    setRsvpName('');
    setRsvpMessage('');
  };

  // Reset/Change RSVP
  const handleRsvpChange = () => {
    playSound.click();
    if (userRsvp) {
      setRsvpName(userRsvp.name);
      setRsvpComing(userRsvp.coming);
      setRsvpGuests(userRsvp.guestsCount);
      setRsvpMessage(userRsvp.message);
    }
    setUserRsvp(null);
  };

  // Copy text invitation details
  const copyInvitationText = () => {
    playSound.click();
    const textMsg = `🎂 Pozivnica za RASIN 7. ROĐENDAN! ⛏️\n\n` +
      `Dobrodošli na Minecraft server u stvarnom životu!\n` +
      `📅 KADA: Subota, 30. maj u 12:00h\n` +
      `📍 GDE: Savski nasip, kod splava Crna Maca\n` +
      `🎯 DETALJI: Igrice, šah, druženje, rođendanska torta i preživljavanje u kreativnom modu!\n\n` +
      `Potvrdite dolazak i pređite igrice otključavanja na linku:\n` +
      `${window.location.origin}`;

    navigator.clipboard.writeText(textMsg)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch((err) => console.log('Copy failed:', err));
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-fade-in font-mono">
      
      {/* Dynamic Sound Header / Music banner */}
      <div className="flex justify-between items-center bg-[#2a2a2a] border-4 border-[#333] p-3 rounded-none backdrop-blur-xs px-4 bento-shadow-sm">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 animate-pulse"></span>
          </span>
          <span className="text-[11px] font-mono text-stone-200">Rašin Server: ONLINE 🟢</span>
        </div>
        <button
          onClick={() => {
            onToggleMusic();
            playSound.pop();
          }}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs px-2.5 font-bold border-2 transition-all cursor-pointer rounded-none ${
            isMusicPlaying 
              ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse' 
              : 'bg-[#1a1a1a] text-stone-300 border-[#333]'
          }`}
          id="btn_melody_toggle"
        >
          {isMusicPlaying ? (
            <>
              <Music className="w-3.5 h-3.5 animate-spin" /> RETRO MUZIKU: ON
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" /> PUSTI MUZIKU 🔇
            </>
          )}
        </button>
      </div>

      {/* Main Minecraft styled Ticket Card */}
      <div className="bg-[#4e3524] border-4 border-[#2c1d14] rounded-none overflow-hidden bento-shadow relative">
        
        {/* Grass Block top decoration */}
        <div className="h-6 bg-[#3c8527] border-b-4 border-black flex justify-between relative overflow-hidden">
          {/* Pixel grass blades blocky texture with inline divs */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="h-full bg-emerald-500" 
                style={{ 
                  width: '3.3%', 
                  marginTop: i % 2 === 0 ? '4px' : '0px',
                  borderTop: i % 3 === 0 ? '3px solid #86efac' : 'none'
                }} 
              />
            ))}
          </div>
        </div>

        {/* Card Content Interior */}
        <div className="p-6 relative text-stone-200">
          
          {/* Creeper pixel background decoration watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.035] pointer-events-none select-none w-72 h-72">
            <svg viewBox="0 0 100 100" fill="currentColor" className="text-white w-full h-full">
              <rect width="100" height="100" />
              {/* Creeper eyes and mouth */}
              <rect x="15" y="20" width="25" height="25" fill="black" />
              <rect x="60" y="20" width="25" height="25" fill="black" />
              <rect x="35" y="45" width="30" height="35" fill="black" />
              <rect x="25" y="55" width="10" height="25" fill="black" />
              <rect x="65" y="55" width="10" height="25" fill="black" />
            </svg>
          </div>

          {/* Minecraft Header Section */}
          <div className="text-center space-y-2 relative z-10 mb-6">
            <div className="inline-block bg-teal-900/40 border-2 border-teal-600 px-2.5 py-1 text-[11px] text-teal-300 font-bold tracking-wider uppercase mb-1">
              👑 SPECIJALNA POZIVNICA 👑
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-yellow-400 tracking-wider uppercase text-shadow-bento drop-shadow-md leading-none">
              Rašin 7. <br />
              <span className="text-stone-100 text-3xl md:text-4xl block mt-1 tracking-tight font-bold">Rođendan!</span>
            </h1>

            {/* Sub heading */}
            <p className="font-sans text-xs md:text-sm text-stone-200 font-medium max-w-sm mx-auto pt-1 bg-black/40 p-2.5 border-2 border-black">
              ⛏️ Minecraft avantura se seli u stvarni svet! Pozvan si na rođendansko preživljavanje u kreativnom modu.
            </p>
          </div>

          {/* Core Info Blocks - Bento Grid layout panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {/* Date & Time Slot */}
            <div className="bg-[#1a1a1a] border-4 border-black p-4 flex items-start gap-3 bento-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all">
              <div className="p-2.5 bg-amber-600/20 border-2 border-amber-600 text-amber-500 rounded-none">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">DATUM I VREME</p>
                <p className="font-bold text-lg text-white font-mono">Subota, 30. Maj</p>
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>U <strong className="text-yellow-400 text-sm">12:00h</strong> (u podne)</span>
                </div>
              </div>
            </div>

            {/* Location Slot */}
            <div className="bg-[#1a1a1a] border-4 border-black p-4 flex items-start gap-3 bento-shadow-sm hover:translate-y-0.5 hover:shadow-none transition-all">
              <div className="p-2.5 bg-sky-600/20 border-2 border-sky-500 text-sky-400 rounded-none">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1 w-full">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">LOKACIJA MAP_POS</p>
                <p className="font-bold text-lg text-white">Savski Nasip</p>
                <p className="text-xs text-stone-300 leading-snug">
                  Beograd, <strong className="text-cyan-300 font-semibold text-xs">kod splava Crna Maca</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Real-time Countdown Timer (Odbrojavanje) */}
          <div className="mt-6 bg-[#1a1a1a] border-4 border-black p-4 text-center relative z-10 bento-shadow-sm">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">
              🔋 VREME DO POKRETANJA SERVERA
            </h3>
            
            {countdown.isOver ? (
              <div className="text-center py-2">
                <span className="text-lg font-bold text-green-400 animate-pulse uppercase">
                  🎂 SLAVLJE JE U TOKU! DOBRODOŠLI! 🎂
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
                <div className="bg-[#2a2a2a] p-2 border-2 border-[#444]">
                  <span className="block text-2xl text-yellow-400 font-bold">{countdown.days}</span>
                  <span className="text-[9px] text-stone-400">DANA</span>
                </div>
                <div className="bg-[#2a2a2a] p-2 border-2 border-[#444]">
                  <span className="block text-2xl text-yellow-400 font-bold">{countdown.hours}</span>
                  <span className="text-[9px] text-stone-400">SAT</span>
                </div>
                <div className="bg-[#2a2a2a] p-2 border-2 border-[#444]">
                  <span className="block text-2xl text-yellow-400 font-bold">{countdown.minutes}</span>
                  <span className="text-[9px] text-stone-400">MIN</span>
                </div>
                <div className="bg-[#2a2a2a] p-2 border-2 border-black bg-[#1b0b0b]">
                  <span className="block text-2xl text-red-500 font-bold animate-pulse">{countdown.seconds}</span>
                  <span className="text-[9px] text-stone-400">SEK</span>
                </div>
              </div>
            )}
          </div>

          {/* Curated Map Navigation & Coordinates */}
          <div className="mt-6 bg-[#1a1a1a] border-4 border-black p-4 relative z-10 bento-shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-500 animate-spin" /> GPS KOORDINATE & NAVIGACIJA
              </span>
              <span className="text-[9px] text-stone-500">X: 44.7937, Y: 20.3953</span>
            </div>

            {/* Simulated Pixel Minimap graphic layout */}
            <div className="relative w-full h-32 bg-stone-950 border-2 border-[#333] p-1 overflow-hidden flex items-center justify-center select-none text-center">
              <div className="absolute inset-0 opacity-15" style={{
                backgroundImage: 'radial-gradient(circle, #3c8527 10%, transparent 11%)',
                backgroundSize: '16px 16px'
              }} />
              {/* Fake river layout */}
              <div className="absolute right-0 bottom-0 top-0 w-2/5 bg-blue-900/40 border-l-2 border-dashed border-blue-500/30 flex items-center justify-center">
                <span className="text-[9px] text-blue-400/60 rotate-90 font-bold">REKA SAVA 🌊</span>
              </div>
              <div className="absolute left-1/4 top-1/2 w-4 h-4 bg-emerald-600 rounded-none animate-ping opacity-60" />
              
              <div className="relative z-10 flex flex-col items-center p-2 rounded-none bg-stone-900/90 border-2 border-stone-700 max-w-xs">
                <span className="text-xl">📍</span>
                <span className="text-[10px] font-semibold text-stone-200 uppercase mt-1">Splav Crna Maca</span>
                <span className="text-[9px] text-stone-400">Pristup sa Novog Beograda nasipom</span>
              </div>
            </div>

            {/* Map Links */}
            <div className="flex flex-col sm:flex-row gap-2">
              <a 
                href="https://www.google.com/maps/search/?api=1&query=Splav+Crna+Maca+Savski+nasip"
                target="_blank"
                rel="noreferrer"
                id="link_google_maps"
                className="flex-1 py-3 bg-[#3c8527] border-4 border-black text-white font-extrabold text-xs uppercase tracking-wider text-center block cursor-pointer hover:translate-y-0.5 active:translate-y-1 hover:shadow-none active:shadow-none bento-shadow-sm transition-all"
              >
                🌍 Otvori Google Maps Navigaciju
              </a>
            </div>
          </div>

          {/* RSVP Status / Interactive RSVP Form */}
          <div className="mt-6 bg-[#1a1a1a] border-4 border-black p-4 relative z-10 bento-shadow-sm">
            <div className="border-b-2 border-black pb-2 mb-4 flex justify-between items-center">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-pink-500" /> POTVRDA DOLASKA (RSVP)
              </span>
              <span className="text-[10px] text-pink-400 animate-pulse">PREŽIVELI SU NA SERVERU!</span>
            </div>

            {userRsvp ? (
              // Saved State View
              <div className="bg-stone-950 p-4 border border-emerald-800 text-center space-y-3 animate-fade-in">
                <div className="w-10 h-10 bg-emerald-900/40 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 text-xl font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-stone-100 text-sm">Uspešno si sačuvao potvrdu!</h4>
                  <p className="text-xs text-stone-400 mt-1">
                    Gost: <strong className="text-stone-200">{userRsvp.name}</strong> • 
                    Dolazi: <strong className="text-yellow-400">{userRsvp.coming === 'yes' ? 'Da' : userRsvp.coming === 'maybe' ? 'Možda' : 'Ne'}</strong> • 
                    Broj: <strong className="text-stone-200">{userRsvp.guestsCount}</strong>
                  </p>
                  {userRsvp.message && (
                    <p className="text-xs text-stone-500 italic mt-1 bg-stone-900 p-1.5">
                      "{userRsvp.message}"
                    </p>
                  )}
                </div>
                <button
                  onClick={handleRsvpChange}
                  className="py-1 px-3 bg-stone-850 hover:bg-stone-800 text-stone-300 text-xs border border-stone-700 cursor-pointer"
                  id="btn_change_rsvp"
                >
                  Izmeni narudžbinu/dolazak 🔄
                </button>
              </div>
            ) : (
              // Form Input View
              <form onSubmit={handleRsvpSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="block text-[9px] text-stone-400 uppercase">Tvoje Ime ili Nadimak</label>
                    <input 
                      type="text"
                      required
                      value={rsvpName}
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="npr. Steve / Relja"
                      className="w-full bg-[#2a2a2a] border-2 border-[#444] focus:border-amber-400 focus:outline-hidden p-2 text-xs text-stone-100 rounded-none font-mono"
                    />
                  </div>
                  
                  {/* Arrival Selection */}
                  <div className="space-y-1">
                    <label className="block text-[9px] text-stone-400 uppercase">Da li dolaziš na rođendan?</label>
                    <select
                      value={rsvpComing}
                      onChange={(e) => setRsvpComing(e.target.value as any)}
                      className="w-full bg-[#2a2a2a] border-2 border-[#444] focus:border-amber-400 focus:outline-hidden p-2 text-xs text-stone-100 rounded-none font-mono"
                    >
                      <option value="yes">DA, spuštam se kod splava! 🥩</option>
                      <option value="maybe">MOŽDA, zavisi od kripere... 🤔</option>
                      <option value="no">NE, sledeći put... ☠️</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Guest count range */}
                  <div className="space-y-1">
                    <label className="block text-[9px] text-stone-400 uppercase">Broj gostiju (deca/odrasli)</label>
                    <input 
                      type="number"
                      min={1}
                      max={10}
                      value={rsvpGuests}
                      onChange={(e) => setRsvpGuests(parseInt(e.target.value) || 1)}
                      className="w-full bg-[#2a2a2a] border-2 border-[#444] focus:border-amber-400 focus:outline-hidden p-2 text-xs text-stone-100 rounded-none font-mono"
                    />
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className="block text-[9px] text-stone-400 uppercase">Poruka za Rasu (opciono)</label>
                    <input 
                      type="text"
                      value={rsvpMessage}
                      onChange={(e) => setRsvpMessage(e.target.value)}
                      placeholder="Srećan 7. rođendan!"
                      className="w-full bg-[#2a2a2a] border-2 border-[#444] focus:border-amber-400 focus:outline-hidden p-2 text-xs text-stone-100 rounded-none font-mono"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-yellow-600 border-4 border-black hover:bg-yellow-500 text-stone-950 font-extrabold uppercase text-xs tracking-widest cursor-pointer hover:translate-y-0.5 active:translate-y-1 active:shadow-none bento-shadow-sm transition-all"
                  id="btn_submit_rsvp"
                >
                  Pošalji potvrdu na server ✉️
                </button>
              </form>
            )}

            {/* Online Server Members / Live List */}
            <div className="mt-4 border-t-2 border-black pt-3">
              <p className="text-[9px] text-stone-400 uppercase tracking-widest mb-2">Spisak prijavljenih preživelih:</p>
              <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                {rsvpList.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] bg-stone-950/70 p-1.5 border border-[#333]">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] col-emerald-500 animate-pulse">🟢</span>
                      <span className="text-stone-200 font-bold">{item.name}</span>
                      <span className="text-stone-400 text-[10px]">({item.guestsCount} gost)</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className={`px-1 rounded-none text-[9px] font-bold ${
                        item.coming === 'yes' ? 'bg-green-950/90 text-green-400' : 'bg-yellow-950/90 text-yellow-400'
                      }`}>
                        {item.coming === 'yes' ? 'Dolazi' : 'Možda'}
                      </span>
                      {item.message && (
                        <span className="text-stone-500 truncate max-w-[120px] hidden sm:inline" title={item.message}>
                          - "{item.message}"
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Share for Parents on WhatsApp/Viber */}
          <div className="mt-6 bg-[#1a1a1a] border-4 border-black p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 bento-shadow-sm">
            <div className="text-left space-y-1">
              <h4 className="text-xs font-bold text-stone-200 uppercase tracking-wide">
                DOKUMENT ZA VIBER / WHATSAPP
              </h4>
              <p className="text-[10px] text-stone-400 leading-snug font-sans">
                Kopirajte gotov tekst i pošaljite drugim roditeljima u poruci.
              </p>
            </div>
            
            <button
              onClick={copyInvitationText}
              className={`w-full sm:w-auto px-4 py-3 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer rounded-none border-4 border-black ${
                copied 
                  ? 'bg-green-600 text-white shadow-none' 
                  : 'bg-stone-800 text-stone-200 bento-shadow-sm hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
              }`}
              id="btn_copy_details"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" /> KOPIRANO! 🌟
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> KOPIRAJ TEKST
                </>
              )}
            </button>
          </div>

          {/* Srecan rodjendan footer */}
          <div className="mt-6 text-center text-[10px] text-stone-400 tracking-wider uppercase border-t border-[#2c1d14] pt-4 flex justify-center items-center gap-1.5">
            <Sparkle className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
            <span>Rasin 7. rođendan • Sponzorisano od strane mame i tate</span>
            <Sparkle className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
          </div>

        </div>
      </div>
    </div>
  );
}
