const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dlkda.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('Todo_Task').collection('Task_List');
        app.get('/tasklist', async (req, res) => {
            const tasklist = await taskCollection.find().toArray();
            res.send(tasklist);
            console.log('mongo connect')
        })

    }
    finally {

    }
}

app.get('/', (req, res) => {
    res.send('Hello task!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})