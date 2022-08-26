const chat = (socket) => {
  socket.join(socket.user.username);

  socket.on("message", ({ to, msg }) => {
    // to is recievers username
    socket.to(to).emit("message", {
      msg,
      from: socket.user.id,
      to,
    });
  });
};

module.exports = chat;
