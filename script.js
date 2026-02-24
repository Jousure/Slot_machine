class SlotMachine {
    constructor() {
        this.balance = 1000;
        this.betPerLine = 10;
        this.lines = 2;
        this.totalSpins = 0;
        this.lastWin = 0;
        this.isSpinning = false;
        
        this.symbols = ['A', 'B', 'C', 'D'];
        this.symbolValues = { 'A': 5, 'B': 4, 'C': 3, 'D': 2 };
        this.symbolCounts = { 'A': 2, 'B': 4, 'C': 6, 'D': 8 };
        
        this.currentSymbols = [[], [], []];
        this.initializeElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.elements = {
            balance: document.getElementById('balance'),
            betAmount: document.getElementById('betAmount'),
            totalBet: document.getElementById('totalBet'),
            lastWin: document.getElementById('lastWin'),
            totalSpins: document.getElementById('totalSpins'),
            messageText: document.getElementById('messageText'),
            spinBtn: document.getElementById('spinBtn'),
            maxBetBtn: document.getElementById('maxBetBtn'),
            increaseBet: document.getElementById('increaseBet'),
            decreaseBet: document.getElementById('decreaseBet'),
            depositModal: document.getElementById('depositModal'),
            coinSlot: document.querySelector('.coin-slot'),
            lever: document.querySelector('.lever'),
            reels: [
                document.getElementById('reel1'),
                document.getElementById('reel2'),
                document.getElementById('reel3')
            ],
            paylines: [
                document.getElementById('line1'),
                document.getElementById('line2'),
                document.getElementById('line3')
            ]
        };
    }
    
    attachEventListeners() {
        // Spin button
        this.elements.spinBtn.addEventListener('click', () => this.spin());
        
        // Max bet button
        this.elements.maxBetBtn.addEventListener('click', () => this.setMaxBet());
        
        // Bet adjustment
        this.elements.increaseBet.addEventListener('click', () => this.adjustBet(1));
        this.elements.decreaseBet.addEventListener('click', () => this.adjustBet(-1));
        
        // Line selection
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.setLines(parseInt(e.target.dataset.lines)));
        });
        
        // Coin slot for deposit
        this.elements.coinSlot.addEventListener('click', () => this.showDepositModal());
        
        // Lever for spin
        this.elements.lever.addEventListener('click', () => this.spin());
        
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideDepositModal());
        document.getElementById('customDepositBtn').addEventListener('click', () => this.customDeposit());
        
        // Deposit amount buttons
        document.querySelectorAll('.deposit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deposit(parseInt(e.target.dataset.amount)));
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isSpinning) {
                e.preventDefault();
                this.spin();
            } else if (e.code === 'KeyD') {
                this.showDepositModal();
            } else if (e.code === 'KeyM') {
                this.setMaxBet();
            }
        });
    }
    
    adjustBet(direction) {
        const newBet = this.betPerLine + (direction * 5);
        if (newBet >= 1 && newBet <= 100) {
            this.betPerLine = newBet;
            this.updateDisplay();
        }
    }
    
    setLines(numLines) {
        this.lines = numLines;
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.lines) === numLines);
        });
        this.updateDisplay();
    }
    
    setMaxBet() {
        this.betPerLine = 100;
        this.lines = 3;
        document.querySelectorAll('.bet-btn').forEach(btn => {
            btn.classList.toggle('active', parseInt(btn.dataset.lines) === 3);
        });
        this.updateDisplay();
        this.showMessage('MAX BET SET!');
    }
    
    updateDisplay() {
        this.elements.balance.textContent = this.balance;
        this.elements.betAmount.textContent = this.betPerLine;
        this.elements.totalBet.textContent = this.betPerLine * this.lines;
        this.elements.lastWin.textContent = this.lastWin;
        this.elements.totalSpins.textContent = this.totalSpins;
        
        // Update spin button state
        this.elements.spinBtn.disabled = this.isSpinning || this.balance < (this.betPerLine * this.lines);
    }
    
    showMessage(message, duration = 2000) {
        this.elements.messageText.textContent = message;
        setTimeout(() => {
            this.elements.messageText.textContent = 'READY TO PLAY!';
        }, duration);
    }
    
    generateReelResult() {
        const allSymbols = [];
        for (const [symbol, count] of Object.entries(this.symbolCounts)) {
            for (let i = 0; i < count; i++) {
                allSymbols.push(symbol);
            }
        }
        
        const columns = [];
        for (let col = 0; col < 3; col++) {
            const column = [];
            const availableSymbols = [...allSymbols];
            
            for (let row = 0; row < 3; row++) {
                const randomIndex = Math.floor(Math.random() * availableSymbols.length);
                const symbol = availableSymbols.splice(randomIndex, 1)[0];
                column.push(symbol);
            }
            columns.push(column);
        }
        
        return columns;
    }
    
    checkWinnings(columns) {
        let winnings = 0;
        const winningLines = [];
        
        for (let line = 0; line < this.lines; line++) {
            const symbol = columns[0][line];
            let isWinning = true;
            
            for (let col = 1; col < 3; col++) {
                if (columns[col][line] !== symbol) {
                    isWinning = false;
                    break;
                }
            }
            
            if (isWinning) {
                winnings += this.symbolValues[symbol] * this.betPerLine;
                winningLines.push(line);
            }
        }
        
        return { winnings, winningLines };
    }
    
    async spin() {
        if (this.isSpinning) return;
        
        const totalBet = this.betPerLine * this.lines;
        if (this.balance < totalBet) {
            this.showMessage('INSUFFICIENT CREDITS!');
            return;
        }
        
        this.isSpinning = true;
        this.balance -= totalBet;
        this.totalSpins++;
        this.updateDisplay();
        
        // Clear previous paylines
        this.elements.paylines.forEach(line => line.classList.remove('active'));
        
        // Start spinning animation
        this.elements.reels.forEach(reel => reel.classList.add('spinning'));
        this.showMessage('SPINNING...');
        
        // Generate result
        const result = this.generateReelResult();
        
        // Simulate spinning duration
        await this.delay(2000);
        
        // Stop spinning and show result
        this.elements.reels.forEach(reel => reel.classList.remove('spinning'));
        this.displayResult(result);
        
        // Check winnings
        const { winnings, winningLines } = this.checkWinnings(result);
        this.lastWin = winnings;
        
        if (winnings > 0) {
            this.balance += winnings;
            this.showMessage(`WIN! $${winnings} ON LINE(S): ${winningLines.map(l => l + 1).join(', ')}`, 3000);
            
            // Highlight winning lines
            winningLines.forEach(lineIndex => {
                this.elements.paylines[lineIndex].classList.add('active');
            });
        } else {
            this.showMessage('NO WIN - TRY AGAIN!');
        }
        
        this.isSpinning = false;
        this.updateDisplay();
    }
    
    displayResult(columns) {
        for (let col = 0; col < 3; col++) {
            const reel = this.elements.reels[col];
            const symbols = reel.querySelectorAll('.symbol');
            
            for (let row = 0; row < 3; row++) {
                symbols[row].textContent = columns[col][row];
            }
        }
    }
    
    showDepositModal() {
        this.elements.depositModal.classList.add('active');
    }
    
    hideDepositModal() {
        this.elements.depositModal.classList.remove('active');
    }
    
    deposit(amount) {
        if (amount > 0) {
            this.balance += amount;
            this.updateDisplay();
            this.showMessage(`DEPOSITED $${amount}!`);
            this.hideDepositModal();
        }
    }
    
    customDeposit() {
        const input = document.getElementById('customAmount');
        const amount = parseInt(input.value);
        
        if (amount > 0 && amount <= 10000) {
            this.deposit(amount);
            input.value = '';
        } else {
            this.showMessage('INVALID AMOUNT!');
        }
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    // Sound effects (using Web Audio API for simple beeps)
    playSound(type) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'spin':
                oscillator.frequency.value = 200;
                gainNode.gain.value = 0.1;
                break;
            case 'win':
                oscillator.frequency.value = 800;
                gainNode.gain.value = 0.2;
                break;
            case 'lose':
                oscillator.frequency.value = 100;
                gainNode.gain.value = 0.1;
                break;
            case 'bet':
                oscillator.frequency.value = 400;
                gainNode.gain.value = 0.1;
                break;
        }
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SlotMachine();
    
    // Add some ambient animations
    setInterval(() => {
        const title = document.querySelector('.title');
        title.style.transform = `scale(${1 + Math.sin(Date.now() / 1000) * 0.02})`;
    }, 50);
    
    // Create floating particles effect
    function createParticle() {
        const particle = document.createElement('div');
        const colors = ['#ff69b4', '#ffb6c1', '#87ceeb', '#98fb98', '#dda0dd'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: ${randomColor};
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.7;
        `;
        
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        particle.style.left = startX + 'px';
        particle.style.top = startY + 'px';
        
        document.body.appendChild(particle);
        
        let y = startY;
        let opacity = 0.7;
        let speed = 1 + Math.random() * 2;
        let wobble = Math.random() * 2 - 1;
        
        const animate = () => {
            y -= speed;
            opacity -= 0.008;
            const x = parseFloat(particle.style.left) + wobble;
            
            particle.style.top = y + 'px';
            particle.style.left = x + 'px';
            particle.style.opacity = opacity;
            
            if (y > -10 && opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Create particles periodically
    setInterval(createParticle, 500);
    
    // Console easter egg
    console.log('%c� PASTEL SLOTS �', 'color: #ff69b4; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 0 #ffb6c1;');
    console.log('%cWelcome to the cute arcade! Press SPACE to spin, D to deposit, M for max bet.', 'color: #87ceeb; font-size: 12px;');
});
