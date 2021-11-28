import clientSocket from './main'

clientSocket();

function App() {
  return (
   <>
      <div id="morse-container" className="flex-center">
        <div>
          <section id="morse-monitor"></section>
        </div>
        <section className="morse-input" title="Digite a sua frase em código morse e pressione ENTER para enviar">
          <input id="morse-user-input" placeholder="Ex.: ... --- ..."
                 pattern="^[.-]{1,5}(?:[ \t]+[.-]{1,5})*(?:[ \t]+[.-]{1,5}(?:[ \t]+[.-]{1,5})*)*[ \t]*$"
          />
          <span id="morse-user-input-message">Digite o código morse e pressione ENTER</span>
        </section>
      </div>
  </>
  );
}

export default App;
