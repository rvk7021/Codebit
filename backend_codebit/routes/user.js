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
const {fileUpload}=require('../controllers/fileUpload')
const {scheduleEmailTask}=require('../controllers/sendContestMail')
const {addPost}=require('../controllers/post');
router.post('/login',login);
router.post('/signup',signup);
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);
router.post('/problems/addTest',addTestCase);
router.post('/contest',fetchUpcomingContestAPI);
router.post('/execute',executeCode);
router.post('/upload',upload.single('file'),fileUpload);
router.post('/scheduleEmailTask',scheduleEmailTask);
router.post('/posts', upload.array('media', 5), addPost);
module.exports=router;
