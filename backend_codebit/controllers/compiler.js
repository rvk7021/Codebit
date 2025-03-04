const { generateFile } = require("../controllers/generateFile");
const {executeCpp}=require("./executeCpp");
exports.executeCode = async (req, res) => {
    try {
        const { code, language,input } = req.body;
        console.log('====================================');
        console.log("req is coming");
        console.log('====================================');
        if (!code || !language||input==undefined) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory",
            });
        }
 
      
        
const filepath = await generateFile(language, code);


const output=await executeCpp(filepath,input);
console.log(output);

        return res.status(200).json({
            success: true,
            message: "Code executed successfully",
            filepath,
            output,
            code,
            language,
            input
        });
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success: false, 
            message: "Error executing code",
            error,
        });
    }
}






