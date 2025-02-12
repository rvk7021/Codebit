const express = require('express');
const app = express();
const user = require('../models/User');
require('dotenv').config();

exports.Leaderboard = async function (req, res) {
    try {

        const { college } = req.body;
        
        const leaderboard= await user.find({college},{userName:1,firstName:1,lastName:1,problemsSolved:1}).sort({problemsSolved:-1});
        if (leaderboard.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No leaderboard corresponding to the college",
            });
        } 

        return res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            leaderboard
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Error in fetching leaderboard",
            error: error.message
        });

    }
}

