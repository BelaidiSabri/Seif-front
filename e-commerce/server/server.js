const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const User = require('./models/User.model');
const Chat = require('./models/Chat.model');
const UserRoute = require('./routes/UserRoute');
const ChatRoute = require('./routes/ChatRoute');
const ProductRoute = require('./routes/ProductRoute');
const ExchangeRoute = require('./routes/ExchangeRoute');
const DonationRoute = require('./routes/DonationRoute');
const NotificationRoute = require('./routes/NotificationRoute');
const TransactionRoute = require('./routes/TransactionRoute');

const path = require('path');
require('./db/cnx'); // Ensure your DB connection is set up here

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000', // Update this to your React app's URL
    methods: ['GET', 'POST']
  }
});

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


let users = [];
app.use("/user", UserRoute);
app.use("/chat" , ChatRoute);
app.use('/product', ProductRoute);
app.use('/', ExchangeRoute);
app.use('/', DonationRoute);
app.use('/notifications', NotificationRoute);
app.use('/donation', DonationRoute);
app.use('/transactions', TransactionRoute);



io.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Handle new user connection
  socket.on('newUser', async (data) => {
    const user = await User.findById(data.userId);
    if (user) {
      // Check if user is already in the array
      const existingUserIndex = users.findIndex(user => user.userId === data.userId);
      if (existingUserIndex !== -1) {
        // Update socket ID if user already exists
        users[existingUserIndex].socketID = socket.id;
      } else {
        // Add new user
        users.push({ userId: data.userId, socketID: socket.id });
      }
      console.log("users", users);
      io.emit('newUserResponse', users);
    }
  });

  // Handle sending and receiving messages
  socket.on('message', async (data) => {
    const chat = new Chat({
      sender: data.sender,
      receiver: data.receiver,
      message: data.message
    });
    await chat.save();
   
    const receiverSocket = users.find(user => user.userId ===  data.receiver)?.socketID;
    console.log(data.receiver)
    if (receiverSocket) {
      io.to(receiverSocket).emit('messageResponse', data);
    }
    io.to(socket.id).emit('messageResponse', data);
  });

  // Handle user disconnection
  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter(user => user.socketID !== socket.id);
    io.emit('newUserResponse', users);
    console.log(users)
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
