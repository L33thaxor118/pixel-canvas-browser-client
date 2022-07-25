const socket = new WebSocket('wss://282bm5cqa4.execute-api.us-east-1.amazonaws.com/development/');

interface AWSRequest {
  action: string
}

interface PaintCommand extends AWSRequest {
  x: number,
  y: number,
  color: number
}

/**
 * Represents canvas state in 2 dimensions
 */
type MatrixState = Array<Array<number>>

type MatrixStateListener = (event: MatrixState)=>void

var stateListener: MatrixStateListener | null = null

socket.addEventListener('open', () => {
  const request: AWSRequest = {
    action: "get"
  }
  socket.send(JSON.stringify(request))
})

socket.addEventListener('message', function (event) {
  const state: MatrixState = JSON.parse(event.data)
  if (stateListener != null) {
    stateListener(state)
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
    action: "paint",
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