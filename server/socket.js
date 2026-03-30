const safeCircleRooms = {};

export function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-safe-circle", ({ topic, userId }) => {
      socket.join(`circle-${topic}`);
      if (!safeCircleRooms[topic]) safeCircleRooms[topic] = [];
      safeCircleRooms[topic].push({ socketId: socket.id, userId });
      io.to(`circle-${topic}`).emit("circle-update", {
        topic,
        members: safeCircleRooms[topic].length,
      });
    });

    socket.on("circle-message", ({ topic, message, userId }) => {
      io.to(`circle-${topic}`).emit("new-circle-message", {
        userId: userId.slice(0, 8) + "...",
        message,
        timestamp: new Date(),
      });
    });

    socket.on("join-mentor-chat", ({ roomId }) => {
      socket.join(`mentor-${roomId}`);
    });

    socket.on("mentor-message", ({ roomId, message, sender }) => {
      io.to(`mentor-${roomId}`).emit("new-mentor-message", {
        sender,
        message,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      for (const topic in safeCircleRooms) {
        safeCircleRooms[topic] = safeCircleRooms[topic].filter((u) => u.socketId !== socket.id);
      }
    });
  });
}
