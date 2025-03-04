import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Permitir qualquer origem (ajuste conforme necessário)
    methods: ["GET", "POST"],
  },
});

interface IChats {
  name: string;
  id: number;
}

const openChats: IChats[] = [];
let chatCount = 0;

app.get("/", (req, res) => {
  res.send("Hello, TypeScript Backend!");
});

app.post("/new-message/:chatid", (req, res) => {
  const { message, user } = req.body;
  const { chatid } = req.params;

  io.emit(`receive-message-${chatid}`, { text: message, userSend: user });
  res.send("teste 1");
});

app.post("/new-chat", (req, res) => {
  const { name } = req.body;

  if (!openChats.some((c) => c.name === name)) {
    const newChat = { id: ++chatCount + 1, name };
    openChats.push(newChat);
    res.json(newChat);
  } else {
    res.status(404).json({ message: "Chat já existente" });
  }
});

app.get("/list-chats", (req, res) => {
  res.json(openChats);
});

app.delete("/clear-chats", (req, res) => {
  openChats.length = 0;
  res.send();
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
