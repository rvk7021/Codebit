import React, { useState, useEffect } from 'react';

export default function Contest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchContests() {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/contests`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch contests');
        }

        const data = await response.json();
        console.log("Fetched Contests:", data);  

        // Extracting contests array safely
        setContests(Array.isArray(data.contests) ? data.contests : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContests();
  }, []);

  const platforms = ['Codeforces', 'Codechef'];

  if (loading) return <div>Loading upcoming contests...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Upcoming Contests</h1>
      {platforms.map((platform) => {
        const platformContests = contests.filter(contest => 
          contest.platform && contest.platform.toLowerCase() === platform.toLowerCase()
        );

        return (
          <div key={platform} style={{ marginBottom: '2rem' }}>
            <h2>{platform}</h2>
            {platformContests.length === 0 ? (
              <p>No upcoming contests for {platform}.</p>
            ) : (
              platformContests.map((contest) => (
                <div
                  key={contest._id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '1rem',
                    margin: '1rem 0',
                    borderRadius: '5px'
                  }}
                >
                  <h3>{contest.name}</h3>
                  <p>{contest.description}</p>
                  <p><strong>Start Time:</strong> {contest.startTime}</p>
                  <p>
                    <strong>Duration:</strong> {platform === 'Codeforces' 
                      ?( contest.duration / 60 * 60) + ' hours' 
                      : contest.duration + ' hours'}
                  </p>
                  <p>
                    <a href={contest.link} target="_blank" rel="noopener noreferrer">
                      Visit Contest Page
                    </a>
                  </p>
                </div>
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}
