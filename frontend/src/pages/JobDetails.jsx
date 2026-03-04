import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getJob, shortlistOrReject, getJobApplications } from "../api/jobApi";
import { getAIMatch } from "../api/matchApi";
import { getResumeDownloadUrl } from "../api/resumeApi";
import MatchChart from "../components/MatchChart";

export default function JobDetails() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [matches, setMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterMinScore, setFilterMinScore] = useState(0);
  const [filterSkill, setFilterSkill] = useState("");
  const [applications, setApplications] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await getJob(jobId);
        setJob(res.data);
      } catch (err) {
        alert("Failed to load job");
      }
    };
    fetchJob();
  }, [jobId]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getJobApplications(jobId);
        const map = {};
        (res.data || []).forEach((a) => {
          map[a.resumeId] = a.status;
        });
        setApplications(map);
      } catch {
        setApplications({});
      }
    };
    if (jobId) fetchApplications();
  }, [jobId, matches]);

  const handleMatch = async () => {
    try {
      setLoading(true);
      const res = await getAIMatch(jobId);
      const data = Array.isArray(res.data) ? res.data : res.data?.matches || [];
      setAllMatches(data);
      setMatches(data);
    } catch (err) {
      alert(err.response?.data?.error || err.message || "Matching failed");
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (resumeId) => {
    try {
      await shortlistOrReject(jobId, resumeId, "SHORTLISTED");
      setApplications((prev) => ({ ...prev, [resumeId]: "SHORTLISTED" }));
    } catch (err) {
      alert("Failed to shortlist");
    }
  };

  const handleReject = async (resumeId) => {
    try {
      await shortlistOrReject(jobId, resumeId, "REJECTED");
      setApplications((prev) => ({ ...prev, [resumeId]: "REJECTED" }));
    } catch (err) {
      alert("Failed to reject");
    }
  };

  const handleDownload = (resumeId) => {
    window.open(getResumeDownloadUrl(resumeId), "_blank");
  };

  useEffect(() => {
    let filtered = allMatches;
    if (filterMinScore > 0) {
      filtered = filtered.filter((m) => (m.matchScore ?? m.score ?? 0) >= filterMinScore);
    }
    if (filterSkill.trim()) {
      const skill = filterSkill.trim().toLowerCase();
      filtered = filtered.filter(
        (m) =>
          (m.matchedSkills || "").toLowerCase().includes(skill) ||
          (m.candidateName || "").toLowerCase().includes(skill) ||
          (m.candidateEmail || "").toLowerCase().includes(skill)
      );
    }
    setMatches(filtered);
  }, [filterMinScore, filterSkill, allMatches]);

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="mt-6 h-48 animate-pulse rounded-2xl bg-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
      {/* Premium Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_#60A5FA15,_transparent_50%),_radial-gradient(ellipse_at_bottom_left,_#34D39915,_transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-3xl" />
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{
          backgroundImage: `linear-gradient(to right, #00000008 1px, transparent 1px),
                            linear-gradient(to bottom, #00000008 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem'
        }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-300 group mb-4"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>

          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 text-gray-400 text-sm tracking-[0.3em] uppercase mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
            POSITION DETAILS
          </div>
        </div>

        {/* Job Info Card - Premium Style */}
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 tracking-tight">
                {job.title}
                <span className="block text-lg text-gray-400 font-normal mt-2">Position Overview</span>
              </h1>
              
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-700 text-sm font-medium">{job.minExperience}+ Years Experience</span>
                </div>
                
                {job.requiredSkills && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="text-emerald-700 text-sm font-medium">{job.requiredSkills}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleMatch}
              disabled={loading}
              className="group relative px-8 py-4 bg-gray-900 text-white overflow-hidden rounded-xl transition-all duration-700 hover:scale-105 hover:shadow-xl hover:shadow-gray-900/20 disabled:opacity-50 disabled:hover:scale-100 min-w-[200px]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.2em] uppercase">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    MATCHING...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    RUN AI MATCHING
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Description Section */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-400 tracking-wider uppercase mb-3">Description</h3>
            <p className="text-gray-600 leading-relaxed">{job.description}</p>
          </div>
        </div>

        {/* Match Results Section */}
        {matches.length > 0 && (
          <div className="space-y-8">
            {/* Tabs Navigation */}
            <div className="flex gap-2 border-b border-gray-200">
              {['details', 'analytics', 'candidates'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-sm font-medium tracking-wider uppercase transition-all duration-500 relative ${
                    activeTab === tab 
                      ? 'text-gray-900' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Analytics Tab - Chart */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 animate-fade-in">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-light text-gray-900">Match Distribution</h3>
                    <p className="text-gray-400 text-sm mt-1">Score analysis across all candidates</p>
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-full border border-blue-100">
                    <span className="text-blue-700 text-sm font-medium">
                      {matches.length} Candidates
                    </span>
                  </div>
                </div>
                <div className="h-[300px]">
                  <MatchChart
                    data={matches.map((m) => ({
                      candidateEmail: m.candidateName || m.candidateEmail || `Resume ${m.resumeId}`,
                      matchScore: m.matchScore ?? m.score ?? 0,
                    }))}
                  />
                </div>
              </div>
            )}

            {/* Candidates Tab - List */}
            {activeTab === 'candidates' && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 animate-fade-in">
                {/* Header with Filters */}
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-light text-gray-900">Candidate Matches</h3>
                    <p className="text-gray-400 text-sm mt-1">AI-ranked by compatibility score</p>
                  </div>
                  
                  {/* Filters */}
                  <div className="flex flex-wrap gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="Min score"
                        value={filterMinScore || ''}
                        onChange={(e) => setFilterMinScore(Number(e.target.value) || 0)}
                        className="w-24 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-300 transition-colors duration-500"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter by skill..."
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                        className="w-44 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-300 transition-colors duration-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-4">
                  {matches.map((match, index) => (
                    <div
                      key={match.resumeId ?? index}
                      className={`group relative bg-gray-50 rounded-xl p-6 transition-all duration-700 hover:shadow-lg border ${
                        applications[match.resumeId] === "SHORTLISTED"
                          ? "border-emerald-200 bg-emerald-50/30"
                          : applications[match.resumeId] === "REJECTED"
                          ? "border-red-200 bg-red-50/30"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      {/* Hover Gradient */}
                      <div className={`absolute inset-0 bg-gradient-to-r rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                        applications[match.resumeId] === "SHORTLISTED"
                          ? "from-emerald-500/5 to-transparent"
                          : applications[match.resumeId] === "REJECTED"
                          ? "from-red-500/5 to-transparent"
                          : "from-blue-500/5 to-emerald-500/5"
                      }`} />

                      <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        {/* Candidate Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-400">#{String(index + 1).padStart(3, '0')}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              (match.matchScore ?? match.score ?? 0) >= 80
                                ? 'bg-emerald-100 text-emerald-700'
                                : (match.matchScore ?? match.score ?? 0) >= 60
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {(match.matchScore ?? match.score ?? 0)}% Match
                            </span>
                          </div>
                          
                          <h4 className="text-xl font-light text-gray-900">
                            {match.candidateName || match.candidateEmail || `Candidate ${match.resumeId}`}
                          </h4>
                          
                          {match.candidateEmail && (
                            <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              {match.candidateEmail}
                            </p>
                          )}

                          {/* Skills Analysis */}
                          <div className="mt-4 space-y-2">
                            {match.matchedSkills && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-emerald-600 font-medium">Matched:</span>
                                <span className="text-gray-600">{match.matchedSkills}</span>
                              </div>
                            )}
                            {match.missingSkills && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-amber-600 font-medium">Missing:</span>
                                <span className="text-gray-600">{match.missingSkills}</span>
                              </div>
                            )}
                          </div>

                          {match.matchExplanation && (
                            <p className="mt-3 text-sm text-gray-500 italic border-l-2 border-gray-200 pl-3">
                              {match.matchExplanation}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 lg:flex-col">
                          <button
                            onClick={() => handleDownload(match.resumeId)}
                            className="group/btn relative overflow-hidden bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg hover:border-gray-300 transition-all duration-500 min-w-[100px]"
                          >
                            <span className="absolute inset-0 bg-gray-100 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </span>
                          </button>

                          {applications[match.resumeId] === "SHORTLISTED" ? (
                            <span className="bg-emerald-100 text-emerald-700 px-4 py-2 text-sm font-medium rounded-lg border border-emerald-200 min-w-[100px] text-center">
                              Shortlisted
                            </span>
                          ) : applications[match.resumeId] === "REJECTED" ? (
                            <span className="bg-red-100 text-red-700 px-4 py-2 text-sm font-medium rounded-lg border border-red-200 min-w-[100px] text-center">
                              Rejected
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleShortlist(match.resumeId)}
                                className="group/btn relative overflow-hidden bg-emerald-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-emerald-500 transition-all duration-500 min-w-[80px]"
                              >
                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                <span className="relative z-10">Shortlist</span>
                              </button>
                              <button
                                onClick={() => handleReject(match.resumeId)}
                                className="group/btn relative overflow-hidden bg-red-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-red-500 transition-all duration-500 min-w-[80px]"
                              >
                                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                <span className="relative z-10">Reject</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Details Tab - Job Info */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-8 lg:p-10 border border-gray-100 animate-fade-in">
                <h3 className="text-2xl font-light text-gray-900 mb-6">Position Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-400 mb-1">Experience Required</p>
                      <p className="text-2xl font-light text-gray-900">{job.minExperience}+ years</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-sm text-gray-400 mb-1">Required Skills</p>
                      <p className="text-gray-900">{job.requiredSkills || 'Not specified'}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-sm text-gray-400 mb-1">Full Description</p>
                    <p className="text-gray-600 leading-relaxed">{job.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Results State */}
        {matches.length === 0 && !loading && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-16 border border-gray-100 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-400">Click "Run AI Matching" to find the best candidates for this position</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}