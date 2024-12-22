const mongoose=require("mongoose");
require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>console.log("Database connected Successfully"))
    .catch((error)=>{
        console.log("Database connection failed");
        console.error(error);
        process.exit(1);
    })
}



