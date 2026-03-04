import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  LabelList
} from "recharts";
import { useState, useEffect } from "react";

// Premium color palette - Nike Inspired
const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
  "#f97316", // Orange
  "#6366f1", // Indigo
  "#14b8a6", // Teal
];

// Gradient definitions for bars
const GRADIENTS = [
  { id: "gradient-blue", start: "#3b82f6", end: "#60a5fa" },
  { id: "gradient-emerald", start: "#10b981", end: "#34d399" },
  { id: "gradient-purple", start: "#8b5cf6", end: "#a78bfa" },
  { id: "gradient-amber", start: "#f59e0b", end: "#fbbf24" },
  { id: "gradient-pink", start: "#ec4899", end: "#f472b6" },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    const getScoreColor = () => {
      if (score >= 80) return "text-emerald-600";
      if (score >= 60) return "text-blue-600";
      if (score >= 40) return "text-amber-600";
      return "text-red-600";
    };

    return (
      <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 p-4 animate-fade-in">
        <p className="text-xs text-gray-400 mb-1 tracking-wider">CANDIDATE</p>
        <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-light ${getScoreColor()}`}>
            {score}%
          </div>
          <div className="h-8 w-px bg-gray-200" />
          <div className="text-xs text-gray-500">
            <span className="block">Match</span>
            <span className="block">Score</span>
          </div>
        </div>
        <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${
              score >= 80 ? 'bg-emerald-500' :
              score >= 60 ? 'bg-blue-500' :
              score >= 40 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  }
  return null;
};

// Custom label component for bar values
const CustomLabel = (props) => {
  const { x, y, width, value } = props;
  if (width < 20) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y - 8}
      fill="#64748b"
      fontSize={11}
      textAnchor="middle"
      className="font-medium"
    >
      {value}%
    </text>
  );
};

export default function MatchChart({ data, title = "Match Scores", showStats = true }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredBar, setHoveredBar] = useState(null);

  useEffect(() => {
    const detectZoom = () => {
      const zoom = Math.round((window.devicePixelRatio * 100)) / 100;
      setZoomLevel(Math.max(0.5, Math.min(2, zoom)));
    };

    detectZoom();
    window.addEventListener('resize', detectZoom);
    return () => window.removeEventListener('resize', detectZoom);
  }, []);

  if (!data?.length) {
    return (
      <div className="w-full bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No match data available</p>
          <p className="text-gray-400 text-xs mt-1">Run AI matching to see results</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const avgScore = Math.round(data.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / data.length);
  const topScore = Math.max(...data.map(d => d.matchScore || 0));
  const sortedData = [...data].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return (
    <div 
      className="w-full bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-500 group"
      style={{
        '--zoom-level': zoomLevel,
      }}
    >
      {/* Header Section - Nike Style */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-6 h-px bg-gradient-to-r from-blue-500 to-emerald-500" />
            <span className="text-gray-400 text-xs tracking-[0.2em] uppercase font-light">
              {title}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-gray-900 tracking-tight">
            Candidate
            <span className="block font-black italic bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              RANKINGS
            </span>
          </h3>
        </div>

        {/* Stats Badges - Nike Style */}
        {showStats && (
          <div className="flex gap-2">
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl px-3 py-2 border border-blue-100">
              <p className="text-[10px] text-gray-400 tracking-wider">AVERAGE</p>
              <p className="text-lg font-light text-gray-900">{avgScore}%</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl px-3 py-2 border border-amber-100">
              <p className="text-[10px] text-gray-400 tracking-wider">TOP</p>
              <p className="text-lg font-light text-gray-900">{topScore}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative">
        {/* Gradient Definitions */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            {GRADIENTS.map((gradient, index) => (
              <linearGradient key={gradient.id} id={gradient.id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradient.start} stopOpacity={0.9} />
                <stop offset="100%" stopColor={gradient.end} stopOpacity={0.7} />
              </linearGradient>
            ))}
          </defs>
        </svg>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={sortedData}
            margin={{ 
              top: 30, 
              right: 16, 
              left: 16, 
              bottom: 70 
            }}
            onMouseMove={(state) => {
              if (state.activeTooltipIndex !== undefined) {
                setHoveredBar(state.activeTooltipIndex);
              }
            }}
            onMouseLeave={() => setHoveredBar(null)}
          >
            {/* Background Grid */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e5e7eb" 
              vertical={false}
              opacity={0.5}
            />

            {/* X Axis */}
            <XAxis
              dataKey="candidateEmail"
              angle={-35}
              textAnchor="end"
              height={80}
              tick={{ 
                fontSize: Math.max(10, 11 / zoomLevel), 
                fill: "#6b7280",
                fontWeight: 400
              }}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />

            {/* Y Axis */}
            <YAxis
              domain={[0, 100]}
              tick={{ 
                fontSize: Math.max(10, 12 / zoomLevel), 
                fill: "#6b7280" 
              }}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={{ stroke: '#e5e7eb' }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />

            {/* Bars */}
            <Bar 
              dataKey="matchScore" 
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
              animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
            >
              {sortedData.map((entry, index) => {
                const score = entry.matchScore || 0;
                const gradientIndex = index % GRADIENTS.length;
                const isHovered = hoveredBar === index;
                
                return (
                  <Cell
                    key={index}
                    fill={`url(#${GRADIENTS[gradientIndex].id})`}
                    opacity={isHovered ? 1 : 0.9}
                    style={{
                      filter: isHovered ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}
            </Bar>

            {/* Value Labels */}
            <LabelList
              dataKey="matchScore"
              position="top"
              content={<CustomLabel />}
            />
          </BarChart>
        </ResponsiveContainer>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-500/5 to-pink-500/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Legend - Nike Style */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
          <span className="text-xs text-gray-500">Top Match (80%+)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
          <span className="text-xs text-gray-500">Strong Match (60-79%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500" />
          <span className="text-xs text-gray-500">Potential Match (40-59%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
          <span className="text-xs text-gray-500">Low Match (&lt;40%)</span>
        </div>
      </div>

      {/* Stats Footer */}
      {showStats && (
        <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-blue-400 rounded-full" />
            <span>{data.length} candidates analyzed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse" />
            <span>AI-powered matching</span>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .recharts-text {
            font-size: 10px !important;
          }
        }

        /* Custom tooltip animation */
        .recharts-tooltip-wrapper {
          transition: transform 0.2s ease !important;
        }
      `}</style>
    </div>
  );
}