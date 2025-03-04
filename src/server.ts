import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const PORT = 3000;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Permitir qualquer origem (ajuste conforme necessário)
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Backend!");
});

server.listen(PORT, () => {
  const address = server.address();
  console.log(`Servidor rodando em :`);
  console.log(address);
});

io.on("connection", (socket) => {
  console.log("Cliente WebSocket conectado, id:", socket.id);

  socket.on("message", (message) => {
    console.log(`Mensagem recebida: ${message}`);
  });

  socket.on("close", () => console.log("Cliente WebSocket desconectado"));
});
