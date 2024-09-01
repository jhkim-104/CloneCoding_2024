const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true; // 최초 페이지 로드 시 메시지 숨기기

let roomName;
let nickname;

var userCount = 0;

function addMessage(message) {
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
        addMessage(`You: ${value}`);
    });
    input.value = "";
}

function roomStatusChange() {
    // 룸 제목 설정
    const h3 = room.querySelector("h3");
    h3.innerText = `
    Room : ${roomName}\n 
    User Count : ${userCount}\n 
    Nickname : ${nickname}\n`;
}

function showRoom() {
    // 룸 입력 숨기고, 메시지 입력 보이기
    welcome.hidden = true;
    room.hidden = false;

    roomStatusChange();

    // 이벤트 등록
    const form = room.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit);    
}

function handleRoomAndNicknameSubmit(event) {
    event.preventDefault();
    const roomNameInput = form.querySelector("input#room_name");
    const nicknameInput = form.querySelector("input#nickname");

    roomName = roomNameInput.value;
    nickname = nicknameInput.value;
    roomNameInput.value = "";
    nicknameInput.value = "";

    socket.emit("enter_room", roomName, nickname, showRoom);
}

form.addEventListener("submit", handleRoomAndNicknameSubmit);

socket.on("welcome", (joinUser) => {
    addMessage(`${joinUser} arrived!`);
});

socket.on("bye", (leftUser) => {
    addMessage(`${leftUser} left ㅠㅠ`);
});

socket.on("user_count_change", (updateUserCount) => {
    userCount = updateUserCount;
    
    roomStatusChange();
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = ""; // 기존 목록 비우기
    rooms.forEach(room => { // 새 목록 채우기
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);        
    });
});