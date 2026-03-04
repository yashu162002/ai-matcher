import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { login } from "../api/authApi";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [focusedField, setFocusedField] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleSubmit = async (e) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
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
        
        {/* Nike Swoosh Watermark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-800">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px),
                            linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] uppercase mb-4">
              <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
              RECRUITER PORTAL
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
              Welcome 
              <span className="block font-black italic bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mt-1">
                BACK
              </span>
            </h1>
            
            <p className="text-gray-500 text-sm mt-4 max-w-sm mx-auto">
              Access your dashboard to manage positions and review candidates
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 relative overflow-hidden group">
            {/* Animated Border Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5" />
            </div>

            {/* Corner Accents */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-gray-200 group-hover:border-blue-400/30 transition-colors duration-500" />
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-gray-200 group-hover:border-emerald-400/30 transition-colors duration-500" />

            <form onSubmit={handleSubmit} className="relative space-y-8">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 tracking-wider uppercase">
                  <span className="w-4 h-px bg-gray-300" />
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 transition-all duration-500"
                    placeholder="Enter your email"
                    required
                  />
                  {/* Animated Icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className={`w-5 h-5 transition-colors duration-500 ${focusedField === 'email' ? 'text-blue-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-400 tracking-wider uppercase">
                  <span className="w-4 h-px bg-gray-300" />
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-all duration-500"
                    placeholder="Enter your password"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <svg className={`w-5 h-5 transition-colors duration-500 ${focusedField === 'password' ? 'text-emerald-500' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="#" className="text-xs text-gray-400 hover:text-gray-600 transition-colors duration-300 tracking-wider">
                  FORGOT PASSWORD?
                </a>
              </div>

              {/* Submit Button - Nike Style */}
              <button
                type="submit"
                className="group/btn relative w-full overflow-hidden bg-gray-900 text-white py-5 px-6 font-bold tracking-[0.2em] uppercase text-sm rounded-xl transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-900/20"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700 ease-in-out" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  ACCESS DASHBOARD
                  <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>

              {/* Demo Credentials - Helpful hint */}
              <div className="text-center pt-4">
                <p className="text-xs text-gray-300">
                  Demo: hr@test.com / any password
                </p>
              </div>
            </form>
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-center gap-8 text-xs text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors duration-300 tracking-wider">
              PRIVACY POLICY
            </a>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <a href="#" className="hover:text-gray-600 transition-colors duration-300 tracking-wider">
              TERMS OF USE
            </a>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <a href="#" className="hover:text-gray-600 transition-colors duration-300 tracking-wider">
              CONTACT
            </a>
          </div>

          {/* Live Status Indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
            <span className="text-gray-400 text-xs tracking-wider">SECURE CONNECTION</span>
          </div>
        </div>
      </div>

      <style jsx>{`
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
        
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Custom input autofill styles */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #f9fafb inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}