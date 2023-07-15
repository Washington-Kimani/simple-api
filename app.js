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

// app.get('/api/products', (req, res) => {
//     const products = collection.find();
//     res.send(products);
// })
app.get('/api/products', async (req, res) => {
    // Your existing code here
    const products = await collection.find();

    try {
        const jsonString = JSON.stringify(products, (key, value) => {
            // Exclude circular references from the serialization
            if (typeof value === 'object' && value !== null) {
                if (key === 'client' || key === 's' || key === 'sessionPool') {
                    return '[Circular]';
                }
            }
            return value;
        });

        // Send the jsonString as the response
        res.send(jsonString);
    } catch (error) {
        console.error('Error converting object to JSON:', error);
        // Handle the error and send an appropriate response
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/product/:id', (req, res) => {
    const product = collection.findOne({
        _id: req.params.id
    })
    res.send(product);
})

app.post('/api/add-product', (req, res) => {
    const data = new collection({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    })

    data.save().then(() => {
        res.status(200).send(data);
    })

})



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))