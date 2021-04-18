const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5004


const app = express()
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!I am from fitness guru')
})
//Connecting to database

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sr6rc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection Error', err);
  const serviceCollection = client.db("fitnessGuru").collection("services");
  const orderCollection = client.db("fitnessGuru").collection("orders");
  const reviewCollection =client.db("fitnessGuru").collection("reviews");
  const adminCollection =client.db("fitnessGuru").collection("admins");


  console.log("database connected successfully");

  //Inserting data into database 
app.post('/addService',(req,res)=>{
    const newEvent = req.body;
    console.log('adding new event', newEvent);
    serviceCollection.insertOne(newEvent)
    .then(result =>{
        console.log("Inserted result count",result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})

//Getting Data
app.get('/service',(req,res)=>{
  serviceCollection.find()
  .toArray((err,documents)=>{
      res.send(documents);
  })
})

//Get Single Data
app.get('/service/:id',(req,res)=> {
  const id = ObjectID(req.params.id);
serviceCollection.find({_id: id})
.toArray((err,documents)=>{
    res.send(documents[0]);
})
})

//Inserting order data into database 
app.post('/addOrder',(req,res)=>{
  const newEvent = req.body;
  console.log('adding new event', newEvent);
  orderCollection.insertOne(newEvent)
  .then(result =>{
      console.log("Inserted result count",result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})

//Getting orders from db
app.get('/orders',(req,res)=>{
  //  console.log(req.headers.authorization);
  console.log(req.query.email);
   orderCollection.find({email: req.query.email})
   .toArray((err, documents)=>{
       res.send(documents)
   })
})

//Getting all order Data
app.get('/allOrders',(req,res)=>{
  orderCollection.find()
  .toArray((err,documents)=>{
      res.send(documents);
  })
})

//Inserting review data into database 
app.post('/addReview',(req,res)=>{
  const newEvent = req.body;
  console.log('adding new event', newEvent);
  reviewCollection.insertOne(newEvent)
  .then(result =>{
      console.log("Inserted result count",result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})

//Getting all review
app.get('/allReviews',(req,res)=>{
  reviewCollection.find()
  .toArray((err,documents)=>{
      res.send(documents);
  })
})

//Inserting admin into database 
app.post('/addAdmin',(req,res)=>{
  const newEvent = req.body;
  console.log('adding new event', newEvent);
  adminCollection.insertOne(newEvent)
  .then(result =>{
      console.log("Inserted result count",result.insertedCount)
      res.send(result.insertedCount > 0)
  })
})

//Checking the user is admin or not
app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  adminCollection.find({ email: email })
    .toArray((err, documents) => {
      res.send(documents.length > 0)

    })


})

//Delete
app.delete('/delete/:id',(req,res)=>{
  const id = ObjectID(req.params.id);
  console.log('delete this', id);
  serviceCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value))

})

});

app.listen(port)
