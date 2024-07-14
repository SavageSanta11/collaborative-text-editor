const io = require('socket.io')(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => {
  socket.on('send-changes', delta => {
    socket.broadcast.emit("receive-changes", delta) // tell everyone else except for us that there are some changes they should receive
  })
})

// quill makes incremental changes instead of copy pasting the whole document evertime a change is made