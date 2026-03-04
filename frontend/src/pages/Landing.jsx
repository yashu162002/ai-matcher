import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login } from "../api/authApi";
import { getRecommendedJobs } from "../api/matchApi";
import UploadResumeModal from "../components/UploadResumeModal";

export default function Landing() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRecommend, setShowRecommend] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [recommendEmail, setRecommendEmail] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRec, setLoadingRec] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* Premium Background - Clean White with Soft Accents */}
      <div className="fixed inset-0">
        {/* Base White Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-white" />
        
        {/* Soft Color Accent Orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-emerald-200/30 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-amber-200/20 via-purple-200/20 to-rose-200/20 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px),
                           linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
        
        {/* Nike-Inspired Swoosh Element - Light Gray */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-800">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header Section - Clean & Elegant */}
        <div className="text-center mb-16 lg:mb-24">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] uppercase mb-6">
            <span className="w-8 h-px bg-gray-300" />
            NEXT GENERATION MATCHING
          </div>
          
          {/* Main Headline - Sophisticated Typography */}
          <h1 className="text-6xl lg:text-8xl font-black tracking-tighter mb-6">
            <span className="block bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              TALENT
            </span>
            <span className="block text-5xl lg:text-7xl font-light italic text-gray-400 mt-2">
              meets OPPORTUNITY
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-light tracking-wide">
            AI-powered precision matching for the world's most ambitious professionals and forward-thinking companies.
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Job Seeker Card - Clean White Edition */}
          <div 
            className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 group border border-gray-100 hover:border-gray-200 transition-all duration-700"
            onMouseEnter={() => setActiveCard('seeker')}
            onMouseLeave={() => setActiveCard(null)}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#f8f8f8,_transparent_70%)] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Card Content */}
            <div className="relative space-y-8">
              {/* Icon Section - With Color */}
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 group-hover:border-blue-200 transition-colors duration-500">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">FOR TALENT</h2>
                    <p className="text-gray-400 text-sm tracking-wider">JOB SEEKER</p>
                  </div>
                </div>
                
                {/* Premium Badge */}
                <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <span className="text-gray-500 text-xs tracking-wider">AI-POWERED</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Upload your resume and let our AI engine find your perfect role. 
                <span className="block text-gray-400 text-xs mt-2">Includes skills analysis, experience matching, and personalized recommendations.</span>
              </p>

              {/* Action Buttons - Elegant Style */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setShowUpload(true)}
                  className="w-full group/btn relative overflow-hidden bg-gray-900 text-white py-4 px-6 font-bold tracking-wider uppercase text-sm rounded-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">Upload Resume</span>
                </button>
                
                <button
                  onClick={() => setShowRecommend(!showRecommend)}
                  className="w-full relative border-2 border-gray-200 py-4 px-6 font-medium text-sm tracking-wider uppercase text-gray-600 rounded-xl hover:border-gray-300 hover:text-gray-900 transition-all duration-500"
                >
                  Get AI Recommendations
                </button>
              </div>

              {/* Recommendations Section */}
              {showRecommend && (
                <div className="mt-8 pt-8 border-t border-gray-100 space-y-4 animate-slide-down">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={recommendEmail}
                      onChange={(e) => setRecommendEmail(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 transition-colors duration-500"
                    />
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (!recommendEmail.trim()) return;
                      setLoadingRec(true);
                      try {
                        const res = await getRecommendedJobs(recommendEmail.trim());
                        setRecommendedJobs(res.data || []);
                      } catch {
                        setRecommendedJobs([]);
                      } finally {
                        setLoadingRec(false);
                      }
                    }}
                    disabled={loadingRec}
                    className="w-full bg-gray-900 text-white py-4 px-6 font-medium tracking-wider uppercase text-sm rounded-xl hover:bg-gray-800 disabled:opacity-50 transition-all duration-500"
                  >
                    {loadingRec ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        PROCESSING...
                      </span>
                    ) : 'Find My Matches'}
                  </button>

                  {/* Recommended Jobs List */}
                  {recommendedJobs.length > 0 && (
                    <div className="mt-6 space-y-3 max-h-64 overflow-y-auto custom-scroll">
                      {recommendedJobs.map((j, index) => (
                        <div 
                          key={j.jobId} 
                          className="group/item relative bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all duration-500 animate-fade-in border border-gray-100 hover:border-gray-200"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="relative flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{j.title}</p>
                              <p className="text-gray-400 text-xs mt-1">#{String(index + 1).padStart(3, '0')}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-light text-blue-600">{j.matchScore}%</span>
                              <p className="text-gray-400 text-xs">match</p>
                            </div>
                          </div>
                          {j.matchExplanation && (
                            <p className="text-gray-500 text-xs mt-2">{j.matchExplanation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Recruiter Card - Clean White Edition */}
          <div 
            className="relative bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 group border border-gray-100 hover:border-gray-200 transition-all duration-700"
            onMouseEnter={() => setActiveCard('recruiter')}
            onMouseLeave={() => setActiveCard(null)}
          >
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#f8f8f8,_transparent_70%)] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            {/* Card Content */}
            <div className="relative space-y-8">
              {/* Icon Section - With Color */}
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 group-hover:border-emerald-200 transition-colors duration-500">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">FOR BUSINESS</h2>
                    <p className="text-gray-400 text-sm tracking-wider">RECRUITER</p>
                  </div>
                </div>
                
                {/* Premium Badge */}
                <div className="px-4 py-2 bg-gray-50 rounded-full border border-gray-100">
                  <span className="text-gray-500 text-xs tracking-wider">ENTERPRISE</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Access our AI matching engine to find the perfect candidates.
                <span className="block text-gray-400 text-xs mt-2">Post jobs, analyze matches, and build your dream team.</span>
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => setShowLogin(!showLogin)}
                  className="w-full group/btn relative overflow-hidden bg-gray-900 text-white py-4 px-6 font-bold tracking-wider uppercase text-sm rounded-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">Recruiter Access</span>
                </button>
              </div>

              {/* Login Form */}
              {showLogin && (
                <form onSubmit={handleLogin} className="mt-8 pt-8 border-t border-gray-100 space-y-4 animate-slide-down">
                  <div className="space-y-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-500"
                      required
                    />
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl py-4 px-6 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-4 px-6 font-medium tracking-wider uppercase text-sm rounded-xl hover:bg-gray-800 transition-all duration-500"
                  >
                    Access Dashboard
                  </button>

                  {/* Forgot Password Link */}
                  <p className="text-center">
                    <a href="#" className="text-gray-400 text-xs tracking-wider hover:text-gray-600 transition-colors duration-500">
                      FORGOT PASSWORD?
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { icon: '⚡', label: 'Instant Matching', color: 'blue' },
            { icon: '🎯', label: '95% Accuracy', color: 'emerald' },
            { icon: '🌍', label: 'Global Talent', color: 'purple' },
            { icon: '🔒', label: 'Enterprise Secure', color: 'amber' }
          ].map((feature, i) => (
            <div key={i} className="text-center group">
              <div className={`text-2xl mb-2 opacity-60 group-hover:opacity-100 transition-opacity duration-500`}>
                {feature.icon}
              </div>
              <p className="text-gray-500 text-xs tracking-wider">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom Bar - Clean Style */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-xs tracking-wider border-t border-gray-100 pt-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-gray-300" />
            <span>© 2024 AI MATCHER</span>
          </div>
          
          <div className="flex gap-8">
            {['PRIVACY', 'TERMS', 'CONTACT'].map((item) => (
              <a key={item} href="#" className="hover:text-gray-600 transition-colors duration-500">
                {item}
              </a>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
            <span>AI ENGINE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadResumeModal 
        isOpen={showUpload} 
        onClose={() => setShowUpload(false)} 
      />

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
        
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
}