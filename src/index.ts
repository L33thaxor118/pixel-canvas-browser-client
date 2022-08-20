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

var currentState: MatrixState

socket.addEventListener('open', () => {
  const request: AWSRequest = {
    action: "get"
  }
  socket.send(JSON.stringify(request))
})

socket.addEventListener('message', function (event) {
  const eventData = JSON.parse(event.data)
  if (Array.isArray(eventData)) {
    //received a GET message containing entire state
    currentState = eventData
  } else {
    //received a PAINT message containing update
    currentState[eventData.y][eventData.x] = eventData.color
  }
  if (stateListener != null) {
    stateListener(currentState)
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