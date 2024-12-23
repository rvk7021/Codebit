const express=require('express');
const router=express.Router();
const {addProblem,searchproblem}=require('../controllers/problem');
const {login,signup}=require('../controllers/auth'); 

router.post('/login',login);
router.post('/signup',signup);
router.post('/problems',addProblem);
router.get('/problems/search',searchproblem);


module.exports=router;