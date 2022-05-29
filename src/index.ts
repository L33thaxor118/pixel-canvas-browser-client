const socket = new WebSocket('ws://localhost:8080');

interface PaintCommand {
  x: number,
  y: number,
  color: number
}

/**
 * Represent the canvas state collapsed to a single dimension, 
 * with every 16 elements representing a row starting with the topmost one.
 */
type MatrixStateDTO = Array<number>

/**
 * Represents canvas state in 2 dimensions
 */
type MatrixState = Array<Array<number>>

type MatrixStateListener = (event: MatrixState)=>void

var stateListener: MatrixStateListener | null = null

socket.addEventListener('message', function (event) {
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

/**
 * Paints a pixel on the canvas
 * @param x - x position of pixel to paint, assuming x=0,y=0 is top-left corner
 * @param y - y position of pixel to paint, assuming x=0,y=0 is top-left corner
 * @param color - decimal representation of the color to paint
 */
function paintTile(x: number, y: number, color: number) {
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