import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";

const initSocket = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: { origin: "*" },
  });
  io.on("connection", (socket: Socket) => {
    // Each user joins their own room for personal notifications
    socket.on("join-user", (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  return io;
};

export default initSocket;