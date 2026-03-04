import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";

export default function Layout() {
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Different gradient colors based on route
  const getGradientColors = () => {
    if (location.pathname.includes('job')) {
      return {
        primary: 'from-blue-500/10',
        secondary: 'to-emerald-500/10',
        accent: 'blue'
      };
    } else if (location.pathname.includes('resume')) {
      return {
        primary: 'from-purple-500/10',
        secondary: 'to-pink-500/10',
        accent: 'purple'
      };
    } else {
      return {
        primary: 'from-gray-500/10',
        secondary: 'to-gray-500/10',
        accent: 'gray'
      };
    }
  };

  const gradients = getGradientColors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-x-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Base Gradient Mesh */}
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#60A5FA15,_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_#34D39915,_transparent_50%)]`} />
        
        {/* Dynamic Color Orbs - Route Based */}
        <div 
          className={`absolute top-20 left-20 w-96 h-96 bg-gradient-to-br ${gradients.primary} via-transparent to-transparent rounded-full blur-3xl`}
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className={`absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl ${gradients.secondary} via-transparent to-transparent rounded-full blur-3xl`}
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />

        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gray-200/20 via-white/20 to-gray-200/20 rounded-full blur-3xl" />

        {/* Nike Swoosh Watermark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-800">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `
            linear-gradient(to right, #00000008 1px, transparent 1px),
            linear-gradient(to bottom, #00000008 1px, transparent 1px),
            radial-gradient(circle at 1px 1px, #00000010 1px, transparent 0)
          `,
          backgroundSize: '48px 48px, 48px 48px, 24px 24px'
        }} />

        {/* Top Gradient Bar - Nike Style */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-purple-500" />
      </div>

      {/* Navbar with Glass Effect */}
      <div className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'backdrop-blur-xl bg-white/80 shadow-lg shadow-gray-200/50' : 'bg-transparent'}`}>
        <Navbar />
      </div>

      {/* Main Content Area */}
      <main className="relative min-h-[calc(100vh-80px)]">
        {/* Page Transition Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 bg-gradient-to-b ${gradients.primary} ${gradients.secondary} opacity-0 transition-opacity duration-700`} />
        </div>

        {/* Content Container */}
        <div className="relative">
          <Outlet />
        </div>

        {/* Decorative Bottom Bar - Nike Style */}
        <div className="fixed bottom-8 right-8 z-50">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-200/50">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
              <span className="text-xs text-gray-500 font-medium">AI ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-xs text-gray-400 tracking-wider">v2.0</span>
          </div>
        </div>

        {/* Scroll to Top Button - Appears on scroll */}
        {scrolled && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 left-8 z-50 group bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </main>

      {/* Footer - Minimal */}
      <footer className="relative border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="w-6 h-px bg-gray-300" />
              <span>© 2024 AI MATCHER</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs">
              {['PRIVACY', 'TERMS', 'CONTACT', 'CAREERS'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-300 tracking-wider"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300">MADE WITH</span>
              <svg className="w-4 h-4 text-red-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-xs text-gray-300">IN USA</span>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Smooth page transitions */
        :global(.animate-page-enter) {
          animation: fade-in 0.5s ease-out forwards;
        }

        :global(.animate-slide-up) {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Custom scrollbar */
        :global(::-webkit-scrollbar) {
          width: 8px;
          height: 8px;
        }

        :global(::-webkit-scrollbar-track) {
          background: #f1f1f1;
        }

        :global(::-webkit-scrollbar-thumb) {
          background: #ccc;
          border-radius: 4px;
        }

        :global(::-webkit-scrollbar-thumb:hover) {
          background: #999;
        }

        /* Smooth scrolling */
        :global(html) {
          scroll-behavior: smooth;
        }

        /* Selection style */
        :global(::selection) {
          background: #000000;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
}