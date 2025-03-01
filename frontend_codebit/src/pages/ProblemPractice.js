import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Submission from '../components/Submission';
import Problem from "../components/Problem";

export default function ProblemPractice() {
  const [code, setCode] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [problem, setProblem] = useState(null);
  const [testResult, setTestResult] = useState(false);
  const [showSubmission, setShowSubmission] = useState(false);
  const [showAcceptedAnimation, setShowAcceptedAnimation] = useState(false);
  const { title } = useParams(); 
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.profile);

  useEffect(() => {
    const savedCode = sessionStorage.getItem('code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('code', code);
    setResults([]);
  }, [code]);

  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
    
  }, [user, navigate]);

  useEffect(() => {
    async function fetchProblemData() {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/problems/searchbyn?title=${title}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        const data = await res.json();
        console.log(data);
        
        setProblem(data.problem[0]);
        setTestCases(data.testcases[0].TestCases || []);
      } catch (err) {
        console.error("Error fetching problem data:", err);
      }
    }
    if (title) {
      fetchProblemData();
    }
  }, [title]);

  const handleRunCode = async() => {
    setLoading(true);
    setError(null);
    setResults([]);
    setTestResult(true); // Automatically show test results when running code

    try {
      const test = testCases.slice(0,2); 
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ code, title, test }),
      });

      const data = await res.json();
      
      if (!data.success) {
        setError(data.message || "Execution failed");
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  const handleSubmit = async () => {
    setLoadingSubmission(true);
    setError(null);
    setResults([]);
    setTestResult(true); // Automatically show test results when submitting code

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({ code, title, testCases,problem }),
      });
      
      const data = await res.json();
      
      if (!data.success) {
        setError(data.message || "Execution failed");
      } else {
        setResults(data.results);
        
        // Check if all test cases passed
        const allPassed = data.results.every(
          result => result.actualOutput === result.expectedOutput
        );
        
        if (allPassed) {
          setShowAcceptedAnimation(true);
          
          // After animation, show submission tab
          setTimeout(() => {
            setShowAcceptedAnimation(false);
            setShowSubmission(true);
          }, 2500);
        }
        
        window.alert(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoadingSubmission(false);
  };

  // Animated loader component
  const Loader = () => (
    <div className="flex justify-center items-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-indigo-300 border-t-indigo-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-indigo-400 border-t-indigo-600 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );

  // Accepted animation component
  const AcceptedAnimation = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/90 z-50">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-green-400 animate-pulse">Accepted!</h2>
        <p className="text-indigo-300 mt-2">All test cases passed successfully</p>
      </div>
    </div>
  );

  // Get the appropriate "no results" message based on state
  const getNoResultsMessage = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-950/50 rounded-lg border border-indigo-800/30 p-6">
          <Loader />
          <p className="mt-4 text-indigo-300 font-medium">Running your code...</p>
          <p className="text-gray-400 mt-2">Executing test cases and analyzing results</p>
        </div>
      );
    } else if (loadingSubmission) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-950/50 rounded-lg border border-indigo-800/30 p-6">
          <Loader />
          <p className="mt-4 text-indigo-300 font-medium">Submitting your code...</p>
          <p className="text-gray-400 mt-2">Testing against all case scenarios</p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-950/50 rounded-lg border border-indigo-800/30 p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          <p className="text-indigo-400 font-medium mb-2">No results yet</p>
          <p className="text-gray-400 text-center">Run your code to see the results of your solution</p>
          <button 
            onClick={handleRunCode}
            className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-medium shadow transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Run Code
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen pt-12 sm:pt-20 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-gray-100">
      {showAcceptedAnimation && <AcceptedAnimation />}
      
      <div className="container mx-auto py-6 px-4 flex flex-col lg:flex-row gap-6"> 
        {/* Left Side: Problem Details */}
        <div className="lg:w-2/5 w-full flex flex-col rounded-xl overflow-hidden border border-indigo-800/30 bg-slate-900">
          <div className="p-4 flex gap-4 border-b border-indigo-800/50 bg-slate-900">
            <button
              onClick={() => setShowSubmission(false)}
              className={`px-4 py-2 rounded-lg font-bold transition transform ${
                !showSubmission 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40" 
                  : "bg-slate-800 text-indigo-300 hover:bg-indigo-900"
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setShowSubmission(true)}
              className={`px-4 py-2 rounded-lg font-bold transition transform ${
                showSubmission 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/40" 
                  : "bg-slate-800 text-indigo-300 hover:bg-indigo-900"
              }`}
            >
              Submission
            </button>
          </div>
    
          <div className="p-6 flex-1 h-[500px] overflow-auto">
            {problem ? (
              showSubmission ? <Submission title={problem.title} setCode={setCode}  problem={problem} /> : <Problem problem={problem} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader />
                <p className="mt-4 text-indigo-300">Loading problem details...</p>
              </div>
            )}
          </div>
        </div>
    
        {/* Right Side: Code Editor & Test Cases */}
        <div className="lg:w-3/5 w-full flex flex-col">
          {/* Action Buttons - New Location */}
          <div className="mb-4 flex justify-between items-center bg-slate-900 rounded-xl border border-indigo-800/30 p-4">
            <div className="flex items-center">
              <h2 className="text-lg font-bold text-indigo-300 mr-4">Code Editor</h2>
              <div className="h-8 w-px bg-indigo-800/30 mx-2"></div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleRunCode}
                disabled={loading}
                className="group relative px-5 py-2.5 bg-gradient-to-b from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-md font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-70 shadow-md disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Running</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span>Run</span>
                  </>
                )}
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loadingSubmission}
                className="group relative px-5 py-2.5 bg-gradient-to-b from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-md font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-70 shadow-md disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 w-full h-full rounded-md bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                {loadingSubmission ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Submit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 rounded-xl p-4 border border-indigo-800/30 bg-slate-900 mb-6">
            <div className="relative rounded-lg overflow-hidden border border-indigo-800/50">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Write your solution here..."
                className="w-full h-96 p-4 font-mono resize-none bg-slate-950 text-indigo-100 focus:outline-none"
                style={{ 
                  lineHeight: "1.6", 
                  caretColor: "#818cf8",
                }}
              ></textarea>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"></div>
            </div>
          </div>

          {/* Test Cases & Results */}
          <div className="rounded-xl p-4 border border-indigo-800/30 bg-slate-900 h-[350px] overflow-auto mb-4">
            <button
              onClick={() => setTestResult(!testResult)}
              className="mb-4 px-4 py-2 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-bold shadow-md shadow-indigo-700/30 transition"
            >
              {testResult ? "Show Test Cases" : "Show Test Results"}
            </button>

            {error && (
              <div className="mb-4 p-3 border border-red-500 rounded-lg bg-red-900/30 text-red-300">
                {error}
              </div>
            )}

            {testResult ? (
              results.length > 0 ? (
                <div>
                  <div className="mb-4">
                    {/* Overall verdict */}
                    {results.every(test => test.actualOutput === test.expectedOutput) ? (
                      <div className="p-3 rounded-lg bg-green-900/30 border border-green-500 text-green-300 text-center font-bold">
                        All Test Cases Passed! ✓
                      </div>
                    ) : (
                      <div className="p-3 rounded-lg bg-red-900/30 border border-red-500 text-red-300 text-center font-bold">
                        Some Test Cases Failed ✗
                      </div>
                    )}
                  </div>
                  
                  {/* Individual test cases */}
                  {results.map((test, index) => {
                    const passed = test.actualOutput === test.expectedOutput;
                    
                    return (
                      <div key={index} className={`mb-4 p-4 border ${passed ? 'border-green-800/50' : 'border-red-800/50'} rounded-lg bg-slate-900 shadow-md`}>
                        <h3 className={`font-semibold ${passed ? 'text-green-300' : 'text-red-300'} mb-2 flex items-center`}>
                          <span>Test Case {index + 1}</span>
                          <span className={`ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full ${passed ? 'bg-green-900/60' : 'bg-red-900/60'}`}>
                            {passed ? '✓' : '✗'}
                          </span>
                        </h3>
                        <div className="space-y-2">
                          <div className="bg-slate-950 p-3 rounded-md">
                            <span className="text-indigo-400 font-semibold">Input:</span>
                            <pre className="text-gray-300 mt-1 overflow-x-auto">{test.input}</pre>
                          </div>
                          <div className={`bg-slate-950 p-3 rounded-md ${passed ? '' : 'border-l-4 border-red-500'}`}>
                            <span className="text-indigo-400 font-semibold">Your Output:</span>
                            <pre className="text-gray-300 mt-1 overflow-x-auto">{test.actualOutput}</pre>
                          </div>
                          <div className="bg-slate-950 p-3 rounded-md">
                            <span className="text-indigo-400 font-semibold">Expected:</span>
                            <pre className="text-gray-300 mt-1 overflow-x-auto">{test.expectedOutput}</pre>
                          </div>
                          <div className={`text-center py-1 rounded-md font-medium ${passed ? 'bg-green-900/40 text-green-300' : 'bg-red-900/40 text-red-300'}`}>
                            {passed ? 'PASSED ✓' : 'FAILED ✗'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Improved no results state with context-aware messages
                getNoResultsMessage()
              )
            ) : (
              testCases.length > 0 ? (
                testCases.map((test, index) => (
                  <div key={index} className="mb-4 p-4 border border-indigo-800/50 rounded-lg bg-slate-900 shadow-md">
                    <h3 className="font-semibold text-indigo-300 mb-2">Test Case {index + 1}</h3>
                    <div className="space-y-2">
                      <div className="bg-slate-950 p-3 rounded-md">
                        <span className="text-indigo-400 font-semibold">Input:</span>
                        <pre className="text-gray-300 mt-1 overflow-x-auto">{test.Input}</pre>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-md">
                        <span className="text-indigo-400 font-semibold">Expected Output:</span>
                        <pre className="text-gray-300 mt-1 overflow-x-auto">{test.ExpectedOutputs}</pre>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader />
                  <p className="mt-4 text-indigo-300">Fetching test cases...</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}