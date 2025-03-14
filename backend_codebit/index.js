const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./config/database');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/user');
const {scheduleEmailTask}=require('./controllers/sendContestMail');
 const job = require('./Utils/cron');
// const path = require('path');
dotenv.config();
 database.connect();
job.start();
app.use(cors({
    origin: "https://codebit-sr.netlify.app",
    credentials: true  
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.status(200).json({ message: "Server is working!" });
    
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is started on http://localhost:${PORT}`);
});
setTimeout(() => {
    scheduleEmailTask();
}, 10000);
