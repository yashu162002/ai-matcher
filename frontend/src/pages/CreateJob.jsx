import { useState } from "react";
import { createJob } from "../api/jobApi";

export default function CreateJob({ onSuccess, onCancel }) {
  const [job, setJob] = useState({
    title: "",
    description: "",
    minExperience: 1,
    recruiterEmail: "hr@test.com",
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setJob((prev) => ({
      ...prev,
      [name]: name === "minExperience" ? Number(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!job.title?.trim()) {
      alert("Please enter a job title");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createJob(job);

      alert("Job created with ID: " + res.data.id);

      setJob({
        title: "",
        description: "",
        minExperience: 1,
        recruiterEmail: "hr@test.com",
      });

      onSuccess?.();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create job");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#f0f0f0,_transparent_70%)]" />

        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #e5e5e5 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            opacity: 0.5,
          }}
        />

        {/* Nike Swoosh */}
        <div className="absolute -right-10 bottom-0 w-48 h-48 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-black">
            <path d="M90.6,13.1c-1.1,1.9-73.2,42.9-73.2,42.9L0,73.5l16.3-5.9c0,0,73.6-42.1,75.3-43.5c3.7-3.1,1.5-7.6-1-6.9 C90,17.2,90.6,13.1,90.6,13.1z" />
          </svg>
        </div>
      </div>

      <div className="relative p-8 lg:p-10">

        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div className="space-y-3">

            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-px bg-black/20" />
              <span className="text-black/40 text-xs tracking-[0.2em] uppercase font-light">
                NEW POSITION
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-black">
              CREATE
              <span className="block text-2xl lg:text-3xl font-light italic text-black/60 mt-1">
                opportunity
              </span>
            </h2>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="group relative w-12 h-12 border border-black/10 hover:border-black/30 transition-all duration-500 rounded-full flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-black/5 scale-0 group-hover:scale-100 rounded-full transition-transform duration-500 pointer-events-none" />

              <svg
                className="w-5 h-5 text-black/40 group-hover:text-black/60 transition-colors duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* TITLE */}
          <div className="space-y-2">

            <label className="flex items-center gap-2 text-xs font-medium text-black/40 tracking-wider uppercase">
              <span className="w-4 h-px bg-black/30" />
              POSITION TITLE
            </label>

            <div className="relative group">

              <div className="absolute inset-0 bg-black/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left pointer-events-none" />

              <input
                name="title"
                placeholder="e.g. Senior React Developer"
                value={job.title}
                onChange={handleChange}
                onFocus={() => setActiveField("title")}
                onBlur={() => setActiveField(null)}
                className="relative z-10 w-full bg-transparent border-b-2 border-black/10 px-4 py-4 text-black placeholder-black/30 focus:outline-none focus:border-black/40 transition-colors duration-500 text-lg"
              />

              <div className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-700 ${activeField === "title" ? "w-full" : "w-0"}`} />

            </div>

            <p className="text-black/30 text-xs tracking-wide mt-1">
              Be specific with the role title
            </p>

          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">

            <label className="flex items-center gap-2 text-xs font-medium text-black/40 tracking-wider uppercase">
              <span className="w-4 h-px bg-black/30" />
              JOB DESCRIPTION
            </label>

            <div className="relative group">

              <div className="absolute inset-0 bg-black/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top pointer-events-none" />

              <textarea
                name="description"
                placeholder="Describe the role, responsibilities, and required skills..."
                value={job.description}
                onChange={handleChange}
                onFocus={() => setActiveField("description")}
                onBlur={() => setActiveField(null)}
                rows={4}
                className="relative z-10 w-full bg-transparent border-2 border-black/10 px-4 py-4 text-black placeholder-black/30 focus:outline-none focus:border-black/40 transition-colors duration-500 resize-none"
              />

            </div>

          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* EXPERIENCE */}
            <div className="space-y-2">

              <label className="flex items-center gap-2 text-xs font-medium text-black/40 tracking-wider uppercase">
                <span className="w-4 h-px bg-black/30" />
                MIN EXPERIENCE
              </label>

              <div className="relative group">

                <div className="absolute inset-0 bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />

                <input
                  name="minExperience"
                  type="number"
                  min={0}
                  value={job.minExperience}
                  onChange={handleChange}
                  className="relative z-10 w-full bg-transparent border-2 border-black/10 px-4 py-4 text-black focus:outline-none focus:border-black/40 transition-colors duration-500"
                />

              </div>

            </div>

            {/* EMAIL */}
            <div className="space-y-2">

              <label className="flex items-center gap-2 text-xs font-medium text-black/40 tracking-wider uppercase">
                <span className="w-4 h-px bg-black/30" />
                RECRUITER EMAIL
              </label>

              <div className="relative group">

                <div className="absolute inset-0 bg-black/5 scale-0 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />

                <input
                  name="recruiterEmail"
                  type="email"
                  value={job.recruiterEmail}
                  onChange={handleChange}
                  className="relative z-10 w-full bg-transparent border-2 border-black/10 px-4 py-4 text-black focus:outline-none focus:border-black/40 transition-colors duration-500"
                />

              </div>

            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={submitting}
            className="group relative flex-1 overflow-hidden bg-black text-white py-5 px-6 font-bold tracking-wider uppercase text-sm transition-all duration-500 hover:scale-[1.02]"
          >
            {submitting ? "CREATING..." : "CREATE POSITION"}
          </button>

        </form>
      </div>
    </div>
  );
}