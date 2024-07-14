const io = require('socket.io')(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

io.on('connection', socket => {
  socket.on('get-document', documentId => {
    const data = ""
    socket.join(documentId) // putting a client inside this socket into its own room - everyone in the room can talk to each other if they have the same roomId (which is the same as our docuemtId)
    socket.emit('load-document', data)
    socket.on('send-changes', delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta) // tell everyone else except for us that there are some changes they should receive
    })
  })
})

// quill makes incremental changes instead of copy pasting the whole document evertime a change is made