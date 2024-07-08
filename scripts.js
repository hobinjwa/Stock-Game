const stock_window = document.getElementById('stock-window'); // 게임 컨테이너 요소 선택
const selectSpeed = document.getElementById('select-speed');
const blocks = []; // 생성된 블록들을 저장할 배열
let interval; // 게임 루프를 위한 인터벌 변수
let to_right = 0; // 현재 블록의 가로 위치
let lastTop = 200; // 이전 블록의 top 위치 초기값 설정

// 주식 가격 상승/하락에 따른 블록 생성 함수
function priceChange() {
  // 변동성을 무작위로 설정하여 주식 가격 변동 시뮬레이션
  volatility = Math.random()*(Math.random() * (Math.random()*500+10)+10)+10;
  const randomChange = (Math.random() - 0.5) * volatility; // 변동성을 고려한 가격 변동
  
  // 가격 변동에 따라 블록 생성
  if (randomChange > 0) {
    createBlock('red', true, randomChange); // 가격 상승 시 빨간 블록 생성
  } else {
    createBlock('blue', false, randomChange); // 가격 하락 시 파란 블록 생성
  }
  
  adjustBlocks(); // 블록 위치 조정
}

// 블록 생성 함수
function createBlock(color, isUp, height) {
  const block = document.createElement('div'); // 새 div 요소 생성
  block.className = `block ${color}-block`; // 클래스 설정으로 색상 지정
  block.style.width = '8px'; // 블록 너비 설정
  height = Math.abs(height); // 높이는 양수로 처리

  // 상승 또는 하락에 따라 top 위치 조정
  if (isUp) {
    lastTop -= height; // 상승 시, top 위치를 위로 이동
  }

  // 블록 스타일 설정
  block.style.top = `${lastTop}px`;
  block.style.height = `${height}px`;
  block.style.left = `${to_right}px`;

  // 블록을 게임 컨테이너에 추가하고 배열에 저장
  stock_window.appendChild(block);
  blocks.push(block);

  // 하락 시, top 위치를 아래로 이동
  if (!isUp) {
    lastTop += height;
  }

  to_right += 8; // 다음 블록이 오른쪽에서 시작하도록 left 값 증가
  stock_window.scrollLeft = stock_window.scrollWidth; // 스크롤을 오른쪽 끝으로 이동
}

// 모든 블록의 위치를 중앙으로 맞추기 위한 함수
function adjustBlocks() {
  const offset = 200 - parseInt(blocks[blocks.length - 1].style.top); // 중앙 정렬을 위한 오프셋 계산
  blocks.forEach(block => block.style.top = `${parseInt(block.style.top) + offset}px`); // 각 블록의 top 위치 조정
  lastTop += offset; // 마지막 블록의 top 위치 업데이트
}

// 게임 시작 시 초기화 함수
function initGame() {
  // 기존 블록들 제거
  while (stock_window.firstChild) {
    stock_window.removeChild(stock_window.firstChild);
  }
  blocks.length = 0; // 블록 배열 초기화
  price = 100; // 주식 가격 초기화
  to_right = 0; // 가로 위치 초기화
  lastTop = 200; // top 위치 초기값 재설정
} 

// 게임 시작 함수
function startGame() {
  initGame(); // 게임 초기화
  interval = setInterval(priceChange, 2000); // 1초마다 주식 가격 변동 및 블록 생성
}
selectSpeed.addEventListener('change', () => {
  clearInterval(interval); 
  interval = setInterval(priceChange,2000/parseFloat(selectSpeed.value));
  if(selectSpeed.value === '0') {
    clearInterval(interval);
  }
});

// 게임 종료 함수
function stopGame() {
  clearInterval(interval); // 인터벌 중지
}

// 게임 시작
startGame();

