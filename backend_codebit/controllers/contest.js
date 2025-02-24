const Contest=require('../models/Contest');
const cron=require('node-cron');
require('dotenv').config();
const axios = require('axios');
 const codeforcesUrl = 'https://codeforces.com/api/contest.list';
 const codechefUrl='https://www.codechef.com/api/list/contests/all';
 
const { v4: uuid } = require('uuid');
let cronJob;

const fetchUpcomingContest = async () => {
    try {
        // Fetch contests data
      console.log("Executing fetchUpcomingContest");
      
        const codeforcesResponse = await axios.get(codeforcesUrl);
        const codechefResponse = await axios.get(codechefUrl);
        const contests = await Contest.find({});
        
        const codeforcesContests = codeforcesResponse.data.result;
        const upcomingCodeforcesContests = codeforcesContests.filter(contest => contest.phase === 'BEFORE' || contest.phase === 'CODING');
        
        const upcomingCodechefContests = codechefResponse.data.future_contests;
        const upcomingContestNames = new Set(upcomingCodeforcesContests.map((c) => c.name));
        const upcomingContestNamesChef = new Set(upcomingCodechefContests.map((c) => c.contest_name));
        // const cns=[
        //     {
            
        //       "name": "W-435",
        //       "description": "All the best for the contest",
        //       "startTime": "2025-02-02T08.00",
        //       "duration": 1.5,
        //         "link": "https://leetcode.com/contest/",
        //       "platform": "LeetCode",
            
        //     },
        //     {
            
        //         "name": "B-150",
        //         "description": "All the best for the contest",
        //         "startTime": "2025-02-15T20.00",
        //         "duration": 1.5,
        //           "link": "https://leetcode.com/contest/",
        //         "platform": "LeetCode",
              
        //     }
        //     ];
        //     for(const cn of cns){
        //         await Contest.create(cn);
        //     }
        // Cleanup outdated contests
        for (const contest of contests) {
           
           
            if (contest.platform === 'Codeforces' && !upcomingContestNames.has(contest.name)) {
                await Contest.findByIdAndDelete(contest._id);
            }
            if (contest.platform === 'Codechef' && !upcomingContestNamesChef.has(contest.name)) {
                await Contest.findByIdAndDelete(contest._id);
            }

            if (contest.platform.toLowerCase() === "leetcode") {
                const startTime = contest.startTime;
                const startDate = new Date(startTime);
                
                
                const currentTime = new Date();
                const durationInHours = contest.duration;

                const endDate = new Date(startDate.getTime() + durationInHours * 60 * 60 * 1000);
                console.log(currentTime, endDate);
                
                if (currentTime > endDate) {
                  
                    
                      
                    if (contest.name.split('-')[0] === 'W') {
                        contest.name = 'W-' + (parseInt(contest.name.split('-')[1]) + 1);
                        const newStartDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000));
                        contest.startTime = formatStartDateToIST(newStartDate);
                    } else {
                        contest.name = 'B-' + (parseInt(contest.name.split('-')[1]) + 1);
                        const newStartDate = new Date(startDate.getTime() + (14 * 24 * 60 * 60 * 1000));
                        contest.startTime = formatStartDateToIST(newStartDate);
                    }
                    contest.notifiedUsers.registeredTime = [];
                    contest.notifiedUsers.beforeDeadline = [];
                    await contest.save();
                }
            }
        }

        // Fetch upcoming contests from Codeforces
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

        // Fetch upcoming contests from Codechef
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

        console.log('Contests fetched and database updated successfully');
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
    console.log('Scheduled next fetch in 15 minutes');
};

// Initial schedule
scheduleFetch();

// API endpoint
exports.fetchUpcomingContestAPI = async (req, res) => {
    try {
        await fetchUpcomingContest();
        scheduleFetch(); // Reset the 15-minute timer
        return res.status(200).json({
            success: true,
            message: "Contests fetched successfully",
            nextFetchIn: "15 minutes"
        });
    } catch (error) {
        console.error('Error fetching contests:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching contests',
            error: error.message
        });
    }
};

// Helper function to format start date to IST
function formatStartDateToIST(input) {
    // Determine if the input is a Date object or a timestamp in seconds
    let date;
    if (input instanceof Date) {
        date = input;
    } else if (typeof input === "number") {
        // For Codeforces contests, the timestamp is in seconds
        date = new Date(input * 1000);
    } else {
        // Fallback if the input is a valid date string already
        date = new Date(input);
    }

    // Format date components with leading zeros if necessary
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    // Return a valid ISO 8601 datetime string using 'T' as the separator.
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

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

