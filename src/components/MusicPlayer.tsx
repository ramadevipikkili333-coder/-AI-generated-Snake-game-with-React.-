import { useRef, useState, useEffect } from 'react';
import { dummyTracks } from '../lib/audioData';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  
  const currentTrack = dummyTracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % dummyTracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + dummyTracks.length) % dummyTracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setProgress((currentTime / duration) * 100 || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekRatio = parseFloat(e.target.value) / 100;
    if (audioRef.current) {
      audioRef.current.currentTime = seekRatio * audioRef.current.duration;
      setProgress(seekRatio * 100);
    }
  };

  return (
    <div className="flex flex-col bg-black border-2 border-[#f0f] relative p-4 uppercase screen-tear relative z-10">
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        loop={false}
      />

      <div className="flex flex-col mb-4 bg-black border border-[#0ff] p-3 text-[#0ff]">
        <div className="flex justify-between items-start mb-2 border-b border-[#0ff] pb-1 font-display text-[10px] md:text-[12px] opacity-70">
          <span>STREAM: ACTIVE</span>
          <span>{currentTrack.id}/{dummyTracks.length}</span>
        </div>
        <h3 className="text-xl font-sans mt-2 glitch-text" data-text={currentTrack.title}>
          {currentTrack.title}
        </h3>
        <p className="text-[#f0f] font-sans text-xl mt-1">&gt; {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 border-2 border-[#f0f] h-6 bg-black relative flex items-center group overflow-hidden">
        <div 
            className="absolute top-0 bottom-0 left-0 bg-[#f0f] transition-all duration-100 ease-linear flex items-center justify-end overflow-hidden" 
            style={{ width: `${progress}%` }}
        >
           <span className="text-black font-display text-[8px] mr-1 opacity-80">████</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress || 0}
          onChange={handleSeek}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Controls */}
      <div className="flex items-start justify-between font-display text-xs md:text-sm gap-4">
        <div className="flex gap-2 w-full">
          <button
            onClick={prevTrack}
            className="flex-1 bg-black border border-[#0ff] text-[#0ff] py-3 hover:bg-[#0ff] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#f0f]"
          >
            &lt;&lt;
          </button>
          
          <button
            onClick={togglePlay}
            className={`flex-[2] border-2 py-3 focus:outline-none focus:ring-2 focus:ring-[#0ff] ${isPlaying ? 'bg-[#f0f] text-black border-[#f0f]' : 'bg-black text-[#f0f] border-[#f0f] hover:bg-[#f0f] hover:text-black'}`}
          >
            {isPlaying ? 'SUSPEND' : 'EXECUTE'}
          </button>

          <button
            onClick={nextTrack}
            className="flex-1 bg-black border border-[#0ff] text-[#0ff] py-3 hover:bg-[#0ff] hover:text-black focus:outline-none focus:ring-2 focus:ring-[#f0f]"
          >
            &gt;&gt;
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 border-t border-[#f0f] pt-4 font-sans text-xl">
         <span className="text-[#0ff]">VOL_</span>
         <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-3 bg-black border border-[#0ff] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#0ff] [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-black"
          />
      </div>
    </div>
  );
}
