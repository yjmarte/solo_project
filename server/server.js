require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;
const SocketServer = require("./socket.server");

const app = express();

// MONGODB CONNECTION
require("./config/mongoose.config");

// MIDDLEWARE
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

// CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// SOCKET
const http = require("http").createServer(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  SocketServer(socket);
});

// ROUTES
app.use("/api", require("./routes/auth.routes"));
app.use("/api", require("./routes/user.routes"));
app.use("/api", require("./routes/post.routes"));
app.use("/api", require("./routes/notification.routes"));
app.use("/api", require("./routes/comment.routes"));

// INITIALIZE SERVER
app.listen(process.env.PORT, () =>
  console.log(`Server initialized on port ${process.env.PORT}`)
);
