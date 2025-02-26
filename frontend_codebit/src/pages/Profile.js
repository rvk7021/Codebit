import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";
import { MdOutlineLocationOn } from "react-icons/md";
import { GiGraduateCap } from "react-icons/gi";
import { SiLeetcode, SiCodeforces, SiCodechef } from "react-icons/si";
import { useState } from "react";

export default function Profile() {
  const data = [
    { topic: "Dynamic Programming", problemsSolved: 152, totalsolved: 500 },
    { topic: "Segment Tree", problemsSolved: 100, totalsolved: 500 },
    { topic: "Web Development", problemsSolved: 50, totalsolved: 500 },
    { topic: "Graph Theory", problemsSolved: 198, totalsolved: 500 },
    { topic: "Graph Theory", problemsSolved: 200, totalsolved: 500 },
    { topic: "Graph Theory", problemsSolved: 200, totalsolved: 500 },
    { topic: "Graph Theory", problemsSolved: 200, totalsolved: 500 },
    { topic: "Graph Theory", problemsSolved: 200, totalsolved: 500 },
  ];

  const temp = [
    {
      userName: "john_doe",
      firstName: "Ranvijay",
      lastName: "Kumar",
      About: "Hey this is RVK, SDE at Codebit currently working on a project.",
      GitHub: "www.github.com/rvk7021",
      college: "MIT",
      email: "john.doe@example.com",
      password: "hashed_password",
      role: "student",
      bio: "Passionate about coding and problem-solving.",
      token: "random_token_123",
      resetPasswordExpires: new Date("2025-03-01T00:00:00Z"),
      profilePic: "https://example.com/profile_pic.jpg",
      topics: ["Dynamic Programming", "Segment Tree", "Web Development"],
      problemsSolved: 150,
      activeDays: 90,
      submissions: 300,
      problemsCategory: [
        { category: "Easy", problemsSolved: 50 },
        { category: "Medium", problemsSolved: 75 },
        { category: "Hard", problemsSolved: 25 },
      ],
      solvedProblems: ["problem_id_1", "problem_id_2"],
      codingProfile: [
        { profileName: "JohnDoe123", platform: "LeetCode" },
        { profileName: "JD_Coder", platform: "CodeChef" },
        { profileName: "John007", platform: "HackerRank" },
      ],
      location: "India",
      ratings: [
        { platform: "CodeChef", rating: 1900 },
        { platform: "Codeforces", rating: 1700 },
        { platform: "LeetCode", rating: 2000 },
      ],
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 5);
// bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900
  return (

    <div className="profile  bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 pt-16 sm:pt-20 lg:px-10 lg:pt-20 p-2">
      <div className="profile-box grid  lg:grid-cols-[30%,70%]  md:gap-2 md:p-2 lg:gap-4">
        {/* Information section */}
        <div className="profile-section-parent p-1 items-center">
          <div className="profile-section flex flex-col  bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-lg items-center shadow-xl shadow-indigo-500/20 p-3">
            <img
              src={temp[0].profilePic}
              alt="profile"
              className="h-[150px] w-[150px] mt-2 rounded-full bg-black border-4 border-indigo-200/20"
            />
            <h1 className="text-2xl font-bold text-white mt-4">
              {temp[0].firstName + " " + temp[0].lastName}
            </h1>
            <h4 className="text-indigo-200 font-medium">
              @{temp[0].userName}
            </h4>
            <button className="mt-3 bg-gradient-to-r w-[300px] xs:w-[400px] md:w-[340px] sm:w-[400px] justify-center from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xl font-semibold px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 shadow-lg group">
              <FaGithub className="text-xl group-hover:rotate-12 transition-transform duration-300" />
              <span>GitHub</span>
            </button>
            <p className="text-gray-200 text-center mt-4 font-mono">{temp[0].About}</p>

            <div className="flex gap-6 mt-2 p-2 w-full justify-center border-b-2 border-t-2 border-gray-900">
              {[
                { icon: <FaLinkedin />, color: "text-blue-300 hover:text-blue-400" },
                { icon: <FaXTwitter />, color: "text-gray-300 hover:text-white" },
                { icon: <FaInstagram />, color: "text-pink-300 hover:text-pink-400" },
                { icon: <CiMail />, color: "text-indigo-200 hover:text-indigo-400" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="https://leetcode.com/u/phoenix_rvk/"
                  className={`text-2xl ${social.color} transition-all duration-300 transform hover:scale-110`}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="location flex items-center gap-2 mt-2 bg-indigo-950/50 p-2 w-full rounded-lg">
              <MdOutlineLocationOn className="text-xl text-indigo-300" />
              <span className="mt-1 font-bold text-gray-300">
                {temp[0].location}
              </span>
            </div>

            <div className="college-name flex items-center justify-start gap-2 p-2 w-full bg-indigo-950/50 mt-2 rounded-lg">
              <GiGraduateCap className="text-xl text-indigo-300" />
              <span className="mt-1 text-base font-bold text-gray-300">
                {temp[0].college}
              </span>
            </div>

            <div className="coding-profile-section grid grid-cols-2 pc:grid-cols-3 lg:grid-cols-2  xs:grid-cols-3 mt-2 md:p-3  p-1 w-full">
              <h1 className="text-[24px] col-span-2 pc:col-span-3 xs:col-span-3 lg:col-span-2 mb-2 text-center font-bold text-white bg-indigo-600/20 rounded-lg py-2 font-mono">
                Techies' Arena
              </h1>
              {[
                { icon: <SiLeetcode />, name: "LeetCode", color: "text-green-300" },
                { icon: <SiCodechef />, name: "Codechef", color: "text-orange-300" },
                { icon: <SiCodeforces />, name: "Codeforces", color: "text-red-300" }
              ].map((platform, index) => (
                <p key={index} className=" m-2 shadow-sm shadow-purple-400  bg-indigo-950/50 p-2 rounded-lg hover:bg-indigo-900/50 hover:scale-105 transition-all duration-300">
                  <a
                    href={`https://www.codechef.com/users/${temp[0].codingProfile[1].profileName}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 no-underline"
                  >
                    <span className={`text-xl ${platform.color}`}>{platform.icon}</span>
                    <span className="font-mono  text-gray-300 font-semibold">{platform.name}</span>
                  </a>
                </p>
              ))}
            </div>

            <div className="w-full mt-0 gap-1 p-1 grid grid-cols-2 lg:grid-cols-2 pc:grid-cols-3 xs:grid-cols-3 py-2 font-mono">
              <h1 className="text-[24px] pb-2 mb-1 col-span-2 pc:col-span-3 lg:col-span-2 xs:col-span-3 text-center font-bold text-white border-b border-indigo-400 shadow-lg shadow-indigo-500/20">
                Topics Solved
              </h1>
              {temp[0].topics.map((topic, index) => (
                <button
                  className="mt-1 mb-1 font-sans bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-full text-md md:text-sm shadow-md hover:from-indigo-700 hover:to-indigo-600 transition-all duration-200 flex justify-center items-center"
                  key={index}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Stats section */}
        <div className="stats-section-parent shadow-sm p-1">
          <div className="grid xs:grid-cols-3 gap-4 ">
            {[
              { title: "Problems Solved", value: "150" },
              { title: "Active Days", value: "90" },
              { title: "Submissions", value: "300" }
            ].map((stat, index) => (
              <div 
                key={index}
                className="p-3 bg-gradient-to-r from-indigo-900 to-slate-900 md:p-6 rounded-lg text-center shadow-lg flex flex-col items-center
                          hover:shadow-indigo-500/20 hover:scale-105 duration-300"
              >
                <p className="text-xl md:text-2xl font-semibold text-gray-300">{stat.title}</p>
                <span className="text-xl md:text-2xl font-bold text-white">{stat.value}</span>
              </div>
            ))}
          </div>

          <div className="grid xs:grid-cols-[60%,40%] gap-4 p-4">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-lg text-center shadow-xl flex flex-col items-center">
              <p className="text-4xl font-mono font-bold text-white mt-1">DSA Tracker</p>

              <div className="w-full p-4 mt-2 rounded-lg">
                <div className="space-y-6">
                  {visibleData.map((item, index) => {
                    const progress = (item.problemsSolved / item.totalsolved) * 100;
                    return (
                      <div key={index} className="relative">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-base font-semibold text-white">{item.topic}</p>
                          <span className="text-md text-gray-200 font-medium">
                            {item.problemsSolved} / {item.totalsolved}
                          </span>
                        </div>
                        <div
                          className="relative group"
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <div className="w-full bg-slate-200 rounded-md overflow-hidden">
                            <div
                              className="h-[10px] bg-indigo-600 transition-all duration-300 rounded-md"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          {hoveredIndex === index && (
                            <div className="absolute left-1/2 -translate-x-1/2 -top-10 bg-indigo-900 text-white px-3 py-1 rounded text-sm font-medium shadow-lg z-10 whitespace-nowrap">
                              Solved: {item.problemsSolved} of {item.totalsolved}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-8 border-transparent border-t-indigo-900" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {data.length > 5 && (
                  <button
                    className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300"
                    onClick={() => setShowAll(!showAll)}
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                )}
              </div>
            </div>

            <div className="user-rating text-center flex flex-col items-center">
              <div className="w-full bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-xl shadow-lg shadow-indigo-500/20">
                <p className="sm:text-3xl xs:text-2xl text-3xl font-semibold text-gray-300 mt-2 mb-4">Contest ratings</p>
                <div className="w-full p-4 mt-2 rounded-lg space-y-4">
                  {temp[0].ratings.map((rating, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row p-4 rounded-lg justify-between items-center bg-gradient-to-r from-indigo-800 to-slate-800 hover:from-indigo-900 hover:to-slate-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        {rating.platform === "CodeChef" && <SiCodechef className="text-2xl text-orange-300" />}
                        {rating.platform === "Codeforces" && <SiCodeforces className="text-2xl text-red-300" />}
                        {rating.platform === "LeetCode" && <SiLeetcode className="text-2xl text-green-300" />}
                        <p className="text-lg font-medium text-white">{rating.platform}</p>
                      </div>
                      <div className="flex flex-row items-center gap-2 mt-2 md:mt-0">
                        <span className="text-lg text-gray-200 font-medium">{rating.rating}</span>
                        <span className="text-sm text-gray-400">(max: {rating.rating})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Problem Categories Distribution */}
          <div className="mt-4 p-4">
            <div className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-center font-mono text-white mb-6">Problem Distribution</h2>
              <div className="grid xs:grid-cols-3 gap-4">
                {temp[0].problemsCategory.map((category, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-indigo-800 to-slate-800 p-4 rounded-lg hover:from-indigo-900 hover:to-slate-900 hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <p className="text-lg text-center font-medium text-gray-300">{category.category}</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-bold text-white">{category.problemsSolved}</p>
                      <p className="text-sm text-gray-400">problems solved</p>
                    </div>


                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}