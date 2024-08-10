// HTML 측의 canvas 태그 element에 접근
const canvas = document.querySelector("canvas");
// 그림을 그리기 위한 context 획득
const ctx = canvas.getContext("2d") // 2d 이외의 나머지 옵션은 3d를 위한 것 
// css에서 설정한 canvas의 크기를 알려줍니다. 
canvas.width =800;
canvas.height = 800;

/* 집 모양 그리기 */
// 벽 그리기
ctx.fillRect(200, 200, 50, 200); //   왼쪽 벽
ctx.fillRect(400, 200, 50, 200); // 오른쪽 벽
// 문 그리기
ctx.lineWidth = 2; // 문의 두께 변경
// 중요! : 스타일 변경은 실제 그리기 전에 진행되어야 합니다.
ctx.fillRect(300, 300, 50, 100); // 문
// 천장 그리기
ctx.fillRect(200, 200, 200, 20); // 천장
// 지붕 그리기 (삼각형)
ctx.moveTo(200, 200); // 좌측 시작점으로 이동
ctx.lineTo(325, 100); // 중앙 위쪽으로 그리기
ctx.lineTo(450, 200); // 우측 종료점까지 그리기
ctx.fill(); // 지붕 채우기
