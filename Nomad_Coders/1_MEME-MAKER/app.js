// HTML 측의 canvas 태그 element에 접근
const canvas = document.querySelector("canvas");
// 그림을 그리기 위한 context 획득
const ctx = canvas.getContext("2d") // 2d 이외의 나머지 옵션은 3d를 위한 것 
// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =800;
canvas.height = 800;

// 사각형 그리기 (수동)
//ctx의 브러시는 모두 (0, 0)에서 시작합니다.
ctx.moveTo(50, 50)    // 브러시 위치를 (50, 50)으로 옮깁니다.
ctx.lineTo(150, 50);  // ( 50,  50)에서 (150,  50)으로 선을 그리기
ctx.lineTo(150, 150); // (150,  50)에서 (150, 150)으로 선을 그리기
ctx.lineTo(50, 150);  // (150, 150)에서 ( 50, 150)으로 선을 그리기
ctx.lineTo(50, 50);   // ( 50, 150)에서 ( 50,  50)으로 선을 그리기
// ctx.stroke();
ctx.fill();
