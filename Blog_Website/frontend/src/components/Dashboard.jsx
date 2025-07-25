import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAllBlogs } from "../api/apiInstance";
import { searchBlogs } from "../api/apiInstance";
import { deleteBlog } from "../api/apiInstance";
import { Plus, BookOpen, Calendar, User } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalBlogs, setTotalBlogs] = useState(1);
  const [theme, setTheme] = useState(""); // Optional: Add theme filter
  const totalPages = Math.ceil(totalBlogs / limit);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await getAllBlogs({ page, limit, theme });
      console.log(response); // ✅ Always debug to understand structure
      setBlogs(response.message.blogs); // ✅ FIXED: Only set blogs array
      setTotalBlogs(response.message.totalBlogs); // ✅ FIXED: Set total blogs count
    } catch (err) {
      setError(`Failed to fetch blogs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page, theme]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await searchBlogs({ query: searchQuery, page, limit });
      setBlogs(res.message.blogs);
      setTotalBlogs(res.message.totalBlogs);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(id);
        fetchBlogs(); // Refresh blogs
      } catch (err) {
        alert(err.response?.data?.message || "Failed to delete");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Ready to share your thoughts with the world?
              </p>
            </div>
            <Link
              to="/compose"
              className="mt-4 sm:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span>New Blog</span>
            </Link>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center space-x-4 mb-8">
          <label className="font-medium">Filter by Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="vincent">Vincent</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Blogs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {blogs.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or description..."
            className="border border-gray-300 px-3 py-2 rounded-lg w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {/* Blogs */}
        <div className="bg-white rounded-2xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Blogs</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : error ? (
            <div className="p-6 text-red-600">{error}</div>
          ) : blogs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No blogs found.</div>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog._id}
                className="p-6 border-b hover:bg-gray-50 transition space-y-2"
              >
                <h3 className="text-lg font-bold text-gray-900">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  By {blog.author.username} • {formatDate(blog.createdAt)}
                </p>
                <Link
                  to={`/blog/${blog._id}`}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  Read More →
                </Link>
                <button onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:underline ml-4">
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
