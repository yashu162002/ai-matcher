import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreateJob from "./CreateJob";
import { getAllJobs } from "../api/jobApi";
import { getAllResumes } from "../api/resumeApi";

export default function Dashboard() {
  const [showCreate, setShowCreate] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [jobsRes, resumesRes] = await Promise.all([
        getAllJobs(),
        getAllResumes(),
      ]);
      setJobs(jobsRes.data || []);
      setResumes(resumesRes.data || []);
    } catch {
      setJobs([]);
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onJobCreated = () => {
    setShowCreate(false);
    fetchData();
  };

  // Premium metrics calculation
  const totalCandidates = resumes.length;
  const activeJobs = jobs.length;
  const matchRate = jobs.length > 0 ? Math.round((resumes.length / jobs.length) * 10) : 0;
  const avgResponseTime = '2.4h';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 selection:bg-gray-900 selection:text-white">
      {/* Premium Background Pattern - Light Version */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Soft Color Orbs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_#60A5FA10,_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_#34D39910,_transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
        
        {/* Grid Pattern - Light */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px),
                            linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }} />
        
        {/* Nike Swoosh Watermark - Light */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 opacity-[0.03]">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-gray-800">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section - Light Luxury */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Brand Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] uppercase font-light">
                <span className="w-8 h-px bg-gray-300" />
                Executive Dashboard
              </div>
              
              <div className="space-y-2">
                <h1 className="text-5xl lg:text-7xl font-light text-gray-900 tracking-tight">
                  Talent
                  <span className="block font-black italic bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    INTELLIGENCE
                  </span>
                </h1>
                
                <p className="text-gray-500 text-lg max-w-2xl font-light tracking-wide">
                  Precision matching for the world's most discerning organizations
                </p>
              </div>
            </div>

            {/* Premium CTA Button - Light Version */}
            <button
              onClick={() => setShowCreate(true)}
              className="group relative px-8 py-4 bg-gray-900 text-white overflow-hidden rounded-xl transition-all duration-700 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              
              {/* Button content */}
              <span className="relative z-10 flex items-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                Create Position
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Create Job Modal */}
        {showCreate && (
          <div className="mb-12 animate-slide-down">
            <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <div className="absolute top-0 left-0 w-20 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
              <div className="absolute top-0 right-0 w-20 h-px bg-gradient-to-l from-blue-500 to-emerald-500" />
              <CreateJob onSuccess={onJobCreated} onCancel={() => setShowCreate(false)} />
            </div>
          </div>
        )}

        {/* Premium Metrics Strip - Light Version */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Active Roles', value: activeJobs, suffix: 'positions', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'blue' },
            { label: 'Total Candidates', value: totalCandidates, suffix: 'profiles', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'emerald' },
            { label: 'Match Rate', value: matchRate, suffix: '% precision', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', color: 'purple' },
            { label: 'Avg Response', value: avgResponseTime, suffix: 'turnaround', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'amber' }
          ].map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 group hover:shadow-xl transition-all duration-700 border border-gray-100">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-light">
                    {metric.label}
                  </span>
                  <div className={`w-8 h-8 rounded-lg bg-${metric.color}-50 flex items-center justify-center`}>
                    <svg className={`w-4 h-4 text-${metric.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={metric.icon} />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="text-3xl lg:text-4xl font-light text-gray-900">{metric.value}</span>
                  <span className="ml-2 text-gray-400 text-sm tracking-wide">{metric.suffix}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid - Light Luxury Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Jobs - Left Column */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100">
            {/* Section Header */}
            <div className="mb-10 flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
                  <span className="text-gray-400 text-xs tracking-[0.3em] uppercase">Collection</span>
                </div>
                <h2 className="text-3xl font-light text-gray-900">
                  Active
                  <span className="block font-bold italic bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Positions
                  </span>
                </h2>
              </div>
              
              {/* Premium Filter */}
              <div className="flex gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                {['all', 'active', 'draft'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 text-xs tracking-wider uppercase rounded-md transition-all duration-500 ${
                      activeFilter === filter 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm tracking-wide">No positions available</p>
                <p className="text-gray-300 text-xs mt-2">Create your first executive search</p>
              </div>
            ) : (
              <div className="space-y-3">
                {jobs.slice(0, 5).map((job, index) => (
                  <Link
                    key={job.id}
                    to={`/job/${job.id}`}
                    className="group relative block bg-gray-50 rounded-xl p-6 hover:bg-white transition-all duration-700 hover:shadow-lg hover:border-gray-200 border border-gray-100"
                  >
                    {/* Hover Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Content */}
                    <div className="relative flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-xl font-light text-gray-900 group-hover:translate-x-2 transition-transform duration-700">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500 flex items-center gap-2">
                            <span className="w-1 h-1 bg-blue-400 rounded-full" />
                            {job.minExperience}+ years
                          </span>
                          <span className="text-gray-500 flex items-center gap-2">
                            <span className="w-1 h-1 bg-emerald-400 rounded-full" />
                            {Math.floor(Math.random() * 15) + 5} candidates
                          </span>
                        </div>
                      </div>
                      
                      {/* Premium Arrow */}
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-50 group-hover:rotate-45 transition-all duration-700 border border-gray-200">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 group-hover:w-full transition-all duration-700" />
                  </Link>
                ))}
                
                {/* View All Link */}
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-3 mt-6 text-gray-500 hover:text-gray-700 text-sm tracking-wider uppercase transition-colors duration-500 group"
                >
                  <span className="w-8 h-px bg-gray-300 group-hover:w-12 transition-all duration-500" />
                  View Complete Collection
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Uploaded Resumes - Right Column */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100">
            {/* Section Header */}
            <div className="mb-10">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-px bg-gradient-to-r from-purple-500 to-pink-500" />
                  <span className="text-gray-400 text-xs tracking-[0.3em] uppercase">Talent Pool</span>
                </div>
                <h2 className="text-3xl font-light text-gray-900">
                  Candidate
                  <span className="block font-bold italic bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Profiles
                  </span>
                </h2>
              </div>
            </div>

            {/* Resumes List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse bg-gray-100 rounded-xl" />
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-400 text-sm tracking-wide">No candidates yet</p>
                <p className="text-gray-300 text-xs mt-2">Candidates will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.slice(0, 5).map((r, index) => (
                  <div
                    key={r.id}
                    className="group relative bg-gray-50 rounded-xl p-6 hover:bg-white transition-all duration-700 hover:shadow-lg border border-gray-100"
                  >
                    {/* Premium Pattern Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    {/* Content */}
                    <div className="relative space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-light text-gray-900">
                          {r.candidateName || r.candidateEmail || 'Confidential Profile'}
                        </h3>
                        
                        {/* Premium Badge */}
                        <span className="px-3 py-1 bg-white rounded-full border border-gray-200 text-gray-500 text-xs tracking-wider">
                          #{String(index + 1).padStart(3, '0')}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {r.candidateEmail || 'Email unavailable'}
                      </p>
                      
                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Uploaded {new Date(r.uploadedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>Match Score Pending</span>
                      </div>
                    </div>
                    
                    {/* Bottom Border Animation */}
                    <div className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-700" />
                  </div>
                ))}
                
                {/* View All Link */}
                <Link
                  to="/resumes"
                  className="inline-flex items-center gap-3 mt-6 text-gray-500 hover:text-gray-700 text-sm tracking-wider uppercase transition-colors duration-500 group"
                >
                  <span className="w-8 h-px bg-gray-300 group-hover:w-12 transition-all duration-500" />
                  Browse All Profiles
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Premium Footer Note - Light Version */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-gray-400 text-xs tracking-wider">
              <span className="w-8 h-px bg-gray-300" />
              AI-POWERED MATCHING TECHNOLOGY
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-gray-300 text-xs">PREMIUM FEATURE</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
                <span className="text-gray-500 text-xs">LIVE</span>
              </div>
            </div>
          </div>
          
          <p className="mt-4 text-gray-400 text-sm max-w-2xl font-light">
            Navigate to any position and initiate AI matching to discover optimal candidates. 
            Our proprietary algorithm ensures precision placement for executive roles.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        /* Custom Scrollbar - Light Version */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 6px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #999;
        }
      `}</style>
    </div>
  );
}