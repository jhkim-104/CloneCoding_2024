// HTML 측의 canvas 태그 element에 접근
const canvas = document.querySelector("canvas");
// 그림을 그리기 위한 context 획득
const ctx = canvas.getContext("2d") // 2d 이외의 나머지 옵션은 3d를 위한 것 
// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =800;
canvas.height = 800;

// 사각형 그리기
// ctx.fillRect(50, 50, 100, 200)
// 사각형 그리기 (분리)
ctx.rect(50, 50, 100, 100)
ctx.rect(150, 150, 100, 100)
ctx.rect(250, 250, 100, 100)
ctx.fill();

ctx.beginPath(); // 새 경로 생성하여 기존의 경로와 분리
ctx.rect(350, 350, 100, 100)
ctx.rect(450, 450, 100, 100)
ctx.fillStyle = "red";
ctx.fill();
