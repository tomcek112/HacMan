from flask import Flask, jsonify, render_template, request
import json

app = Flask(__name__)



@app.route('/')
def index():
	#global highscore
	return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True,port=5000)


