const Contest=require('../models/Contest');
const cron=require('node-cron');
require('dotenv').config();
const axios = require('axios');
 const codeforcesUrl = 'https://codeforces.com/api/contest.list';
 const codechefUrl='https://www.codechef.com/api/list/contests/all';
 
let cronJob;

const fetchUpcomingContest = async () => {
    try {
     
        const codeforcesResponse = await axios.get(codeforcesUrl);
        const codechefResponse = await axios.get(codechefUrl);
        const contests = await Contest.find({});
        
        const codeforcesContests = codeforcesResponse.data.result;
        const upcomingCodeforcesContests = codeforcesContests.filter(contest => contest.phase === 'BEFORE' || contest.phase === 'CODING');
        
        const upcomingCodechefContests = codechefResponse.data.future_contests;
        const upcomingContestNames = new Set(upcomingCodeforcesContests.map((c) => c.name));
        const upcomingContestNamesChef = new Set(upcomingCodechefContests.map((c) => c.contest_name));
       
        for (const contest of contests) {
           
           
            if (contest.platform === 'Codeforces' && !upcomingContestNames.has(contest.name)) {
                await Contest.findByIdAndDelete(contest._id);
            }
            if (contest.platform === 'Codechef' && !upcomingContestNamesChef.has(contest.name)) {
                await Contest.findByIdAndDelete(contest._id);
            }

            
            
        }

        for (const contest of upcomingCodeforcesContests) {
            const existingContest = await Contest.findOne({ name: contest.name });
            contest.durationSeconds = contest.durationSeconds/(60*60);
            if (!existingContest) {
                await Contest.create({
                    name: contest.name,
                    description: "All the best for the contest",
                    startTime: formatStartDateToIST(contest.startTimeSeconds),
                    duration: (contest.durationSeconds) ,
                    link: "https://codeforces.com/contests",
                    platform: 'Codeforces'
                });
               
            }
        }

    
        for (const contest of upcomingCodechefContests) {
            const existingContest = await Contest.findOne({ name: contest.contest_name });
            if (!existingContest) {
                await Contest.create({
                    name: contest.contest_name,
                    description: "All the best for the contest",
                    startTime: contest.contest_start_date,
                    duration: contest.contest_duration / 60,
                    link: "https://www.codechef.com/contests",
                    platform: 'Codechef'
                });
            }
        }

    
    } catch (error) {
        console.error('Error fetching contests:', error);
        throw error;
    }
};

const scheduleFetch = () => {
    if (cronJob) {
        cronJob.stop();
    }
    cronJob = cron.schedule('*/15 * * * *', fetchUpcomingContest);
  
};

// Initial schedule
scheduleFetch();

// API endpoint
exports.fetchUpcomingContestAPI = async (req, res) => {
    try {
        await fetchUpcomingContest();
        scheduleFetch(); 
        return res.status(200).json({
            success: true,
            message: "Contests fetched successfully",
            nextFetchIn: "15 minutes"
        });
    } catch (error) {
       
        return res.status(500).json({
            success: false,
            message: 'Error fetching contests',
            error: error.message
        });
    }
};


exports.getAllContests=async(req,res)=>{
    try {
      await  fetchUpcomingContest();
        const contests = await Contest.find({}).sort({ startTime: 1 });
        return res.status(200).json({
            success: true,
            message: "Contests fetched successfully",
            contests
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching contests", 
            error: error.message
        });
    }
}

