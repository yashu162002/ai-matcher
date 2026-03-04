import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const navLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { to: "/jobs", label: "Jobs", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { to: "/resumes", label: "Resumes", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Get gradient colors based on current route
  const getGradientColors = () => {
    if (location.pathname.includes('job')) {
      return 'from-blue-500 to-emerald-500';
    } else if (location.pathname.includes('resume')) {
      return 'from-purple-500 to-pink-500';
    } else {
      return 'from-gray-700 to-gray-900';
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-200/50' 
          : 'bg-white/50 backdrop-blur-sm'
      }`}>
        {/* Top Gradient Bar - Nike Style */}
        <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getGradientColors()}`} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Nike Style */}
            <Link 
              to="/dashboard" 
              className="group flex items-center gap-3 relative"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {/* Logo Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
              
              {/* Logo Container */}
              <div className="relative w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <span className="text-white font-black italic text-lg">AI</span>
              </div>
              
              {/* Brand Text */}
              <div className="hidden sm:block">
                <span className="text-xl font-light text-gray-900">
                  Matcher<span className="font-black italic">.AI</span>
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-6 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
                  <span className="text-[10px] text-gray-400 tracking-wider">RECRUITER</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 group ${
                      active
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className={`w-4 h-4 transition-colors duration-500 ${
                        active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                      </svg>
                      {label}
                    </span>
                    {active && (
                      <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r ${getGradientColors()}`} />
                    )}
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gray-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500 origin-left" />
                  </Link>
                );
              })}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Profile Dropdown */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-500"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
                    <div className="relative w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-sm font-medium text-gray-700">HR</span>
                    </div>
                  </div>
                  <span className="hidden lg:block text-sm text-gray-700">Recruiter</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-all duration-500 ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-slide-down">
                    <div className="p-2">
                      {/* Profile Header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">Recruiter Access</p>
                        <p className="text-xs text-gray-500 mt-1">hr@company.com</p>
                      </div>
                      
                      {/* Menu Items */}
                      <button
                        onClick={handleLogout}
                        className="w-full mt-1 flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-500 group"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-500 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity" />
                          <svg className="relative w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </div>
                        <span className="flex-1 text-left">Logout</span>
                        <span className="text-xs text-red-300">→</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden relative w-10 h-10 rounded-lg hover:bg-gray-100 transition-all duration-500 group"
              >
                <div className="absolute inset-0 bg-gray-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-500" />
                <div className="relative flex flex-col items-center justify-center gap-1.5">
                  <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-500 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                  }`} />
                  <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-500 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <span className={`w-5 h-0.5 bg-gray-600 transition-all duration-500 ${
                    isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                  }`} />
                </div>
              </button>

              {/* Live Status Indicator */}
              <div className="hidden md:flex items-center gap-2 pl-3 border-l border-gray-200">
                <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
                <span className="text-xs text-gray-400 tracking-wider">LIVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-slide-down">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(({ to, label, icon }) => {
                const active = isActive(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 ${
                      active
                        ? `bg-gradient-to-r ${getGradientColors()} bg-opacity-10 text-gray-900`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className={`w-5 h-5 ${active ? 'text-gray-900' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                    <span className="flex-1 text-sm font-medium">{label}</span>
                    {active && (
                      <span className="w-1 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
                    )}
                  </Link>
                );
              })}
              
              {/* Mobile Logout */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-500 mt-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="flex-1 text-sm font-medium">Logout</span>
              </button>

              {/* Mobile Status */}
              <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-gray-100">
                <span className="text-xs text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
                  <span className="text-xs text-gray-600">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}