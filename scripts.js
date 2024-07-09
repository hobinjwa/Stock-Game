const stock_window = document.getElementById('stock-window');
const selectSpeed = document.getElementById('select-speed');
const blocks = [];
let interval;
let to_right = 0;
let lastTop = 200;
let Price = 100;
let balance = 10000;
let shares = 0;
let Variance = 0;

// 모달 요소들
const inputWindow = document.getElementById('input-window');
const close = document.getElementsByClassName('close')[0];
const tradingTitle = document.getElementById('trading-title');
const availableAmount = document.getElementById('available-amount');
const ownedShares = document.getElementById('owned-shares');
const inputAmount = document.getElementById('input-amount');
const inputPrice = document.getElementById('input-price');
const decreaseQuantity = document.getElementById('decrease-quantity');
const increaseQuantity = document.getElementById('increase-quantity');
const quantityInput = document.getElementById('quantity-input'); // 수량 입력 필드
const quantitySlider = document.getElementById('quantity-slider');
const sliderDisplay = document.getElementById('slider-display');
const confirm = document.getElementById('confirm');
const cancel = document.getElementById('cancel');

let currentTransaction = null;
let currentQuantity = 0;

function openModal(transactionType) {
    stopGame(); // 모달이 열릴 때 그래프 생성을 멈춤
    inputWindow.style.display = "block";
    tradingTitle.innerText = transactionType;
    availableAmount.innerText = `${balance.toFixed(2)}원`;
    ownedShares.innerText = `${shares}주`;
    inputPrice.innerText = `${Price.toFixed(2)}원`;
    inputAmount.innerText = `${(Price * currentQuantity).toFixed(2)}원`;
    currentTransaction = transactionType;
    currentQuantity = 0;
    quantityInput.value = currentQuantity;
    quantitySlider.value = 0;
    sliderDisplay.innerText = "0%";
}

// 매수/매도 버튼 이벤트 리스너
document.getElementById('buy-button').addEventListener('click', () => {
    openModal('매수');
});

document.getElementById('sell-button').addEventListener('click', () => {
    openModal('매도');
});

// 모달 닫기 이벤트 리스너
close.addEventListener('click', () => {
    inputWindow.style.display = "none";
    reStartGame(); // 모달이 닫힐 때 그래프 생성을 다시 시작
});

cancel.addEventListener('click', () => {
    inputWindow.style.display = "none";
    reStartGame(); // 모달이 닫힐 때 그래프 생성을 다시 시작
});

// 수량 증가/감소 버튼 이벤트 리스너
decreaseQuantity.addEventListener('click', () => {
    if (currentQuantity > 0) {
        currentQuantity--;
        updateTransactionDetails();
    }
});

increaseQuantity.addEventListener('click', () => {
    currentQuantity++;
    checkQuantityLimit();
    updateTransactionDetails();
});

// 수량 입력 필드 이벤트 리스너
quantityInput.addEventListener('input', () => {
    currentQuantity = parseInt(quantityInput.value) || 0;
    checkQuantityLimit();
    updateTransactionDetails();
});

// 슬라이더 이벤트 리스너
quantitySlider.addEventListener('input', () => {
    const percentage = quantitySlider.value;
    sliderDisplay.innerText = `${percentage}%`;
    if (currentTransaction === '매수') {
        currentQuantity = Math.floor((balance / Price) * (percentage / 100));
    } else if (currentTransaction === '매도') {
        currentQuantity = Math.floor(shares * (percentage / 100));
    }
    checkQuantityLimit();
    updateTransactionDetails();
});

// 수량 한도 확인 함수
function checkQuantityLimit() {
    if (currentTransaction === '매수' && currentQuantity * Price > balance) {
        currentQuantity = Math.floor(balance / Price);
    } else if (currentTransaction === '매도' && currentQuantity > shares) {
        currentQuantity = shares;
    }
}

// 거래 정보 업데이트 함수
function updateTransactionDetails() {
    quantityInput.value = currentQuantity;
    inputAmount.innerText = `${(Price * currentQuantity).toFixed(2)}원`;
}

// 거래 확인 버튼 이벤트 리스너
confirm.addEventListener('click', () => {
    if (currentTransaction === '매수') {
        const totalCost = Price * currentQuantity;
        if (balance >= totalCost) {
            balance -= totalCost;
            shares += currentQuantity;
            updatePortfolio();
        } else {
            alert("잔액 부족");
        }
    } else if (currentTransaction === '매도') {
        if (shares >= currentQuantity) {
            balance += Price * currentQuantity;
            shares -= currentQuantity;
            updatePortfolio();
        } else {
            alert("주식 부족");
        }
    }
    inputWindow.style.display = "none";
    reStartGame(); // 거래가 완료된 후 그래프 생성을 다시 시작
});

function updatePortfolio() {
    document.getElementById('balance').innerText = `잔고: $${balance.toFixed(2)}`;
    document.getElementById('shares').innerText = `보유 주식: ${shares}`;
    availableAmount.innerText = `${balance.toLocaleString()}원`;
    ownedShares.innerText = `${shares.toLocaleString()}주`;
}

function priceChange() {
    const volatility = Math.random() * (Math.random() * (Math.random() * 500 + 10) + 10) + 10;
    const randomChange = (Math.random() - 0.5) * volatility;
    Price += Price * randomChange / 500;
    Variance = randomChange / 500;
    if (randomChange > 0) {
        createBlock('red', true, randomChange);
    } else {
        createBlock('blue', false, randomChange);
    }

    adjustBlocks();
    const stockPriceElement = document.getElementById('stock-price');
    if (Variance > 0) {
        stockPriceElement.innerHTML = `현재 가격: $${Price.toFixed(2)}<span style="color: red;"> +${(Variance * 100).toFixed(2)}%</span>`;
    } else {
        stockPriceElement.innerHTML = `현재 가격: $${Price.toFixed(2)} <span style="color: blue;">${(Variance * 100).toFixed(2)}%</span>`;
    }
}

function createBlock(color, isUp, height) {
    const block = document.createElement('div');
    block.className = `block ${color}-block`;
    block.style.width = '8px';
    height = Math.abs(height);

    if (isUp) {
        lastTop -= height;
    }

    block.style.top = `${lastTop}px`;
    block.style.height = `${height}px`;
    block.style.left = `${to_right}px`;

    stock_window.appendChild(block);
    blocks.push(block);

    if (!isUp) {
        lastTop += height;
    }

    to_right += 8;
    stock_window.scrollLeft = stock_window.scrollWidth;
}

function adjustBlocks() {
    const offset = 200 - parseInt(blocks[blocks.length - 1].style.top);
    blocks.forEach(block => block.style.top = `${parseInt(block.style.top) + offset}px`);
    lastTop += offset;
}

function initGame() {
    while (stock_window.firstChild) {
        stock_window.removeChild(stock_window.firstChild);
    }
    blocks.length = 0;
    Price = 100;
    to_right = 0;
    lastTop = 200;
}

function startGame() {
    initGame();
    interval = setInterval(priceChange, 2000);
}
function reStartGame() {
  interval = setInterval(priceChange, 2000 / parseFloat(selectSpeed.value));
}
selectSpeed.addEventListener('change', () => {
    if (selectSpeed.value == '0') {
        clearInterval(interval);
    } else {
        clearInterval(interval);
        interval = setInterval(priceChange, 2000 / parseFloat(selectSpeed.value));
    }
});

function stopGame() {
    clearInterval(interval);
}

startGame();
