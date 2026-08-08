const io = require("socket.io-client");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./backend/.env" });

const secret = process.env.JWT_SECRET || 'secret-key-super-aman';
const token = jwt.sign({ id: 23, email: 'test@example.com' }, secret);

const socket = io("http://localhost:5001", {
  auth: { token: token }
});

socket.on("connect", () => {
  console.log("Connected successfully!");
  socket.emit("send_message", {
    receiverId: 13,
    encryptedContentForReceiver: "test1",
    encryptedContentForSender: "test2"
  });
});

socket.on("message_sent_success", (msg) => {
  console.log("Success:", msg);
  process.exit(0);
});

socket.on("message_error", (err) => {
  console.error("Error:", err);
  process.exit(1);
});

socket.on("connect_error", (err) => {
  console.error("Connect Error:", err.message);
  process.exit(1);
});
