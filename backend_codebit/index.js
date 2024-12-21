import express from 'express';

const app = express();
const dotenv = require('dotenv');
const database = require("./config/database");
database.connect();
app.use(express.json());
dotenv.config();
let products = [
    { id: 1, name: 'Product 1', price: 100 },
    { id: 2, name: 'Product 2', price: 200 },
    { id: 3, name: 'Product 3', price: 300 }
];

app.get('/', (req, res) => {
    res.send(products);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is started on http://localhost:${PORT}`);
});
