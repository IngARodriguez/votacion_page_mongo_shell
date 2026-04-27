const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
app.use(express.json());
app.use(express.static('.'));

const url = 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/?replicaSet=rs0';
const client = new MongoClient(url);
const dbName = 'test_db';

const crud = {
    async create(data) {
        const db = client.db(dbName);
        return await db.collection('votos').insertOne(data);
    },
    async read() {
        const db = client.db(dbName);
        return await db.collection('votos').find({}).toArray();
    },
    async update(id, data) {
        const db = client.db(dbName);
        return await db.collection('votos').updateOne(
            { _id: new ObjectId(id) },
            { $set: data }
        );
    },
    async delete(id) {
        const db = client.db(dbName);
        return await db.collection('votos').deleteOne({ _id: new ObjectId(id) });
    }
};

app.get('/votos', async (req, res) => {
    await client.connect();
    const lista = await crud.read();
    res.json(lista);
});

app.post('/votos', async (req, res) => {
    await client.connect();
    const nuevo = await crud.create(req.body);
    res.json(nuevo);
});

app.put('/votos/:id', async (req, res) => {
    await client.connect();
    const resultado = await crud.update(req.params.id, req.body);
    res.json(resultado);
});

app.delete('/votos/:id', async (req, res) => {
    await client.connect();
    await crud.delete(req.params.id);
    res.json({ mensaje: 'eliminado' });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));
