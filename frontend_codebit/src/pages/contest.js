import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
// import Navbar from '../components/Navbar';
export default function Contest() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );
  
  const mainControls = useAnimation();
  const leftControls = useAnimation();
  const rightControls = useAnimation();
  
  const { ref: mainRef, inView: mainInView } = useInView({ threshold: 0.2 });
  const { ref: leftRef, inView: leftInView } = useInView({ threshold: 0.2 });
  const { ref: rightRef, inView: rightInView } = useInView({ threshold: 0.2 });
  
  // Track window width for responsive behavior
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Check if we're at sm breakpoint (Tailwind default is <640px)
  const isSmBreakpoint = windowWidth < 640;
  
  useEffect(() => {
    if (mainInView) {
      mainControls.start('visible');
    }
  }, [mainControls, mainInView]);
  
  useEffect(() => {
    if (leftInView) {
      leftControls.start('visible');
    }
  }, [leftControls, leftInView]);
  
  useEffect(() => {
    if (rightInView) {
      rightControls.start('visible');
    }
  }, [rightControls, rightInView]);

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

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <div className="flex flex-col items-center">
        <motion.div
          className="md:text-3xl font-medium text-indigo-300 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Loading upcoming contests
        </motion.div>
        <motion.div 
          className="flex space-x-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          {[0, 1, 2].map((dot) => (
            <motion.div
              key={dot}
              className="h-4 w-4 bg-indigo-500 rounded-full"
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "loop",
                delay: dot * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
  
  if (error) return (
    <motion.div 
      className="bg-slate-900 border h-screen border-red-500 rounded-md p-4 my-4 max-w-2xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <svg className="w-6 h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-red-300">Error: {error}</div>
      </div>
    </motion.div>
  );

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="mx-auto mt-[50px] h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 px-4 py-8">
      <motion.h1 
        ref={mainRef}
        initial="hidden"
        animate={mainControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-8 text-white font-mono"
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
          Upcoming Contests
        </span>
      </motion.h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform, index) => {
          const platformContests = contests.filter(contest =>
            contest.platform && contest.platform.toLowerCase() === platform.toLowerCase()
          );
          
          // First platform slides from left, second from right
          const slideDirection = index === 0 ? -100 : 100;
          const controlsToUse = index === 0 ? leftControls : rightControls;
          const refToUse = index === 0 ? leftRef : rightRef;

          return (
            <motion.div 
              key={platform} 
              ref={refToUse}
              initial="hidden"
              animate={controlsToUse}
              variants={{
                hidden: { opacity: 0, x: slideDirection },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ 
                duration: 0.8, 
                ease: [0.2, 0.65, 0.3, 0.9], // Custom ease curve for smoother animation
                delay: 0.2
              }}
              className="rounded-lg overflow-hidden"
            >
              <div className="text-center py-3 px-4">
                <h2 className="text-2xl md:text-3xl border-b-2 border-indigo-400 pb-3 font-bold text-white">{platform}</h2>
              </div>
              
              <div className="p-4">
                {platformContests.length === 0 ? (
                  <p className="text-gray-300 text-center py-4">No upcoming contests for {platform}.</p>
                ) : (
                  <div className="space-y-4">
                    {platformContests.map((contest, idx) => (
                      <motion.div
                        key={contest._id}
                        initial={{ opacity: 0, x: slideDirection / 2 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.1 * idx,
                          ease: [0.2, 0.65, 0.3, 0.9] // Custom ease curve for smoother animation
                        }}
                        className={`rounded-lg p-4 duration-100 shadow-lg
                          ${isSmBreakpoint ? 
                            'sm:hover:bg-slate-700 bg-purple-900/30 sm:hover:border-purple-500 sm:hover:shadow-purple-900/40' : 
                            'hover:bg-slate-700 bg-indigo-900/30 hover:border-indigo-500'}`}
                        whileHover={{ 
                          scale: isSmBreakpoint ? 1.03 : 1.02,
                          y: isSmBreakpoint ? -5 : 0
                        }}
                      >
                        <h3 className={`text-lg font-medium mb-2 ${isSmBreakpoint ? 'sm:group-hover:text-purple-300 text-white' : 'text-white'}`}>{contest.name}</h3>
                        <p className="text-gray-300 text-sm mb-3">{contest.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 rounded bg-slate-900/80">
                            <p className="text-xs text-indigo-300 font-medium">START TIME</p>
                            <p className="xs:text-sm font-medium text-gray-200">{formatDate(contest.startTime)}</p>
                          </div>
                          <div className="p-2 rounded bg-slate-900/80">
                            <p className="text-xs text-indigo-300 font-medium">DURATION</p>
                            <p className="text-sm font-medium text-gray-200">
                              {platform === 'Codeforces'
                                ? (contest.duration / 60 * 60) + ' hours'
                                : contest.duration + ' hours'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex justify-center">
                          <motion.a 
                            href={contest.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-medium py-2 px-6 rounded-full transition-all duration-300 text-sm shadow-md bg-blue-400"
                            whileHover={{ scale: isSmBreakpoint ? 1.08 : 1.05, backgroundColor: "#4338ca" }}
                            whileTap={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                          >
                            Visit Contest Page
                          </motion.a>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}