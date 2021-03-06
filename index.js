const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ObjectID } = require('mongodb');
const port = process.env.PORT || 5000;
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config()
app.use(cors())
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.efzfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('relaxWatch');
        const reviewCollection = database.collection('reviews');
        const productCollection = database.collection('products');
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users');

        app.get('/reviews', async(req,res) =>{
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);

        })

        app.get('/orders', async(req,res) =>{
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        app.get('/products/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.json(product)

        })
        
        app.get('/orders/:email', async(req,res) =>{
            const email = req.params.email;
            const query = {email: email};
            const order =   orderCollection.find(query);
            const myorder = await order.toArray();
            res.send(myorder)

        })
        

        app.post('/reviews', async(req,res) =>{
            const review = req.body;

            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result);
            console.log('hit api')
    })

    app.get('/products', async(req,res) =>{
        const cursor = productCollection.find({});
        const products = await cursor.toArray();
        res.send(products);
    })
    app.get('/users', async(req,res) =>{
        const cursor = userCollection.find({});
        const users = await cursor.toArray();
        res.send(users);
    })

    app.get('/users/:email', async(req,res) =>{
        const email = req.params.email;
        const query = {email:email};
        const user = await userCollection.findOne(query);
        let isAdmin = false;
        if(user?.role === 'admin'){
            isAdmin = true;
        }
        res.json({admin:isAdmin});

    })

    app.post('/products',async(req,res) =>{
        const product = req.body;
        const result = await productCollection.insertOne(product);
        res.json(result);
        console.log('hit api');
    })

    app.post('/users', async(req,res) => {
        const users = req.body;
        const result = await userCollection.insertOne(users);
        res.json(result);
        console.log('user added')
    })

    app.post('/orders',async(req,res) =>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    })

    app.put('/users/admin', async(req,res) => {
            const user = req.body;
            const filter = {email: user.email};
            const updateDoc = {$set: { role: 'admin' }};
            const result = await userCollection.updateOne(filter,updateDoc);
            res.json(result);
            console.log('hittedd')
    })

     //Delete api
     app.delete('/orders/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const result = await orderCollection.deleteOne(query)
        res.json(result);
    })
}
    
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  
