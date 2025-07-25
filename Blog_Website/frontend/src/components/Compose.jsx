import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { postBlog } from "../api/apiInstance";
import { Save, Eye, Palette } from "lucide-react";

const Compose = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [theme, setTheme] = useState("light");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const navigate = useNavigate();

  const themes = {
    light: {
      name: "Light",
      bg: "bg-white",
      text: "text-gray-900",
      border: "border-gray-200",
    },
    dark: {
      name: "Dark",
      bg: "bg-gray-900",
      text: "text-white",
      border: "border-gray-700",
    },
    vincent: {
      name: "Vincent",
      bg: "bg-gradient-to-br from-yellow-50 to-orange-50",
      text: "text-gray-900",
      border: "border-yellow-200",
    },
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await postBlog({ title, description, content, theme });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const currentTheme = themes[theme];

  return (
    <div
      className={`min-h-screen ${currentTheme.bg} transition-colors duration-300`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1
            className={`text-3xl font-bold ${currentTheme.text} mb-4 sm:mb-0`}
          >
            Write Your Story
          </h1>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <div className="flex items-center space-x-2">
              <Palette className={`h-5 w-5 ${currentTheme.text}`} />
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:ring-2 focus:ring-indigo-500`}
              >
                {Object.entries(themes).map(([key, themeData]) => (
                  <option key={key} value={key}>
                    {themeData.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview Toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} hover:bg-gray-100 transition-colors flex items-center space-x-2`}
            >
              <Eye className="h-4 w-4" />
              <span>{showPreview ? "Edit" : "Preview"}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!showPreview ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your blog title..."
                className={`w-full px-4 py-3 text-2xl font-bold border-b-2 ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:border-indigo-500 placeholder-gray-500`}
              />
            </div>

            {/* Description Input */}
            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter blog description (short summary)..."
                className={`w-full px-4 py-3 border rounded-lg ${currentTheme.border} ${currentTheme.bg} ${currentTheme.text} focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-500`}
                rows="3"
              ></textarea>
            </div>

            {/* Content Editor */}
            <div className="relative">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your story..."
                  className="min-h-[300px] h-28"
                />
              </div>
              {/* Spacer div to avoid overlap */}
              <div className="h-20"></div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    <span>Publish Blog</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Preview Mode */
          <div
            className={`${currentTheme.bg} ${currentTheme.text} rounded-lg p-8 border ${currentTheme.border} shadow-sm`}
          >
            <h1 className="text-4xl font-bold mb-6">
              {title || "Your Title Here"}
            </h1>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content || "<p>Your content will appear here...</p>",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Compose;
