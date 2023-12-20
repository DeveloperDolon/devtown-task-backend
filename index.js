require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true
  }));

const uri = `mongodb+srv://${process.env.DATA_USERNAME}:${process.env.DATA_PASSWORD}@cluster0.evacz3b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // price, name, type, processor, memory, OS
    const phoneCollection = client.db("DevTowTask").collection("mobileCollections");

    app.get("/all-phones", async (req, res) => {
        try {
            const searchQuery = req.query.searchQuery;
        
            if(searchQuery) {
               const query = {
                    $or: [
                            {price: {$regex: searchQuery, $options: 'i'}},
                            {name: {$regex: searchQuery, $options: 'i'}},
                            {os: {$regex: searchQuery, $options: 'i'}},
                            {memory: {$regex: searchQuery, $options: 'i'}},
                            {type: {$regex: searchQuery, $options: 'i'}},
                            {processor: {$regex: searchQuery, $options: 'i'}}

                        ]
                };

                const result = await phoneCollection.find(query).toArray();
                return res.send(result);
            }

            const result = await phoneCollection.find().toArray();
            res.send(result);

        } catch (err) {
            console.log(err);
        }
    })

    app.get("/phone/:id", async (req, res) => {
        try {

            const id = req.params.id;
            const query = {_id: new ObjectId(id)};

            const result = await phoneCollection.findOne(query);
            res.send(result);

        } catch (err) {
            console.log(err);
        }
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  try {
    res.send("Mobile Shop Server is running");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log("Listening on port " + port);
});
