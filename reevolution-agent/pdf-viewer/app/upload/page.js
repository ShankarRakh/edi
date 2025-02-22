'use client';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const formVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

const fileVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
};

export default function Home() {
  // State management
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Handle user login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else if (data?.user) {
        setUserId(data.user.id);
        await getPdfs(data.user.id);
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  // Handle PDF upload
  const uploadPdf = async (e) => {
    const file = e.target.files[0];
    if (!file || !userId) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Please upload PDF files only');
      return;
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setError('File size must be less than 10MB');
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const fileName = `${uuidv4()}.pdf`;
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`${userId}/${fileName}`, file, {
          contentType: 'application/pdf',
          onUploadProgress: (progress) => {     
            const percentage = (progress.loaded / progress.total) * 100;
            setUploadProgress(Math.round(percentage));
          },
        });

      if (error) throw error;

      await getPdfs(userId);
    } catch (err) {
      setError('Error uploading PDF file');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Fetch PDFs list
  const getPdfs = async (uid) => {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .list(`${uid}/`, {
          limit: 10,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) throw error;
      setPdfs(data || []);
    } catch (err) {
      setError('Error fetching PDFs');
    }
  };

  // View PDF in browser
  const viewPdf = async (fileName) => {
    try {
      const { data, error } = await supabase.storage
        .from('uploads')
        .createSignedUrl(`${userId}/${fileName}`, 3600); // URL valid for 1 hour

      if (error) throw error;

      setPdfUrl(data.signedUrl);
      setSelectedPdf(fileName);
    } catch (err) {
      setError('Error loading PDF');
    }
  };

  // Close PDF viewer
  const closePdfViewer = () => {
    setPdfUrl(null);
    setSelectedPdf(null);
  };

  // Handle sign out
  const signout = async () => {
    await supabase.auth.signOut();
    setUserId('');
    setPdfs([]);
    setSelectedPdf(null);
    setPdfUrl(null);
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        await getPdfs(user.id);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await getPdfs(session.user.id);
      } else {
        setUserId('');
        setPdfs([]);
        setSelectedPdf(null);
        setPdfUrl(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl">
        {!userId ? (
          <motion.div
            className="max-w-md mx-auto"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <input
                  type="file"
                  onChange={uploadPdf}
                  accept=".pdf"
                  className="max-w-xs p-2 border rounded-lg"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              <button
                onClick={signout}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-800">My PDFs</h2>

            {selectedPdf ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-700 truncate max-w-2xl">
                    {selectedPdf}
                  </h3>
                  <button
                    onClick={closePdfViewer}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100"
                  >
                    Back to List
                  </button>
                </div>
                <div className="w-screen h-screen border rounded-lg overflow-hidden bg-gray-50">
                  <iframe
                    src={`${pdfUrl}#toolbar=0`}
                    className="min-w-screen min-h-screen"
                    title="PDF Viewer"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {pdfs.map((item) => (
                    <motion.div
                      key={item.id}
                      className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                      variants={fileVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onClick={() => viewPdf(item.name)}
                    >
                      <div className="text-sm truncate text-gray-700">
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        Size: {(item.metadata?.size / 1024).toFixed(2)} KB
                      </div>
                      <div className="text-xs text-blue-600 mt-2">
                        Click to view
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}