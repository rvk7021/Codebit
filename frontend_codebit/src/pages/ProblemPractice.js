import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Submission from '../components/Submission'
import Problem  from "../components/Problem";
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
  const { title } = useParams(); 
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
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
    if (!token) {
      navigate("/sign-in");
    }
  }, [token, navigate]);

  useEffect(() => {
    async function fetchProblemData() {
      try {
        
   const res = await fetch(`${process.env.REACT_APP_BASE_URL}/problems/search?title=${title}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          });
        
        const data = await res.json();
          console.log(data.problem[0].examples[0]);
         
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

   try {
    const test=testCases.slice(0,2); 
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, title, test }),
    });

    const data = await res.json();
    console.log(data);
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

    try {
      
    
      
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, title, token,testCases }),
      });
      
  
  
      const data = await res.json();
      console.log(data);
      
      if (!data.success) {
        setError(data.message || "Execution failed");
      } else {
        setResults(data.results);
        window.alert(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoadingSubmission(false);
  };

  return (
  
      <div className="min-h-screen flex flex-wrap"> 
        {/* Left Side: Problem Details */}
        <div className="flex flex-col w-2/5 border-r border-gray-300">
          <div className="p-4 flex gap-4 border-b bg-gray-100">
            <button
              onClick={() => setShowSubmission(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
            >
              Description
            </button>
            <button
              onClick={() => setShowSubmission(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
            >
              Submission
            </button>
          </div>
    
          <div className="p-6 bg-gray-50 flex-1 h-[500px] overflow-auto shadow-md rounded-lg">
            {problem ? (
              showSubmission ? <Submission title={problem.title}  setCode={setCode} /> : <Problem problem={problem} />
            ) : (
              <p className="text-gray-500">Loading problem details...</p>
            )}
          </div>
        </div>
    
        {/* Right Side: Code Editor & Test Cases */}
{/* Right Side: Code Editor & Test Cases */}
<div className="w-3/5 flex flex-col p-6">
  {/* Code Editor */}
  <div className="flex-1 border border-gray-300 rounded-lg p-4 bg-white shadow-md">
    <h2 className="text-lg font-bold text-gray-700 mb-2">Code Editor</h2>
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="Write your solution here..."
      className="mt-2 w-full h-96 p-4 border border-gray-300 rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>

  {/* Test Cases & Results */}
  <div className="mt-4 border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-md h-[350px] overflow-auto">
    <button
      onClick={() => setTestResult(!testResult)}
      className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
    >
      {testResult ? "Show Test Cases" : "Show Test Results"}
    </button>

    {testResult ? (
      results.length > 0 ? (
        results.map((test, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-semibold">Case {index + 1}</h3>
            <pre className="bg-gray-200 p-3 rounded-md">Input: {test.input}</pre>
            <pre className="bg-gray-200 p-3 rounded-md">Output: {test.actualOutput}</pre>
            <pre className="bg-gray-200 p-3 rounded-md">Expected: {test.expectedOutput}</pre>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Please run the code ...</p>
      )
    ) : (
      testCases.length > 0 ? (
        testCases.map((test, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg bg-white shadow-md">
            <h3 className="font-semibold">Case {index + 1}</h3>
            <pre className="bg-gray-200 p-3 rounded-md">Input: {test.Input}</pre>
            <pre className="bg-gray-200 p-3 rounded-md">Expected Output: {test.ExpectedOutputs}</pre>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Fetching test cases...</p>
      )
    )}
  </div>

  {/* Buttons */}
  <div className="flex gap-4 p-4">
    <button
      onClick={handleRunCode}
      disabled={loading}
      className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 transition"
    >
      {loading ? "Running..." : "Run Code"}
    </button>
    <button
      onClick={handleSubmit}
      disabled={loadingSubmission}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition"
    >
      {loadingSubmission ? "Submitting..." : "Submit Code"}
    </button>
  </div>
</div>

      </div>
    );
    

}
