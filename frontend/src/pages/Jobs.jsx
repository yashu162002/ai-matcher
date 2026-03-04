import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../api/jobApi";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterExperience, setFilterExperience] = useState("all");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        setJobs(res.data || []);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Filter jobs based on search and experience
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterExperience === "all") return matchesSearch;
    if (filterExperience === "entry") return matchesSearch && job.minExperience <= 2;
    if (filterExperience === "mid") return matchesSearch && job.minExperience > 2 && job.minExperience <= 5;
    if (filterExperience === "senior") return matchesSearch && job.minExperience > 5;
    return matchesSearch;
  });

  const experienceLevels = [
    { value: "all", label: "All Levels", color: "gray" },
    { value: "entry", label: "Entry (0-2 yrs)", color: "blue" },
    { value: "mid", label: "Mid (3-5 yrs)", color: "emerald" },
    { value: "senior", label: "Senior (5+ yrs)", color: "purple" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm tracking-wider">LOADING POSITIONS...</p>
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
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 via-transparent to-transparent rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-emerald-200/20 via-transparent to-transparent rounded-full blur-3xl"
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
                <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
                POSITION COLLECTION
              </div>
              
              <div>
                <h1 className="text-5xl lg:text-6xl font-light text-gray-900 tracking-tight">
                  Open
                  <span className="block font-black italic bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                    POSITIONS
                  </span>
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl font-light mt-4">
                  Discover your next opportunity from our curated collection of roles
                </p>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                  viewMode === "grid" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                  viewMode === "list" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                List
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mt-8 flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <input
                type="text"
                placeholder="Search positions by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl px-6 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 transition-all duration-500"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Experience Filter */}
            <div className="flex gap-2">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setFilterExperience(level.value)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-500 overflow-hidden group ${
                    filterExperience === level.value
                      ? `text-white`
                      : `text-gray-500 hover:text-gray-700 bg-gray-100`
                  }`}
                >
                  {filterExperience === level.value && (
                    <div className={`absolute inset-0 bg-${level.color}-500 transition-all duration-500`} />
                  )}
                  <span className="relative z-10">{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            {filteredJobs.length} POSITIONS AVAILABLE
          </div>
        </div>

        {/* Jobs Grid/List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-16 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">No positions found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="group relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-700 hover:-translate-y-1"
                style={{
                  animation: `fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Premium Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.minExperience <= 2 
                      ? 'bg-blue-100 text-blue-700'
                      : job.minExperience <= 5
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {job.minExperience}+ years
                  </span>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-2xl font-light text-gray-900 mb-3 group-hover:translate-x-1 transition-transform duration-700">
                    {job.title}
                  </h3>
                  
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {job.description}
                  </p>

                  {/* Skills Tags */}
                  {job.requiredSkills && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requiredSkills.split(',').slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          {skill.trim()}
                        </span>
                      ))}
                      {job.requiredSkills.split(',').length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          +{job.requiredSkills.split(',').length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-400">
                      Posted {new Date().toLocaleDateString()}
                    </span>
                    
                    <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-500">
                      <span className="text-sm font-medium">View Details</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 group-hover:w-full transition-all duration-700" />
              </Link>
            ))}
          </div>
        ) : (
          // List View
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="group relative bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 hover:shadow-xl transition-all duration-700 hover:-translate-y-1 block"
                style={{
                  animation: `fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s forwards`,
                  opacity: 0
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-light text-gray-900">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.minExperience <= 2 
                          ? 'bg-blue-100 text-blue-700'
                          : job.minExperience <= 5
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {job.minExperience}+ years
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {job.description}
                    </p>

                    {job.requiredSkills && (
                      <div className="flex flex-wrap gap-2">
                        {job.requiredSkills.split(',').slice(0, 3).map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-400">
                      Posted {new Date().toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2 text-blue-600">
                      <span className="text-sm font-medium">View</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-12 flex items-center justify-between text-xs text-gray-400 border-t border-gray-200 pt-8">
          <div className="flex items-center gap-4">
            <span className="w-8 h-px bg-gray-300" />
            <span>© 2024 AI MATCHER</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse rounded-full" />
            <span>{filteredJobs.length} ACTIVE POSITIONS</span>
          </div>
        </div>
      </div>

      <style jsx>{`
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