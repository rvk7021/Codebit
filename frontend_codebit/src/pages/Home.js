// import React from 'react';

// export default function Home() {
//     return (
//         <div>
//         This is my Home Page
          
          
//         </div>
//     );
// }
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [problems, setProblems] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Check auth status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Check if user is logged in (e.g., token in localStorage)
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };

    checkAuthStatus();
  }, []);

  // Fetch problems and posts
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch problems
        const problemsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/problems`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!problemsResponse.ok) {
          throw new Error('Failed to fetch problems');
        }

        const problemsData = await problemsResponse.json();
        const problemsList = Array.isArray(problemsData) ? problemsData : problemsData.problems || [];
        setProblems(problemsList.slice(0, 6)); // Show only the first 6 problems

        // Fetch posts
        const postsResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/posts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await postsResponse.json();
        const postsList = Array.isArray(postsData) ? postsData : postsData.posts || [];
        setPosts(postsList.slice(0, 4)); // Show only the first 4 posts
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleProblemClick = (problem) => {
    if (isLoggedIn) {
      navigate(`/problem-practice/${problem.title}`);
    } else {
      navigate('/login', { state: { redirectTo: `/problem-practice/${problem.title}` } });
    }
  };

  const handlePostClick = (post) => {
    navigate(`/post/${post._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return 'bg-slate-700 text-slate-200';
    
    switch(difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-800 text-green-100';
      case 'medium':
        return 'bg-yellow-700 text-yellow-100';
      case 'hard':
        return 'bg-red-800 text-red-100';
      default:
        return 'bg-slate-700 text-slate-200';
    }
  };

  // Content Loader Skeleton for initial loading
  const ContentLoader = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-slate-800 rounded w-48 mx-auto sm:mx-0"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-lg">
            <div className="flex justify-between">
              <div className="h-5 bg-slate-700 rounded w-1/2"></div>
              <div className="h-5 bg-slate-700 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-700 rounded w-full mt-3"></div>
            <div className="h-4 bg-slate-700 rounded w-3/4 mt-2"></div>
            <div className="flex gap-1 mt-3">
              <div className="h-4 bg-slate-700 rounded w-12"></div>
              <div className="h-4 bg-slate-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="h-8 bg-slate-800 rounded w-48 mx-auto sm:mx-0 mt-12"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-800 p-4 rounded-lg">
            <div className="h-5 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full mt-3"></div>
            <div className="h-4 bg-slate-700 rounded w-full mt-2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mt-2"></div>
            <div className="flex justify-between mt-4">
              <div className="h-4 bg-slate-700 rounded w-20"></div>
              <div className="h-4 bg-slate-700 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div className="bg-red-900 border border-red-700 rounded-lg p-4 my-8">
      <div className="flex items-center">
        <svg className="w-5 h-5 text-red-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 className="ml-2 text-sm font-medium text-red-200">Error</h3>
      </div>
      <div className="mt-2 text-sm text-red-300">
        {error || 'Failed to load content. Please try again later.'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-indigo-900 to-purple-900 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            Ace Your Coding Skills
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-lg text-indigo-200 sm:text-xl">
            Practice problems, learn from the community, and master coding Contests.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => navigate('/sign-in')}
                  className="bg-white text-indigo-900 px-6 py-3 rounded-md font-medium shadow-lg hover:bg-indigo-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/sign-up')}
                  className="bg-indigo-700 text-white px-6 py-3 rounded-md font-medium shadow-lg hover:bg-indigo-600 transition-colors"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/problem-set')}
                  className="bg-indigo-700 text-white px-6 py-3 rounded-md font-medium shadow-lg hover:bg-indigo-600 transition-colors"
                >
                  Browse All Problems
                </button>
                <button
                  onClick={() => navigate('/all-posts')}
                  className="bg-purple-700 text-white px-6 py-3 rounded-md font-medium shadow-lg hover:bg-purple-600 transition-colors"
                >
                  View All Posts
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <ContentLoader />
        ) : error ? (
          <ErrorComponent />
        ) : (
          <div className="space-y-16">
            {/* Featured Problems Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Featured Problems</h2>
                <button 
                  onClick={() => navigate('/problem-set')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  View all →
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {problems.map((problem) => (
                  <button
                    key={problem._id}
                    onClick={() => handleProblemClick(problem)}
                    className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-700 transition-all p-4 text-left"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-white">{problem.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty || 'Unknown'}
                      </span>
                    </div>
                    {problem.description && (
                      <p className="mt-2 text-sm text-slate-300 line-clamp-2">{problem.description}</p>
                    )}
                    <div className="mt-3 flex flex-wrap gap-1">
                      {problem.tags && problem.tags.length > 0 && 
                        problem.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950 text-indigo-300"
                          >
                            {tag}
                          </span>
                        ))
                      }
                      {problem.tags && problem.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950 text-indigo-300">
                          +{problem.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {!isLoggedIn && (
                <div className="mt-8 p-6 bg-indigo-900 bg-opacity-50 rounded-lg text-center">
                  <p className="text-indigo-200 mb-4">Sign in to access all problems and track your progress</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-indigo-700 text-white px-4 py-2 rounded-md font-medium shadow-md hover:bg-indigo-600 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </section>

            {/* Community Posts Section */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Community Posts</h2>
                <button 
                  onClick={() => navigate('/all-posts')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                  View all →
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <div 
                    key={post._id} 
                    className="bg-slate-800 border border-slate-700 rounded-lg p-5 hover:border-purple-700 transition-colors cursor-pointer"
                    onClick={() => handlePostClick(post)}
                  >
                    <h3 className="text-xl font-medium text-white mb-2">{post.title}</h3>
                    <p className="text-slate-300 line-clamp-3">{post.content}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-indigo-700 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {post.author?.name?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-indigo-300">{post.author?.name || 'Anonymous'}</span>
                      </div>
                      <span className="text-sm text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {!isLoggedIn && (
                <div className="mt-8 p-6 bg-purple-900 bg-opacity-50 rounded-lg text-center">
                  <p className="text-purple-200 mb-4">Sign in to interact with the community and create posts</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="bg-purple-700 text-white px-4 py-2 rounded-md font-medium shadow-md hover:bg-purple-600 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </section>
            
            {/* Features Overview Section */}
            <section className="py-8">
              <h2 className="text-2xl font-bold text-white text-center mb-10">Why Join Our Platform?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800 p-6 rounded-lg text-center">
                  <div className="bg-indigo-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Curated Problem Sets</h3>
                  <p className="text-slate-300">Practice with hundreds of carefully selected coding problems across various difficulty levels.</p>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-lg text-center">
                  <div className="bg-purple-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Active Community</h3>
                  <p className="text-slate-300">Learn from peers, share your solutions, and grow together with our supportive community.</p>
                </div>
                
                <div className="bg-slate-800 p-6 rounded-lg text-center">
                  <div className="bg-indigo-900 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                    <svg className="h-8 w-8 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Track Your Progress</h3>
                  <p className="text-slate-300">Monitor your improvement with detailed statistics and progress tracking tools.</p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="bg-slate-900 py-10 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold text-white">CodePrep</h2>
              <p className="text-slate-400 mt-2">Your platform for coding interview preparation</p>
            </div>
            <div className="flex space-x-8">
              <a href="#" className="text-slate-300 hover:text-white">About</a>
              <a href="#" className="text-slate-300 hover:text-white">Contact</a>
              <a href="#" className="text-slate-300 hover:text-white">Privacy</a>
              <a href="#" className="text-slate-300 hover:text-white">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
            <p>&copy; {new Date().getFullYear()} CodePrep. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}