"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
        credentials: true
    }
});
// const corsOptions = {
//   origin: 'http://localhost:3000/'
// }
// app.use(cors(corsOptions))
const PORT = 8000;
app.get('/', (req, res) => {
    res.send('Web Meeting App is running');
});
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
    socket.on('sending-signal', (payload) => {
        io.to(payload.userToSignal).emit('receiving-signal', payload);
    });
    socket.on('returning-signal', (payload) => {
        io.to(payload.userId).emit('receiving-returned-signal', payload);
    });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
