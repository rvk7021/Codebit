import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function Submission({ title, setCode }) {
  const { token } = useSelector((state) => state.auth);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/submissions?title=${title}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch submissions");
        }

        const data = await response.json();
        console.log(data);

        setSubmissions(data.submissions);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      }
    };

    if (token) {
      fetchSubmissions();
    }
  }, [token, title]);

  return (
    <div className="h-[500px] overflow-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Submissions</h2>
      {submissions.length === 0 ? (
        <p className="text-gray-500">No submissions found.</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="p-4 border rounded-lg shadow-md bg-white"
            >
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    submission.status === "Accepted"
                      ? "text-green-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  {submission.status}
                </span>
              </p>
              <p>
                <strong>Submitted At:</strong>{" "}
                {new Date(submission.submittedAt).toLocaleString()}
              </p>

              <button
                onClick={() => setCode(submission.code)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:scale-105 transition transform"
              >
                Load Code
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
