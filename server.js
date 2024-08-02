const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const Datastore = require('nedb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Inisialisasi database
const db = new Datastore({ filename: 'messages.db', autoload: true });

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Kirim semua pesan histori saat ada pengguna baru yang terkoneksi
  db.find({}).sort({ timestamp: 1 }).exec((err, docs) => {
    if (err) {
      console.error('Error fetching messages:', err);
    } else {
      socket.emit('chat history', docs);
    }
  });

  // Simpan pesan ke database dan kirimkan ke semua pengguna
  socket.on('chat message', (msg) => {
    const message = { text: msg, timestamp: new Date() };
    db.insert(message, (err, newDoc) => {
      if (err) {
        console.error('Error saving message:', err);
      } else {
        io.emit('chat message', newDoc);
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
