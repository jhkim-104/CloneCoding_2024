// HTML 측의 canvas 태그 element에 접근
const canvas = document.querySelector("canvas");
// 그림을 그리기 위한 context 획득
const ctx = canvas.getContext("2d") // 2d 이외의 나머지 옵션은 3d를 위한 것 
// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =800;
canvas.height = 800;

/* 사람 모양 그리기 */
// 몸통 그리기
ctx.fillRect(210, 200, 15, 100); // 왼쪽 팔
ctx.fillRect(350, 200, 15, 100); // 오른쪽 팔
ctx.fillRect(260, 200, 60, 200); // 몸통
// 얼굴 그리기
ctx.arc( // `arc()`함수는 많은 매개 변수가 사용됩니다.
    290,        // x 좌표
    150,        // y 좌표
    40,         // 반지름의 크기
    0,          // 시작 angle :: 0도
    2 * Math.PI // 끝 angle   :: 360도
);
ctx.fill();
// 눈 그리기
ctx.beginPath(); // 스타일 변경을 위해 Path 분리
ctx.fillStyle = "white"; // 색상 변경 시에는 새로운 path 검토하고 적용 전에 스타일 변경해야 합니다.
ctx.arc(275, 140, 5, 0, 2 * Math.PI);
ctx.arc(305, 140, 5, 0, 2 * Math.PI);
ctx.fill();