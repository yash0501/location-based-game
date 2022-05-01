const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const http = require("http");
const app = express();
const { addUser } = require("./utils/index");
const models = require("./models");
const User = models.User;

const PORT = config.PORT;
const DB_URL = config.DB_URL;
app.use(cors());
app.use(express.static("public"));

const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("setUserLocation", (data) => {
    console.log("setUserLocation");
    console.log(typeof(data))
    console.log(data, "data");
    let position = data.lastIndexOf(',')
    console.log('position',position)
    console.log('length',data.length)
    let length = data.length
    console.log(data.substr(position+11,length-2))
    let teamId = data.substr(position+11,length-2)
    teamId = teamId.slice(0,-2)
    console.log(teamId)
    // data = JSON.stringify(data)
  //  let updata = JSON.parse(data)
  //  console.log(typeof(updata))
    // const { teamId, str } = data;
    // const { teamId, str } = ;
    // console.log(updatadata.substr(0,5))
    // console.log(updatadata['str']);
    // console.log(updatadata.teamId)
    // console.log(updatadata['teamId'])
    socket.join(teamId)
    socket.broadcast.to(teamId).emit("user-joined", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// const user = await User.findOne({ _id: userId });

// socket.on("join-room", (data) => {
//   // console.log(data);
//   // socket.join(data.teamId);
//   // socket.broadcast.to(data.teamId).emit("user-joined", data);
// });

mongoose.connect(DB_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

/*
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
});
*/
console.log(DB_URL);
// console.log(server);

// server.listen(PORT, () => {
//   // connect to mongoDB
//
// });

app.use(express.json());
app.get("/home", (req, res) => {
  res.send("Hello World!");
});
app.use("/", routes);

// create a mapping

// const ioServer = io.listen(server);
// ioServer.on("connection", (socket) => {
//   console.log("Client connected");
//   socket.on("disconnect", () => {
//     console.log("Client disconnected");
//   });
// });

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
