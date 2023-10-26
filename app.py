from boggle import Boggle
from flask import Flask, request, render_template, redirect, session, jsonify


app = Flask(__name__)
app.secret_key = 'firstapp'


boggle_game = Boggle()
times_played = 0
highest_score = 0


@app.route('/')
def index():
    board = boggle_game.make_board()
    session['board'] = board  

    session.setdefault('games_played', 0)
    session.setdefault('high_score', 0)

    return render_template('play.html', board=board)


@app.route('/check-word', methods=['GET'])
def check_word():
    guess = request.args['word']
    board = session['board']
    
    response = boggle_game.check_valid_word(board, guess)

    if not guess:
        return jsonify({'error': 'No word parameter provided'}), 400
    
    return jsonify({'result': response})


@app.route('/update-score', methods=['POST'])
def update_score():
    current_score = request.json.get('score', 0)
    
    session['games_played'] += 1

    if current_score > session['high_score']:
        session['high_score'] = current_score

    return jsonify({
        'status': 'success',
        'high_score': session['high_score'],
        'games_played': session['games_played']
    })

@app.route('/get-new-board', methods=['GET'])
def get_new_board():
    board = boggle_game.make_board()
    session['board'] = board  
    return jsonify({'board': board})


