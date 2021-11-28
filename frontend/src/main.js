import { io } from 'socket.io-client'

import { morseRegex } from './morseDict.js'

export default function clientSocket()
{
    const socket = io('http://127.0.0.1:5000/morse');

    // ----------------------------------------------------------------------------

    // User interface elements filled after loading:
    let morseContainer = null;
    let userInput = null;
    let morseMonitor = null;
    let userHelperText = null;

    // ----------------------------------------------------------------------------

    /**
     * Handles the socket and auto-starts the connection
     */
    function configSocket() {

        socket.on('connect', _ => {
            socket.emit('morseEvt', {data: "socket_connected"});
            console.log('Connected with id: ', socket.id)
        } );

        socket.on('morseEvtResponse', (msg, callBack) => {
            renderDecodedResponse(msg.data);
            if (callBack) callBack();
        });
    }

    // ----------------------------------------------------------------------------

    /**
     * Given the received socket message, render its content into the
     * "black monitor"
     * @param {string} msg
     */
    function renderDecodedResponse(msg) {
        morseMonitor.append(msg);

        const scrollVal = morseMonitor.scrollHeight || 0;
        morseMonitor.scrollTop = scrollVal;
    }

    // ----------------------------------------------------------------------------

    /**
     * Receives an morse-code message from the user input and sends it
     * via socket emit
     * @param {string} data
     */
    function sendUserData(data) {
        morseMonitor.innerHTML += `<br/>[${data}] : `;
        socket.emit('morseEvt', {data});
    }

    // ----------------------------------------------------------------------------

    /**
     * Manage the user input to send only a valid morse code
     * @param {KeyboardEvent} event
     * @returns
     */
    function handleUserInput(event) {
        const typed = (event.target || {}).value || '';

        const matches = typed.match(morseRegex);

        if(!matches) {
            setUserHelperText('Código inválido!', 'tomato');
            return;
        }
        setUserHelperText('Continue...', 'seagreen');

        if (event.key === 'Enter') {
            sendUserData(typed);
            event.target.value = '';
        }
    }

    // ----------------------------------------------------------------------------

    /**
     * Sets an text below the user control input to help the user
     * @param {string} txt
     * @param {string} color
     */
    function setUserHelperText(txt, color) {
        userHelperText.textContent = txt;
        userHelperText.style.color = color;
    }

    // ----------------------------------------------------------------------------

    /**
     * Configs all Html ui elements by its id and fulfill an true promise if it
     * was all present on screen
     * @returns Promise<boolean>
     */
    function configUiElements() {

        return new Promise((fulfil, reject) => {
            morseContainer = document.getElementById('morse-container');
            userInput = document.getElementById('morse-user-input');
            userHelperText = document.getElementById('morse-user-input-message');
            morseMonitor = document.getElementById('morse-monitor');

            if(morseContainer &&
             userInput &&
             userHelperText &&
             morseMonitor) {
                fulfil(true)
            }
            else {
                reject()
            }
        })
    }

    // ----------------------------------------------------------------------------

    /**
     * After all ui elements is rendered and testes, adds its listeners
     */
    function addUiListeners() {
        userInput.addEventListener('keyup', handleUserInput);
    }
    // ----------------------------------------------------------------------------

    /**
     * Overall configs
     */
    function config() {

        configSocket();

        configUiElements()
            .then(addUiListeners())
            .catch(e => console.error('Error onto ui elements'));


        if(userInput) userInput.focus();
    }

    // ----------------------------------------------------------------------------

    window.onload = _ => config();
}