const express=require('express');
const router=express.Router();
const {addProblem,searchproblem}=require('../controllers/problem');
const {checkProblem}=require('../middleware/problem')
const {login,signup}=require('../controllers/auth'); 

router.post('/login',login);
router.post('/signup',signup);
router.post('/problems',checkProblem,addProblem);
router.get('/problems/search',searchproblem);


module.exports=router;