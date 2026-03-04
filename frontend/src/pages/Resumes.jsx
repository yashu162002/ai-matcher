import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllResumes } from "../api/resumeApi";

export default function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState("table"); // table or cards

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const fetchResumes = async () => {
      try {
        const res = await getAllResumes();
        setResumes(res.data || []);
      } catch (err) {
        console.error(err);
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleMail = async (email) => {
    try {
      await fetch(`http://localhost:8084/api/match/send-mail/${email}`, { method: "POST" });
      alert("Email sent to candidate!");
    } catch (err) {
      console.error(err);
      alert("Failed to send email");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    await fetch(`http://localhost:8082/api/resume/delete/${id}`, { method: "DELETE" });
    setResumes(resumes.filter((r) => r.id !== id));
  };

  // Filter resumes based on search
  const filteredResumes = resumes.filter(r => {
    const searchString = searchTerm.toLowerCase();
    return (
      (r.candidateName || "").toLowerCase().includes(searchString) ||
      (r.candidateEmail || "").toLowerCase().includes(searchString) ||
      (r.phoneNo || "").toLowerCase().includes(searchString) ||
      (r.address || "").toLowerCase().includes(searchString) ||
      (r.fileName || "").toLowerCase().includes(searchString)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider">LOADING TALENT POOL...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-200/20 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-pink-200/20 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Nike Swoosh Watermark */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.02]">
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
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] uppercase">
                <span className="w-8 h-px bg-gradient-to-r from-purple-500 to-pink-500" />
                TALENT POOL
              </div>
              
              <div>
                <h1 className="text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
                  Candidate
                  <span className="block font-black italic bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    PROFILES
                  </span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl font-light mt-4">
                  Manage and review candidate resumes from your talent pool
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                  viewMode === "table" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                  viewMode === "cards" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Cards
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-8 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <input
              type="text"
              placeholder="Search candidates by name, email, phone, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-300 transition-all duration-500"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <span className="w-1 h-1 bg-purple-400 rounded-full" />
            {filteredResumes.length} CANDIDATE PROFILES FOUND
          </div>
        </div>

        {/* Resumes Display */}
        {filteredResumes.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-16 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-400">Try adjusting your search criteria</p>
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    {['Name', 'Email', 'Phone', 'Location', 'Resume', 'Actions'].map((header, i) => (
                      <th key={i} className="px-6 py-4 text-left">
                        <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">
                          {header}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredResumes.map((r, index) => (
                    <tr
                      key={r.id}
                      className="border-b border-gray-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 group"
                      style={{
                        animation: `fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s forwards`,
                        opacity: 0
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(r.candidateName || '?').charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {r.candidateName || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{r.candidateEmail || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{r.phoneNo || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 max-w-xs truncate block">
                          {r.address || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm text-gray-500">{r.fileName || '—'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            to="/jobs"
                            className="group/btn relative overflow-hidden px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-all duration-500"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              Match Jobs
                              <svg className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </Link>
                          
                          <button
                            onClick={() => handleMail(r.candidateEmail)}
                            className="group/btn relative overflow-hidden px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-500"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              Mail
                            </span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="group/btn relative overflow-hidden px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-500"
                          >
                            <span className="relative z-10 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Cards View */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((r, index) => (
              <div
                key={r.id}
                className="group relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-700 hover:-translate-y-1"
                style={{
                  animation: `fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Card Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl font-medium text-gray-700">
                        {(r.candidateName || '?').charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-light text-gray-900">
                        {r.candidateName || 'Anonymous Candidate'}
                      </h3>
                      <p className="text-xs text-gray-400">#{String(index + 1).padStart(3, '0')}</p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-4">
                  {/* Email */}
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600">{r.candidateEmail || 'No email provided'}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-600">{r.phoneNo || 'No phone provided'}</span>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 text-sm">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600 truncate">{r.address || 'No location provided'}</span>
                  </div>

                  {/* Resume File */}
                  <div className="flex items-center gap-3 text-sm pt-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-500 text-xs">{r.fileName || 'No resume file'}</span>
                  </div>
                </div>

                {/* Card Footer - Actions */}
                <div className="p-6 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Link
                      to="/jobs"
                      className="flex-1 text-center px-3 py-2 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-500"
                    >
                      Match Jobs
                    </Link>
                    <button
                      onClick={() => handleMail(r.candidateEmail)}
                      className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-500"
                    >
                      Mail
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="px-3 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all duration-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-700" />
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-gray-300" />
            <span>AI-POWERED CANDIDATE MATCHING</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-400 animate-pulse rounded-full" />
            <span>{filteredResumes.length} ACTIVE PROFILES</span>
          </div>
        </div>

        <p className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-6 py-4 text-sm text-gray-600 border border-purple-100">
          <span className="font-medium text-purple-700">Pro tip:</span> Navigate to Jobs → select a position → Run AI Matching to see candidate compatibility scores.
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}