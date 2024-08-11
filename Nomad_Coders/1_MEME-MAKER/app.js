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
// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =800;
canvas.height = 800;
// canvas의 선 설정
ctx.lineWidth = lineWidth.value; // "line-width"의 기본 값을 가져와서 할당하게 구성

let isPainting = false;
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

canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);

lineWidth.addEventListener("change", onLineWidthChange);
color.addEventListener("change", onColorChange);

// 각 color element에 이벤트 리스너 등록
colorOptions.forEach(color => color.addEventListener("click", onColorClick));