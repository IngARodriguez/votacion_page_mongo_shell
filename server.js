const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
app.use(express.json());
app.use(express.static('.'));

// ── Selecciona el modo de conexión ──────────────────────────────
const MODO = 'atlas'; // 'atlas' | 'replica' | 'local'

const URLS = {
    atlas:   'mongodb://arodriguez_db_user:WbfDlK5S6OzlReNr@ac-1gdtgu0-shard-00-00.ekb6ka9.mongodb.net:27017,ac-1gdtgu0-shard-00-01.ekb6ka9.mongodb.net:27017,ac-1gdtgu0-shard-00-02.ekb6ka9.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority',
    replica: 'mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/?replicaSet=rs0',
    local:   'mongodb://127.0.0.1:27017',
};

const url    = URLS[MODO];
const client = new MongoClient(url);
const dbName = 'test_db';

console.log(`Modo de conexión: ${MODO.toUpperCase()} → ${url.substring(0, 60)}...`);

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
