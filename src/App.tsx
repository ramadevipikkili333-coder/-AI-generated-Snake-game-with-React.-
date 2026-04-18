import { SnakeBoard } from './components/SnakeBoard';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#0ff] flex flex-col relative overflow-x-hidden font-sans scanlines">
      
      <div className="absolute inset-0 static-noise-bg z-[100]" />
      
      <header className="relative z-10 w-full py-6 px-4 md:px-8 border-b-[8px] border-[#f0f] bg-black screen-tear">
        <h1 
          data-text="<SYS.ERR.OUROBOROS_PROTOCOL/>"
          className="text-2xl md:text-4xl font-display font-bold text-[#0ff] glitch-text leading-loose md:leading-loose tracking-tighter"
        >
          &lt;SYS.ERR.OUROBOROS_PROTOCOL/&gt;
        </h1>
        <p className="text-[#f0f] mt-2 text-lg md:text-xl uppercase border-l-4 border-[#f0f] pl-3">INITIATING... STATUS: UNSTABLE</p>
      </header>

      <main className="flex-1 relative z-10 container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-12 max-w-7xl items-start">
        
        {/* Game Area */}
        <div className="w-full lg:w-7/12 border-4 border-[#0ff] p-2 bg-black relative screen-tear mt-4 lg:mt-0">
          <div className="absolute -top-5 right-4 px-2 bg-[#0ff] text-black text-sm font-display font-bold">SIM_RENDERER_v1.9.9</div>
          <div className="absolute -bottom-5 left-4 px-2 bg-[#0ff] text-black text-sm font-display font-bold">KERNEL_PANIC_ACTIVE</div>
          <SnakeBoard />
        </div>

        {/* Sidebar / Music Player */}
        <div className="w-full lg:w-5/12 shrink-0 flex flex-col gap-10">
          
          <div className="border-l-[8px] border-[#f0f] pl-4 mb-2 bg-black/50 p-2">
            <h2 className="text-xl md:text-2xl font-display text-[#f0f] mb-3 glitch-text" data-text="[AUDIO_MUX_SUB]">
              [AUDIO_MUX_SUB]
            </h2>
            <p className="text-[#0ff] text-lg uppercase font-bold">SYNC AUDIO STREAM TO NEURAL INTERFACE.</p>
          </div>
          
          <MusicPlayer />
          
          <div className="p-6 bg-black border-4 border-dashed border-[#0ff] uppercase relative z-10">
             <div className="absolute -top-4 left-6 bg-[#f0f] text-black px-2 py-1 font-display text-sm font-bold border-2 border-black">
                INPUT_VECTOR_MAP
             </div>
             <ul className="text-[#0ff] text-2xl space-y-4 font-sans mt-4">
               <li className="flex items-center gap-6"><span className="inline-block w-12 py-1 text-center bg-[#0ff] text-black font-bold">W</span> ADAPT_UP</li>
               <li className="flex items-center gap-6"><span className="inline-block w-12 py-1 text-center bg-[#0ff] text-black font-bold">A</span> ADAPT_LEFT</li>
               <li className="flex items-center gap-6"><span className="inline-block w-12 py-1 text-center bg-[#0ff] text-black font-bold">S</span> ADAPT_DOWN</li>
               <li className="flex items-center gap-6"><span className="inline-block w-12 py-1 text-center bg-[#0ff] text-black font-bold">D</span> ADAPT_RIGHT</li>
               <li className="pt-6 mt-4 border-t-[4px] border-[#f0f] border-dotted flex items-center gap-6 text-[#f0f]">
                 <span className="inline-block px-3 py-1 bg-[#f0f] text-black font-bold">SPACE</span> HALT_PROCESS
               </li>
             </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
