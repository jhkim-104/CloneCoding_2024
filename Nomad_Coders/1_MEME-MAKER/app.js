// HTML 측에서 "file" id elemnt 획득
const fileInput = document.getElementById("file");
// HTML 측에서 "mode-btn" id element 획득
const modeBtn = document.getElementById("mode-btn");
// HTML 측에서 "destroy-btn" id element 획득
const destroyBtn = document.getElementById("destroy-btn");
// HTML 측에서 "erase-btn" id element 획득
const eraseBtn = document.getElementById("eraser-btn");
// HTML 측에서 "color-option" 클래스를 갖는 element를 획득하여 array 배열로 사용
const colorOptions = Array.from(
    document.getElementsByClassName("color-option") 
    // 그대로 사용하면 array가 아니라 foreach 등을 사용할 수 없습니다.
);
// HTML 측의 input 태그 중 "color" element에 접근
const color = document.getElementById("color");
// HTML 측의 input 태그 중 "line-width" element에 접근
const lineWidth = document.getElementById("line-width");
// HTML 측의 canvas 태그 element에 접근
const canvas = document.querySelector("canvas");
// 그림을 그리기 위한 context 획득
const ctx = canvas.getContext("2d") // 2d 이외의 나머지 옵션은 3d를 위한 것 

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
// canvas의 선 설정
ctx.lineWidth = lineWidth.value; // "line-width"의 기본 값을 가져와서 할당하게 구성

let isPainting = false;
let isFilling = false;

function onMouseMove(event) {
    if(isPainting) {
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
        return;
    }
    ctx.moveTo(event.offsetX, event.offsetY);
}
function startPainting(event) {
    isPainting = true;
}
function cancelPainting(event) {
    isPainting = false;
    ctx.beginPath(); // 그리기 종료 시 기존 path와 구분되게 새 path를 설정합니다.
}
function onCanvasClick(event) {
    if(isFilling) {
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
}

function onLineWidthChange(event) {
    ctx.lineWidth = event.target.value;
}
function onColorChange(event) {
    ctx.strokeStyle = event.target.value; // 선의 색상을 설정
    ctx.fillStyle = event.target.value; // 채우기 색상을 설정
}

function onColorClick(event) {
    // console.dir(event.target);  // event.target으로 클릭된 element를 확인할 수 있습니다.
    //                             // console.dir로 element를 상세히 볼 수 있습니다.

    // 선택된 color 획득
    const colorValue = event.target.dataset.color; 

    ctx.strokeStyle = colorValue; // 선의 색상을 설정
    ctx.fillStyle = colorValue; // 채우기 색상을 설정
    color.value = colorValue; // color input의 색상도 변경
}

function onModeClick() {
    if(isFilling) {
        isFilling = false;
        modeBtn.innerText = "Fill";
    } else {
        isFilling = true;
        modeBtn.innerText = "Draw";
    }
}

function onDestroyClick() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0,  CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onEraserClick() {
    // 선의 색상을 하얀색으로 변경합니다.
    ctx.strokeStyle = "white";
    // 채우기 모드인 경우일 수 있으니 그리기 모드로 변경 시킵니다.
    isFilling = false;
    modeBtn.innerText = "Fill";
}

function onFIleChange(event) {
    // console.dir(event.taget); // 파일 선택 시 event로 전달되는 사항 확인 

    const file = event.target.files[0]; // 사용자가 선택한 파일 객체에 접근합니다.
    const url = URL.createObjectURL(file); // 파일 객체에서 파일에 접근 가능한 URL을 획득합니다.
    // console.log(url); // 출력되는 "blob:http://~"를 브라우저에 접근이 가능합니다.
    const image = new Image(); // HTML의 <image> 태그를 생성하듯 image elemnt를 생성합니다.
    image.src = url;
    image.onload = function() { // image element에 이미지가 로드된 경우 호출되는 이벤트를 등록합니다.
        ctx.drawImage( // 캔버스에 이미지를 그립니다.
            image, // image 객체를 등록합니다.
            0, // 시작 x좌표
            0, // 시작 y좌표
            CANVAS_WIDTH,  // width 크기
            CANVAS_HEIGHT, // height 크기
        ); 
        fileInput.value = null; // 사진을 사용한 뒤 fileInput의 값을 비웁니다. 이는 새로운 값 입력이 가능하게 수정됩니다.
    }
}

canvas.addEventListener("mousemove", onMouseMove);
// canvas.onmousemove = onMouseMove; // 위와 같이 `addEventListener()`를 사용한 것과 같은 동작을 합니다.
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

// 각 color element에 이벤트 리스너 등록
colorOptions.forEach(color => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraserClick);

fileInput.addEventListener("change", onFIleChange);