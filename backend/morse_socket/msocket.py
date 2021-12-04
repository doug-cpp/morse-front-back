from flask_socketio import SocketIO, emit

from backend.resources.constants import SOCKET_CONNECTED, WELLCOME_MESSAGE
from backend.resources.morse_interpreter import Interpreter


def config_morse_socket(app):

    ws = SocketIO(app, async_mode=None, cors_allowed_origins="*")

    @ws.on('morseEvt', namespace='/morse')
    def receive_message(message):
        if message['data'] == SOCKET_CONNECTED:
            emit('morseEvtResponse', {'data': WELLCOME_MESSAGE}, broadcast=True)
        else:
            emit('morseEvtResponse', {'data': Interpreter.text(message['data'])}, broadcast=True)

    return ws
