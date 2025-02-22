// useEffect(() => {
//     async function fetchProblems() {
//       try {
//         const res = await fetch(`${process.env.REACT_APP_BASE_URL}/searchProblem?title=${search}`, {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
        
//         console.log("Response", res);
        
//         const data = await res.json();
//         console.log(data);
        
//         setProblems(data.problems || []); 
//       } catch (err) {
//         console.error('Error fetching problems:', err);
//       }
//     }
//     if (search.length> 1) {
//       console.log(search);
      
      
//       fetchProblems();
//     } else {
//       setProblems([]);
//     }
//   }, [search]);
//   return (
//     <div className="h-screen flex">
//       <div className="w-1/3 p-6 border-r border-gray-300 overflow-auto">
//         {
//           token==null?navigate("/sign-in"):""
//         }
        
//         <h2 className="text-xl font-bold">Search Problem</h2>
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search problem..."
//           className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />

//         );