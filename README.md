# 🎰 Pixel Slot Machine

A retro arcade-style slot machine with pixelated graphics and web interface.

## 🚀 Quick Start

### Setup Virtual Environment
```bash
# Create virtual environment
python -m venv env

# Activate virtual environment
# Windows:
env\Scripts\activate
# Mac/Linux:
source env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run the Game
```bash
python app.py
```

## 🎮 Game Features

- **Retro arcade design** with pixelated aesthetics
- **3x3 slot reels** with spinning animations
- **Interactive controls** (lever, coin slot, buttons)
- **Betting system** with line selection (1-3 lines)
- **Visual payline indicators** for winning combinations
- **Deposit system** for adding credits
- **Statistics tracking** (spins, wins, balance)
- **Keyboard shortcuts** (Space to spin, D to deposit, M for max bet)

## 🎯 Controls

- **SPIN Button** or **Lever**: Start spinning
- **Line Buttons**: Select 1, 2, or 3 lines to bet on
- **Bet +/-**: Adjust bet per line ($1-$100)
- **MAX BET**: Set maximum bet (3 lines, $100 per line)
- **Coin Slot**: Add more credits
- **Keyboard Shortcuts**:
  - `Space`: Spin
  - `D`: Deposit
  - `M`: Max bet

## 🔧 Dependencies

- **Flask 2.3.3** - Web framework
- **Flask-CORS 4.0.0** - Cross-origin resource sharing

## 🎮 Game Rules

1. **Select Lines**: Choose 1-3 horizontal lines to bet on
2. **Set Bet**: Choose bet amount per line ($1-$100)
3. **Spin**: Match symbols across selected lines to win
4. **Payouts**: 
   - A symbols: 5x bet
   - B symbols: 4x bet  
   - C symbols: 3x bet
   - D symbols: 2x bet

Enjoy the retro arcade experience! 🕹️