const { generateFile } = require("../controllers/generateFile");
const {executeCpp}=require("./executeCpp");
exports.executeCode = async (req, res) => {
    try {
        const { code, language } = req.body;
 console.log(code,language);
        if (!code || !language) {
            return res.status(400).json({
                success: false,
                message: "all fields are mandatory",
            });
        }
      
        
const filepath = await generateFile(language, code);
const output=await executeCpp(filepath);
        return res.status(200).json({
            success: true,
            message: "Code executed successfully",
            filepath,
            output,
            code,
            language,
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: "Error executing code",
            error,
        });
    }
}






