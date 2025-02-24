const Submission = require("../models/Submission");
const TestCase = require("../models/TestCases");
const axios = require("axios");

exports.submitCode = async (req, res) => {
    try {
        const { title, code ,testCases} = req.body;
  
        if (!title || !code ) {
            return res.status(400).json({ success: false, message: "All fields are mandatory" });
        }

        
    
        if (!testCases) {
            return res.status(404).json({ success: false, message: "Test cases not found" });
        }
      
        

        let allPassed = true;
        let results = [];
  
 
   
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            
            
            const input = testCase.Input;
            const expectedOutput = testCase.ExpectedOutputs.trim();

            const response = await axios.post(`${process.env.EXECUTION_API_URL}/execute`, {
                code,
                input,
                language:"cpp"
            });
           
            const actualOutput = response.data.output.trim();

          
            const passed = actualOutput === expectedOutput;
            results.push({
                input,
                expectedOutput,
                actualOutput,
                passed
            })
            if(!passed)
            {
               
                
                allPassed = false;
               
               
               if(results.length>2) { break;}
            }
          

           
        }
          
        const user=req.user.id ;
         
      const status = allPassed ? "Accepted" : "Wrong Answer";
        
            const submission = await Submission.create({user:user, title:title, code:code,status:status });
            if(allPassed){
            return res.status(200).json({ success: true, message: "Code Accepted Successful",results ,status:status });
        } else {
            return res.status(200).json({ success: true, message: " Code Not Accepted", results });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
exports.getUserSubmissions = async (req, res) => {
    try {
        const userId = req.user.id;
        const title=req.query.title;
        const submissions = await Submission.find({ user: userId,title:title });
        
        return res.status(200).json({ success: true, submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.runCode = async (req, res) => {
    try {
        const { title, code,test } = req.body;
        if (!title || !code ) {
            return res.status(400).json({ success: false, message: "All fields are mandatory" });
        }
        if (!test) {
            return res.status(404).json({ success: false, message: "Test cases not found" });
        }
        let results = [];
        for (let i = 0; i < test.length; i++) {
            const testCase =    test[i];
            const input = testCase.Input;
            const expectedOutput = testCase.ExpectedOutputs.trim();
            const response = await axios.post(`${process.env.EXECUTION_API_URL}/execute`, {
                code,
                input,
                language:"cpp"
            });
            const actualOutput = response.data.output.trim();
            const passed = actualOutput === expectedOutput;
            results.push({
                input,
                expectedOutput,
                actualOutput,
                passed
            })
           }   
            return res.status(200).json({ success: true, message: "All Test Cases Run Successfully",results });
        } 
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};