const socket = new WebSocket('ws://localhost:8080');

interface PaintCommand {
  x: number,
  y: number,
  color: string
}

type MatrixStateDTO = Array<number>

type MatrixState = Array<Array<number>>


type MatrixStateListener = (event: MatrixState)=>void

var stateListener: MatrixStateListener | null = null

socket.addEventListener('message', function (event) {
  console.log("received state from server: " + event.data)
  const stateDto: MatrixStateDTO = JSON.parse(event.data)
  var matrixState: MatrixState = []
  const size = 16
  while (stateDto.length > 0) {
    matrixState.push(stateDto.splice(0, size))  
  }
  if (stateListener != null) {
    stateListener(matrixState)
  }
});

function paintTile(x: number, y: number, color: string) {
  const message: PaintCommand = {
    x: x,
    y: y,
    color: color
  }
  socket.send(JSON.stringify(message))
}

function setStateListener(listener: MatrixStateListener) {
  stateListener = listener
}

export default {
  paintTile,
  setStateListener
}