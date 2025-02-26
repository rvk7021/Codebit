import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';
export default function ProblemSet() {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtering, setFiltering] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDifficulties, setActiveDifficulties] = useState([]);
  const [activeTags, setActiveTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllTags, setShowAllTags] = useState(false);
  const problemsPerPage = 10;
  const searchBarRef = useRef(null);
  const filterTimeoutRef = useRef(null);

  // Expanded list of difficulties and tags
  const difficulties = ['easy', 'medium', 'hard'];
  const tags = [
    'array', 'string', 'dynamic programming', 'graph', 'tree', 
    'hash table', 'binary search', 'breadth-first search', 'depth-first search',
    'two pointers', 'backtracking', 'stack', 'queue', 'linked list', 'recursion',
    'sorting', 'greedy', 'math', 'bit manipulation', 'trie'
  ];

  // Initial visible tags
  const visibleTagsCount = 8;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/problems`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }

        const data = await response.json();
        const problemsData = Array.isArray(data) ? data : data.problems || [];
        setProblems(problemsData);
        setFilteredProblems(problemsData);
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    // Set filtering state to show loader
    setFiltering(true);
    
    // Clear any existing timeout
    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }
    
    // Use timeout for debounce and to show the loader animation
    filterTimeoutRef.current = setTimeout(() => {
      // Filter problems based on search query, difficulty, and tags
      const filtered = problems.filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (problem.description && problem.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesDifficulty = activeDifficulties.length === 0 || 
                                (problem.difficulty && activeDifficulties.includes(problem.difficulty.toLowerCase()));
        
        const matchesTags = activeTags.length === 0 || 
                          (problem.tags && activeTags.every(tag => problem.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())));
        
        return matchesSearch && matchesDifficulty && matchesTags;
      });
      
      setFilteredProblems(filtered);
      setCurrentPage(1); // Reset to first page after filtering
      
      // Remove filtering state after a small delay to show the transition
      setTimeout(() => {
        setFiltering(false);
      }, 300);
    }, 300); // Small delay for debounce
    
    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [searchQuery, activeDifficulties, activeTags, problems]);

  // Handle scroll for fixed search bar
  useEffect(() => {
    const handleScroll = () => {
      const searchBar = searchBarRef.current;
      if (searchBar) {
        if (window.scrollY > 100) {
          searchBar.classList.add('fixed', 'top-0', 'left-0', 'right-0', 'z-10', 'shadow-md');
          searchBar.classList.add('px-4', 'py-3', 'bg-gradient-to-r', 'from-slate-900', 'to-indigo-900');
          document.body.style.paddingTop = `${searchBar.offsetHeight}px`;
        } else {
          searchBar.classList.remove('fixed', 'top-0', 'left-0', 'right-0', 'z-10', 'shadow-md');
          searchBar.classList.remove('px-4', 'py-3', 'bg-gradient-to-r', 'from-slate-900', 'to-indigo-900');
          document.body.style.paddingTop = '0';
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDifficultyClick = (difficulty) => {
    setActiveDifficulties(prev => 
      prev.includes(difficulty) ? prev.filter(d => d !== difficulty) : [...prev, difficulty]
    );
  };

  const handleTagClick = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveDifficulties([]);
    setActiveTags([]);
  };

  const handleProblemClick = (problem) => {
        console.log(problem.title);
        navigate(`/problem-practice/${problem.title}`);
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

  const getDifficultyButtonColor = (difficulty, isActive) => {
    if (isActive) {
      switch(difficulty) {
        case 'easy':
          return 'bg-green-600 text-white';
        case 'medium':
          return 'bg-yellow-600 text-white';
        case 'hard':
          return 'bg-red-600 text-white';
        default:
          return 'bg-slate-600 text-white';
      }
    } else {
      switch(difficulty) {
        case 'easy':
          return 'bg-green-900 text-green-100 hover:bg-green-800';
        case 'medium':
          return 'bg-yellow-900 text-yellow-100 hover:bg-yellow-800';
        case 'hard':
          return 'bg-red-900 text-red-100 hover:bg-red-800';
        default:
          return 'bg-slate-700 text-slate-200 hover:bg-slate-600';
      }
    }
  };

  // Pagination logic
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(indexOfFirstProblem, indexOfLastProblem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Check if any filter is active
  const isFilterActive = searchQuery || activeDifficulties.length > 0 || activeTags.length > 0;

  // Loader Component
  const Loader = () => (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-300 animate-spin animate-pulse" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-l-4 border-r-4 border-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  // Content Loader Skeleton for initial loading
  const ContentLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-800 rounded w-48"></div>
          <div className="h-10 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-800 rounded w-3/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
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
                  <div className="h-4 bg-slate-700 rounded w-14"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Error Component
  const ErrorComponent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="ml-2 text-sm font-medium text-red-200">Error</h3>
          </div>
          <div className="mt-2 text-sm text-red-300">
            Failed to load problems. Please try again later.
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <ContentLoader />;
  }

  if (error) {
    return <ErrorComponent />;
  }

  return (
    <div className="min-h-screen pt-12 sm:pt-[60px] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      {/* Fixed Search Bar */}
     
      <div ref={searchBarRef} className="transition-all pt-5 duration-300 ease-in-out">
        <div className="max-w-6xl mx-auto">
          <div className="relative mx-5">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-indigo-800 rounded-md leading-5 bg-slate-900 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-400 hover:text-indigo-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4">
        <div className="sm:flex sm:space-x-4">
          {/* Filters Section - Side panel on SM and above */}
          <div className="sm:w-1/4 mb-4 sm:mb-0">
            <div className="bg-slate-900 rounded-lg shadow-lg p-4 sticky top-20">
              <h2 className="text-xl font-bold text-indigo-300 mb-4">Filters</h2>
              
              {/* Difficulty Filter Buttons */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-indigo-200 mb-2">Difficulty</h3>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((difficulty) => (
                    <button
                      key={difficulty}
                      onClick={() => handleDifficultyClick(difficulty)}
                      className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                        getDifficultyButtonColor(difficulty, activeDifficulties.includes(difficulty))
                      }`}
                    >
                      {difficulty}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter Buttons */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-indigo-200 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, showAllTags ? tags.length : visibleTagsCount).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        activeTags.includes(tag) 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-indigo-900 text-indigo-200 hover:bg-indigo-800'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {tags.length > visibleTagsCount && (
                  <button
                    onClick={() => setShowAllTags(!showAllTags)}
                    className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 focus:outline-none focus:underline"
                  >
                    {showAllTags ? 'Show less' : 'Show more tags'}
                  </button>
                )}
              </div>

              {/* Clear Filters Button */}
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="sm:w-3/4">
            <div className="bg-slate-900 rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-slate-800">
                <h1 className="text-2xl font-bold text-white">Problems</h1>
                <p className="text-indigo-300 text-sm mt-1">
                  {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''} found
                </p>
              </div>

              {/* Problem Cards as Buttons */}
              <div className={`p-4 transition-opacity duration-300 ${filtering ? 'opacity-50' : 'opacity-100'}`}>
                {filtering ? (
                  <Loader />
                ) : currentProblems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentProblems.map((problem) => (
                      <button
                        key={problem}
                        onClick={() => handleProblemClick(problem)}
                        className="bg-slate-800 border border-slate-700 rounded-lg shadow-sm hover:shadow-md hover:border-indigo-700 transition-all p-4 text-left w-full"
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
                        {problem.tags && problem.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {problem.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-950 text-indigo-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-white">No results found</h3>
                    <p className="mt-1 text-sm text-indigo-300">
                      No problems match your current filters. Try adjusting your search criteria.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-900 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {!filtering && filteredProblems.length > 0 && (
                <div className="px-6 py-4 border-t border-slate-800">
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: Math.ceil(filteredProblems.length / problemsPerPage) }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          currentPage === i + 1 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}