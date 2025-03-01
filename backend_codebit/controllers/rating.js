const axios = require('axios');

exports.fetchCodeforcesRating = async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        const rating = response.data.result[0].rating;
        
        return res.status(200).json({ success: true, rating });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.fetchCodeChefRating = async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://codechef-api.vercel.app/handle/${username}`);
        const rating = response.data.currentRating;
       
        
        return res.status(200).json({ success: true, rating });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.fetchLeetCodeRating = async (req, res) => {
    try {
        const { username } = req.params;
        const response = await axios.get(`https://alfa-leetcode-api.onrender.com/userContestRankingInfo/${username}`);
        const rating = response.data.data.userContestRanking.rating;
        
        return res.status(200).json({ success: true, rating });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: err.message });
    }
};
