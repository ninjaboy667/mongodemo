import express from 'express';
import { MongoClient } from 'mongodb';
import os from 'os'

const app = express();
const port = 3000;

const uri = 'mongodb://127.0.0.1:27017/DYNODB'; // Specify the database name here
const collectionName = 'DynoRecords'; // Specify the collection name here

const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB server');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

connectToMongoDB();

app.get('/data', async (req, res) => {
    try {
        const database = client.db();
        const collection = database.collection(collectionName);

        const document = await collection.findOne();

        if (!document) {
            return res.status(404).json({ error: 'No document found in the collection' });
        }

        res.json(document.snapshot);
    } catch (error) {
        console.error('Error retrieving document from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.use(express.static('public')); // Serve static files from the 'public' directory

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});


function getLocalIpAddress() {
    const ifaces = os.networkInterfaces();
    let localIpAddress = '';

    Object.keys(ifaces).forEach((ifname) => {
        ifaces[ifname].forEach((iface) => {
            // Skip over internal and non-IPv4 addresses
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }

            localIpAddress = iface.address;
        });
    });

    return localIpAddress;
}

const lanIpAddress = getLocalIpAddress();
console.log('LAN IP Address:', lanIpAddress);