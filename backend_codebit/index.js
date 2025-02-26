const express=require('express')
const cors=require('cors')
const app = express();
const database = require('./config/database');
const dotenv = require('dotenv');
const cloudinary = require('./config/cloudinary');

 database.connect();
const userRoutes=require('./routes/user');
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
dotenv.config();
let products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
];


app.use('/',userRoutes)

app.get('/', (req, res) => {
    res.send(products);
});

const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
    console.log(`Server is started on http://localhost:${PORT}`);
});
