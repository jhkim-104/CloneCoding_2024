const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type,payload) {
    const msg = { type, payload };
    return JSON.stringify(msg);
}

socket.addEventListener("open", () => {
    console.log("Connected to Server ✅");
});
socket.addEventListener("message", (message) => {
    const li = document.createElement("li"); // li 태그 생성
    li.innerText = message.data; // 수신 받은 데이터로 채우기
    messageList.append(li); // ul 태그에 삽입하여 표시
});

socket.addEventListener("close", () => {
    console.log("Disconnected from Server ❌");
});

function handleSubmiut(event) {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    socket.send(makeMessage("new_message", input.value)); // 메시지 전송
    input.value = ""; // input 내용 비우기
}

function handleNickSubmit(event) {
    event.preventDefault();
    const input = nickForm.querySelector("input");
    socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmiut);
nickForm.addEventListener("submit", handleNickSubmit);