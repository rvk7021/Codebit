const express=require('express');
const multer = require('multer');
const upload = multer(); 
const router=express.Router();
const {addProblem,searchproblem}=require('../controllers/problem');
const {checkProblem}=require('../middleware/problem')
const {login,signup}=require('../controllers/auth'); 
const { addTestCase } = require('../controllers/testCases');
const {fetchUpcomingContestAPI}=require('../controllers/contest');
const {executeCode}=require('../controllers/compiler')
<<<<<<< HEAD
const {Leaderboard,fetchUserDetails}=require('../controllers/leaderBoard');
=======
const {Leaderboard}=require('../controllers/leaderBoard');
>>>>>>> 9b68d0a2fd09014d793097e7fd3ede947109e373
const { CheckSheet, CreateGroup, DeleteGroup, ShowAllGroups, AddProblemToGroup, RemoveProblemFromGroup } = require('../controllers/userSheet');
// auth routes
router.post('/login',login);
router.post('/signup',signup);
// problem routes
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);
router.post('/problems/addTest',addTestCase);
// contest routes
<<<<<<< HEAD
router.post('/contest',fetchUpcomingContest);
router.post('/execute',executeCode);
// leaderboard routes
router.get('/leaderboard',Leaderboard);
router.get('/leaderboard/leetcode',fetchUserDetails);
=======
router.post('/contest',fetchUpcomingContestAPI);
router.post('/execute',executeCode);
// leaderboard routes
router.get('/leaderboard',Leaderboard);
>>>>>>> 9b68d0a2fd09014d793097e7fd3ede947109e373
// user sheet routes
router.get('/sheet/check',CheckSheet);
router.post('/sheet/group',CreateGroup);
router.delete('/sheet/group',DeleteGroup);
router.get('/sheet/groups',ShowAllGroups);
router.post('/sheet/group/problem',AddProblemToGroup);
router.delete('/sheet/group/problem',RemoveProblemFromGroup);

<<<<<<< HEAD
// // Check if the sheet exists for the user or validate sheet data
// router.get('/api/sheets/validate', checkSheet); 

// // Create a new group within a sheet
// router.post('/api/sheets/:sheetId/groups', createGroup); 

// // Delete a specific group within a sheet
// router.delete('/api/sheets/:sheetId/groups/:groupId', deleteGroup); 

// // Retrieve all groups from a specific sheet
// router.get('/api/sheets/:sheetId/groups', showAllGroups); 

// // Add a problem to a specific group in a sheet
// router.post('/api/sheets/:sheetId/groups/:groupId/problems', addProblemToGroup); 

// // Remove a problem from a specific group in a sheet
// router.delete('/api/sheets/:sheetId/groups/:groupId/problems/:problemId', removeProblemFromGroup);

=======
>>>>>>> 9b68d0a2fd09014d793097e7fd3ede947109e373
module.exports=router;
