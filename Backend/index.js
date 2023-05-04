const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running.");
});

function covertX() {
  var gx = [];
  groups.forEach((item) => {
    gx.push({ gId: item.gId, name: item.name, key: item.key });
  });
  return gx;
}

//Setup video call peer signal
var peers = {};
var groups = [];

io.on("connection", (socket) => {
  peers[socket.id] = socket;

  console.log(socket.id);
  // socket.on("CreateRoom", (data) => {
  //   roomx = {
  //     gId: groups.length + 1,
  //     name: data,
  //     key: socket.id,
  //     gpeers: {},
  //   };
  //   roomx.gpeers[socket.id] = socket;
  //   groups.push(roomx);
  //   io.emit("Svs_getRoom", covertX());
  //   console.log(groups);

  //   // groups.forEach((item, index)=>{
  //   //   console.log(item.gId)
  //   // })
  // });
  socket.on("joinRoom", (data) => {
    ix = 0;
    isExistRoom = false;
    console.log(data);
    groups.forEach((item, index) => {
      if (item.name === data.gId) {
        item.gpeers[socket.id] = socket;
        ix = index;
        isExistRoom = true;
        console.log("join room sucess " + data.gId);
      }
    });

    if (!isExistRoom) {
      roomx = {
        gId: groups.length + 1,
        name: data.gId,
        key: socket.id,
        gpeers: {},
      };
      roomx.gpeers[socket.id] = socket;
      groups.push(roomx);
      ix = -1;
      socket.broadcast.emit("Svs_getRoom", covertX());
    }
    console.log("ix-" + ix);
    console.log(groups);
    socket.emit("joinRoomSucess", ix);
  });

  socket.on("getRoom", () => {
    // console.log(groups)

    socket.emit("Svs_getRoom", covertX());
  });

  socket.on("clientReady", (data) => {
    for (let id in peers) {
      if (id === socket.id) continue;
      console.log("sending init re to " + socket.id);
      peers[id].emit("initReceive", socket.id);
    }
  });

  socket.on("clientReadyGroup", (data) => {
    console.log("clinetReadyGroup" + data);
    for (let id in groups[data].gpeers) {
      if (id === socket.id) continue;
      console.log("sending init re to" + socket.id);
      groups[data].gpeers[id].emit("initReceive", socket.id);
    }
  });

  socket.on("signal", (data) => {
    console.log("sending singnal from " + socket.id + " to "+ data.socket_id);
    if (!peers[data.socket_id]) return;
    peers[data.socket_id].emit("signal", {
      socket_id: socket.id,
      signal: data.signal,
    });
    // console.log("sending singnal from " + socket.id + " to ");
  });

  socket.on("outRoom", (data) => {
    groups.forEach((item, index) => {
      if (item.gId == data) {
        for (let id in item.gpeers) {
          if ((socket.id = id)) continue;
          item.gpeers[id].emit("removePeer", socket.id);
        }
        delete item.gpeers[socket.id];
        if (item.gpeers.length == 0) {
          groups.splice(index, 1);
        }
      }
    });
  });

  socket.on("send_message", (data) => {
    // console.log(data.gId)
    let crtime = new Date();
    data.time =
      crtime.getHours().toString() + ":" + crtime.getMinutes().toString();
    console.log(data.time);
    groups.forEach((item, index) => {
      if (item.name == data.gId) {
        for (let id in item.gpeers) {
          if (id == socket.id) continue;
          // console.log(data)
          item.gpeers[id].emit("message", data);
        }
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("sk disconnect " + socket.id);
    socket.broadcast.emit("removePeer", socket.id);
    delete peers[socket.id];
    groups.forEach((item, index) => {
      delete item.gpeers[socket.id];
      if (item.gpeers.length == 0) {
        groups.splice(index, 1);
      }
    });
  });

  socket.on("initSend", (init_socket_id) => {
    console.log("INIT SEND by " + socket.id + " for " + init_socket_id);
    peers[init_socket_id].emit("initSend", socket.id);
  });

  socket.on("sendImg", (data) => {
    let crtime = new Date();
    data.time =
      crtime.getHours().toString() + ":" + crtime.getMinutes().toString();
    groups.forEach((item, index) => {
      if (item.name == data.gId) {
        for (let id in item.gpeers) {
          if (id == socket.id) continue;
          item.gpeers[id].emit("sendImg", data);
        }
      }
    });
  });
});
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
