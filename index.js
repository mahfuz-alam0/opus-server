const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3njemyu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// opus
// kkpFLRyUO5Xu68AF


async function run() {
    try {
        const Heading = client.db('Opus').collection('Heading');
        const emails = client.db('Opus').collection('emails');

        app.get('/heading', async (req, res) => {
            const query = {};
            const users = await Heading.find(query).toArray();
            res.send(users);
        });

        app.get('/emails', async (req, res) => {
            const query = {};
            const users = await emails.find(query).toArray();
            res.send(users);
        });

        app.post('/email', async (req, res) => {
            const email = req.body;
            
            const stored_email = await emails.findOne({ email: email.email });
           
            if (stored_email?.email === email.email) {
                res.json({ message: 'Email already exists' });
                
            } else {
                const result = await emails.insertOne(email);
                res.json(result);
            }
        });

        app.patch('/heading/:id', async (req, res) => {
            const query = { _id: ObjectId(req.params.id) };
            const updateDoc = { $set: req.body };
            const result = await Heading.updateOne(query, updateDoc);
            res.send(result);
        });
        
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});