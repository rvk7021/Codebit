import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProblemPractice() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [testCases, setTestCases] = useState([]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [problem, setProblem] = useState(null);
  
  const { title } = useParams(); 
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

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
        console.log(data);
         console.log(data.problem[0].examples[0]);
         
        setProblem(data.problem[0]);
        setTestCases(data.testcases[0].TestCases || []);
        console.log(testCases);
        

      } catch (err) {
        console.error("Error fetching problem data:", err);
      }
    }
    if (title) {
      fetchProblemData();
    }
  }, [title]);

 
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/execute-problem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code, language, title }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Execution failed");
      } else {
        setResults(data.testResults);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex">
      {/* Left Side: Problem Details */}
      <div className="w-1/3 p-6 border-r border-gray-300 overflow-auto bg-gray-50">
        {problem ? (
          <>
            <h2 className="text-2xl font-bold text-blue-700">{problem.title}</h2>
            <p className="mt-2 text-gray-700">{problem.description}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Input Format:</h3>
              <p className="text-gray-700">{problem.inputFormat}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Output Format:</h3>
              <p className="text-gray-700">{problem.outputFormat}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Constraints:</h3>
              <p className="text-gray-700">{problem.constraints}</p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-600">Examples:</h3>
          
              { problem.examples&& problem.examples.map((example, index) => (
                <div key={index} className="p-3 border rounded-lg bg-white shadow-md my-2">
                  <p>
                  
                    <strong>Input:</strong> <span className="bg-white p-1 rounded">{example.input}</span>
                  </p>
                  <p>
                    <strong>Output:</strong> <span className="bg-white p-1 rounded">{example.output}</span>
                  </p>
                  <p>
                    <strong>Explanation:</strong> <span className="bg-white p-1 rounded">{example.explanation}</span>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Loading problem details...</p>
        )}
      </div>

      {/* Right Side: Code Editor & Test Cases */}
      <div className="w-2/3 flex flex-col">
        <div className="flex-1 p-4 border-b border-gray-300">
          <h2 className="text-lg font-bold text-gray-700">Code Editor</h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your solution here..."
            className="mt-2 w-full h-60 p-4 border border-gray-300 rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="h-1/2 p-4">
          <h2 className="text-lg font-bold text-gray-700">Test Cases</h2>
          <div className="mt-2 border border-gray-300 rounded-lg p-4 bg-gray-50 overflow-auto h-full">
            {testCases.length > 0 ? (
              testCases.map((test, index) => (
                <div key={index} className="mb-4 p-3 border rounded-lg bg-white shadow-md">
                  <h3 className="font-semibold">Case {index + 1}</h3>
                  <pre className="bg-white-200 p-2 rounded-md">{test.Input}</pre>
                  <pre className="bg-white-200 p-2 rounded-md">{test.ExpectedOutputs}</pre>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Fetching test cases...</p>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="python">Python</option>
              <option value="c++">C++</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
            >
              {loading ? "Running..." : "Run Code"}
            </button>
          </div>

          {error && <p className="mt-2 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
}
