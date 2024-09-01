const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; // 최초 페이지 로드 시 메시지 숨기기

let roomName;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);

}

function showRoom() {
    // 룸 입력 숨기고, 메시지 입력 보이기
    welcome.hidden = true;
    room.hidden = false;

    // 룸 제목 설정
    const h3 = room.querySelector("h3");
    h3.innerText = `Room : ${roomName}`;
}

function handleRoomSubmit(event) {
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", () => {
    addMessage("someone joined!");
});