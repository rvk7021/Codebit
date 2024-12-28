const Contest=require('../models/Contest');
require('dotenv').config();
const axios = require('axios');
 const codeforcesUrl = 'https://codeforces.com/api/contest.list';
 const codechefUrl='https://www.codechef.com/api/list/contests/all';
//  const leetcodeUrl='https://leetcode.com/contest/';
exports.fetchUpcomingContest=async(req,res)=>{
    try{
const codeforcesResponse=await axios.get(codeforcesUrl);
const codechefResponse=await axios.get(codechefUrl);
// const leetcodeResponse=await axios.get(leetcodeUrl);
const codeforcesContests=codeforcesResponse.data.result;
// console.log(leetcodeResponse.data);

//for upcoming or ongoing contests
const upcomingCodeforcesContests=codeforcesContests.filter(contest => contest.phase === 'BEFORE'||contest.phase === 'CODING');
for (const contest of upcomingCodeforcesContests){
    
    const existingContest = await Contest.findOne({ name: contest.name });
    if(!existingContest){
       
        const relativeTime=contest.relativeTimeSeconds;
        const start=Date.now()+relativeTime*1000;
        const startDate = new Date(start);
        console.log(startDate.toDateString());

   
        Contest.create({
            name:contest.name,
            description:"All the best for the contest",
            startTime:startDate.toDateString(),
            duration:contest.durationSeconds,
            link:"https://codeforces.com/contests",
            platform:'Codeforces'
        })
    }
}  
const upcomingCodechefContests=codechefResponse.data.future_contests;
//codechef
for(const contest of upcomingCodechefContests){

    const existingContest = await Contest.findOne({ name: contest.name });
    if(!existingContest){


        Contest.create({
            name:contest.contest_name,
            description:"All the best for the contest",
            startTime:contest.contest_start_date,
            duration:contest.contest_duration/60,    
            link:"https://www.codechef.com/contests",
            platform:'Codechef'
        })
    }
}
  return res.status(200).json(
    {
        success:true,
      CodeforcesContests:  upcomingCodeforcesContests,
       codechefContests: upcomingCodechefContests,
        message:"Contest fecthed successfully",
    }
  )

    }catch(error){
 return res.status(500).json({ success:false, message: 'Error fetching contests', error });
    }
}