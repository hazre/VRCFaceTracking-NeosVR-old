import osc from 'osc'
import type { WebSocket } from 'ws'
import { WebSocketServer } from 'ws'
import parameters from '../static/vrc_parameters.json'
import type { FaceExpression, Parameter } from './d.js'
import { decode } from './decode.js'

const expressions = parameters?.parameters.map((p: Parameter) => p?.input?.address.split('/')[5]).reduce((a, v) => ({ ...a, [v]: 0 }), {})
const face_expression: FaceExpression = expressions
const fe_keys = Object.keys(face_expression)

let connected = false
let send_data_interval: ReturnType<typeof setInterval>
let change_avatar_interval: ReturnType<typeof setInterval>

const wss = new WebSocketServer({ port: 8080 })

const udpPort = new osc.UDPPort({
  localAddress: '0.0.0.0',
  localPort: 9000,
  remoteAddress: '127.0.0.1',
  remotePort: 9001,
  metadata: false,
})

const send_data = (ws: WebSocket) => {
  send_data_interval = setInterval(() => {
    ws.send(fe_keys.map(key => (Math.round(face_expression[key] * 100) / 100 + 1).toFixed(4)).join('\n'))
  }, 0)
}

const change_avatar = () => {
  change_avatar_interval = setInterval(() => {
    udpPort.send({
      address: '/avatar/change',
      args: [
        {
          type: 's',
          value: 'vrc_parameters',
        },
      ],
    })
  }, 1000)
}

const run = (ws: WebSocket) => {
  if (connected) {
    clearInterval(send_data_interval)
    connected = false
    console.log('Client already connected, restarting..')
    run(ws)
  }
  else {
    connected = true
    clearInterval(change_avatar_interval)
    console.log('Connected to websocket client.')
    send_data(ws)
    console.log('Parameters Index:')
    console.log(fe_keys.map(key => `[${fe_keys.indexOf(key)}]: ${key}`).join('\n'))
  }
}

udpPort.on('ready', () => {
  console.log('Listening for OSC over UDP.')
  change_avatar()
  console.log('Waiting on VRCFT Client To Connect..')
})

udpPort.on('error', (err: any) => {
  console.error(err)
})

udpPort.on('raw', (data: Uint8Array) => {
  try {
    decode(data).elements.map((a: any) => face_expression[a[0].split('/')[5]] = a[1])
  }
  catch (error) {
    console.error(error)
  }
})

udpPort.open()

wss.on('connection', (ws) => {
  run(ws)
})
