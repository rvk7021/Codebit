const express = require('express');
const app = express();
require('dotenv').config();
const Sheet = require('../models/Sheet');

// Check sheet API call if it exists or not, then create one
exports.CheckSheet = async (req, res) => {
  try {
    let SheetData = await Sheet.findOne({
      user: req.body.user
    });

    if (!SheetData) {
      SheetData = await Sheet.create({
        user: req.body.user
      });

      if (SheetData) {
        return res.status(200).json({
          message: "Sheet Created",
          success: true
        });
      } else {
        return res.status(400).json({
          message: "Internal Server Error",
          success: false
        });
      }
    }

    return res.status(200).json({
      message: "Sheet Already Exists",
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: "Invalid User Error",
      success: false
    });
  }
}

// Group creation API call
exports.CreateGroup = async (req, res) => {
  try {
    const SheetData = await Sheet.findOne({ user: req.body.user });

    if (!SheetData) {
      return res.status(400).json({
        message: "Sheet not found",
        success: false
      });
    }

    const groupName = req.body.groupName;

    if (!groupName) {
      return res.status(400).json({
        message: "GroupName is required",
        success: false
      });
    }

    // Check if the group already exists
    const groupExists = SheetData.groups.some(group => group.groupName === groupName);

    if (groupExists) {
      return res.status(400).json({
        message: "Group Already Exists",
        success: false
      });
    }

    // Create and push the new group
    const newGroup = {
      groupName: groupName,
      problems: []
    };

    SheetData.groups.push(newGroup);

    // Save the updated sheet
    const updatedSheet = await SheetData.save();

    if (updatedSheet) {
      return res.status(200).json({
        message: "Group Created",
        success: true
      });
    }

    return res.status(400).json({
      message: "Failed to create group",
      success: false
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Delete group API call
exports.DeleteGroup = async (req, res) => {
  try {
    // Find the user's sheet
    const SheetData = await Sheet.findOne({ user: req.body.user });

    if (!SheetData) {
      return res.status(400).json({
        message: "Sheet not found",
        success: false
      });
    }

    const groupName = req.body.groupName;

    if (!groupName) {
      return res.status(400).json({
        message: "GroupName is required",
        success: false
      });
    }

    // Check if the group exists
    const groupExists = SheetData.groups.some(group => group.groupName === groupName);

    if (!groupExists) {
      return res.status(400).json({
        message: "Group Not Exists",
        success: false
      });
    }

    // Remove the group
    const UpdatedSheet = await SheetData.updateOne({
      $pull: {
        groups: { groupName: groupName }
      }
    });

    if (UpdatedSheet.modifiedCount > 0) {
      return res.status(200).json({
        message: "Group Deleted",
        success: true
      });
    }

    return res.status(400).json({
      message: "Failed to delete group",
      success: false
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Show all groups API call
exports.ShowAllGroups = async (req, res) => {
  try {
    const user = req.body.user;
    // console.log("User:", user);

    // Fetch the sheet data for the user
    const SheetData = await Sheet.findOne({ user: user });

    // Handle case where the sheet is not found
    if (!SheetData) {
      // console.log("Sheet not found");
      return res.status(400).json({
        message: "Sheet not found",
        success: false
      });
    }

    // Map and return group names
    const groupNames = SheetData.groups.map(group => group.groupName);

    return res.status(200).json({
      groups: groupNames,
      success: true
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false
    });
  }
};

// Add problem to group API call 
exports.AddProblemToGroup = async (req, res) => {
  try {
    const SheetData = await Sheet.findOne({
      user: req.body.user
    });

    if (!SheetData) {
      return res.status(400).json({
        message: "Internal Server Error",
        success: false
      });
    }

    const groupName = req.body.groupName;

    if (!groupName) {
      return res.status(400).json({
        message: "Group Not Specified",
        success: false
      });
    }

    const problem = req.body.problemId;

    if (!problem) {
      return res.status(400).json({
        message: "Problem Not Selected",
        success: false
      });
    }

    const notes = req.body.notes;

    const group = SheetData.groups.filter(group => group.groupName === groupName);

    if (group.length === 0) {
      return res.status(400).json({
        message: "Group Not Exists",
        success: false
      });
    }

    if (!group[0].problems) {
      group[0].problems = [];
    }

    // Check if the problem already exists in the group
    const problemExist = group[0].problems.filter(prob => prob.problem.equals(problem));

    if (problemExist.length > 0) {
      return res.status(400).json({
        message: "Problem Already Exists",
        success: false
      });
    }

    group[0].problems.push({
      problem: problem,
      notes: notes
    });

    const updatedSheet = await SheetData.save();

    if (updatedSheet) {
      return res.status(200).json({
        message: "Problem Added",
        success: true
      });
    }

    return res.status(400).json({
      message: "Failed to add problem",
      success: false
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to add problem",
      success: false
    });
  }
}

// Remove problem from group API call
exports.RemoveProblemFromGroup = async (req, res) => {
  try {
    const { user, groupName, problemId } = req.body;

    // Find the sheet by user
    const sheet = await Sheet.findOne({ user });
    if (!sheet) {
      return res.status(400).json({
        message: "Internal Server Error",
        success: false
      });
    }

    // Find the group by groupName
    const group = sheet.groups.find(group => group.groupName === groupName);
    if (!group) {
      return res.status(400).json({
        message: "Group Not Found",
        success: false
      });
    }

    // Find the problem in the group's problems array
    const problemIndex = group.problems.findIndex(prob => prob.problem.toString() === problemId);
    if (problemIndex === -1) {
      return res.status(400).json({
        message: "Problem Not Found in Group",
        success: false
      });
    }

    // Remove the problem from the group's problems array
    group.problems.splice(problemIndex, 1);

    // Save the updated sheet
    const updatedSheet = await sheet.save();
    if (updatedSheet) {
      return res.status(200).json({
        message: "Problem Removed Successfully",
        success: true
      });
    }
    
    return res.status(400).json({
      message: "Failed to remove problem",
      success: false
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to remove problem",
      success: false
    });
  }
};
