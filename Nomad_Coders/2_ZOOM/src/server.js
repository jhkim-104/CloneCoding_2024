import http from "http" // nodejs에 이미 포함되어 있는 패키지라 설치하지 않아도 됩니다.
import {Server} from "socket.io"; // socket.io 패키지 import
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"))
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/")); // "/"만 사용할 것이므로 다른 url 모두 home으로 리다이렉트

const portNumber = 3000;
const handleListen = () => console.log(`Listening on http://localhost:${portNumber}`)

const httpServer = http.createServer(app);  // http 패키지 사용해 서버 생성 (with express)
const wsServer = new Server(httpServer); // socket.io 서버 생성

wsServer.on("connection", (socket) => {
    socket.onAny((event) => { // 미들웨어 추가와 유사
        console.log(`Socket Event: ${event}`); // 발생 이벤트 들을 로깅합니다.
    });
    socket.on("enter_room", (roomName, done) => {
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome"); // 룸 전체에 메시지 전송
    });
})

// const wss = new WebSocket.Server({ server });   // ws server 생성

// const sockets = [];

// wss.on("connection", (socket) => {
//     sockets.push(socket); // 연결된 소켓 저장
//     socket["nickname"] = "Anno"; // 초기값 설정
//     console.log("Connected to Browser ✅");
//     socket.on("close", () => console.log("Disconnected from Browser ❌"));
//     socket.on("message", (msg) => {
//         const message = JSON.parse(msg.toString());
//         switch(message.type) {
//             case "new_message":
//                 sockets.forEach(aSocket => aSocket.send(`${socket.nickname}: ${message.payload}`));
//                 break;
//             case "nickname":
//                 socket["nickname"] = message.payload;
//                 break;
//         }
//     });
// });

httpServer.listen(3000, handleListen);  // server listen