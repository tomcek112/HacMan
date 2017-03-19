from flask import Flask, jsonify, render_template, request
from flask.ext.socketio import SocketIO, emit
import json

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['HOST'] = "0.0.0.0"
socketio = SocketIO(app)


@app.route('/')
def index():
	#global highscore
	return render_template('index.html')

@app.route('/multi/1')
def multi_1():
	#global highscore
	return render_template('multi.html')

@app.route('/multi/2')
def multi_2():
	#global highscore
	return render_template('multi.html')

@app.route('/local')
def local():
	#global highscore
	return render_template('local.html')


@socketio.on('p2 loc', namespace='/p1')
def test_message(message):
    emit('p2 loc down', {'x': message['x'], 'y': message['y']}, broadcast=True)
    print "Player 2: " + str(message['x']) +  " : " + str(message['y'])

@socketio.on('p1 loc', namespace='/p1')
def test_message(message):
    emit('p1 loc down', {'x': message['x'], 'y': message['y']}, broadcast=True)
    print "Player 1: " + str(message['x']) +  " : " + str(message['y'])

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')


if __name__ == '__main__':
    socketio.run(app)


