from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import main
import json
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# Serve static files
@app.route('/<path:filename>')
def serve_static(filename):
    return send_from_directory('.', filename)

class GameState:
    def __init__(self):
        self.balance = 1000
        self.total_spins = 0
        self.last_win = 0
        self.bet_per_line = 10
        self.lines = 2

game_state = GameState()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API routes should come after the static file route

@app.route('/api/spin', methods=['POST'])
def spin():
    try:
        data = request.get_json()
        bet_per_line = data.get('bet_per_line', game_state.bet_per_line)
        lines = data.get('lines', game_state.lines)
        
        total_bet = bet_per_line * lines
        
        if game_state.balance < total_bet:
            return jsonify({
                'success': False,
                'message': 'Insufficient credits',
                'balance': game_state.balance
            })
        
        # Deduct bet
        game_state.balance -= total_bet
        game_state.total_spins += 1
        game_state.bet_per_line = bet_per_line
        game_state.lines = lines
        
        # Generate spin result using existing logic
        columns = main.get_slot_machine_spin(main.ROWS, main.COLS, main.symbol_count)
        winnings, winning_lines = main.check_winnings(columns, lines, bet_per_line, main.symbol_values)
        
        # Update game state
        game_state.last_win = winnings
        game_state.balance += winnings
        
        # Format response
        result = {
            'success': True,
            'columns': columns,
            'winnings': winnings,
            'winning_lines': winning_lines,
            'total_bet': total_bet,
            'balance': game_state.balance,
            'total_spins': game_state.total_spins,
            'last_win': game_state.last_win
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e),
            'balance': game_state.balance
        })

@app.route('/api/deposit', methods=['POST'])
def deposit():
    try:
        data = request.get_json()
        amount = data.get('amount', 0)
        
        if amount <= 0:
            return jsonify({
                'success': False,
                'message': 'Invalid deposit amount'
            })
        
        game_state.balance += amount
        
        return jsonify({
            'success': True,
            'balance': game_state.balance,
            'message': f'Deposited ${amount}'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        })

@app.route('/api/state', methods=['GET'])
def get_state():
    return jsonify({
        'balance': game_state.balance,
        'total_spins': game_state.total_spins,
        'last_win': game_state.last_win,
        'bet_per_line': game_state.bet_per_line,
        'lines': game_state.lines,
        'symbol_values': main.symbol_values,
        'symbol_counts': main.symbol_counts,
        'max_lines': main.MAX_LINES,
        'min_bet': main.MIN_BET,
        'max_bet': main.MAX_BET
    })

@app.route('/api/reset', methods=['POST'])
def reset_game():
    global game_state
    game_state = GameState()
    return jsonify({
        'success': True,
        'message': 'Game reset successfully',
        'balance': game_state.balance
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
