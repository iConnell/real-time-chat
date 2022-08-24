const chat = (socket) => {
  console.log("Connected");

  socket.join(socket.user.id);

  socket.on("private message", ({ msg, reciepient }) => {
    socket.to(reciepient).to(socket.user.id).emit("private message", {
      msg,
      from: socket.user.id,
      reciepient,
    });
  });
};

module.exports = chat;
