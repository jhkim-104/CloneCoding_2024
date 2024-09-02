const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const cameraSelect = document.getElementById("cameras");
const call = document.getElementById("call");
const chat = document.getElementById("chat");

call.hidden = true;
chat.hidden = true;


let myStream;
let muted = false;
let cameraOff = false;
var roomName;
var nickname;
let myPeerConnection;
let myDataChannel;

async function getCamera() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0]; // 현재 사용중인 카메라 획득
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label === camera.label) { // 앱 실행 시 사용중인 카메라 선택되도록 구현
                option.selected = true;
            }
            cameraSelect.appendChild(option);
        });
    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        // audio: true,
        video: { facingMode: "user" },
    };
    const cameraConstraints = {
        // audio: true,
        video: { deviceId: { exact: deviceId } }, // 특정 카메라 표시하게 강제, 없어도 대체 되지 않습니다.
    };

    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        );
        myFace.srcObject = myStream;
        if (!deviceId) { // 초기화 전 1회만 호출하게 제약하였습니다.
            await getCamera();
        }
    } catch (e) {
        console.log(e);
    }
}

function resetMedia() {
    if (myStream) {
        myStream.getTracks().forEach(track => track.stop());
        myStream = null;
        console.log("Media stream closed.");
    }
}

function handleMuteClick() {
    myStream
        .getAudioTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if (!muted) {
        muteBtn.innerText = "Unmute";
        muted = true;
    } else {
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick() {
    myStream
        .getVideoTracks()
        .forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(cameraSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
            .getSenders()
            .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
cameraSelect.addEventListener("input", handleCameraChange);

// Welcome Form (join a room)

const welcome = document.getElementById("welcome");
const welcomeForm = welcome.querySelector("form");

async function handleMessageSubmit(event) {
    event.preventDefault();
    const input = chat.querySelector("input");
    const value = input.value;
    await myDataChannel.send(`${nickname}: ${value}`);
    addMessage(`You: ${value}`);
    input.value = "";
}

async function initChat() {
    chat.hidden = false;
    const form = chat.querySelector("form");
    form.addEventListener("submit", handleMessageSubmit)
}

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

async function resetChat() {
    chat.hidden = true;
    const ul = chat.querySelector("ul");
    ul.innerHTML = "";
    const form = chat.querySelector("form");
    form.removeEventListener("submit", handleMessageSubmit)
}

async function resetCall() {
    call.hidden = true;
    welcome.hidden = false;
    resetMedia();
    closeConnection();
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const roomNameInput = welcomeForm.querySelector("#roomName");
    const nicknameInput = welcomeForm.querySelector("#nickname");
    await initCall();
    initChat();
    socket.emit("join_room", roomNameInput.value);
    roomName = roomNameInput.value;
    roomNameInput.value = "";
    nickname = nicknameInput.value;
    nicknameInput.value = "";
}

welcomeForm.addEventListener("submit", handleWelcomeSubmit);

// Socket Code

socket.on("welcome", async () => {
    myDataChannel = myPeerConnection.createDataChannel("chat"); // data chnnel 생성
    setDataChannelEvent(myDataChannel);
    console.log("made data channel");
    setPeerConnectrionStateChange(myPeerConnection);

    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
    myPeerConnection.addEventListener("datachannel", (event) => {
        myDataChannel = event.channel;
        setDataChannelEvent(myDataChannel);
    });

    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent the answer");
});

socket.on("answer", (answer) => {
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
});

socket.on("ice", (ice) => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
});

// RTC Code

function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun.l.google.com:5349",
                    "stun:stun1.l.google.com:3478",
                    "stun:stun1.l.google.com:5349",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun2.l.google.com:5349",
                    "stun:stun3.l.google.com:3478",
                    "stun:stun3.l.google.com:5349",
                    "stun:stun4.l.google.com:19302",
                    "stun:stun4.l.google.com:5349",
                ],
            },
        ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
        .getTracks()
        .forEach((track) => myPeerConnection.addTrack(track, myStream));
}

function handleIce(data) {
    console.log("sent candidate");
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data) {
    const peerFace = document.getElementById("peerFace");
    peerFace.srcObject = data.stream;
}

function closeConnection() {
    if (myDataChannel) {
        myDataChannel.close();
        myDataChannel = null;
    }

    if (myPeerConnection) {
        myPeerConnection.close();
        myPeerConnection = null;
    }
}

function addMessage(message) {
    const ul = chat.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function setDataChannelEvent(datachannel) {
    myDataChannel.addEventListener("message", (event) => {
        addMessage(event.data);
    });   
}

function handlePeerDisconnected() {
    resetCall();
    resetChat();
    // console.log("Peer disconnected");
    // alert("상대방이 연결을 종료했습니다.");
    // 추가적인 처리 (예: UI 변경, 연결 종료 등)
}

function handlePeerClosed() {
    console.log("Connection closed");
    // 추가적인 처리 (예: UI 리셋, 재연결 시도 등)
}

function setPeerConnectrionStateChange(peerConnection) {
    peerConnection.addEventListener("connectionstatechange", () => {
        switch(myPeerConnection.connectionState) {
            case "disconnected":
            case "failed":
                // 상대방이 연결을 끊었을 때 처리할 작업
                handlePeerDisconnected();
                break;
            case "closed":
                // 연결이 완전히 종료된 경우
                handlePeerClosed();
                break;
        }
    });
    
}