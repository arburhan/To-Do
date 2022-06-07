const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const taskCollection = client.db("Todo_Task").collection("List");
        app.get('/list', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const taskList = await cursor.toArray();
            res.send(taskList);
        });
        app.get('/list/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await taskCollection.find(query).toArray();
            res.send(user);
        })

        app.post('/list', async (req, res) => {
            const newTask = req.body;
            // const query = { name: newTask.treatment, description: newTask.date }
            const result = await taskCollection.insertOne(newTask);
            return res.send({ success: true, result });
        });
        // patch
        app.patch('/list/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    complete: true,
                }
            }
            const updateStyle = await taskCollection.updateOne(filter, updateDoc);
            res.send(updateStyle);

        })
        // face error
        // delete item
        app.delete('/list/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await taskCollection.deleteOne(query);
            res.send(item);
        });

    }
    finally {

    }
}
run().catch(console.dir());

app.get('/', (req, res) => {
    res.send('Hello task!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})