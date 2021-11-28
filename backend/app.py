from flask import Flask
from backend.morse_socket.msocket import config_morse_socket


app = Flask(__name__)

ws = config_morse_socket(app)

if __name__ == '__main__':
    ws.run(app, debug=False)
