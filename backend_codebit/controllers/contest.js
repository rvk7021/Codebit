const Contest=require('../models/Contest');
require('dotenv').config();
const axios = require('axios');
 const codeforcesUrl = 'https://codeforces.com/api/contest.list';
 const codechefUrl='https://www.codechef.com/api/list/contests/all';
exports.fetchUpcomingContest=async(req,res)=>{
    try{
const codeforcesResponse=await axios.get(codeforcesUrl);
const codechefResponse=await axios.get(codechefUrl);
const contests=await Contest.find({});

const codeforcesContests=codeforcesResponse.data.result;
// const cns=[
// {

//   "name": "W-435",
//   "description": "All the best for the contest",
//   "startTime": "2025-02-02 08.00",
//   "duration": 1.5,
//     "link": "https://leetcode.com/contest/",
//   "platform": "LeetCode",

// },
// {

//     "name": "B-149",
//     "description": "All the best for the contest",
//     "startTime": "2025-02-01 20.00",
//     "duration": 1.5,
//       "link": "https://leetcode.com/contest/",
//     "platform": "LeetCode",
  
// }
// ];
//for upcoming or ongoing contests
const upcomingCodeforcesContests=codeforcesContests.filter(contest => contest.phase === 'BEFORE'||contest.phase === 'CODING');
const upcomingCodechefContests=codechefResponse.data.future_contests;
const upcomingContestNames = new Set(upcomingCodeforcesContests.map((c) => c.name));
const upcomingContestNamesChef = new Set(upcomingCodechefContests.map((c) => c.contest_name));
for (const contest of contests){
   
    
    if(contest.platform === 'Codeforces'&&!upcomingContestNames.has(contest.name)){
        await Contest.findByIdAndDelete(contest._id);
    }
    if(contest.platform === 'Codechef'&&!upcomingContestNamesChef.has(contest.name)){
        await Contest.findByIdAndDelete(contest._id);
    }
    if (contest.platform.toLowerCase() === "leetcode") {

        const startTime=contest.startTime;
        const startDate = new Date(startTime);
        const currentTime = new Date();
     
        const durationInHours = contest.duration; // Assuming duration is in hours

    
        // Calculate end time by adding duration to start time
        const endDate = new Date(startDate.getTime() + durationInHours * 60 * 60 * 1000);
        console.log(endDate);
      
        if(currentTime>(endDate)){
          if(contest.name.split('-')[0]==='W'){
              contest.name='W-'+(parseInt(contest.name.split('-')[1])+1);
             offset=7;
             const newStartDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
            
             // Format back to "YYYY-MM-DD HH:mm" string
             const pad = n => n.toString().padStart(2, '0');
             contest.startTime = [
                 newStartDate.getFullYear(),
                 pad(newStartDate.getMonth() + 1), // Months are 0-based
                 pad(newStartDate.getDate())
             ].join('-') + 'T' + [
                 pad(newStartDate.getHours()),
                 pad(newStartDate.getMinutes())
             ].join(':');
             await contest.save();
          }
          else{
            contest.name='B-'+(parseInt(contest.name.split('-')[1])+1);
            const newStartDate = new Date(startDate.getTime() + (14 * 24 * 60 * 60 * 1000));
            
            // Format back to "YYYY-MM-DD HH:mm" string
            const pad = n => n.toString().padStart(2, '0');
            contest.startTime = [
                newStartDate.getFullYear(),
                pad(newStartDate.getMonth() + 1), // Months are 0-based
                pad(newStartDate.getDate())
            ].join('-') + 'T' + [
                pad(newStartDate.getHours()),
                pad(newStartDate.getMinutes())
            ].join(':');
            await contest.save();
             
          }
          
        }     
    
    
    }
    
}

function formatStartDateToIST(timestamp) {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
  
    const istOffset =0; // Offset in milliseconds
    const istDate = new Date(date.getTime() + istOffset);
  
    // Format date to 'YYYY-MM-DD HH:mm'
    const year = istDate.getFullYear();
    const month = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(istDate.getDate()).padStart(2, '0');
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
for (const contest of upcomingCodeforcesContests){
    
    const existingContest = await Contest.findOne({ name: contest.name });
  
    
    if(!existingContest){
       
    

        Contest.create({
            name:contest.name,
            description:"All the best for the contest",
            startTime:formatStartDateToIST(contest.startTimeSeconds),
            duration:(contest.durationSeconds)/60*60,
            link:"https://codeforces.com/contests",
            platform:'Codeforces'
        })
    }
}  

//codechef
for(const contest of upcomingCodechefContests){

    const existingContest = await Contest.findOne({ name: contest.contest_name });
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
