const express=require('express');
const router=express.Router();
const {addProblem,searchproblem}=require('../controllers/problem');
const {checkProblem}=require('../middleware/problem')
const {login,signup}=require('../controllers/auth'); 
const { addTestCase } = require('../controllers/testCases');
const {fetchUpcomingContest}=require('../controllers/contest');
const {executeCode}=require('../controllers/compiler')
router.post('/login',login);
router.post('/signup',signup);
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);
router.post('/problems/addTest',addTestCase);
router.post('/contest',fetchUpcomingContest);
router.post('/execute',executeCode);
module.exports=router;
