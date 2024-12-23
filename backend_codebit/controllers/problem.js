const express=require('express');
const Problem=require('../models/Problem');
const app = express();
require('dotenv').config();

exports.addProblem=async function(req,res){
        try {
            const { title, description, difficulty, tags, inputFormat, outputFormat, examples, constraints } = req.body;
            const ProblemId=Date.now();

            if(!(title||description||difficulty||tags||inputFormat||outputFormat||constraints)){
                return res.status(400).json({
                    success: false,
                    message: "all fields are mandatory",
                })
            }

            const existingproblem=await Problem.findOne({description});
            if(existingproblem){
                return res.status(400).json({
                    success: false,
                    message: "Problem already exists",
                })
            }

            const problem=await Problem.create({
                problemId:ProblemId,
                title,
                description,
                difficulty,
                tags,
                inputFormat,
                outputFormat,
                examples,
                constraints
            });
            
            return res.status(200).json({
                success:true,
                message:"Problem added successfully",
                problem
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error in adding problem",
                error:error.message
            })
        }
}


exports.searchproblem=async function(req,res){
        try {

            const {tags,difficulty}=req.body;

            if(!tags && !difficulty){
                return res.status(400).json({
                    success:false,
                    message: "Please provide the tag and difficulty"
                })
            }
            if(tags){

                if(!difficulty){
                    const problems=await Problem.find({
                        tags:{$all:tags}
                    })
                    return res.status(200).json({
                        success:true,
                        message:"All problems with the given tags",
                        problems
                    })
                }
                else{
                    const query={};
                    query.tags=tags;
                    query.difficulty=difficulty;
                    const problems=await Problem.find(query);
                    return res.status(200).json({
                        success:true,
                        message:"Problems with the given difficulty",
                        problems
                    })
                }
            }
            else{
                if(difficulty){
                    const problems=await Problem.find({
                        difficulty:{$all:difficulty}
                    })
                    return res.status(200).json({
                        success:true,
                        message:"All problems with the given difficulty",
                        problems
                    })
                }
                else{
                    return res.status(400).json({
                        success:false,
                        message: "Please provide the tag or difficulty"
                    })
                }
            }
            
        } catch (error) {
            res.status(500).json({
                success:false,
                message:"Please Check the tags",
                error:error.message
            })
        }
}
