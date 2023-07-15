import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { collection } from './models/dbModel.js';
import cors from 'cors';
const app = express();

config();

const PORT = process.env.PORT;

//MIDDLEWARES
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

mongoose.connect(process.env.dbURl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`Connected to database`);
}).catch((err) => {
    console.log(err);
})

//ROUTES
app.get('/', (req, res) => {
    res.send(`Hello Amigo`)
})

app.get('/api/products', async (req, res) => {
    const products = await collection.find();
    res.json(products);
})

app.get('/api/product/:id', async (req, res) => {
    const product = await collection.findOne({
        _id: req.params.id
    })
    res.send(product);
})

app.post('/api/add-product', async (req, res) => {
    const data = new collection ({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    data.save().then(() => {
        res.status(200).json(data);
    })

})



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))