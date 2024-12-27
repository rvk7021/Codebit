const TestCase=require('../models/TestCases');

exports.addTestCase=async function(req,res){
    try {
        const { ProblemId,TestCases } = req.body;

        if(!ProblemId){

            return res.status(400).json({
                success: false,
                message: "ProblemId is required"
            });

        }
        if(!TestCases){

            return res.status(400).json({
                success: false,
                message: "Test cases are required"
            });

        }

        const existingProblem=await TestCase.findOne({ProblemId});

        if(existingProblem){

            const existingInputs = existingProblem.TestCases.map(tc => tc.Input);
            const filteredTestCases = TestCases.filter(tc => !existingInputs.includes(tc.Input));

            if (filteredTestCases.length > 0) {

                existingProblem.TestCases.push(...filteredTestCases);
                await existingProblem.save();

                return res.status(200).json({
                    success: true,
                    message: "New test cases added to the existing problem",
                    data: existingProblem
                });

            }
            else {
                return res.status(400).json({
                    message: "Test Cases already exist"
                })
            }

        }
        else {

            const addedTestcase=await TestCase.create({
                ProblemId,
                TestCases
            });

            return res.status(200).json({
                success: true,
                message: "Test cases added successfully",
                addedTestcase
            })

        }
        

    } catch (error) {
        return res.status(404).json({
            success:false,
            message: "Error in adding test case",
            error:error.message
        })
    }
}