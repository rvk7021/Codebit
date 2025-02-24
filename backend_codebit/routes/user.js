const express=require('express');
const multer = require('multer');
const upload = multer(); 
const router=express.Router();
const {addProblem,searchproblem,searchProblemByName}=require('../controllers/problem');
const {checkProblem}=require('../middleware/problem')
const {login,signup}=require('../controllers/auth'); 
const { addTestCase } = require('../controllers/testCases');
const {fetchUpcomingContestAPI,getAllContests}=require('../controllers/contest');
const {executeCode}=require('../controllers/compiler')
const {Leaderboard}=require('../controllers/leaderBoard');
const {auth }=require('../middleware/auth');
const {getAllUserDetails}=require('../controllers/auth');
const {submitCode,getUserSubmissions,runCode}=require('../controllers/submission');

const { CheckSheet, CreateGroup, DeleteGroup, ShowAllGroups, AddProblemToGroup, RemoveProblemFromGroup } = require('../controllers/userSheet');
// auth routes
router.post('/login',login);
router.post('/signup',signup);
// problem routes
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);
router.post('/problems/addTest',addTestCase);
// contest routes
router.post('/contest',fetchUpcomingContestAPI);
router.get('/contests',getAllContests);
router.post('/execute',executeCode);
router.post('/submit',auth,submitCode);
router.post('/run',runCode);
router.post('/submissions',auth,getUserSubmissions);
// leaderboard routes
router.get('/leaderboard',Leaderboard);
// user sheet routes
router.get('/sheet/check',CheckSheet);
router.post('/sheet/group',CreateGroup);
router.delete('/sheet/group',DeleteGroup);
router.get('/sheet/groups',ShowAllGroups);
router.post('/sheet/group/problem',AddProblemToGroup);
router.delete('/sheet/group/problem',RemoveProblemFromGroup);
router.get('/searchProblem',searchProblemByName);
router.get("/getUserDetails",auth,getAllUserDetails);

module.exports=router;
