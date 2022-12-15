import http from "http";
import fs from "fs";
import path from "path";
import { Server } from "socket.io"
import { Socket } from "dgram";

const host = 'localhost'
const port = 3001



const server = http.createServer((req, res) => {
    if (["GET", "POST", "PUT"].includes(req.method)) {

        const filePath = path.join(process.cwd(), "./lessons/message/index.html");
        const rs = fs.createReadStream(filePath);

        rs.pipe(res);
    }
});
const io = new Server(server)

let clients = []

io.on('connection', (client) => {
    clients.push(client)
    const newClient = clients.find(item => item.id == client.id)
    console.log('Websocket connected')

    client.broadcast.emit('server-msg', { msg: `The new client ${newClient.id} connected` })
    client.emit('server-msg', { msg: `number of clients ${clients.length}` })
    client.broadcast.emit('server-msg', { msg: `number of clients ${clients.length}` })
    client.conn.on('close', () => {
        clients = clients.filter(item => item.id !== client.id)
        console.log('close')
        client.broadcast.emit('server-msg', { msg: `The client ${newClient.id} closed. Number of clients ${clients.length}` })
    })
    client.on('client-msg', (data) => {
        client.emit('server-msg', { msg: data.msg })
        client.broadcast.emit('server-msg', { msg: data.msg })
    })
})


server.listen(port, host, () =>
    console.log(`Server running at http://${host}:${port}`)
);