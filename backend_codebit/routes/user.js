const express=require('express');
const multer = require('multer');
const upload = multer(); 
const router=express.Router();
const {addProblem,searchproblem,search,searchProblemBySubstring,AllProblems}=require('../controllers/problem');
const {checkProblem}=require('../middleware/problem')
const {login,signup}=require('../controllers/auth'); 
const { addTestCase } = require('../controllers/testCases');
const {fetchUpcomingContestAPI,getAllContests}=require('../controllers/contest');
const {executeCode}=require('../controllers/compiler')
const {Leaderboard}=require('../controllers/leaderBoard');
const {auth }=require('../middleware/auth');
const {getAllUserDetails}=require('../controllers/auth');
const {submitCode,getUserSubmissions,runCode}=require('../controllers/submission');

const { CheckSheet, CreateGroup, DeleteGroup, DeleteSheet,ShowAllGroups,CreateSheet, AddProblemToGroup, RemoveProblemFromGroup,ShowProblemsInGroup } = require('../controllers/userSheet');
// auth routes
router.post('/login',login);
router.post('/signup',signup);
// problem routes
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);
router.get('/problems/searchbyn',search);
router.get('/problems/searchbys',searchProblemBySubstring);
router.post('/problems/addTest',addTestCase);
router.get('/problems',AllProblems);
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
router.post('/sheet/check',CreateSheet);
router.delete('/sheet/check',DeleteSheet);
router.post('/sheet/group',CreateGroup);
router.delete('/sheet/group',DeleteGroup);
router.get('/sheet/groups',ShowAllGroups);
router.post('/sheet/group/problem',AddProblemToGroup);
router.get('/sheet/group/problems',ShowProblemsInGroup);
router.delete('/sheet/group/problem',RemoveProblemFromGroup);
// user routes
router.get("/getUserDetails",auth,getAllUserDetails);

module.exports=router;
