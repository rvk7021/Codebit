/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CodeRunner() {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load code from sessionStorage when the component mounts
  useEffect(() => {
    const savedCode = sessionStorage.getItem('code');
    if (savedCode) {
      setCode(savedCode);
    }
  }, []);

  // Save code to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('code', code);
  }, [code]);

  // Handles code execution by sending data to the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput('');
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, input, language }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message || 'Execution failed');
        setLoading(false);
        return;
      }
      setOutput(data.output);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Mode Selection Buttons */}
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-700">Code Editor</h2>
      </div>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Left side - Code Editor */}
        <div className="w-full lg:w-2/3 p-4 border-r border-gray-200">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your code here..."
            className="mt-2 w-full h-full p-4 border border-gray-300 rounded-lg font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Right side - Input and Output */}
        <div className="w-full lg:w-1/3 p-4 flex flex-col">
          {/* Top section for Input and Controls */}
          <div className="flex-1 mb-4">
            <h2 className="text-lg font-bold text-gray-700">Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your input here..."
              className="mt-2 w-full p-4 h-32 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <div className="mt-2 flex items-center space-x-4">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="python">Python</option>
                <option value="c++">C++</option>
              </select>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
              >
                {loading ? 'Running...' : 'Run Code'}
              </button>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </div>

          {/* Bottom section for Output */}
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-700">Output</h2>
            <div className="mt-2 p-4 h-full border border-gray-300 rounded-lg bg-gray-50 font-mono whitespace-pre-wrap overflow-auto">
              {output}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
