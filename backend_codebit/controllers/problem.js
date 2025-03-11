const express = require('express');
const Problem = require('../models/Problem');
const TestCase = require('../models/TestCases');
const app = express();
require('dotenv').config();

exports.addProblem = async function (req, res) {
    try {
        const { title, description, difficulty, tags, inputFormat, outputFormat, examples, constraints } = req.body;

        if (!(title || description || difficulty || tags || inputFormat || outputFormat || constraints)) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory",
            });
        }

        const existingproblem = await Problem.findOne({ title: title });
        if (existingproblem) {
            return res.status(400).json({
                success: false,
                message: "Problem already exists",
            });
        }

        const problem = await Problem.create({
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
            success: true,
            message: "Problem added successfully",
            problem
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in adding problem",
            error: error.message
        });
    }
};

exports.searchproblem = async function (req, res) {
  try {
      const { difficulty, tags } = req.query;
    
      let query = {};

      if (difficulty) {
          query.difficulty = { $regex: new RegExp(`^${difficulty}$`, "i") };
      }

      if (tags) {
          const tagsArray = tags.split(",").map(tag => new RegExp(tag.trim(), "i"));
          query.tags = { $all: tagsArray }; 
      }

     
      const problems = await Problem.find(query);

      if (problems.length === 0) {
          return res.status(404).json({
              success: true,
              message: "No problems found matching the criteria",
              problems: [],
          });
      }

      return res.status(200).json({
          success: true,
          message: "Problems fetched successfully",
          problems,
      });
  } catch (error) {
      console.error("Error fetching problems:", error.message);
      res.status(500).json({
          success: false,
          message: "Internal Server Error",
          error: error.message,
      });
  }
};
exports.search = async function (req, res) {
  try {
      const { tags, difficulty, title } = req.query;
      if(title){
          const problem = await Problem.find({ title: title });
          if(problem){
               const testcases=await TestCase.find({title:title});
               
               console.log(testcases);
               
              return res.status(200).json({
                  success: true,
                  message: "Problem fetched successfully",
                  problem,
                  testcases
              }); 
          }
          else{
              return res.status(404).json({
                  success: false,
                  message: "Problem not found",
              });
          }
        
      }

      if (!tags && !difficulty) {
          return res.status(400).json({
              success: false,
              message: "Please provide the tag and difficulty"
          });
      }

      if (tags) {

          if (!difficulty) {

              const problems = await Problem.find({
                  tags: { $all: tags }
              });

              return res.status(200).json({
                  success: true,
                  message: "All problems with the given tags",
                  problems
              });

          } else {

              const query = {};
              query.tags = tags;
              query.difficulty = difficulty;

              const problems = await Problem.find(query);

              return res.status(200).json({
                  success: true,
                  message: "Problems with the given difficulty",
                  problems
              });

          }
      } else {

          if (difficulty) {

              const problems = await Problem.find({
                  difficulty: { $all: difficulty }
              });

              return res.status(200).json({
                  success: true,
                  message: "All problems with the given difficulty",
                  problems
              });

          } else {

              return res.status(400).json({
                  success: false,
                  message: "Please provide the tag or difficulty"
              });

          }
      }

  } catch (error) {

      res.status(500).json({
          success: false,
          message: "Please Check the tags",
          error: error.message
      });

  }
};

exports.searchProblemByName = async function (req, res) {
try {
 
  
  const { title } = req.query; 

  if (!title) {
    return res.status(400).json({ success: false, message: 'Title is required' });
  }

  const regex = new RegExp(title, 'i'); 
  const problems = await Problem.find({ title: regex });

  if (!problems || problems.length === 0) {
    return res.status(404).json({ success: false, message: 'Problem not found' });
  }

  res.json({ success: true, problems });
} catch (error) {
  console.error(error);
  res.status(500).json({ success: false, message: 'Server Error' });
}
};

exports.searchProblemBySubstring = async function (req, res) {
    try {
      let { query } = req.query;
  
      
      if (!query || typeof query !== "string") {
        return res.status(400).json({ success: false, message: "Query is required and must be a string" });
      }
  
      const cleanQuery = query.trim();
  
      const regex = new RegExp(cleanQuery, "i");
  
      const problems = await Problem.find({ title: regex });
  
      if (!problems.length) {
        return res.status(404).json({ success: false, message: "No problems found" });
      }
  
      res.status(200).json({ success: true, problems });
  
    } catch (error) {
      console.error("Error searching problems:", error.message);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };

  exports.AllProblems = async function (req, res) {
    try {
    const problems = await Problem.find({}, 'title difficulty tags');
      res.status(200).json({ success: true, problems });
    } catch (error) {
      console.error("Error fetching problems:", error.message);
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
  