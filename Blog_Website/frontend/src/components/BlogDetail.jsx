import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById } from '../api/apiInstance';
import { ArrowLeft } from 'lucide-react';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const themes = {
  light: 'bg-white text-gray-900',
  dark: 'bg-gray-900 text-white',
  vincent: 'bg-gradient-to-br from-yellow-50 to-orange-50 text-gray-900'
};


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await getBlogById(id);
        setBlog(res.message);
      } catch (err) {
        setError(`Failed to load blog: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !blog) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }

  return (
    <div className={`min-h-screen ${themes[blog.theme]}`}>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link
          to="/dashboard"
          className="flex items-center text-indigo-600 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-600 mb-6">
          By {blog.author.username} • {new Date(blog.createdAt).toLocaleDateString()}
        </p>
        <p className="text-lg font-medium mb-6">{blog.description}</p>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        ></div>
      </div>
    </div>
  );
};

export default BlogDetail;
