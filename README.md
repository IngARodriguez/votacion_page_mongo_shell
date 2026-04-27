# Sistema de Votación Electrónica — Registraduría Nacional

Aplicación web de votación con Node.js, Express y MongoDB (Atlas / Replica Set / Local).

---

## Arranque rápido

```bash
npm install
node server.js
```

Abrir en: `http://localhost:3000`  
Panel admin: `http://localhost:3000/admin.html` — usuario: `admin` / clave: `registraduria2026`

---

## Cambiar modo de conexión

Editar **una línea** en `server.js`:

```js
const MODO = 'atlas';    // MongoDB Atlas (nube)
const MODO = 'replica';  // Replica set local rs0 (27017-27019 + árbitro 27020)
const MODO = 'local';    // MongoDB nodo único local (27017)
```

---

## Reiniciar el servidor

```powershell
# PowerShell — matar puerto 3000 y reiniciar
$proc = (Get-NetTCPConnection -LocalPort 3000 -State Listen).OwningProcess
Stop-Process -Id $proc -Force
node server.js
```

```bash
# Git Bash
kill $(netstat -ano | grep :3000 | grep LISTEN | awk '{print $5}') 2>/dev/null
node server.js
```

---

## Replica Set Local (rs0)

### Apagar nodos

```bash
mongosh --port 27017 --eval "db.adminCommand({shutdown: 1})"
mongosh --port 27018 --eval "db.adminCommand({shutdown: 1})"
mongosh --port 27019 --eval "db.adminCommand({shutdown: 1})"
mongosh --port 27020 --eval "db.adminCommand({shutdown: 1})"
```

### Encender nodos

```bash
mongod --config "C:\data\nodo1\mongod.cfg"
mongod --config "C:\data\nodo2\mongod.cfg"
mongod --config "C:\data\nodo3\mongod.cfg"
mongod --config "C:\data\arb\mongod.cfg"
```

### Primer arranque — inicializar el replica set

Solo se hace **una vez**. Luego los nodos se reconectan solos al encender.

```js
// 1. Conectar al nodo primario
mongosh --port 27017

// 2. Inicializar con los 3 nodos + árbitro
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017", priority: 10 },
    { _id: 1, host: "localhost:27018", priority: 1 },
    { _id: 2, host: "localhost:27019", priority: 1 },
    { _id: 3, host: "localhost:27020", arbiterOnly: true }
  ]
})
```

### Verificar estado del replica set

```js
// Conectar a cualquier nodo
mongosh --port 27017

// Ver estado de todos los miembros
rs.status().members.forEach(function(m){ print(m.name, m.stateStr) })
```

Resultado esperado:
```
localhost:27017  PRIMARY
localhost:27018  SECONDARY
localhost:27019  SECONDARY
localhost:27020  ARBITER
```

---

## Estructura del proyecto

```
crud_page/
├── index.html               # Página de votación
├── admin.html               # Panel administrativo
├── server.js                # API Express + conexión MongoDB
├── icons/
│   └── fondos_oscuros.svg   # Logo Registraduría
├── package.json
└── .gitignore
```
