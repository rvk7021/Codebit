// const express=require('express')
// const cors=require('cors')
// const app = express();
// const database = require('./config/database');
// const dotenv = require('dotenv');
// const cloudinary = require('./config/cloudinary');
// const cookieParser=require('cookie-parser')
// const fileUpload = require('express-fileupload');

// const userRoutes=require('./routes/user');

// database.connect();
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//     origin: "http://localhost:3000",
//     credentials: true 
// }));
// app.use(fileUpload());


// dotenv.config();
// let products = [
//     { id: 1, name: 'Product 1', price: 100 },
//     { id: 2, name: 'Product 2', price: 200 },
//     { id: 3, name: 'Product 3', price: 300 }
// ];


// app.use('/',userRoutes)

// app.get('/', (req, res) => {
//     res.send(products);
// });

// const PORT = process.env.PORT||5000;
// app.listen(PORT, () => {
//     console.log(`Server is started on http://localhost:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./config/database');
const dotenv = require('dotenv');
const cloudinary = require('./config/cloudinary');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const userRoutes = require('./routes/user');

dotenv.config();
database.connect();

// ✅ Correct CORS setup (remove the first cors() call!)
app.use(cors({
    origin: "http://localhost:3000", // ✅ Set frontend URL
    credentials: true  // ✅ Allow sending cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

// ✅ Routes should be added AFTER setting up CORS
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send("API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is started on http://localhost:${PORT}`);
});
