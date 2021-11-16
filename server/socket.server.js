let users = [];

const EditData = (data, id, call) => {
  const newData = data.map((item) =>
    item.id === id ? { ...item, call } : item
  );
  return newData;
};

const SocketServer = (socket) => {
  // Like Post
  socket.on("likePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("likeToClient", newPost);
      });
    }
  });

  // Unlike Post
  socket.on("unlikePost", (newPost) => {
    const ids = [...newPost.user.followers, newPost.user._id];
    const clients = users.filter((user) => ids.includes(user.id));

    if (clients.length > 0) {
      clients.forEach((client) => {
        socket.to(`${client.socketId}`).emit("unlikeToClient", newPost);
      });
    }
  });
  // Follow
  socket.on("follow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.sockedId}`).emit("followToClient", newUser);
  });

  // Unfollow
  socket.on("unfollow", (newUser) => {
    const user = users.find((user) => user.id === newUser._id);
    user && socket.to(`${user.sockedId}`).emit("unfollowToClient", newUser);
  });

  // Create Notification
  socket.on("createNotification", (message) => {
    const client = users.find((user) => message.recipients.includes(user.id));
    client &&
      socket
        .to(`${client.socketId}`)
        .emit("createNotificationToClient", message);
  });

  // Remove Notification
  socket.on("deleteNotification", (message) => {
    const client = users.find((user) => message.recipients.includes(user.id));
    client &&
      socket
        .to(`${client.socketId}`)
        .emit("deleteNotificationToClient", message);
  });
};

module.exports = SocketServer;
