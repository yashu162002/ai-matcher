import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const INTRO_DURATION_MS = 4200;
const EXIT_DURATION_MS = 800;

export default function Intro() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("enter");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 200);
    const t2 = setTimeout(() => setPhase("exit"), INTRO_DURATION_MS - EXIT_DURATION_MS);
    const t3 = setTimeout(() => navigate("/landing"), INTRO_DURATION_MS);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [navigate]);

  const isExiting = phase === "exit";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white text-black"
      style={{
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? "scale(1.05)" : "scale(1)",
        transition: `opacity ${EXIT_DURATION_MS}ms cubic-bezier(0.86, 0, 0.07, 1), transform ${EXIT_DURATION_MS}ms cubic-bezier(0.86, 0, 0.07, 1)`,
      }}
    >
      {/* Premium White Background with Texture */}
      <div className="absolute inset-0">
        {/* Clean White Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        
        {/* Subtle Grid Pattern - Nike Inspired */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(to right, #00000008 1px, transparent 1px),
            linear-gradient(to bottom, #00000008 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Soft Radial Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_#00000005,_transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_#00000005,_transparent_70%)]" />
        
        {/* Nike Swoosh Watermark */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>
      </div>

      {/* Floating Orbs - Soft White */}
      <div 
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-black/5 to-transparent blur-3xl"
        style={{
          top: '20%',
          left: '15%',
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />
      <div 
        className="absolute w-96 h-96 rounded-full bg-gradient-to-l from-black/5 to-transparent blur-3xl"
        style={{
          bottom: '20%',
          right: '15%',
          transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center px-6 text-center max-w-7xl mx-auto">
        {/* Ultra-Premium Logo Animation */}
        <div className="mb-12 perspective-1000">
          <div
            className="relative"
            style={{
              animation: "float-rotating 4s ease-in-out infinite",
            }}
          >
            {/* Outer Rings - Clean White */}
            <div className="absolute inset-0 -m-8">
              <div className="w-40 h-40 border border-black/10 rounded-full animate-spin-slow" />
              <div className="absolute inset-0 -m-4">
                <div className="w-32 h-32 border border-black/5 rounded-full animate-spin-slower" />
              </div>
            </div>

            {/* Main Logo Container - Nike Style */}
            <div
              className="relative flex h-36 w-36 items-center justify-center"
              style={{
                animation: "scale-luxury 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                opacity: phase === "enter" ? 0 : 1,
                transformStyle: "preserve-3d",
              }}
            >
              {/* 3D Rotating Elements */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/5 rounded-2xl rotate-45 animate-pulse-slow" />
              <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-black/5 rounded-2xl -rotate-12 animate-pulse-slower" />
              
              {/* Logo Background with Premium Texture */}
              <div className="absolute inset-0 bg-white/90 backdrop-blur-2xl rounded-2xl border border-black/10 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_#00000015,_transparent_70%)]" />
                <div className="absolute inset-0" style={{
                  backgroundImage: `linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,0.02) 50%, transparent 100%)`,
                  backgroundSize: '300% 300%',
                  animation: 'shine 4s ease-in-out infinite'
                }} />
              </div>

              {/* Logo Image */}
              <img
                src="/logo.png"
                alt="AI Matcher"
                className="relative z-10 h-16 w-16 object-contain"
                style={{
                  filter: 'brightness(0) drop-shadow(0 0 20px rgba(0,0,0,0.1))',
                  animation: 'logo-reveal 1s ease-out forwards'
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextElementSibling;
                  fallback?.classList.remove("hidden");
                  fallback?.classList.add("animate-luxury-fade");
                }}
              />
              <span className="hidden text-5xl font-black italic text-black tracking-tighter">AI</span>
            </div>
          </div>
        </div>

        {/* Title - Nike Typography */}
        <div className="space-y-4 mb-8">
          <h1
            className="overflow-hidden"
            style={{
              animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards",
              opacity: phase === "enter" ? 0 : 1,
            }}
          >
            <span className="block text-7xl md:text-8xl lg:text-9xl font-black italic tracking-tighter text-black">
              AI RESUME
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] text-black/40 mt-2">
              MATCHER
            </span>
          </h1>

          {/* Divider - Clean Style */}
          <div className="flex items-center justify-center gap-4 py-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
            <span className="text-black/30 text-xs tracking-[0.3em] uppercase">Since 2024</span>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent" />
          </div>
        </div>

        {/* Tagline */}
        <div className="space-y-2 mb-12">
          <p
            className="text-lg md:text-xl text-black/40 font-light tracking-wide"
            style={{
              animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards",
              opacity: phase === "enter" ? 0 : 1,
            }}
          >
            <span className="inline-block w-2 h-2 bg-black/30 rounded-full mr-3" />
            AI-POWERED TALENT ACQUISITION
            <span className="inline-block w-2 h-2 bg-black/30 rounded-full ml-3" />
          </p>
          <p
            className="text-black/30 text-sm tracking-widest uppercase"
            style={{
              animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards",
              opacity: phase === "enter" ? 0 : 1,
            }}
          >
            Precision Matching • Executive Search • Global Talent
          </p>
        </div>

        {/* Premium Progress Indicator - Nike Style */}
        <div className="relative w-80 md:w-96">
          {/* Background Track */}
          <div className="h-[2px] w-full bg-black/5 overflow-hidden">
            {/* Animated Progress Bar */}
            <div
              className="h-full bg-gradient-to-r from-black/60 via-black/40 to-black/60"
              style={{
                width: isExiting ? "100%" : undefined,
                transition: isExiting ? `width ${EXIT_DURATION_MS}ms cubic-bezier(0.86, 0, 0.07, 1)` : "none",
                animation: phase !== "enter" ? `progress-luxury ${INTRO_DURATION_MS - EXIT_DURATION_MS}ms cubic-bezier(0.86, 0, 0.07, 1) forwards` : "none",
              }}
            />
          </div>

          {/* Progress Indicators */}
          <div className="absolute -top-8 left-0 right-0 flex justify-between text-black/30 text-xs tracking-wider">
            <span className="transition-all duration-300 hover:text-black/60 cursor-default">INITIALIZE</span>
            <span className="transition-all duration-300 hover:text-black/60 cursor-default">PROCESS</span>
            <span className="transition-all duration-300 hover:text-black/60 cursor-default">LAUNCH</span>
          </div>

          {/* Pulsing Dots */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-1 h-1 bg-black/30 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="w-1 h-1 bg-black/30 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-1 bg-black/30 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Bottom Brand Bar - Clean Style */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-between items-center px-8 text-black/20 text-xs tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-black/20" />
            <span>PURITY LABS</span>
          </div>
          <div className="flex gap-8">
            {['CLARITY', 'PRECISION', 'ELEGANCE'].map((word, i) => (
              <span key={i} className="hover:text-black/40 transition-colors duration-300 cursor-default">
                {word}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <span>EST. 2024</span>
            <span className="w-8 h-px bg-black/20" />
          </div>
        </div>

        {/* Animated Corner Accents - Clean */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-black/10" />
        <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-black/10" />
        <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-black/10" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-black/10" />

        {/* Additional Clean Design Elements */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 to-transparent transform -translate-y-1/2" />
      </div>

      <style jsx>{`
        @keyframes float-rotating {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(2deg); }
          75% { transform: translateY(10px) rotate(-2deg); }
        }
        
        @keyframes scale-luxury {
          0% { opacity: 0; transform: scale(0.8) rotate(-10deg); filter: blur(10px); }
          50% { opacity: 0.8; transform: scale(1.1) rotate(2deg); filter: blur(0); }
          100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
        }
        
        @keyframes shine {
          0% { background-position: 200% 200%; }
          100% { background-position: -100% -100%; }
        }
        
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(30px); filter: blur(10px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        
        @keyframes progress-luxury {
          0% { width: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { width: calc(100% - 0px); opacity: 1; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-slower {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: rotate(45deg) scale(1); }
          50% { opacity: 0.4; transform: rotate(45deg) scale(1.05); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; transform: rotate(-12deg) scale(1); }
          50% { opacity: 0.4; transform: rotate(-12deg) scale(0.95); }
        }
        
        @keyframes logo-reveal {
          0% { filter: brightness(0) drop-shadow(0 0 0 rgba(0,0,0,0)); }
          100% { filter: brightness(0) drop-shadow(0 0 20px rgba(0,0,0,0.1)); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        
        .animate-spin-slower {
          animation: spin-slower 12s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 4s ease-in-out infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}