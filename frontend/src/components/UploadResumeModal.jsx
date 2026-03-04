import { useState, useRef, useEffect } from "react";
import { uploadResume } from "../api/resumeApi";

export default function UploadResumeModal({ isOpen, onClose }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
  });

  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload your resume");
      return;
    }

    try {
      setSubmitting(true);

      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      data.append("phoneNo", form.phoneNo);
      data.append("address", form.address);
      data.append("file", file);

      await uploadResume(data);

      alert("Resume uploaded successfully 🚀");

      setForm({ name: "", email: "", phoneNo: "", address: "" });
      setFile(null);

      if (fileInputRef.current) fileInputRef.current.value = "";

      onClose();
    } catch (err) {
      alert("Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      onClick={() => !submitting && onClose()}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      />

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1)" : "scale(.95)",
        }}
        className="relative w-full max-w-lg rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.25)] p-8 transition-all duration-300"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Upload Resume
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-500">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-500">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@email.com"
              required
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-semibold text-gray-500">
              Phone
            </label>

            <input
              name="phoneNo"
              value={form.phoneNo}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm font-semibold text-gray-500">
              Address
            </label>

            <textarea
              name="address"
              rows="2"
              value={form.address}
              onChange={handleChange}
              placeholder="City, State"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black outline-none transition"
            />
          </div>

          {/* FILE */}
          <div>
            <label className="text-sm font-semibold text-gray-500">
              Upload Resume
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              required
              className="w-full mt-2 text-sm file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0 file:bg-black
              file:text-white hover:file:bg-gray-800"
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={submitting}
            className="w-full mt-4 py-3 rounded-xl bg-black text-white font-semibold
            hover:bg-gray-900 active:scale-[0.98] transition"
          >
            {submitting ? "Uploading..." : "Submit Resume"}
          </button>

        </form>
      </div>
    </div>
  );
}