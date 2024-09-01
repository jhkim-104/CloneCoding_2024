import http from "http" // nodejs에 이미 포함되어 있는 패키지라 설치하지 않아도 됩니다.
import { Server as SocketIO } from "socket.io"; // socket.io 패키지 import
const { instrument } = require("@socket.io/admin-ui");
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); // "/"만 사용할 것이므로 다른 url 모두 home으로 리다이렉트

const httpServer = http.createServer(app);  // http 패키지 사용해 서버 생성 (with express)
const wsServer = new SocketIO(httpServer, {
    cors: {
        origin: ["https://admin.socket.io"], // socket.io의 데모를 사용하기 위해 cors 허용 처리
        credentials: true,
    },
}); // socket.io 서버 생성
instrument(wsServer, { // admin ui 사용하도록 허용
    auth: false, // 추후 비밀번호 사용 가능합니다.
    mode: "development",
});

wsServer.on("connection", (socket) => {
    socket.on("join_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome");
    });
    socket.on("offer", (offer, roomName) => {
        socket.to(roomName).emit("offer", offer);
    });
});

const portNumber = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${portNumber}`)
httpServer.listen(3000, handleListen);  // server listen